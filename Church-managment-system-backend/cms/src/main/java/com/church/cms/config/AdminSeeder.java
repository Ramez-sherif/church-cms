package com.church.cms.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.church.cms.auth.Account;
import com.church.cms.auth.AccountRepository;
import com.church.cms.sundaySchool.common.UserRole;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AdminSeeder {

    private final AccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedAdmin() {

        return args -> {

            if (!accountRepository.existsByUsername("admin")) {

                Account admin = new Account();

                admin.setUsername("admin");

                admin.setPassword(
                        passwordEncoder.encode("123456"));

                admin.setRole(UserRole.ADMIN);

                admin.setEnabled(true);

                accountRepository.save(admin);
            }
        };
    }
}