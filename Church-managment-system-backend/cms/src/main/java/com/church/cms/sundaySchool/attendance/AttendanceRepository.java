package com.church.cms.sundaySchool.attendance;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  AttendanceRepository extends JpaRepository<Attendance, Long>{
    boolean existsByLesson_IdAndUser_Id(UUID lessonId, UUID userId);
    List<Attendance> findByLesson_Id(UUID lessonId);
    List<Attendance> findByLesson_ClassGrade_Id(long classGradeId);//attendance.lesson.classGrade.id

    List<Attendance> findByUser_Id(UUID userId);

}
