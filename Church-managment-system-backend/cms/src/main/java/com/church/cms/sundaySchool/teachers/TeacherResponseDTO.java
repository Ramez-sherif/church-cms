package com.church.cms.sundaySchool.teachers;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherResponseDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;  //YYYY-MM-DD 
    private String phoneNumber;
    private String address;

    private String serviceRole;
    private String classGradeName;
}
