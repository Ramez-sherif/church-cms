package com.church.cms.sundaySchool.teachers;

import java.time.LocalDate;

import com.church.cms.sundaySchool.common.ServiceRole;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherRequestDTO {

    // =========================
    // Basic Info
    // =========================

    @NotBlank(message = "First name cannot be empty")
    @Size(min = 2, max = 50)
    private String firstName;

    @NotBlank(message = "Last name cannot be empty")
    @Size(min = 2, max = 50)
    private String lastName;

    @NotNull(message = "Birth date cannot be empty")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @NotBlank(message = "Phone number cannot be empty")
    @Pattern(regexp = "^01[0-2,5]{1}[0-9]{8}$", message = "Invalid Egyptian phone number")
    private String phoneNumber;

    @Size(max = 255)
    private String address;

    // =========================
    // Church Service Role
    // =========================

    @NotNull(message = "Service role is required")
    private ServiceRole serviceRole;

    // =========================
    // Responsible Class
    // =========================
    private Long classGradeId;

    // =========================
    // Login Credentials
    // =========================

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}