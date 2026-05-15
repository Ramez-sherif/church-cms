package com.church.cms.auth;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.church.cms.shared.exceptions.BadRequestException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.jwt.refreshExpDays}")
    private long refreshExpDays;

    // =========================
    // Create Refresh Token
    // =========================
    public RefreshToken createRefreshToken(
            Account account) {

        // remove old refresh token
        refreshTokenRepository
                .deleteByAccount(account);

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setAccount(account);

        refreshToken.setToken(
                UUID.randomUUID().toString());

        refreshToken.setExpiryDate(
                Instant.now()
                        .plusSeconds(
                                refreshExpDays
                                        * 24
                                        * 60
                                        * 60));

        return refreshTokenRepository
                .save(refreshToken);
    }

    // =========================
    // Verify Expiration
    // =========================
    public RefreshToken verifyExpiration(
            RefreshToken token) {

        if (token.getExpiryDate()
                .isBefore(Instant.now())) {

            refreshTokenRepository.delete(token);

            throw new BadRequestException(
                    "Refresh token expired");
        }

        return token;
    }

    // =========================
    // Find By Token
    // =========================
    public RefreshToken findByToken(
            String token) {

        return refreshTokenRepository
                .findByToken(token)
                .orElseThrow(() -> new BadRequestException(
                        "Invalid refresh token"));
    }

    // =========================
    // Delete By Account
    // =========================
    public void deleteByAccount(
            Account account) {

        refreshTokenRepository
                .deleteByAccount(account);
    }
}