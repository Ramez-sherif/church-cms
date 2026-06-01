package com.church.cms.sundaySchool.teachers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.church.cms.auth.Account;
import com.church.cms.auth.AccountRepository;
import com.church.cms.shared.exceptions.BadRequestException;
import com.church.cms.sundaySchool.common.ServiceRole;
import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.grades.ClassGradeService;
import com.church.cms.sundaySchool.stages.Stage;
import com.church.cms.sundaySchool.stages.StageService;
import com.church.cms.sundaySchool.stageGroups.StageGroup;
import com.church.cms.sundaySchool.stageGroups.StageGroupService;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private ClassGradeService classGradeService;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private StageService stageService;

    @Mock
    private StageGroupService stageGroupService;

    @InjectMocks
    private TeacherService teacherService;

    private TeacherRequestDTO addDto;
    private TeacherUpdateRequestDTO updateDto;
    private Teacher existingTeacher;

    @BeforeEach
    void setUp() {
        addDto = new TeacherRequestDTO();
        addDto.setFirstName("John");
        addDto.setLastName("Doe");
        addDto.setBirthDate(LocalDate.of(1990, 1, 1));
        addDto.setPhoneNumber("01012345678");
        addDto.setAddress("Cairo, Egypt");
        addDto.setUsername("johndoe");
        addDto.setPassword("securepassword");

        updateDto = new TeacherUpdateRequestDTO();
        updateDto.setFirstName("John");
        updateDto.setLastName("Doe");
        updateDto.setBirthDate(LocalDate.of(1990, 1, 1));
        updateDto.setPhoneNumber("01012345678");
        updateDto.setAddress("Cairo, Egypt");

        existingTeacher = new Teacher();
        existingTeacher.setId(UUID.randomUUID());
        existingTeacher.setFirstName("John");
        existingTeacher.setLastName("Doe");
    }

    // ==========================================
    // GENERAL_ADMIN VALIDATION TESTS
    // ==========================================

    @Test
    void addTeacher_GeneralAdminWithStageId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.GENERAL_ADMIN);
        addDto.setStageId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("GENERAL_ADMIN cannot be assigned to stage, stage group, or class grade", ex.getMessage());
    }

    @Test
    void addTeacher_GeneralAdminWithStageGroupId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.GENERAL_ADMIN);
        addDto.setStageGroupId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("GENERAL_ADMIN cannot be assigned to stage, stage group, or class grade", ex.getMessage());
    }

    @Test
    void addTeacher_GeneralAdminWithClassGradeId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.GENERAL_ADMIN);
        addDto.setClassGradeId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("GENERAL_ADMIN cannot be assigned to stage, stage group, or class grade", ex.getMessage());
    }

    @Test
    void addTeacher_GeneralAdminValid_SavesSuccessfully() {
        addDto.setServiceRole(ServiceRole.GENERAL_ADMIN);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);
        
        Teacher teacherMock = new Teacher();
        teacherMock.setId(UUID.randomUUID());
        teacherMock.setFirstName(addDto.getFirstName());
        teacherMock.setLastName(addDto.getLastName());
        teacherMock.setServiceRole(ServiceRole.GENERAL_ADMIN);

        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacherMock);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedpwd");

        TeacherResponseDTO response = teacherService.addTeacher(addDto);

        assertNotNull(response);
        assertEquals(ServiceRole.GENERAL_ADMIN, response.getServiceRole());
        verify(teacherRepository).save(any(Teacher.class));
    }

    // ==========================================
    // STAGE LEADER VALIDATION TESTS
    // ==========================================

    @Test
    void addTeacher_StageLeaderMissingStageId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.STAGE_LEADER);
        addDto.setStageId(null);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("Stage ID is required for stage leader roles", ex.getMessage());
    }

    @Test
    void addTeacher_StageLeaderWithStageGroupId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.STAGE_LEADER);
        addDto.setStageId(1L);
        addDto.setStageGroupId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("Stage leaders cannot be assigned to stage group or class grade", ex.getMessage());
    }

    @Test
    void addTeacher_StageLeaderValid_SavesSuccessfully() {
        addDto.setServiceRole(ServiceRole.STAGE_LEADER);
        addDto.setStageId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        Stage mockStage = new Stage();
        mockStage.setId(1L);
        mockStage.setName("Primary Stage");
        when(stageService.getById(1L)).thenReturn(mockStage);

        Teacher teacherMock = new Teacher();
        teacherMock.setId(UUID.randomUUID());
        teacherMock.setFirstName(addDto.getFirstName());
        teacherMock.setLastName(addDto.getLastName());
        teacherMock.setServiceRole(ServiceRole.STAGE_LEADER);
        teacherMock.setStage(mockStage);

        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacherMock);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedpwd");

        TeacherResponseDTO response = teacherService.addTeacher(addDto);

        assertNotNull(response);
        assertEquals(ServiceRole.STAGE_LEADER, response.getServiceRole());
        assertEquals(1L, response.getStageId());
    }

    // ==========================================
    // STAGE GROUP LEADER VALIDATION TESTS
    // ==========================================

    @Test
    void addTeacher_StageGroupLeaderMissingStageGroupId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.STAGE_GROUP_LEADER);
        addDto.setStageGroupId(null);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("Stage group ID is required for stage group leader roles", ex.getMessage());
    }

    @Test
    void addTeacher_StageGroupLeaderWithClassGradeId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.STAGE_GROUP_LEADER);
        addDto.setStageGroupId(1L);
        addDto.setClassGradeId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("Stage group leaders cannot be assigned to stage or class grade", ex.getMessage());
    }

    @Test
    void addTeacher_StageGroupLeaderValid_SavesSuccessfully() {
        addDto.setServiceRole(ServiceRole.STAGE_GROUP_LEADER);
        addDto.setStageGroupId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        StageGroup mockGroup = new StageGroup();
        mockGroup.setId(1L);
        mockGroup.setName("Group A");
        when(stageGroupService.getById(1L)).thenReturn(mockGroup);

        Teacher teacherMock = new Teacher();
        teacherMock.setId(UUID.randomUUID());
        teacherMock.setFirstName(addDto.getFirstName());
        teacherMock.setLastName(addDto.getLastName());
        teacherMock.setServiceRole(ServiceRole.STAGE_GROUP_LEADER);
        teacherMock.setStageGroup(mockGroup);

        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacherMock);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedpwd");

        TeacherResponseDTO response = teacherService.addTeacher(addDto);

        assertNotNull(response);
        assertEquals(ServiceRole.STAGE_GROUP_LEADER, response.getServiceRole());
        assertEquals(1L, response.getStageGroupId());
    }

    // ==========================================
    // CLASS ROLE VALIDATION TESTS (CLASS_TEACHER, etc.)
    // ==========================================

    @Test
    void addTeacher_ClassTeacherMissingClassGradeId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.CLASS_TEACHER);
        addDto.setClassGradeId(null);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("Class grade ID is required for class roles", ex.getMessage());
    }

    @Test
    void addTeacher_ClassTeacherWithStageGroupId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.CLASS_TEACHER);
        addDto.setClassGradeId(1L);
        addDto.setStageGroupId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("Class roles cannot be assigned to stage or stage group", ex.getMessage());
    }

    @Test
    void addTeacher_ClassTeacherValid_SavesSuccessfully() {
        addDto.setServiceRole(ServiceRole.CLASS_TEACHER);
        addDto.setClassGradeId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        ClassGrade mockGrade = new ClassGrade();
        mockGrade.setId(1L);
        mockGrade.setName("Grade 4");
        when(classGradeService.getClassGradeById(1L)).thenReturn(mockGrade);

        Teacher teacherMock = new Teacher();
        teacherMock.setId(UUID.randomUUID());
        teacherMock.setFirstName(addDto.getFirstName());
        teacherMock.setLastName(addDto.getLastName());
        teacherMock.setServiceRole(ServiceRole.CLASS_TEACHER);
        teacherMock.setClassGrade(mockGrade);

        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacherMock);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedpwd");

        TeacherResponseDTO response = teacherService.addTeacher(addDto);

        assertNotNull(response);
        assertEquals(ServiceRole.CLASS_TEACHER, response.getServiceRole());
        assertEquals(1L, response.getClassGradeId());
    }
}
