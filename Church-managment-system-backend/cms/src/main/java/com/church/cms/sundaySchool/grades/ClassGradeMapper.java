package com.church.cms.sundaySchool.grades;


public class ClassGradeMapper {
    //request DTO to Entity

        public static ClassGrade toEntity(ClassGradeRequestDTO dto) {
        ClassGrade classGrade = new ClassGrade();
        classGrade.setName(dto.getName());

        return classGrade;
    }

     public static ClassGradeResponseDTO toDTO(ClassGrade classGrade) {
        ClassGradeResponseDTO dto = new ClassGradeResponseDTO();
        dto.setId(classGrade.getId());
        dto.setName(classGrade.getName());
        return dto;
    }
}
