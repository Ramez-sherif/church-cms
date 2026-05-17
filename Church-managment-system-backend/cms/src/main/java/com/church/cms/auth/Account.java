package com.church.cms.auth;

import java.util.UUID;

import com.church.cms.sundaySchool.common.User;
import com.church.cms.sundaySchool.common.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    // =========================
    // Login Credentials
    // =========================
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    // =========================
    // User Type
    // =========================
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    // =========================
    // Account Status
    // =========================
    private boolean enabled = true;

    // =========================
    // Linked User
    // =========================
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}