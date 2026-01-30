package com.church.cms.sundaySchool.students;

import com.church.cms.sundaySchool.grades.ClassGrade;

public class StudentMapper {
    //flow
    //Request DTO -> Entity , Entity->save to DB ,Entity -> ResponseDTO , ResponseDTO -> client
    
   // Request → Entity
    public static  Student toEntity(StudentRequestDTO dto, ClassGrade classGrade) {
        Student student = new Student();

        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setAddress(dto.getAddress());
        student.setBirthDate(dto.getBirthDate());
        student.setPhoneNumber(dto.getPhoneNumber());

        student.setStudentCode(dto.getStudentCode());
        student.setClassGrade(classGrade);
        return student;
    }
    
   // Entity → DTO
    public static StudentResponseDTO toDTO(Student student) {
        StudentResponseDTO dto = new StudentResponseDTO();
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setBirthDate(student.getBirthDate());
        dto.setAddress(student.getAddress());
        dto.setPhoneNumber(student.getPhoneNumber());

        dto.setStudentCode(student.getStudentCode());

        if (student.getClassGrade() != null) {
            dto.setClassGradeName(student.getClassGrade().getName());
        }

        return dto;
    }

    // DTO → Entity
    /*
    public static Student toEntity(StudentResponseDTO dto, ClassGrade classGrade) {
        Student student = new Student();
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setBirthDate(dto.getBirthDate());
        student.setAddress(dto.getAddress());
        student.setPhoneNumber(dto.getPhoneNumber());

        student.setStudentCode(dto.getStudentCode());
        student.setClassGrade(classGrade);
        return student;
    }
    */
}
