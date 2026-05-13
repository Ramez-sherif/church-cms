package com.church.cms.sundaySchool.teachers;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherRequestDTO {
    @NotBlank(message = "First name cannot be empty")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name cannot be empty")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotNull(message = "Birth date cannot be empty")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate; // YYYY-MM-DD

    @NotBlank(message = "Phone number cannot be empty")
    @Pattern(regexp = "^01[0-2,5]{1}[0-9]{8}$", message = "Invalid Egyptian phone number")
    private String phoneNumber;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    @NotBlank(message = "Service role cannot be empty")
    @Size(min = 2, max = 50, message = "Service role must be between 2 and 50 characters")
    private String serviceRole;

    @Positive(message = "Class grade id must be positive")
    private long classGradeId;
}
