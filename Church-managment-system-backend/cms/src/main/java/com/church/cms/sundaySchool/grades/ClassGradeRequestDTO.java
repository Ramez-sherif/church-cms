package com.church.cms.sundaySchool.grades;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ClassGradeRequestDTO {
 
    @NotBlank(message = "اسم الصف لا يمكن أن يكون فارغًا")
    @Size(min = 2, max = 50, message = "اسم الصف يجب أن يكون بين 2 و 50 حرفًا")
    private String name;
}
