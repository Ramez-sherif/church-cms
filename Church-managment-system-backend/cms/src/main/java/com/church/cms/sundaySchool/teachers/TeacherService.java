package com.church.cms.sundaySchool.teachers;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.church.cms.sundaySchool.grades.ClassGrade;
import com.church.cms.sundaySchool.grades.ClassGradeService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TeacherService {

    //flow
    //Request DTO -> Entity , Entity->save to DB ,Entity -> ResponseDTO , ResponseDTO -> client

    private final TeacherRepository teacherRepository;
    private final ClassGradeService classGradeService;
    //add teacher
    public TeacherResponseDTO addTeacher(TeacherRequestDTO dto){
        //get class grade of the teacher :
        ClassGrade grade= this.classGradeService.getClassGradeById(dto.getClassGradeId());

        //create Teacher Entity  and convert ReqDTO to Entity:
        Teacher teacher =  TeacherMapper.toEntity(dto, grade);

        //save entity in DB:
        this.teacherRepository.save(teacher);

        //convert Teacher Entity to Response DTO;
         return TeacherMapper.toDTO(teacher);
        
    }

    //get List of teachers of class-grade 
    public List<TeacherResponseDTO> getTeachersByClassGrade(long  classGradeId){
            return this.teacherRepository.findByClassGrade_Id(classGradeId)
            .stream()                   //loop int the list 
            .map(teacher->TeacherMapper.toDTO(teacher))   //convert each teacher from entity to DTO 
            .toList();      //return them to list 
    }

    //get teachers by id 
    public TeacherResponseDTO getById(UUID id)
    {
        return this.teacherRepository.findById(id)
        .map(teacher->TeacherMapper.toDTO(teacher))
        .orElseThrow(()->new IllegalStateException("Teacher not found"));
    }


 //get teachers by id 
    public Teacher getTeacherById(UUID id)
    {
        return this.teacherRepository.findById(id)
        .orElseThrow(()->new IllegalStateException("Teacher not found"));
    }
    
}
