package com.church.cms.sundaySchool.grades;

import java.util.List;

import com.church.cms.sundaySchool.lessons.Lesson;
import com.church.cms.sundaySchool.stageGroups.StageGroup;
import com.church.cms.sundaySchool.students.Student;
import com.church.cms.sundaySchool.teachers.Teacher;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "class_grades")
public class ClassGrade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // مثال: أولى ابتدائي، ثاني ثانوي

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_group_id", nullable = false)
    private StageGroup stageGroup; // المجموعة الدراسية

    @OneToMany(mappedBy = "classGrade")
    private List<Student> students; // الطلاب

    @OneToMany(mappedBy = "classGrade")
    private List<Teacher> teachers; // الخدام في الفصل

    @OneToMany(mappedBy = "classGrade")
    private List<Lesson> lessons; // الدروس

}
