package com.church.cms.sundaySchool.teachers;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherRequestDTO {
  
    private String firstName;
    private String lastName;
    private LocalDate birthDate;  //YYYY-MM-DD 
    private String phoneNumber;
    private String address;

    private String serviceRole;
    private long  classGradeId;
}
