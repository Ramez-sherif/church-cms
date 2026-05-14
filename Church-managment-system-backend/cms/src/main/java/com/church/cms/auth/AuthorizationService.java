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
    // Teacher/Father Owns Class
    // =========================
    public void assertTeacherOwnsClass(
            Long classGradeId) {

        // admin bypass
        if (securityUtils.isAdmin()) {
            return;
        }

        ClassGrade classGrade = classGradeService
                .getClassGradeById(classGradeId);

        // =========================
        // Teacher Authorization
        // =========================
        if (securityUtils.isTeacher()) {

            Teacher teacher = securityUtils.getCurrentTeacher();

            if (teacher.getClassGrade() == null) {

                throw new ForbiddenException(
                        "Teacher has no class");
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
        // Father Authorization
        // =========================
        if (securityUtils.isFather()) {

            Father father = securityUtils.getCurrentFather();

            if (father.getStage() == null) {

                throw new ForbiddenException(
                        "Father has no stage");
            }

            // classGrade -> stageGroup -> stage
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

        throw new ForbiddenException(
                "Access denied");
    }
}