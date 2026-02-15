package com.church.cms.sundaySchool.attendance;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AttendanceRequestDTO {
 
   
    private Boolean status; // true = حاضر / false = غائب
    private UUID userId;
    private UUID lessonId;
   // private long  classGradeId;
}
