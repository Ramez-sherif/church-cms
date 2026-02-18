package com.church.cms.sundaySchool.students;

import java.time.LocalDate;

import jakarta.annotation.PostConstruct;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class StudentRequestDTO { 

    @NotNull(message = "الاسم الأول لا يمكن أن يكون فارغًا")
    private String firstName;
    
    @NotNull(message = "اسم العائلة لا يمكن أن يكون فارغًا")
    private String lastName;
    
    @NotNull(message = "تاريخ الميلاد لا يمكن أن يكون فارغًا")
    @Past(message = "تاريخ الميلاد يجب أن يكون في الماضي")
    private LocalDate birthDate;  //YYYY-MM-DD 
    
    @Pattern(regexp = "\"^01[0-2,5]{1}[0-9]{8}$", message = "رقم هاتف مصري غير صالح")
    private String phoneNumber;
   
    
    @NotNull(message = "معرف الصف لا يمكن أن يكون فارغًا")
    @Positive(message = "معرف الصف يجب أن يكون رقمًا موجبًا")
    private Long classGradeId;

    @NotNull(message = "كود الطالب لا يمكن أن يكون فارغًا")
    @Pattern(regexp = "^ST-\\d{3,}$", message = "يجب أن يكون رمز الطالب مثل ST-001 أو أكثر من الأرقام")
    private String studentCode;
    
    private String address;
}
