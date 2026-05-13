package com.church.cms.auth.jwt;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.church.cms.auth.Account;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final Key signingKey;

    private final long expMillis;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expMinutes}") long expMinutes) {

        this.signingKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8));

        this.expMillis = expMinutes * 60_000;
    }

    // =========================
    // Generate Token
    // =========================
    public String generateToken(Account account) {

        Date now = new Date();

        Date expirationDate = new Date(now.getTime() + expMillis);

        return Jwts.builder()

                // username as subject
                .subject(account.getUsername())

                // extra claims
                .claim("role", account.getRole().name())

                // dates
                .issuedAt(now)
                .expiration(expirationDate)

                // signature
                .signWith(signingKey)

                .compact();
    }

    // =========================
    // Extract Username
    // =========================
    public String extractUsername(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    // =========================
    // Extract Role
    // =========================
    public String extractRole(String token) {

        return extractAllClaims(token)
                .get("role", String.class);
    }

    // =========================
    // Validate Token
    // =========================
    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    // =========================
    // Check Expiration
    // =========================
    private boolean isTokenExpired(String token) {

        return extractExpiration(token)
                .before(new Date());
    }

    // =========================
    // Extract Expiration
    // =========================
    private Date extractExpiration(String token) {

        return extractAllClaims(token)
                .getExpiration();
    }

    // =========================
    // Parse Claims
    // =========================
    private Claims extractAllClaims(String token) {

        return Jwts.parser()

                .verifyWith((javax.crypto.SecretKey) signingKey)

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }
}