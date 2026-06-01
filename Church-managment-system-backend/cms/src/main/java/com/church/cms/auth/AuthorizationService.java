package com.church.cms.auth;

import org.springframework.stereotype.Service;

import com.church.cms.shared.exceptions.ForbiddenException;
import com.church.cms.sundaySchool.fathers.Father;
import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.grades.ClassGradeService;
import com.church.cms.sundaySchool.teachers.Teacher;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorizationService {

    private final SecurityUtils securityUtils;

    private final ClassGradeService classGradeService;

    // =========================
    // Access Control For Class
    // =========================
    public void assertTeacherOwnsClass(
            Long classGradeId) {

        // =========================
        // GENERAL ADMIN
        // =========================
        if (securityUtils.isGeneralAdmin()) {
            return;
        }

        // =========================
        // Get Class Grade
        // =========================
        ClassGrade classGrade = classGradeService
                .getClassGradeById(classGradeId);

        // =========================
        // CLASS ROLE (SERVANT, TEACHER, ASSISTANT TEACHER)
        // =========================
        if (securityUtils.isClassServant()
                || securityUtils.isClassTeacher()
                || securityUtils.isAssistantClassTeacher()) {

            Teacher teacher = securityUtils.getCurrentTeacher();

            if (teacher.getClassGrade() == null) {
                throw new ForbiddenException("Teacher has no class");
            }

            if (!teacher.getClassGrade().getId().equals(classGrade.getId())) {
                throw new ForbiddenException("You cannot access this class");
            }

            return;
        }

        // =========================
        // STAGE GROUP LEADER
        // =========================
        if (securityUtils.isStageGroupLeader()
                || securityUtils.isAssistantStageGroupLeader()) {

            Teacher teacher = securityUtils.getCurrentTeacher();

            if (teacher.getStageGroup() == null) {
                throw new ForbiddenException("Leader has no stage group");
            }

            Long currentGroupId = teacher.getStageGroup().getId();

            if (classGrade.getStageGroup() == null) {
                throw new ForbiddenException("Target class has no stage group");
            }

            Long targetGroupId = classGrade.getStageGroup().getId();

            if (!currentGroupId.equals(targetGroupId)) {
                throw new ForbiddenException("You cannot access this stage group");
            }

            return;
        }

        // =========================
        // STAGE LEADER
        // =========================
        if (securityUtils.isStageLeader()
                || securityUtils.isAssistantStageLeader()) {

            Teacher teacher = securityUtils.getCurrentTeacher();

            if (teacher.getStage() == null) {
                throw new ForbiddenException("Leader has no stage");
            }

            Long currentStageId = teacher.getStage().getId();

            if (classGrade.getStageGroup() == null || classGrade.getStageGroup().getStage() == null) {
                throw new ForbiddenException("Target class has no stage");
            }

            Long targetStageId = classGrade.getStageGroup().getStage().getId();

            if (!currentStageId.equals(targetStageId)) {
                throw new ForbiddenException("You cannot access this stage");
            }

            return;
        }

        // =========================
        // FATHER
        // =========================
        if (securityUtils.isFather()) {

            Father father = securityUtils.getCurrentFather();

            if (father.getStage() == null) {

                throw new ForbiddenException(
                        "Father has no stage");
            }

            Long classStageId = classGrade
                    .getStageGroup()
                    .getStage()
                    .getId();

            if (!father
                    .getStage()
                    .getId()
                    .equals(classStageId)) {

                throw new ForbiddenException(
                        "You cannot access this stage");
            }

            return;
        }

        // =========================
        // Access Denied
        // =========================
        throw new ForbiddenException(
                "Access denied");
    }
}