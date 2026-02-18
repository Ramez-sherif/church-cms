package com.church.cms.sundaySchool.teachers;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherRequestDTO {
    @NotBlank(message = "الاسم الأول لا يمكن أن يكون فارغًا")
    @Size(min = 2, max = 50, message = "الاسم الأول يجب أن يكون بين 2 و 50 حرفًا")
    private String firstName;

    @NotBlank(message = "اسم العائلة لا يمكن أن يكون فارغًا")
    @Size(min = 2, max = 50, message = "اسم العائلة يجب أن يكون بين 2 و 50 حرفًا")
    private String lastName;

    @NotNull(message = "تاريخ الميلاد لا يمكن أن يكون فارغًا")
    @Past(message = "تاريخ الميلاد يجب أن يكون في الماضي")
    private LocalDate birthDate;  //YYYY-MM-DD 
    
    @NotBlank(message = "رقم الهاتف لا يمكن أن يكون فارغًا")
    @Pattern(regexp = "^01[0-2,5]{1}[0-9]{8}$", message = "رقم هاتف مصري غير صالح")
    private String phoneNumber;
    
    @Size(max = 255, message = "العنوان يجب أن لا يتجاوز 255 حرفًا")
    private String address;

    @NotBlank(message = "الدور في الخدمة لا يمكن أن يكون فارغًا")
    @Size(min = 2, max = 50, message = "الدور في الخدمة يجب أن يكون بين 2 و 50 حرفًا")
    private String serviceRole;
   
    @Positive(message = "معرف الصف يجب أن يكون رقمًا موجبًا")
    private long  classGradeId;
}
