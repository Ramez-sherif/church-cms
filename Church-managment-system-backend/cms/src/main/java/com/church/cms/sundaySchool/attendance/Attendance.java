package com.church.cms.sundaySchool.attendance;

import com.church.cms.sundaySchool.common.User;
import com.church.cms.sundaySchool.lessons.Lesson;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
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
    name = "attendance",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
    }
)
public class Attendance {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private boolean status; // true = حاضر / false = غائب
    
    @ManyToOne(optional=false)
    private User user;  //خادم او مخدوم 

    @ManyToOne(optional = false)
    private Lesson lesson;


  

}
