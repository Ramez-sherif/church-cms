package com.church.cms.sundaySchool.students;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;

import lombok.Setter;

@Getter
@Setter
public class StudentResponseDTO {
    
    private UUID id;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;  //YYYY-MM-DD 
    private String phoneNumber;
    private String address;

    private String studentCode;         //كل طالب: ليه كود تابع لفصل واحد
    private String classGradeName;
    
}
