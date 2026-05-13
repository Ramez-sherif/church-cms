package com.church.cms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.Customizer;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.church.cms.auth.jwt.AccountDetailsService;
import com.church.cms.auth.jwt.JwtAuthFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final AccountDetailsService accountDetailsService;

    private final JwtAuthFilter jwtAuthFilter;

    // =========================
    // Password Encoder
    // =========================
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    // =========================
    // Authentication Provider
    // =========================
    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(
                accountDetailsService);

        authProvider.setPasswordEncoder(
                passwordEncoder());

        return authProvider;
    }

    // =========================
    // Authentication Manager
    // =========================
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config)
            throws Exception {

        return config.getAuthenticationManager();
    }

    // =========================
    // Security Filter Chain
    // =========================
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http

                // disable csrf
                .csrf(csrf -> csrf.disable())

                // enable cors
                .cors(Customizer.withDefaults())

                // stateless api
                .sessionManagement(session -> session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))

                // auth provider
                .authenticationProvider(
                        authenticationProvider())

                // authorization
                .authorizeHttpRequests(auth -> auth

                        // public
                        .requestMatchers(
                                "/auth/**")
                        .permitAll()

                        // admin only
                        .requestMatchers(
                                "/teachers/**",
                                "/class-grades/**",
                                "/stages/**",
                                "/stage-groups/**",
                                "/fathers/**")
                        .hasRole("ADMIN")

                        // teacher + father + admin
                        .requestMatchers(
                                "/students/**",
                                "/lessons/**",
                                "/attendance/**")
                        .hasAnyRole(
                                "TEACHER",
                                "FATHER",
                                "ADMIN")

                        // everything else
                        .anyRequest()
                        .authenticated())

                // jwt filter
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}