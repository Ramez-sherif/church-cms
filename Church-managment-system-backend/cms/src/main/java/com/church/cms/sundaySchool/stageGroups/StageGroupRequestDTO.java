package com.church.cms.sundaySchool.stageGroups;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class StageGroupRequestDTO {

    @NotBlank(message = "Group name is required")
    private String name;

    @NotNull(message = "Stage ID is required")
    private Long stageId;
}
