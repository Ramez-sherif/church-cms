package com.church.cms.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.church.cms.auth.dto.CurrentUserResponseDTO;
import com.church.cms.auth.dto.LoginRequestDTO;
import com.church.cms.auth.dto.LoginResponseDTO;
import com.church.cms.auth.dto.LogoutRequestDTO;
import com.church.cms.auth.dto.RefreshTokenRequestDTO;
import com.church.cms.auth.jwt.JwtService;

import com.church.cms.sundaySchool.common.User;
import com.church.cms.sundaySchool.teachers.Teacher;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final AuthenticationManager authenticationManager;

        private final AccountRepository accountRepository;

        private final JwtService jwtService;

        private final RefreshTokenService refreshTokenService;

        private final SecurityUtils securityUtils;

        // =========================
        // Login
        // =========================
        public LoginResponseDTO login(
                        LoginRequestDTO request) {

                // =========================
                // Authenticate Username/Password
                // =========================
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));

                // =========================
                // Get Account
                // =========================
                Account account = accountRepository
                                .findByUsername(
                                                request.getUsername())
                                .orElseThrow();

                // =========================
                // Generate Access Token
                // =========================
                String accessToken = jwtService.generateToken(account);

                // =========================
                // Generate Refresh Token
                // =========================
                RefreshToken refreshToken = refreshTokenService
                                .createRefreshToken(account);

                // =========================
                // Return Tokens
                // =========================
                return new LoginResponseDTO(
                                accessToken,
                                refreshToken.getToken());
        }

        // =========================
        // Refresh Access Token
        // =========================
        public LoginResponseDTO refreshToken(
                        RefreshTokenRequestDTO request) {

                // =========================
                // Find Refresh Token
                // =========================
                RefreshToken refreshToken = refreshTokenService.findByToken(
                                request.getRefreshToken());

                // =========================
                // Validate Expiration
                // =========================
                refreshTokenService.verifyExpiration(
                                refreshToken);

                // =========================
                // Account
                // =========================
                Account account = refreshToken.getAccount();

                // =========================
                // Generate New Access Token
                // =========================
                String accessToken = jwtService.generateToken(account);

                return new LoginResponseDTO(
                                accessToken,
                                refreshToken.getToken());
        }

        // =========================
        // Logout
        // =========================
        public void logout(
                        LogoutRequestDTO request) {

                // =========================
                // Find Refresh Token
                // =========================
                RefreshToken refreshToken = refreshTokenService.findByToken(
                                request.getRefreshToken());

                // =========================
                // Delete Refresh Token
                // =========================
                refreshTokenService.deleteByAccount(
                                refreshToken.getAccount());
        }

        // =========================
        // Current Logged-in User
        // =========================
        public CurrentUserResponseDTO me() {

                // =========================
                // Current Account
                // =========================
                Account account = securityUtils.getCurrentAccount();

                // =========================
                // Current User
                // =========================
                User user = account.getUser();

                String fullName = null;

                String serviceRole = null;

                // =========================
                // Full Name
                // =========================
                if (user != null) {

                        String firstName = user.getFirstName() != null
                                        ? user.getFirstName()
                                        : "";

                        String lastName = user.getLastName() != null
                                        ? user.getLastName()
                                        : "";

                        fullName = (firstName + " " + lastName)
                                        .trim();
                }

                // =========================
                // Teacher Service Role
                // =========================
                if (user instanceof Teacher teacher) {

                        if (teacher.getServiceRole() != null) {

                                serviceRole = teacher.getServiceRole()
                                                .name();
                        }
                }

                // =========================
                // Response
                // =========================
                return new CurrentUserResponseDTO(

                                account.getUsername(),

                                account.getRole()
                                                .name(),

                                fullName,

                                serviceRole);
        }
}