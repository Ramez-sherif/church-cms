package com.church.cms.sundaySchool.teachers;

import com.church.cms.sundaySchool.common.ServiceRole;
import com.church.cms.sundaySchool.grades.ClassGrade;

public class TeacherMapper {

    // =========================
    // Request DTO -> Entity
    // =========================
    public static Teacher toEntity(
            TeacherRequestDTO dto,
            ClassGrade grade) {

        Teacher teacher = new Teacher();

        teacher.setFirstName(
                dto.getFirstName());

        teacher.setLastName(
                dto.getLastName());

        teacher.setAddress(
                dto.getAddress());

        teacher.setBirthDate(
                dto.getBirthDate());

        teacher.setPhoneNumber(
                dto.getPhoneNumber());

        teacher.setServiceRole(
                dto.getServiceRole());

        // =========================
        // Roles That Need Class
        // =========================
        if (

        dto.getServiceRole() == ServiceRole.CLASS_SERVANT

                ||

                dto.getServiceRole() == ServiceRole.STAGE_GROUP_LEADER

                ||

                dto.getServiceRole() == ServiceRole.ASSISTANT_STAGE_GROUP_LEADER

                ||

                dto.getServiceRole() == ServiceRole.STAGE_LEADER

                ||

                dto.getServiceRole() == ServiceRole.ASSISTANT_STAGE_LEADER) {

            teacher.setClassGrade(
                    grade);
        }

        return teacher;
    }

    // =========================
    // Entity -> Response DTO
    // =========================
    public static TeacherResponseDTO toDTO(
            Teacher teacher) {

        TeacherResponseDTO dto = new TeacherResponseDTO();

        dto.setId(
                teacher.getId());

        dto.setAddress(
                teacher.getAddress());

        dto.setBirthDate(
                teacher.getBirthDate());

        dto.setFirstName(
                teacher.getFirstName());

        dto.setLastName(
                teacher.getLastName());

        dto.setPhoneNumber(
                teacher.getPhoneNumber());

        dto.setServiceRole(
                teacher.getServiceRole());

        if (teacher.getClassGrade() != null) {

            dto.setClassGradeName(
                    teacher.getClassGrade()
                            .getName());
        }

        return dto;
    }
}