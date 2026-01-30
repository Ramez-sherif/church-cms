package com.church.cms.sundaySchool.attendance;

import java.time.LocalDate;

import com.church.cms.sundaySchool.common.UserRole;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AttendanceResponseDTO {
  
    private boolean status; // true = حاضر / false = غائب
    
   // private UUID userId;
    private String userName;  //خادم او مخدوم 
    private UserRole userRole;
    private String lessonTitle;
    private LocalDate lessonDate;
    private String classGradeName;

   // private long  classGradeId;
}
