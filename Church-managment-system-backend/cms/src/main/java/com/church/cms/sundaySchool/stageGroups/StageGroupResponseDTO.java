package com.church.cms.sundaySchool.stageGroups;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StageGroupResponseDTO {
    private Long id;
    private String name;

    private Long stageId;
    private String stageName;
}
