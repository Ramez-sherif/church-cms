package com.church.cms.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.church.cms.auth.dto.LoginRequestDTO;
import com.church.cms.auth.dto.LoginResponseDTO;
import com.church.cms.auth.jwt.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;

    private final AccountRepository accountRepository;

    private final JwtService jwtService;

    public LoginResponseDTO login(LoginRequestDTO request) {

        // check username/password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        // get account from db
        Account account = accountRepository
                .findByUsername(request.getUsername())
                .orElseThrow();

        // generate jwt
        String token = jwtService.generateToken(account);

        return new LoginResponseDTO(token);
    }
}