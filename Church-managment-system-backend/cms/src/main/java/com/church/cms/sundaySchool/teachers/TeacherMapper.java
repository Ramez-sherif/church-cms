package com.church.cms.sundaySchool.teachers;

import com.church.cms.sundaySchool.common.ServiceRole;
import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.stages.Stage;
import com.church.cms.sundaySchool.stageGroups.StageGroup;

public class TeacherMapper {

        // =========================
        // Request DTO -> Entity
        // =========================
        public static Teacher toEntity(
                        TeacherRequestDTO dto,
                        ClassGrade grade,
                        StageGroup stageGroup,
                        Stage stage) {

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
                // Role-based assignments
                // =========================
                ServiceRole role = dto.getServiceRole();
                if (role == ServiceRole.CLASS_SERVANT
                                || role == ServiceRole.CLASS_TEACHER
                                || role == ServiceRole.ASSISTANT_CLASS_TEACHER) {
                        teacher.setClassGrade(grade);
                        if (grade != null && grade.getStageGroup() != null) {
                                teacher.setStageGroup(grade.getStageGroup());
                                teacher.setStage(grade.getStageGroup().getStage());
                        } else {
                                teacher.setStageGroup(null);
                                teacher.setStage(null);
                        }
                } else if (role == ServiceRole.STAGE_GROUP_LEADER
                                || role == ServiceRole.ASSISTANT_STAGE_GROUP_LEADER) {
                        teacher.setStageGroup(stageGroup);
                        if (stageGroup != null) {
                                teacher.setStage(stageGroup.getStage());
                        } else {
                                teacher.setStage(null);
                        }
                        teacher.setClassGrade(null);
                } else if (role == ServiceRole.STAGE_LEADER
                                || role == ServiceRole.ASSISTANT_STAGE_LEADER) {
                        teacher.setStage(stage);
                        teacher.setStageGroup(null);
                        teacher.setClassGrade(null);
                } else {
                        teacher.setStage(null);
                        teacher.setStageGroup(null);
                        teacher.setClassGrade(null);
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

                if (teacher.getStage() != null) {
                        dto.setStageId(
                                        teacher.getStage().getId());
                        dto.setStageName(
                                        teacher.getStage().getName());
                }

                if (teacher.getStageGroup() != null) {
                        dto.setStageGroupId(
                                        teacher.getStageGroup().getId());
                        dto.setStageGroupName(
                                        teacher.getStageGroup().getName());
                }

                if (teacher.getClassGrade() != null) {

                        dto.setClassGradeId(
                                        teacher.getClassGrade().getId());

                        dto.setClassGradeName(
                                        teacher.getClassGrade().getName());
                }

                return dto;
        }
}