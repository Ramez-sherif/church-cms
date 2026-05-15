package com.church.cms.sundaySchool.lessons;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.church.cms.auth.AuthorizationService;
import com.church.cms.auth.SecurityUtils;
import com.church.cms.shared.exceptions.BadRequestException;
import com.church.cms.shared.exceptions.ConflictException;
import com.church.cms.shared.exceptions.NotFoundException;
import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.grades.ClassGradeService;
import com.church.cms.sundaySchool.teachers.Teacher;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonService {

        private final LessonRepository lessonRepository;

        private final ClassGradeService classGradeService;

        private final SecurityUtils securityUtils;

        private final AuthorizationService authorizationService;

        // =========================
        // Add Lesson
        // =========================
        public LessonResponseDTO addLesson(
                        LessonRequestDTO lessonRequestDTO) {

                // =========================
                // Validate PDF Exists
                // =========================
                if (lessonRequestDTO.getPdf() == null) {

                        throw new BadRequestException(
                                        "PDF file is required");
                }

                // =========================
                // Validate File Size
                // 10 MB max
                // =========================
                if (lessonRequestDTO
                                .getPdf()
                                .getSize() > 10_000_000) {

                        throw new BadRequestException(
                                        "File size too large");
                }

                // =========================
                // Validate File Extension
                // =========================
                String originalFileName = lessonRequestDTO
                                .getPdf()
                                .getOriginalFilename();

                if (originalFileName == null
                                || !originalFileName
                                                .toLowerCase()
                                                .endsWith(".pdf")) {

                        throw new BadRequestException(
                                        "Only PDF files are allowed");
                }

                // =========================
                // Validate Content Type
                // =========================
                if (!lessonRequestDTO
                                .getPdf()
                                .getContentType()
                                .equals("application/pdf")) {

                        throw new BadRequestException(
                                        "Only PDF files are allowed");
                }

                // =========================
                // Check Duplicate Lesson
                // =========================
                if (lessonRepository.existsByDateAndClassGrade_Id(
                                lessonRequestDTO.getDate(),
                                lessonRequestDTO.getClassGradeId())) {

                        throw new ConflictException(
                                        "There is already a lesson for this class on this date");
                }

                // =========================
                // Create Unique File Name
                // =========================
                String fileName = UUID.randomUUID()
                                + "_"
                                + originalFileName;

                // =========================
                // Upload Directory
                // =========================
                Path uploadPath = Paths.get("uploads/lessons");

                // create folders
                try {

                        Files.createDirectories(uploadPath);

                } catch (IOException ex) {

                        throw new BadRequestException(
                                        "Could not create upload directory");
                }

                // =========================
                // Final File Path
                // =========================
                Path filePath = uploadPath.resolve(fileName);

                // =========================
                // Save File
                // =========================
                try {

                        Files.copy(
                                        lessonRequestDTO
                                                        .getPdf()
                                                        .getInputStream(),
                                        filePath);

                } catch (IOException ex) {

                        throw new BadRequestException(
                                        "Failed to save PDF file");
                }

                // =========================
                // Get Class Grade
                // =========================
                ClassGrade classGrade = classGradeService.getClassGradeById(
                                lessonRequestDTO.getClassGradeId());

                // =========================
                // Authorization
                // =========================
                authorizationService.assertTeacherOwnsClass(
                                classGrade.getId());

                // =========================
                // Current Logged-in Teacher
                // =========================
                Teacher teacher = securityUtils.getCurrentTeacher();

                // =========================
                // Create Lesson Entity
                // =========================
                Lesson lesson = LessonMapper.toEntity(
                                lessonRequestDTO,
                                teacher,
                                classGrade,
                                "/uploads/lessons/" + fileName);

                // =========================
                // Save Lesson
                // =========================
                lessonRepository.save(lesson);

                // =========================
                // Return DTO
                // =========================
                return LessonMapper.toDTO(lesson);
        }

        // =========================
        // Get Lessons By Class Grade
        // =========================
        public List<LessonResponseDTO> getLessonsByClassGrade(Long classGradeId) {

                authorizationService.assertTeacherOwnsClass(
                                classGradeId);

                return lessonRepository
                                .findByClassGrade_Id(classGradeId)
                                .stream()
                                .map(LessonMapper::toDTO)
                                .toList();
        }

        // =========================
        // Get Last Lesson
        // =========================
        public LessonResponseDTO getLastLessonByClassGrade(Long classGradeId) {

                authorizationService.assertTeacherOwnsClass(
                                classGradeId);

                return lessonRepository
                                .findTopByClassGrade_IdOrderByDateDesc(
                                                classGradeId)
                                .map(LessonMapper::toDTO)
                                .orElseThrow(() -> new NotFoundException(
                                                "No lessons found for this class grade"));
        }

        // =========================
        // Get Lesson DTO By Id
        // =========================
        public LessonResponseDTO getLessonById(UUID lessonId) {

                Lesson lesson = lessonRepository.findById(lessonId)
                                .orElseThrow(() -> new NotFoundException(
                                                "Lesson not found"));

                authorizationService.assertTeacherOwnsClass(
                                lesson.getClassGrade().getId());

                return LessonMapper.toDTO(lesson);
        }

        // =========================
        // Get Lesson Entity By Id
        // =========================
        public Lesson getById(UUID lessonId) {

                Lesson lesson = lessonRepository.findById(lessonId)
                                .orElseThrow(() -> new NotFoundException(
                                                "Lesson not found"));

                authorizationService.assertTeacherOwnsClass(
                                lesson.getClassGrade().getId());

                return lesson;
        }
}