package com.church.cms.sundaySchool.students;

import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class StudentRequestDTO {

    @NotNull(message = "First name cannot be empty")
    private String firstName;

    @NotNull(message = "Last name cannot be empty")
    private String lastName;

    @NotNull(message = "Birth date cannot be empty")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate; // YYYY-MM-DD

    @Pattern(regexp = "^01[0-2,5]{1}[0-9]{8}$", message = "Invalid Egyptian phone number")
    private String phoneNumber;

    @NotNull(message = "Class grade id cannot be empty")
    @Positive(message = "Class grade id must be positive")
    private Long classGradeId;

    @NotNull(message = "Student code cannot be empty")
    @Pattern(regexp = "^ST-\\d{3,}$", message = "Student code must be like ST-001 or more numbers")
    private String studentCode;

    private String address;
}
