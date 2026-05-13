package com.church.cms.sundaySchool.fathers;

import com.church.cms.sundaySchool.stages.Stage;

public class FatherMapper {
    public static Father toEntity(FatherRequestDTO dto, Stage stage) {
        Father f = new Father();
        f.setFirstName(dto.getFirstName());
        f.setLastName(dto.getLastName());
        f.setBirthDate(dto.getBirthDate());
        f.setPhoneNumber(dto.getPhoneNumber());
        f.setAddress(dto.getAddress());
        f.setStage(stage);
        return f;
    }

    public static FatherResponseDTO toDTO(Father f) {
        FatherResponseDTO dto = new FatherResponseDTO();
        dto.setId(f.getId());
        dto.setFirstName(f.getFirstName());
        dto.setLastName(f.getLastName());
        dto.setBirthDate(f.getBirthDate());
        dto.setPhoneNumber(f.getPhoneNumber());
        dto.setAddress(f.getAddress());

        if (f.getStage() != null) {
            dto.setStageId(f.getStage().getId());
            dto.setStageName(f.getStage().getName());
        }
        return dto;
    }
}
