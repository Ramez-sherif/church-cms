package com.church.cms.sundaySchool.attendance;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.church.cms.sundaySchool.common.User;
import com.church.cms.sundaySchool.common.UserService;
import com.church.cms.sundaySchool.lessons.Lesson;
import com.church.cms.sundaySchool.lessons.LessonService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final LessonService lessonService;
    private final UserService userService;

    //create attendace sheet
    public AttendanceResponseDTO addAttendance(AttendanceRequestDTO attendanceDTO){
        //get lesson , class grade ,user object
        Lesson lesson =this.lessonService.getById(attendanceDTO.getLessonId());
        User user = userService.getUserById(attendanceDTO.getUserId());

        if (this.attendanceRepository
            .existsByLessonIdAndUserId(lesson.getId(), user.getId())){
                throw new IllegalStateException("Attendance already exists");
        }
        
        //create attendance obj
        Attendance attendance = AttendanceMapper.toEntity(attendanceDTO, lesson, user);
        //save in DB   
        this.attendanceRepository.save(attendance);
        return AttendanceMapper.toDTO(attendance);
    }

     public List<AttendanceResponseDTO> getAttendanceByLesson(UUID lessonId) {
        return this.attendanceRepository.findByLessonId(lessonId)
        .stream()
        .map(attendace-> AttendanceMapper.toDTO(attendace))
        .toList();
     }
       public List<AttendanceResponseDTO> getAttendanceByClassGradeId(long classGradeId) {
        return this.attendanceRepository.findByLesson_ClassGrade_Id(classGradeId)
        .stream()
        .map(attendace-> AttendanceMapper.toDTO(attendace))
        .toList();
     }

     
    public List<AttendanceResponseDTO> getByUser(UUID userId) {
         return this.attendanceRepository.findByUserId(userId)
         .stream()
         .map(attendace-> AttendanceMapper.toDTO(attendace))
         .toList();
    }
    
}
