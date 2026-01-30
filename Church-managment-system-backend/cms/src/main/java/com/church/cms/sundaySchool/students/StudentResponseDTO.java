package com.church.cms.sundaySchool.students;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import com.church.cms.sundaySchool.attendance.Attendance;
import com.church.cms.sundaySchool.common.UserRole;
import com.church.cms.sundaySchool.grades.ClassGrade;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentResponseDTO {
    
    private UUID id;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;  //YYYY-MM-DD 
    private String phoneNumber;
    private String address;

    private String studentCode;         //كل طالب: ليه كود تابع لفصل واحد
    private String classGradeName;
    
}
