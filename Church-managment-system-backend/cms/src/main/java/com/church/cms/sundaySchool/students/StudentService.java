package com.church.cms.sundaySchool.students;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.church.cms.shared.exceptions.ConflictException;
import com.church.cms.shared.exceptions.NotFoundException;
import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.grades.ClassGradeService;
import com.church.cms.sundaySchool.lessons.Lesson;
import com.church.cms.sundaySchool.lessons.LessonService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentService {
  
private final StudentRepository studentRepository;
private final ClassGradeService classGradeService;
private final LessonService lessonService;

// 1. create student 
    public StudentResponseDTO addStudent(StudentRequestDTO studentDTO){
        
        //check Student code 
        if(this.studentRepository.existsByStudentCode(studentDTO.getStudentCode())){
            throw new ConflictException("Student code already exists");
        }
        //get class grade object
        ClassGrade classGrade= classGradeService.getClassGradeById(studentDTO.getClassGradeId());

        //map req dto -> entity
        Student student= StudentMapper.toEntity(studentDTO, classGrade);

         //save 
        Student saved =  this.studentRepository.save(student);
        //map entity ->res dto
        return StudentMapper.toDTO(saved);
    }

//2. list all student in the class

     public List<StudentResponseDTO> getByClassGrade(Long classGradeId) {
       
        return studentRepository.findByClassGrade_Id(classGradeId)
            .stream()                                           // loop on each student
            .map(student -> StudentMapper.toDTO(student))       // convert to dto
            .toList();                                          // return it to list again
    }


 //GET students by birth date
 public List<StudentResponseDTO> getStudentsByBirthDate(UUID lastLessonId) {

    Lesson lastLesson= this.lessonService.getById(lastLessonId);
    LocalDate lastLessonDate= lastLesson.getDate();
    
    LocalDate start= lastLessonDate.minusDays(3);
    LocalDate end = lastLessonDate.plusDays(3);

    List<Student> students= 
    this.studentRepository.findByClassGrade_Id(lastLesson.getClassGrade().getId());

    List<Student> birthdayStudents= students   .stream()   // loop on each student                                                   
         .filter(student->{                                                  // filter by birth date
                 LocalDate birthdayThisYear= 
                            student.getBirthDate().withYear(lastLessonDate.getYear());  // change year to this year
                 return ( !birthdayThisYear.isBefore(start) && !birthdayThisYear.isAfter(end) );        // check if in range
        })
        .toList();                                                                              // return as list

    return birthdayStudents.stream()
            .map(student->{                 // loop on each student
                return StudentMapper.toDTO(student);                       // convert to dto
            })  
            .toList();                                                  // return as list                            
 }





     //3. get user by id
    public StudentResponseDTO getById(UUID id) {
        return studentRepository.findById(id)
                .map(student->StudentMapper.toDTO(student))
                .orElseThrow(() -> new NotFoundException("Student not found"));
    }
         //3. get user by id
    public Student getByStudentId(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Student not found"));
    }
}
