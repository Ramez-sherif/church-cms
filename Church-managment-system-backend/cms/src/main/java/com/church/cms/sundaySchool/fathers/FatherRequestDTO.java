package com.church.cms.sundaySchool.fathers;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
    @Column(unique = true)
    private String phoneNumber;

    @NotNull(message = "Stage is required")
    private Long stageId; // KG/PRIMARY/PREP

}
