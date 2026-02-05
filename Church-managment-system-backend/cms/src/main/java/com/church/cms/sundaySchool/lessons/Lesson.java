package com.church.cms.sundaySchool.lessons;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import com.church.cms.sundaySchool.attendance.Attendance;
import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.teachers.Teacher;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
    name = "lessons",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"lesson_Date", "class_grade_id"})
    }
)
public class Lesson {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;
 private String title;     
 @Column(name = "lesson_Date",nullable=false)
 private LocalDate date;             // تاريخ شرح الدرس ✅
 private String pdfFilePath;         //   pdf  ملف  على السيرفر 
 
 
@ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "teacher_id")
private Teacher teacher;          // الخادم اللي شرح الدرس
 

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "class_grade_id")
private ClassGrade classGrade;        // الفصل اللي الدرس اتطبق فيه


@OneToMany(mappedBy = "lesson", fetch = FetchType.LAZY)
private List<Attendance> attendanceRecords;     // سجلات الحضور للدرس

}
