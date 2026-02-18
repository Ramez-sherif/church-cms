package com.church.cms.sundaySchool.attendance;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AttendanceRequestDTO {
 
   @NotNull(message = "الحالة لا يمكن أن تكون فارغة")
    private Boolean status; // true = حاضر / false = غائب
    
    @NotNull(message = "معرف المستخدم لا يمكن أن يكون فارغًا")
    private UUID userId;
   
    @NotNull(message = "معرف الدرس لا يمكن أن يكون فارغًا")
    private UUID lessonId;
   // private long  classGradeId;
}
