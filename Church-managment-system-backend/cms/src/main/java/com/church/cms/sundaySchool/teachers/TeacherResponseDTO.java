package com.church.cms.sundaySchool.teachers;

import java.time.LocalDate;
import java.util.UUID;

import com.church.cms.sundaySchool.common.ServiceRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherResponseDTO {

    private UUID id;

    private String firstName;

    private String lastName;

    private LocalDate birthDate;

    private String phoneNumber;

    private String address;

    private ServiceRole serviceRole;

    // =========================
    // Stage
    // =========================
    private Long stageId;

    private String stageName;

    // =========================
    // Stage Group
    // =========================
    private Long stageGroupId;

    private String stageGroupName;

    // =========================
    // Class Grade
    // =========================
    private Long classGradeId;

    private String classGradeName;
}