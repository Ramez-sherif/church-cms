package com.church.cms.sundaySchool.attendance;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  AttendanceRepository extends JpaRepository<Attendance, Long>{
    boolean existsByLessonIdAndUserId(UUID lessonId, UUID userId);
    List<Attendance> findByLessonId(UUID lessonId);
    List<Attendance> findByLesson_ClassGrade_Id(long classGradeId);//attendance.lesson.classGrade.id

    List<Attendance> findByUserId(UUID lessonId);

}
