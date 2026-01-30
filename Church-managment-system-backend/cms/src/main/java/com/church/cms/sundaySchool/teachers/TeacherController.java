package com.church.cms.sundaySchool.teachers;

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
@RequiredArgsConstructor
@RequestMapping("/teachers")
public class TeacherController {
    private final TeacherService teacherService;

    @PostMapping
    public ResponseEntity<TeacherResponseDTO> addTeacher(@RequestBody TeacherRequestDTO dto) {
        TeacherResponseDTO saved= this.teacherService.addTeacher(dto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED) ;
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherResponseDTO> getTeacher(@PathVariable  UUID id) {
        return  ResponseEntity.ok(this.teacherService.getById(id));
    }
     @GetMapping("/class/{classGradeId}")
      public ResponseEntity<List<TeacherResponseDTO>> getTeachersByClassGrade(@PathVariable long classGradeId) {
        return  ResponseEntity.ok(this.teacherService.getTeachersByClassGrade(classGradeId));
    }
    
}
/*
POST->  /teachers
{
  "firstName": "Michael",
  "lastName": "Samy",
  "birthDate": "1990-03-15",
  "phoneNumber": "01122223333",
  "address": "Giza",
  "serviceRole": "Teacher",
  "classGradeId": 1
}

GET->  /teachers/class/{classGradeId}



*/