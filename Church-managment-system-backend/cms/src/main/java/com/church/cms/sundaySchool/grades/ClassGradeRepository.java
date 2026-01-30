package com.church.cms.sundaySchool.grades;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ClassGradeRepository extends  JpaRepository<ClassGrade , Long> {
   
}
