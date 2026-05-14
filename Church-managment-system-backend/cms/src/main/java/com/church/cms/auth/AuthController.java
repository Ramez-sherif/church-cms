package com.church.cms.auth;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.church.cms.auth.dto.LoginRequestDTO;
import com.church.cms.auth.dto.LoginResponseDTO;
import com.church.cms.auth.dto.LogoutRequestDTO;
import com.church.cms.auth.dto.RefreshTokenRequestDTO;
import com.church.cms.auth.dto.CurrentUserResponseDTO;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthService authService;

        // =========================
        // Login
        // =========================
        @PostMapping("/login")
        public ResponseEntity<LoginResponseDTO> login(
                        @Valid @RequestBody LoginRequestDTO request) {

                return ResponseEntity.ok(
                                authService.login(request));
        }

        // =========================
        // Refresh Access Token
        // =========================
        @PostMapping("/refresh")
        public ResponseEntity<LoginResponseDTO> refreshToken(
                        @Valid @RequestBody RefreshTokenRequestDTO request) {

                return ResponseEntity.ok(
                                authService.refreshToken(request));
        }

        // =========================
        // Logout
        // =========================
        @PostMapping("/logout")
        public ResponseEntity<Void> logout(
                        @Valid @RequestBody LogoutRequestDTO request) {

                authService.logout(request);

                return ResponseEntity.noContent()
                                .build();
        }

        // =========================
        // Current Logged-in User
        // =========================
        @GetMapping("/me")
        public ResponseEntity<CurrentUserResponseDTO> me() {

                return ResponseEntity.ok(
                                authService.me());
        }
}