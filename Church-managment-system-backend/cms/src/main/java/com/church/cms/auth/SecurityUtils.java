package com.church.cms.auth;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import com.church.cms.sundaySchool.fathers.Father;
import com.church.cms.sundaySchool.teachers.Teacher;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final AccountRepository accountRepository;

    // =========================
    // Current Account
    // =========================
    public Account getCurrentAccount() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String username = authentication.getName();

        return accountRepository
                .findByUsername(username)
                .orElseThrow(() -> new RuntimeException(
                        "Account not found"));
    }

    // =========================
    // Current Teacher
    // =========================
    public Teacher getCurrentTeacher() {

        return (Teacher) getCurrentAccount()
                .getUser();
    }

    // =========================
    // Current Father
    // =========================
    public Father getCurrentFather() {

        return (Father) getCurrentAccount()
                .getUser();
    }

    // =========================
    // Current Role
    // =========================
    public String getCurrentRole() {

        return getCurrentAccount()
                .getRole()
                .name();
    }

    // =========================
    // Role Helpers
    // =========================
    public boolean isAdmin() {

        return getCurrentRole()
                .equals("ADMIN");
    }

    public boolean isTeacher() {

        return getCurrentRole()
                .equals("TEACHER");
    }

    public boolean isFather() {

        return getCurrentRole()
                .equals("FATHER");
    }
}