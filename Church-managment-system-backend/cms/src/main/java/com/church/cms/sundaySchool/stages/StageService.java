package com.church.cms.sundaySchool.stages;

import java.util.List;

import org.springframework.stereotype.Service;

import com.church.cms.shared.exceptions.ConflictException;
import com.church.cms.shared.exceptions.NotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StageService {

    private final StageRepository stageRepository;

    public StageResponseDTO createStage(StageRequestDTO dto){

        // Trim the stage name to remove leading/trailing spaces
        String stageName = dto.getName().trim();

        // Check if stage with the same name already exists
        if(this.stageRepository.existsByNameIgnoreCase(stageName)){
            throw new ConflictException("Stage already exists");
        }

        // Map the request DTO to an entity, save it, and return the response DTO
        Stage saved = stageRepository.save(StageMapper.toEntity(dto));
        return StageMapper.toDTO(saved);
    } 

    public List<StageResponseDTO> getALL(){
       
        return this.stageRepository.findAll()
        .stream()
        .map(stage-> StageMapper.toDTO(stage)) // .map(StageMapper::toDTO)
        .toList();
    }

    public Stage getById(Long id){
      
        return this.stageRepository.findById(id)
            .orElseThrow(()->new NotFoundException("Stage not found"));
    }

    
}
