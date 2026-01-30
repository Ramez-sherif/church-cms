package com.church.cms.sundaySchool.students;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class StudentRequestDTO { 

    private String firstName;
    private String lastName;
    private LocalDate birthDate;  //YYYY-MM-DD 
    private String phoneNumber;
    private String address;
    
    private Long classGradeId;
    private String studentCode;
}
