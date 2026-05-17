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

import com.church.cms.shared.errors.JwtAccessDeniedHandler;
import com.church.cms.shared.errors.JwtAuthenticationEntryPoint;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

        private final AccountDetailsService accountDetailsService;

        private final JwtAuthFilter jwtAuthFilter;

        private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

        private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

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

                DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(
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

                                // =========================
                                // Disable CSRF
                                // =========================
                                .csrf(csrf -> csrf.disable())

                                // =========================
                                // Enable CORS
                                // =========================
                                .cors(Customizer.withDefaults())

                                // =========================
                                // Stateless API
                                // =========================
                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                // =========================
                                // Authentication Provider
                                // =========================
                                .authenticationProvider(
                                                authenticationProvider())

                                // =========================
                                // Exception Handlers
                                // =========================
                                .exceptionHandling(ex -> ex

                                                .authenticationEntryPoint(
                                                                jwtAuthenticationEntryPoint)

                                                .accessDeniedHandler(
                                                                jwtAccessDeniedHandler))

                                // =========================
                                // Routes Authorization
                                // =========================
                                .authorizeHttpRequests(auth -> auth

                                                // =========================
                                                // Public Endpoints
                                                // =========================
                                                .requestMatchers(
                                                                "/auth/**")
                                                .permitAll()

                                                // =========================
                                                // Teachers + Fathers
                                                // =========================
                                                .requestMatchers(
                                                                "/teachers/**",
                                                                "/class-grades/**",
                                                                "/stages/**",
                                                                "/stage-groups/**",
                                                                "/fathers/**",
                                                                "/students/**",
                                                                "/lessons/**",
                                                                "/attendance/**")
                                                .hasAnyRole(
                                                                "TEACHER",
                                                                "FATHER")

                                                // =========================
                                                // Everything Else
                                                // =========================
                                                .anyRequest()
                                                .authenticated())

                                // =========================
                                // JWT Filter
                                // =========================
                                .addFilterBefore(
                                                jwtAuthFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}