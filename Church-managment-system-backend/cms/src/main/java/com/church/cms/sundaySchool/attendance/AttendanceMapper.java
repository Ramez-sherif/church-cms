package com.church.cms.sundaySchool.attendance;

import com.church.cms.sundaySchool.common.User;
import com.church.cms.sundaySchool.lessons.Lesson;

public class AttendanceMapper {
    
    public static Attendance toEntity(AttendanceRequestDTO dto,Lesson lesson,User user){
        
        Attendance attendance= new Attendance();
        attendance.setStatus(dto.isStatus());
        attendance.setLesson(lesson);
        attendance.setUser(user);
        return attendance;     
    } 


     public static AttendanceResponseDTO toDTO(Attendance attendace){
        AttendanceResponseDTO dto =new AttendanceResponseDTO();
        dto.setStatus(attendace.isStatus());
        dto.setLessonTitle(attendace.getLesson().getTitle());
        dto.setLessonDate(attendace.getLesson().getDate());
        dto.setUserName(attendace.getUser().getFirstName()+" "+attendace.getUser().getLastName());
        dto.setUserRole(attendace.getUser().getRole());

        if(attendace.getLesson().getClassGrade() !=null){
          dto.setClassGradeName(attendace.getLesson().getClassGrade().getName());
        }
      
        return dto;

     }
}
