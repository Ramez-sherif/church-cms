package com.church.cms.sundaySchool.fathers;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FatherResponseDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String phoneNumber;
    private String address;

    private Long stageId;
    private String stageName;
}
