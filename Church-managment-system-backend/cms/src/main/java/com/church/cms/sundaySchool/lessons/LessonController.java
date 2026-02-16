package com.church.cms.sundaySchool.lessons;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;



@RestController
@RequiredArgsConstructor
@RequestMapping("/lessons")
@Validated
public class LessonController {
    private final LessonService lessonService;

    @PostMapping(consumes="multipart/form-data")
    public ResponseEntity<LessonResponseDTO> addLesson(
        @Valid @ModelAttribute LessonRequestDTO lesson) {
     
        LessonResponseDTO saved= this.lessonService.addLesson(lesson);
        return new ResponseEntity<>(saved,HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<LessonResponseDTO> getLesson(@PathVariable UUID id) {
     return ResponseEntity.ok(this.lessonService.getLessonById(id));
    }
    //get lessons by class grade

    @GetMapping("class/{classgradeId}")
    public ResponseEntity<List<LessonResponseDTO>> getLessonsByClassGrade(
        @PathVariable @Positive(message="معرف الصف يجب أن يكون رقمًا موجبًا") long classgradeId) {
       
        return ResponseEntity.ok(this.lessonService.getLessonsByClassGrade(classgradeId));
    }
    
    //get last lesson by class grade 
    //GET /class/{id}/last-lesson

    @GetMapping("class/{classgradeId}/last-lesson")
    public ResponseEntity<LessonResponseDTO> getLastLessonByClassGrade(
        @PathVariable @Positive(message="معرف الصف يجب أن يكون رقمًا موجبًا") long classgradeId) {
       
        return ResponseEntity.ok(this.lessonService.getLastLessonByClassGrade(classgradeId));
    }
    
}
/*
POST->  /lessons
{
  "name": "Bible Lesson",
  "title": "Noah Ark",
  "date": "2024-10-01",
  "pdfFilePath": "/files/noah.pdf",
  "teacherId": "UUID-HERE",
  "classGradeId": 1
}

GET /lessons/class/{classGradeId}

*/