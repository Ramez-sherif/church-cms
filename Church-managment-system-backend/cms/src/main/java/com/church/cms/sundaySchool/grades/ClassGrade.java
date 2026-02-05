package com.church.cms.sundaySchool.grades;
import java.util.List;

import com.church.cms.sundaySchool.lessons.Lesson;
import com.church.cms.sundaySchool.students.Student;
import com.church.cms.sundaySchool.teachers.Teacher;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Entity
public class ClassGrade {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @OneToMany(mappedBy="classGrade")
    private List<Student>students;      // الطلاب

    @OneToMany(mappedBy="classGrade")
    private List<Teacher>teachers;      // الخدام في الفصل

    @OneToMany(mappedBy="classGrade")
    private List<Lesson>lessons;        // الدروس
   
    /*
    @OneToMany(mappedBy = "classGrade")
    private List<Attendance> attendanceRecords; // سجلات الحضور
    */


}
