package com.church.cms.sundaySchool.teachers;

import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.church.cms.auth.Account;
import com.church.cms.auth.AccountRepository;
import com.church.cms.shared.exceptions.ConflictException;
import com.church.cms.shared.exceptions.NotFoundException;
import com.church.cms.sundaySchool.common.UserRole;
import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.grades.ClassGradeService;

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

    // =========================
    // Add Teacher
    // =========================
    public TeacherResponseDTO addTeacher(
            TeacherRequestDTO dto) {

        // username exists
        if (accountRepository.existsByUsername(
                dto.getUsername())) {

            throw new ConflictException(
                    "Username already exists");
        }

        // get class grade
        ClassGrade grade = classGradeService.getClassGradeById(
                dto.getClassGradeId());

        // create teacher entity
        Teacher teacher = TeacherMapper.toEntity(dto, grade);

        // save teacher
        Teacher savedTeacher = teacherRepository.save(teacher);

        // =========================
        // Create Account
        // =========================

        Account account = new Account();

        account.setUsername(dto.getUsername());

        account.setPassword(
                passwordEncoder.encode(
                        dto.getPassword()));

        account.setRole(UserRole.TEACHER);

        account.setEnabled(true);

        account.setUser(savedTeacher);

        accountRepository.save(account);

        return TeacherMapper.toDTO(savedTeacher);
    }

    // =========================
    // Get Teachers By Class Grade
    // =========================
    public List<TeacherResponseDTO> getTeachersByClassGrade(long classGradeId) {

        return teacherRepository
                .findByClassGrade_Id(classGradeId)
                .stream()
                .map(TeacherMapper::toDTO)
                .toList();
    }

    // =========================
    // Get Teacher By ID DTO
    // =========================
    public TeacherResponseDTO getById(UUID id) {

        return teacherRepository.findById(id)
                .map(TeacherMapper::toDTO)
                .orElseThrow(() -> new NotFoundException(
                        "Teacher not found"));
    }

    // =========================
    // Get Teacher Entity
    // =========================
    public Teacher getTeacherById(UUID id) {

        return teacherRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        "Teacher not found"));
    }
}