package com.church.cms.sundaySchool.grades;

import com.church.cms.sundaySchool.stageGroups.StageGroup;

public class ClassGradeMapper {
    // request DTO to Entity

    public static ClassGrade toEntity(ClassGradeRequestDTO dto, StageGroup group) {
        ClassGrade c = new ClassGrade();
        c.setName(dto.getName().trim());
        c.setStageGroup(group);
        return c;
    }

    public static ClassGradeResponseDTO toDTO(ClassGrade c) {
        ClassGradeResponseDTO dto = new ClassGradeResponseDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());

        if (c.getStageGroup() != null) {
            dto.setStageGroupId(c.getStageGroup().getId());
            dto.setStageGroupName(c.getStageGroup().getName());

            if (c.getStageGroup().getStage() != null) {
                dto.setStageId(c.getStageGroup().getStage().getId());
                dto.setStageName(c.getStageGroup().getStage().getName());
            }
        }
        return dto;
    }
}
