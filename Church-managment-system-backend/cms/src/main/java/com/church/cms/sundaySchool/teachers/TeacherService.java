package com.church.cms.sundaySchool.teachers;

import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.church.cms.auth.Account;
import com.church.cms.auth.AccountRepository;

import com.church.cms.shared.exceptions.BadRequestException;
import com.church.cms.shared.exceptions.ConflictException;
import com.church.cms.shared.exceptions.NotFoundException;

import com.church.cms.sundaySchool.common.ServiceRole;
import com.church.cms.sundaySchool.common.UserRole;

import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.grades.ClassGradeService;
import com.church.cms.sundaySchool.stages.Stage;
import com.church.cms.sundaySchool.stages.StageService;
import com.church.cms.sundaySchool.stageGroups.StageGroup;
import com.church.cms.sundaySchool.stageGroups.StageGroupService;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TeacherService {

        private final TeacherRepository teacherRepository;

        private final ClassGradeService classGradeService;

        private final AccountRepository accountRepository;

        private final PasswordEncoder passwordEncoder;

        private final StageService stageService;

        private final StageGroupService stageGroupService;

        // =========================
        // Role Helpers
        // =========================
        private boolean isGeneralAdmin(ServiceRole role) {
                return role == ServiceRole.GENERAL_ADMIN;
        }

        private boolean isStageLeaderRole(ServiceRole role) {
                return role == ServiceRole.STAGE_LEADER
                                || role == ServiceRole.ASSISTANT_STAGE_LEADER;
        }

        private boolean isStageGroupLeaderRole(ServiceRole role) {
                return role == ServiceRole.STAGE_GROUP_LEADER
                                || role == ServiceRole.ASSISTANT_STAGE_GROUP_LEADER;
        }

        private boolean isClassRole(ServiceRole role) {
                return role == ServiceRole.CLASS_SERVANT
                                || role == ServiceRole.CLASS_TEACHER
                                || role == ServiceRole.ASSISTANT_CLASS_TEACHER;
        }

        // =========================
        // Validate Role and Assignments
        // =========================
        private void validateTeacherRoleAndAssignments(ServiceRole serviceRole, Long stageId, Long stageGroupId, Long classGradeId) {
                if (isGeneralAdmin(serviceRole)) {
                        if (stageId != null || stageGroupId != null || classGradeId != null) {
                                throw new BadRequestException(
                                                "GENERAL_ADMIN cannot be assigned to stage, stage group, or class grade");
                        }
                } else if (isStageLeaderRole(serviceRole)) {
                        if (stageId == null) {
                                throw new BadRequestException("Stage ID is required for stage leader roles");
                        }
                        if (stageGroupId != null || classGradeId != null) {
                                throw new BadRequestException("Stage leaders cannot be assigned to stage group or class grade");
                        }
                } else if (isStageGroupLeaderRole(serviceRole)) {
                        if (stageGroupId == null) {
                                throw new BadRequestException("Stage group ID is required for stage group leader roles");
                        }
                        if (stageId != null || classGradeId != null) {
                                throw new BadRequestException("Stage group leaders cannot be assigned to stage or class grade");
                        }
                } else if (isClassRole(serviceRole)) {
                        if (classGradeId == null) {
                                throw new BadRequestException("Class grade ID is required for class roles");
                        }
                        if (stageId != null || stageGroupId != null) {
                                throw new BadRequestException("Class roles cannot be assigned to stage or stage group");
                        }
                }
        }

        // =========================
        // Add Teacher
        // =========================
        public TeacherResponseDTO addTeacher(
                        TeacherRequestDTO dto) {

                // =========================
                // Username Exists
                // =========================
                if (accountRepository.existsByUsername(
                                dto.getUsername())) {

                        throw new ConflictException(
                                        "Username already exists");
                }

                // =========================
                // Validate Role and Assignments
                // =========================
                validateTeacherRoleAndAssignments(dto.getServiceRole(), dto.getStageId(), dto.getStageGroupId(), dto.getClassGradeId());

                // =========================
                // Get Class Grade, Stage Group & Stage
                // =========================
                ClassGrade grade = null;
                StageGroup stageGroup = null;
                Stage stage = null;

                if (isClassRole(dto.getServiceRole())) {
                        grade = classGradeService.getClassGradeById(dto.getClassGradeId());
                } else if (isStageGroupLeaderRole(dto.getServiceRole())) {
                        stageGroup = stageGroupService.getById(dto.getStageGroupId());
                } else if (isStageLeaderRole(dto.getServiceRole())) {
                        stage = stageService.getById(dto.getStageId());
                }

                // =========================
                // Create Teacher Entity
                // =========================
                Teacher teacher = TeacherMapper.toEntity(
                                dto,
                                grade,
                                stageGroup,
                                stage);

                // =========================
                // Save Teacher
                // =========================
                Teacher savedTeacher = teacherRepository.save(
                                teacher);

                // =========================
                // Create Account
                // =========================
                Account account = new Account();

                account.setUsername(
                                dto.getUsername());

                account.setPassword(
                                passwordEncoder.encode(
                                                dto.getPassword()));

                // =========================
                // User Type
                // =========================
                account.setRole(
                                UserRole.TEACHER);

                account.setEnabled(true);

                account.setUser(
                                savedTeacher);

                accountRepository.save(
                                account);

                return TeacherMapper.toDTO(
                                savedTeacher);
        }

        // =========================
        // Get Teachers By Class Grade
        // =========================
        public List<TeacherResponseDTO> getTeachersByClassGrade(
                        long classGradeId) {

                return teacherRepository
                                .findByClassGrade_Id(
                                                classGradeId)
                                .stream()
                                .map(TeacherMapper::toDTO)
                                .toList();
        }

        // =========================
        // Get Teacher By ID DTO
        // =========================
        public TeacherResponseDTO getById(
                        UUID id) {

                return teacherRepository
                                .findById(id)
                                .map(TeacherMapper::toDTO)
                                .orElseThrow(() -> new NotFoundException(
                                                "Teacher not found"));
        }

        // =========================
        // Get Teacher Entity
        // =========================
        public Teacher getTeacherById(
                        UUID id) {

                return teacherRepository
                                .findById(id)
                                .orElseThrow(() -> new NotFoundException(
                                                "Teacher not found"));
        }

        // =========================
        // Get All Teachers
        // =========================
        public List<TeacherResponseDTO> getAllTeachers() {

                return teacherRepository
                                .findAll()
                                .stream()
                                .map(TeacherMapper::toDTO)
                                .toList();
        }

        // =========================
        // Update Teacher
        // =========================
        public TeacherResponseDTO updateTeacher(
                        UUID id,
                        TeacherUpdateRequestDTO dto) {

                Teacher teacher = getTeacherById(id);

                // =========================
                // Validate Role and Assignments
                // =========================
                validateTeacherRoleAndAssignments(dto.getServiceRole(), dto.getStageId(), dto.getStageGroupId(), dto.getClassGradeId());

                // =========================
                // Get Class Grade, Stage Group & Stage
                // =========================
                ClassGrade grade = null;
                StageGroup stageGroup = null;
                Stage stage = null;

                if (isClassRole(dto.getServiceRole())) {
                        grade = classGradeService.getClassGradeById(dto.getClassGradeId());
                } else if (isStageGroupLeaderRole(dto.getServiceRole())) {
                        stageGroup = stageGroupService.getById(dto.getStageGroupId());
                } else if (isStageLeaderRole(dto.getServiceRole())) {
                        stage = stageService.getById(dto.getStageId());
                }

                // =========================
                // Update Teacher
                // =========================
                teacher.setFirstName(
                                dto.getFirstName());

                teacher.setLastName(
                                dto.getLastName());

                teacher.setBirthDate(
                                dto.getBirthDate());

                teacher.setPhoneNumber(
                                dto.getPhoneNumber());

                teacher.setAddress(
                                dto.getAddress());

                teacher.setServiceRole(
                                dto.getServiceRole());

                // Assign relationships based on role
                if (isClassRole(dto.getServiceRole())) {
                        teacher.setClassGrade(grade);
                        if (grade != null && grade.getStageGroup() != null) {
                                teacher.setStageGroup(grade.getStageGroup());
                                teacher.setStage(grade.getStageGroup().getStage());
                        } else {
                                teacher.setStageGroup(null);
                                teacher.setStage(null);
                        }
                } else if (isStageGroupLeaderRole(dto.getServiceRole())) {
                        teacher.setStageGroup(stageGroup);
                        if (stageGroup != null) {
                                teacher.setStage(stageGroup.getStage());
                        } else {
                                teacher.setStage(null);
                        }
                        teacher.setClassGrade(null);
                } else if (isStageLeaderRole(dto.getServiceRole())) {
                        teacher.setStage(stage);
                        teacher.setStageGroup(null);
                        teacher.setClassGrade(null);
                } else {
                        teacher.setStage(null);
                        teacher.setStageGroup(null);
                        teacher.setClassGrade(null);
                }

                Teacher updatedTeacher = teacherRepository.save(
                                teacher);

                return TeacherMapper.toDTO(
                                updatedTeacher);
        }

        // =========================
        // Delete Teacher
        // =========================
        public void deleteTeacher(
                        UUID id) {

                Teacher teacher = getTeacherById(id);

                // =========================
                // Delete Account First
                // =========================
                accountRepository
                                .deleteByUser_Id(id);

                // =========================
                // Delete Teacher
                // =========================
                teacherRepository.delete(
                                teacher);
        }
}