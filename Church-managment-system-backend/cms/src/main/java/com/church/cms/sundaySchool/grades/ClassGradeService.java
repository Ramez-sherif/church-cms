package com.church.cms.sundaySchool.grades;
import java.util.List;

import org.springframework.stereotype.Service;

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

    //create class grade
    public ClassGradeResponseDTO addClassGrade(ClassGradeRequestDTO classGradeDTO){
        ClassGrade classGrade= ClassGradeMapper.toEntity(classGradeDTO);
        this.classGradeRepository.save(classGrade);
        return ClassGradeMapper.toDTO(classGrade);
    }

    //get class grade by id 
    public ClassGrade getClassGradeById(Long ClassGradeId){
        return this.classGradeRepository.findById(ClassGradeId)
        .orElseThrow(()->new IllegalStateException("can not find class grade by this id "));
    }

        public ClassGradeResponseDTO getById(Long ClassGradeId){
        return this.classGradeRepository.findById(ClassGradeId).map(classGrade ->ClassGradeMapper.toDTO(classGrade))
        .orElseThrow(()->new IllegalStateException("can not find class grade by this id "));
    }
   

    //get all classGrades
    public List<ClassGradeResponseDTO> getAllClassGrades(){
        return this.classGradeRepository.findAll().stream().map(classGrade -> ClassGradeMapper.toDTO(classGrade)).toList();
    }

    //get students By ClassGrade
    public List<StudentResponseDTO> getClassGradeStudents(long classGradeId){
        return this.studentRepository.findByClassGradeId(classGradeId)
        .stream()
        .map(student->StudentMapper.toDTO(student))
        .toList();
}
}