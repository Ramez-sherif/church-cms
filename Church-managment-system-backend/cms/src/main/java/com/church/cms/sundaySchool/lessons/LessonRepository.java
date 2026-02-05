package com.church.cms.sundaySchool.lessons;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID>{
     List<Lesson> findByClassGrade_Id(Long classGradeId);

    boolean existsByDateAndClassGrade_Id(LocalDate date, Long classGradeId);
    Optional<Lesson> findTopByClassGrade_IdOrderByDateDesc(Long classGradeId); 
    // Get the most recent lesson for a class grade
    //top=> find the first record in the ordered list
    //orderByDateDesc => order by date in descending order
  
}
