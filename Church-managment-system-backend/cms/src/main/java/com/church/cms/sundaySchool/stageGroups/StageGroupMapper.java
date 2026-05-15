package com.church.cms.sundaySchool.stageGroups;

import com.church.cms.sundaySchool.stages.Stage;

public class StageGroupMapper {
    public static StageGroup toEntity(StageGroupRequestDTO dto, Stage stage) {
        StageGroup g = new StageGroup();
        g.setName(dto.getName().trim());
        g.setStage(stage);
        return g;
    }

    public static StageGroupResponseDTO toDTO(StageGroup g) {
        StageGroupResponseDTO dto = new StageGroupResponseDTO();
        dto.setId(g.getId());
        dto.setName(g.getName());
        if (g.getStage() != null) {
            dto.setStageId(g.getStage().getId());
            dto.setStageName(g.getStage().getName());
        }
        return dto;
    }
}
