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
import com.church.cms.shared.exceptions.ConflictException;
import com.church.cms.shared.exceptions.NotFoundException;
import com.church.cms.sundaySchool.common.ServiceRole;
import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.grades.ClassGradeService;
import com.church.cms.sundaySchool.stages.Stage;
import com.church.cms.sundaySchool.stages.StageService;

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

        assertEquals("GENERAL_ADMIN cannot be assigned to stage or class grade", ex.getMessage());
    }

    @Test
    void addTeacher_GeneralAdminWithClassGradeId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.GENERAL_ADMIN);
        addDto.setClassGradeId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("GENERAL_ADMIN cannot be assigned to stage or class grade", ex.getMessage());
    }

    @Test
    void updateTeacher_GeneralAdminWithStageId_ThrowsBadRequestException() {
        UUID id = UUID.randomUUID();
        updateDto.setServiceRole(ServiceRole.GENERAL_ADMIN);
        updateDto.setStageId(1L);

        when(teacherRepository.findById(id)).thenReturn(Optional.of(existingTeacher));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.updateTeacher(id, updateDto);
        });

        assertEquals("GENERAL_ADMIN cannot be assigned to stage or class grade", ex.getMessage());
    }

    @Test
    void addTeacher_GeneralAdminValid_SavesSuccessfully() {
        addDto.setServiceRole(ServiceRole.GENERAL_ADMIN);
        addDto.setStageId(null);
        addDto.setClassGradeId(null);

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
        verify(accountRepository).save(any(Account.class));
    }

    // ==========================================
    // STAGE ROLE VALIDATION TESTS
    // ==========================================

    @Test
    void addTeacher_StageLeaderWithClassGradeId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.STAGE_LEADER);
        addDto.setStageId(1L);
        addDto.setClassGradeId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("Stage leaders cannot be assigned to class grade", ex.getMessage());
    }

    @Test
    void addTeacher_StageLeaderMissingStageId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.STAGE_LEADER);
        addDto.setStageId(null);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("Stage ID is required for STAGE_LEADER role", ex.getMessage());
    }

    @Test
    void updateTeacher_AssistantStageLeaderWithClassGradeId_ThrowsBadRequestException() {
        UUID id = UUID.randomUUID();
        updateDto.setServiceRole(ServiceRole.ASSISTANT_STAGE_LEADER);
        updateDto.setStageId(1L);
        updateDto.setClassGradeId(1L);

        when(teacherRepository.findById(id)).thenReturn(Optional.of(existingTeacher));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.updateTeacher(id, updateDto);
        });

        assertEquals("Stage leaders cannot be assigned to class grade", ex.getMessage());
    }

    @Test
    void addTeacher_StageLeaderValid_SavesSuccessfully() {
        addDto.setServiceRole(ServiceRole.STAGE_LEADER);
        addDto.setStageId(1L);
        addDto.setClassGradeId(null);

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
        verify(stageService).getById(1L);
        verify(teacherRepository).save(any(Teacher.class));
    }

    // ==========================================
    // CLASS_SERVANT VALIDATION TESTS
    // ==========================================

    @Test
    void addTeacher_ClassServantWithStageId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.CLASS_SERVANT);
        addDto.setClassGradeId(1L);
        addDto.setStageId(1L);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("CLASS_SERVANT cannot manually assign stage", ex.getMessage());
    }

    @Test
    void addTeacher_ClassServantMissingClassGradeId_ThrowsBadRequestException() {
        addDto.setServiceRole(ServiceRole.CLASS_SERVANT);
        addDto.setClassGradeId(null);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.addTeacher(addDto);
        });

        assertEquals("Class grade ID is required for CLASS_SERVANT role", ex.getMessage());
    }

    @Test
    void updateTeacher_ClassServantWithStageId_ThrowsBadRequestException() {
        UUID id = UUID.randomUUID();
        updateDto.setServiceRole(ServiceRole.CLASS_SERVANT);
        updateDto.setClassGradeId(1L);
        updateDto.setStageId(1L);

        when(teacherRepository.findById(id)).thenReturn(Optional.of(existingTeacher));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            teacherService.updateTeacher(id, updateDto);
        });

        assertEquals("CLASS_SERVANT cannot manually assign stage", ex.getMessage());
    }

    @Test
    void addTeacher_ClassServantValid_SavesSuccessfully() {
        addDto.setServiceRole(ServiceRole.CLASS_SERVANT);
        addDto.setClassGradeId(1L);
        addDto.setStageId(null);

        when(accountRepository.existsByUsername(addDto.getUsername())).thenReturn(false);

        ClassGrade mockGrade = new ClassGrade();
        mockGrade.setId(1L);
        mockGrade.setName("Grade 4");
        when(classGradeService.getClassGradeById(1L)).thenReturn(mockGrade);

        Teacher teacherMock = new Teacher();
        teacherMock.setId(UUID.randomUUID());
        teacherMock.setFirstName(addDto.getFirstName());
        teacherMock.setLastName(addDto.getLastName());
        teacherMock.setServiceRole(ServiceRole.CLASS_SERVANT);
        teacherMock.setClassGrade(mockGrade);

        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacherMock);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedpwd");

        TeacherResponseDTO response = teacherService.addTeacher(addDto);

        assertNotNull(response);
        assertEquals(ServiceRole.CLASS_SERVANT, response.getServiceRole());
        assertEquals(1L, response.getClassGradeId());
        verify(classGradeService).getClassGradeById(1L);
        verify(teacherRepository).save(any(Teacher.class));
    }
}
