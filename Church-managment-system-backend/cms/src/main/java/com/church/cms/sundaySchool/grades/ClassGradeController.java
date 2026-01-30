package com.church.cms.sundaySchool.grades;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.church.cms.sundaySchool.students.StudentResponseDTO;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/class-grades")
public class ClassGradeController {
    private final ClassGradeService classGradeService;

    @PostMapping
    public ResponseEntity<ClassGradeResponseDTO> addClassGrade(@RequestBody ClassGradeRequestDTO classGrade) {
      ClassGradeResponseDTO saved= this.classGradeService.addClassGrade(classGrade);
      return new ResponseEntity<>(saved,HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<ClassGradeResponseDTO>> getAllClassGrades(){
        return ResponseEntity.ok(this.classGradeService.getAllClassGrades());
    } 
     @GetMapping("/{id}/students")
    public ResponseEntity<List<StudentResponseDTO>> getClassGradeStudents(@PathVariable long id){
        return ResponseEntity.ok(this.classGradeService.getClassGradeStudents(id));
    }
}
/*
POST-> localhost:8080/class-grades
{
  "name": "Grade 3"
}

GET->  /class-grades
GET-> /class-grades/{id}/students














*/