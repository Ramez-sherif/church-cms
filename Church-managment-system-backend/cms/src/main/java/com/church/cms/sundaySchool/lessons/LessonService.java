package com.church.cms.sundaySchool.lessons;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.grades.ClassGradeService;
import com.church.cms.sundaySchool.teachers.Teacher;
import com.church.cms.sundaySchool.teachers.TeacherService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonService {
    private final LessonRepository lessonRepository;
    private final TeacherService teacherService;
    private final ClassGradeService classGradeService;

    //Request DTO -> entity ,Entity -> DB , Entity -> Response DTO , Response DTO -> client 

    public LessonResponseDTO addLesson(LessonRequestDTO lessonRequestDTO){
            //validate pdf file
        if (!lessonRequestDTO.getPdf().getContentType().equals("application/pdf")) {
            throw new IllegalStateException("Only PDF files are allowed");
        }

        if(this.lessonRepository.existsByDateAndClassGrade_Id(lessonRequestDTO.getDate(), lessonRequestDTO.getClassGradeId())){
            throw new IllegalStateException(
             "There is already a lesson for this class on this date"
            );
        }

        // save pdf file to server and get path:

        // create unique file name://to avoid duplicate file names
        String fileName= UUID.randomUUID()+"_"+lessonRequestDTO.getPdf().getOriginalFilename(); 
        
        // specify your upload directory
        Path uploadPath= Paths.get("uploads/lessons"); 
        
        //create directories if not exist
        try {
            Files.createDirectories(uploadPath);        
        } catch (IOException ex) {
            System.getLogger(LessonService.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }

        //create file path with file name
        Path filePath= uploadPath.resolve(fileName);   

        //save the file to the server from windows
        try {
            Files.copy(lessonRequestDTO.getPdf().getInputStream(), filePath); 
        } catch (IOException ex) {
            System.getLogger(LessonService.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }

        //Get Teacher and ClassGrade obj:
        Teacher teacher = this.teacherService.getTeacherById(lessonRequestDTO.getTeacherId());
        ClassGrade classGrade= this.classGradeService.getClassGradeById(lessonRequestDTO.getClassGradeId());

        //Create Lesson obj:
        Lesson lesson= LessonMapper.toEntity(lessonRequestDTO, teacher, classGrade,"/uploads/lessons/" + fileName);

        //save lesson in DB:
         this.lessonRepository.save(lesson);
         
        //convert Entity to DTo
         return LessonMapper.toDTO(lesson);
    }

    //get list of lesson by class grade
    public List<LessonResponseDTO> getLessonsByClassGrade(Long classGradeId){
        return  this.lessonRepository.findByClassGrade_Id(classGradeId)
        .stream()
        .map(lesson->LessonMapper.toDTO(lesson))
        .toList();
    }


    //get last lesson by class grade
    public LessonResponseDTO getLastLessonByClassGrade(Long classGradeId){
        return this.lessonRepository.findTopByClassGrade_IdOrderByDateDesc(classGradeId)
        .map(lesson-> LessonMapper.toDTO(lesson))
        .orElseThrow(()->new IllegalStateException("No lessons found for this class grade"));
    }
    public LessonResponseDTO getLessonById(UUID lessonId){
        return this.lessonRepository.findById(lessonId)
        .map(lesson-> LessonMapper.toDTO(lesson))
        .orElseThrow(()->new IllegalStateException("Lesson not found"));
    }
    
    public Lesson getById(UUID lessonId){
        return this.lessonRepository.findById(lessonId)
        .orElseThrow(()->new IllegalStateException("Lesson not found"));
    }
}
