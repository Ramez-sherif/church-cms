package com.church.cms.sundaySchool.stages;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class StageRequestDTO {

    @NotBlank(message = "Stage name is required")
    private String name;

}
