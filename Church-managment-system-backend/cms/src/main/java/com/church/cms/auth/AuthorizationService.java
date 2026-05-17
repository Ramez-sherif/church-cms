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
        // STAGE ADMIN
        // حاليا bypass مؤقت
        // =========================
        if (securityUtils.isStageAdmin()) {
            return;
        }

        // =========================
        // Get Class Grade
        // =========================
        ClassGrade classGrade = classGradeService
                .getClassGradeById(classGradeId);

        // =========================
        // CLASS SERVANT
        // =========================
        if (securityUtils.isClassServant()) {

            Teacher teacher = securityUtils.getCurrentTeacher();

            if (teacher.getClassGrade() == null) {

                throw new ForbiddenException(
                        "Servant has no class");
            }

            if (!teacher
                    .getClassGrade()
                    .getId()
                    .equals(classGrade.getId())) {

                throw new ForbiddenException(
                        "You cannot access this class");
            }

            return;
        }

        // =========================
        // STAGE GROUP LEADER
        // حاليا يشوف نفس الـ group
        // =========================
        if (securityUtils.isStageGroupLeader()
                || securityUtils.isAssistantStageGroupLeader()) {

            Teacher teacher = securityUtils.getCurrentTeacher();

            if (teacher.getClassGrade() == null) {

                throw new ForbiddenException(
                        "Leader has no class");
            }

            Long currentGroupId = teacher.getClassGrade()
                    .getStageGroup()
                    .getId();

            Long targetGroupId = classGrade.getStageGroup()
                    .getId();

            if (!currentGroupId.equals(targetGroupId)) {

                throw new ForbiddenException(
                        "You cannot access this stage group");
            }

            return;
        }

        // =========================
        // STAGE LEADER
        // حاليا يشوف نفس الـ stage
        // =========================
        if (securityUtils.isStageLeader()
                || securityUtils.isAssistantStageLeader()) {

            Teacher teacher = securityUtils.getCurrentTeacher();

            if (teacher.getClassGrade() == null) {

                throw new ForbiddenException(
                        "Leader has no class");
            }

            Long currentStageId = teacher.getClassGrade()
                    .getStageGroup()
                    .getStage()
                    .getId();

            Long targetStageId = classGrade.getStageGroup()
                    .getStage()
                    .getId();

            if (!currentStageId.equals(targetStageId)) {

                throw new ForbiddenException(
                        "You cannot access this stage");
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