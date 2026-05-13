package com.church.cms.sundaySchool.grades;

import java.util.List;

import org.springframework.stereotype.Service;

import com.church.cms.shared.exceptions.NotFoundException;
import com.church.cms.sundaySchool.stageGroups.StageGroup;
import com.church.cms.sundaySchool.stageGroups.StageGroupService;
import com.church.cms.sundaySchool.students.StudentMapper;
import com.church.cms.sundaySchool.students.StudentRepository;
import com.church.cms.sundaySchool.students.StudentResponseDTO;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassGradeService {

    private final ClassGradeRepository classGradeRepository;
    private final StudentRepository studentRepository;
    private final StageGroupService stageGroupService;

    // create class grade
    public ClassGradeResponseDTO addClassGrade(ClassGradeRequestDTO dto) {
        StageGroup group = stageGroupService.getById(dto.getStageGroupId());
        ClassGrade saved = classGradeRepository.save(ClassGradeMapper.toEntity(dto, group));
        return ClassGradeMapper.toDTO(saved);
    }

    // get class grade by id
    public ClassGrade getClassGradeById(Long ClassGradeId) {
        return this.classGradeRepository.findById(ClassGradeId)
                .orElseThrow(() -> new NotFoundException("Class grade not found"));
    }

    public ClassGradeResponseDTO getById(Long ClassGradeId) {
        return this.classGradeRepository.findById(ClassGradeId).map(classGrade -> ClassGradeMapper.toDTO(classGrade))
                .orElseThrow(() -> new NotFoundException("Class grade not found"));
    }

    // get all classGrades
    public List<ClassGradeResponseDTO> getAllClassGrades() {
        return this.classGradeRepository.findAll().stream().map(classGrade -> ClassGradeMapper.toDTO(classGrade))
                .toList();
    }

    // get students By ClassGrade
    public List<StudentResponseDTO> getClassGradeStudents(long classGradeId) {
        return this.studentRepository.findByClassGrade_Id(classGradeId)
                .stream()
                .map(student -> StudentMapper.toDTO(student))
                .toList();
    }
}