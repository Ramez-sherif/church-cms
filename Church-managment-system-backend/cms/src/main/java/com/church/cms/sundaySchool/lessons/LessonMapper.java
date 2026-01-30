package com.church.cms.sundaySchool.lessons;

import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.teachers.Teacher;

public class LessonMapper {
    //Request DTO -> entity ,Entity -> DB , Entity -> Response DTO , Response DTO -> client 

    //RequestDTO ->Entity
    public static Lesson toEntity(LessonRequestDTO dto,Teacher teacher, ClassGrade classGrade, String pdfFilePath){
        //create Lesson obj:
        Lesson lesson= new Lesson();

        //convert DTO -> Entity
        lesson.setPdfFilePath(pdfFilePath);
        lesson.setTitle(dto.getTitle());
        lesson.setDate(dto.getDate());
        lesson.setTeacher(teacher);
        lesson.setClassGrade(classGrade);

        //return Lesson Entity
        return lesson;
    }


    //Entity -> Response DTO
    public static LessonResponseDTO toDTO (Lesson lesson){
        //create ResponseDTO obj:
        LessonResponseDTO dto = new LessonResponseDTO();
        dto.setId(lesson.getId());
        dto.setDate(lesson.getDate());
        dto.setPdfFilePath(lesson.getPdfFilePath());
        dto.setTitle(lesson.getTitle());

        
        if (lesson.getClassGrade() != null) {
            dto.setClassGradeName(lesson.getClassGrade().getName());
        }
       

          if (lesson.getTeacher() != null) {
            dto.setTeacherName(
                lesson.getTeacher().getFirstName() + " " +
                lesson.getTeacher().getLastName()
            );
        }
        
       
      
        return dto;

    }
}

