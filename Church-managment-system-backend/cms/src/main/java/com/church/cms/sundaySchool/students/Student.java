package com.church.cms.sundaySchool.students;

import java.util.List;

import com.church.cms.sundaySchool.attendance.Attendance;
import com.church.cms.sundaySchool.common.User;
import com.church.cms.sundaySchool.common.UserRole;
import com.church.cms.sundaySchool.grades.ClassGrade;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Entity
public class Student extends User {

    
 
    @Column(unique = true)
    private String studentCode;         //كل طالب: ليه كود تابع لفصل واحد


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_grade_id")
    private ClassGrade classGrade;              // الفصل اللي الطالب مسجل فيه
    

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Attendance> attendanceRecords;         // سجلات حضور الطالب

    @PrePersist
    public void prePersist() {
        this.setRole(UserRole.STUDENT);  // تحديد الدور تلقائي عند إنشاء الطالب
    }
}
