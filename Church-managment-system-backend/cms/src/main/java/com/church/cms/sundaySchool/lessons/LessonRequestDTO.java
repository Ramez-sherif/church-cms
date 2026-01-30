package com.church.cms.sundaySchool.lessons;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class LessonRequestDTO {
    private String title;     
    private LocalDate date;             // تاريخ شرح الدرس ✅
    private UUID teacherId;
    private long classGradeId;
    private MultipartFile pdf;

}
