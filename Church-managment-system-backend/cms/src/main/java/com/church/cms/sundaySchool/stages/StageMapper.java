package com.church.cms.sundaySchool.stages;

public class StageMapper {
    
    public static Stage toEntity(StageRequestDTO dto) {
       
        Stage stage = new Stage();
        stage.setName(dto.getName().trim()); //trim to remove leading/trailing spaces
        return stage;
    }

    public static StageResponseDTO toDTO(Stage stage) {
        
        StageResponseDTO dto = new StageResponseDTO();
        dto.setId(stage.getId());
        dto.setName(stage.getName());
        return dto;
    }
}
