package com.church.cms.sundaySchool.teachers;

import java.util.List;

import com.church.cms.sundaySchool.common.User;
import com.church.cms.sundaySchool.common.UserRole;
import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.lessons.Lesson;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Teacher extends User {

   private String serviceRole;      // أمين خدمة، مدرس، مساعد...
  
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_grade_id")
    private ClassGrade classGrade;      // الفصل المسؤول عنه

    @OneToMany(mappedBy = "teacher", fetch = FetchType.LAZY)
    private List<Lesson> lessons;       // الدروس اللي بيشرحها 

    @PrePersist
    public void prePersist() {
    this.setRole(UserRole.TEACHER);  // تحديد الدور تلقائي عند إنشاء المدرس
    }
   
}
