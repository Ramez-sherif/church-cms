package com.church.cms.sundaySchool.teachers;

import com.church.cms.sundaySchool.grades.ClassGrade;

public class TeacherMapper {

        //flow
    //Request DTO -> Entity , Entity->save to DB ,Entity -> ResponseDTO , ResponseDTO -> client
    
    //Request DTO -> Entity 
    public static Teacher toEntity (TeacherRequestDTO dto ,ClassGrade grade){
            //create new Teacher
            Teacher teacher= new Teacher();
            teacher.setFirstName(dto.getFirstName());
            teacher.setLastName(dto.getLastName());
            teacher.setAddress(dto.getAddress());
            teacher.setBirthDate(dto.getBirthDate());
            teacher.setPhoneNumber(dto.getPhoneNumber());

            teacher.setServiceRole(dto.getServiceRole());
            teacher.setClassGrade(grade);
            return teacher;
            
    }

    //Entity -> Response DTO
    public static  TeacherResponseDTO toDTO (Teacher teacher){

        TeacherResponseDTO dto =new TeacherResponseDTO();
        dto.setId(teacher.getId());
        dto.setAddress(teacher.getAddress());
        dto.setBirthDate(teacher.getBirthDate());
        dto.setFirstName(teacher.getFirstName());
        dto.setLastName(teacher.getLastName());
        dto.setPhoneNumber(teacher.getPhoneNumber());
        dto.setServiceRole(teacher.getServiceRole());
        if( teacher.getClassGrade()!=null){
            dto.setClassGradeName(teacher.getClassGrade().getName());
        }

            return dto;
    }
}
