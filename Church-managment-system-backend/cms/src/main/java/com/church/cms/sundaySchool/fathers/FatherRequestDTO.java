package com.church.cms.sundaySchool.fathers;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FatherRequestDTO {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Address is required")
    private String address;

    private LocalDate birthDate;

    @Pattern(regexp = "^\\+?[0-9\\s\\-\\(\\)]{7,15}$", message = "Phone number is invalid")
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotNull(message = "Stage is required")
    private Long stageId;

    // =========================
    // Login Credentials
    // =========================

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6)
    private String password;
}