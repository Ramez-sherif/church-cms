package com.church.cms.sundaySchool.students;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface StudentRepository extends JpaRepository<Student, UUID>{

boolean existsByStudentCode(String studentCode);
List<Student> findByClassGrade_Id(long classGradeId);

}
