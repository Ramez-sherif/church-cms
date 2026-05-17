package com.church.cms.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.church.cms.sundaySchool.common.ServiceRole;
import com.church.cms.sundaySchool.common.UserRole;
import com.church.cms.sundaySchool.fathers.Father;
import com.church.cms.sundaySchool.teachers.Teacher;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

        private final AccountRepository accountRepository;

        // =========================
        // Current Account
        // =========================
        public Account getCurrentAccount() {

                Authentication authentication = SecurityContextHolder
                                .getContext()
                                .getAuthentication();

                String username = authentication.getName();

                return accountRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new RuntimeException(
                                                "Account not found"));
        }

        // =========================
        // Current User Role
        // =========================
        public UserRole getCurrentRole() {

                return getCurrentAccount()
                                .getRole();
        }

        // =========================
        // Current Teacher
        // =========================
        public Teacher getCurrentTeacher() {

                if (!(getCurrentAccount()
                                .getUser() instanceof Teacher teacher)) {

                        throw new RuntimeException(
                                        "Current user is not a teacher");
                }

                return teacher;
        }

        // =========================
        // Current Father
        // =========================
        public Father getCurrentFather() {

                if (!(getCurrentAccount()
                                .getUser() instanceof Father father)) {

                        throw new RuntimeException(
                                        "Current user is not a father");
                }

                return father;
        }

        // =========================
        // Current Service Role
        // =========================
        public ServiceRole getCurrentServiceRole() {

                Teacher teacher = getCurrentTeacher();

                return teacher.getServiceRole();
        }

        // =========================
        // User Type Helpers
        // =========================
        public boolean isTeacher() {

                return getCurrentRole() == UserRole.TEACHER;
        }

        public boolean isFather() {

                return getCurrentRole() == UserRole.FATHER;
        }

        public boolean isStudent() {

                return getCurrentRole() == UserRole.STUDENT;
        }

        // =========================
        // Service Role Helpers
        // =========================
        public boolean isGeneralAdmin() {

                return isTeacher()

                                &&

                                getCurrentServiceRole() == ServiceRole.GENERAL_ADMIN;
        }

        public boolean isStageAdmin() {

                return isTeacher()

                                &&

                                getCurrentServiceRole() == ServiceRole.STAGE_ADMIN;
        }

        public boolean isStageLeader() {

                return isTeacher()

                                &&

                                getCurrentServiceRole() == ServiceRole.STAGE_LEADER;
        }

        public boolean isAssistantStageLeader() {

                return isTeacher()

                                &&

                                getCurrentServiceRole() == ServiceRole.ASSISTANT_STAGE_LEADER;
        }

        public boolean isStageGroupLeader() {

                return isTeacher()

                                &&

                                getCurrentServiceRole() == ServiceRole.STAGE_GROUP_LEADER;
        }

        public boolean isAssistantStageGroupLeader() {

                return isTeacher()

                                &&

                                getCurrentServiceRole() == ServiceRole.ASSISTANT_STAGE_GROUP_LEADER;
        }

        public boolean isClassServant() {

                return isTeacher()

                                &&

                                getCurrentServiceRole() == ServiceRole.CLASS_SERVANT;
        }
}