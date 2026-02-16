package com.church.cms.sundaySchool.lessons;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class LessonRequestDTO {
    @NotBlank(message = "عنوان الدرس لا يمكن أن يكون فارغًا")
    @Size(min = 2, max = 100, message = "عنوان الدرس يجب أن يكون بين 2 و 100 حرفًا")
    private String title;     
   
    @NotNull(message = "تاريخ الدرس لا يمكن أن يكون فارغًا")
    private LocalDate date;             // تاريخ شرح الدرس ✅
    
    @NotNull(message = "معرف المعلم لا يمكن أن يكون فارغًا")
    private UUID teacherId;
    
    @Positive(message = "معرف الصف يجب أن يكون رقمًا موجبًا")
    private long classGradeId;
    
    @NotNull(message = "ملف PDF لا يمكن أن يكون فارغًا")
    private MultipartFile pdf;

}
