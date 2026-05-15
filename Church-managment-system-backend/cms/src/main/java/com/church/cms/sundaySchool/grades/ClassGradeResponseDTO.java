package com.church.cms.sundaySchool.grades;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ClassGradeResponseDTO {
    private Long id;
    private String name;

    private Long stageGroupId;
    private String stageGroupName;

    private Long stageId;
    private String stageName;
}
