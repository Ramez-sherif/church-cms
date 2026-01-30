package com.church.cms.sundaySchool.attendance;

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
@RequestMapping("/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<AttendanceResponseDTO> addAttendance(@RequestBody AttendanceRequestDTO  attendance) {
       AttendanceResponseDTO saved= this.attendanceService.addAttendance(attendance);
       return new ResponseEntity<>(saved,HttpStatus.CREATED);
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendanceByLesson(@PathVariable UUID lessonId){
        return ResponseEntity.ok(this.attendanceService.getAttendanceByLesson(lessonId));
    }
    
    @GetMapping("/class/{classGradeId}")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendanceByClassGradeId(@PathVariable long classGradeId){
        return ResponseEntity.ok(this.attendanceService
            .getAttendanceByClassGradeId(classGradeId));
    }
    
}
/*
POST->  /attendance
{
  "status": true,
  "userId": "UUID-STUDENT",
  "lessonId": "UUID-LESSON",
  "classGradeId": 1
}

GET /attendance/lesson/{lessonId}
GET /class/{classGradeId}


*/