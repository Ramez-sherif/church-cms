package com.church.cms.sundaySchool.teachers;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;


public interface TeacherRepository extends JpaRepository<Teacher, UUID> {
    List<Teacher> findByClassGradeId(Long classGradeID);
}
