package com.church.cms.auth.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final AccountDetailsService accountDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        final String jwtToken;

        final String username;

        // =========================
        // Check Authorization Header
        // =========================
        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);

            return;
        }

        // =========================
        // Extract Token
        // =========================
        jwtToken = authHeader.substring(7);

        // =========================
        // Extract Username Safely
        // =========================
        try {

            username = jwtService.extractUsername(jwtToken);

        } catch (Exception ex) {

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired token");

            return;
        }

        // =========================
        // Authenticate User
        // =========================
        if (username != null
                && SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            UserDetails userDetails = accountDetailsService
                    .loadUserByUsername(username);

            // validate token
            if (jwtService.isTokenValid(
                    jwtToken,
                    userDetails)) {

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authToken);

            } else {

                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid or expired token");

                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}