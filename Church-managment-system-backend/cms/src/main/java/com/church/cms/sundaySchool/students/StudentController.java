package com.church.cms.sundaySchool.students;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    
    @PostMapping
    public ResponseEntity<StudentResponseDTO> addStudent(@RequestBody StudentRequestDTO studentDTO) { 
        StudentResponseDTO saved= this.studentService.addStudent(studentDTO);     
        return  new ResponseEntity<>(saved,HttpStatus.CREATED);
    }

    // Get/students/12
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable UUID id){
        return ResponseEntity.ok(this.studentService.getById(id));
    }
    
    @GetMapping("/class/{classGradeId}")
    public ResponseEntity<List<StudentResponseDTO>> getStudentByClassGrade(@PathVariable long classGradeId){
        return ResponseEntity.ok(this.studentService.getByClassGrade(classGradeId));
    }

    @GetMapping("/birthdays/lesson/{lessonId}")
    public ResponseEntity<List<StudentResponseDTO>> getStudentsByBirthDate(@PathVariable UUID lessonId){
        return ResponseEntity.ok(this.studentService.getStudentsByBirthDate(lessonId));
    }

}
/*
POST->  /students
{
  "firstName": "Peter",
  "lastName": "George",
  "birthDate": "2012-05-10",
  "phoneNumber": "01012345678",
  "address": "Cairo",
  "classGradeId": 1,
  "studentCode": "ST-001"
}

 GET->  /students/{uuid}
GET->  /students/class/{classGradeId}


*/