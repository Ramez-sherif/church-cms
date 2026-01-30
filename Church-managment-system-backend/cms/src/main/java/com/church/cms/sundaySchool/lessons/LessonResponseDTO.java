package com.church.cms.sundaySchool.lessons;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LessonResponseDTO {
    private UUID id ;

    private String title;     
    private LocalDate date;             // تاريخ شرح الدرس ✅
    private String pdfFilePath; 
    private String teacherName;
    private String classGradeName;
}
