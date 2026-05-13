package com.church.cms.sundaySchool.teachers;

import java.time.Instant;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TeacherCreateResponseDTO {

    private TeacherResponseDTO teacher;

    private String whatsappMessage;
    private String whatsappLink;

    private Instant expiresAt;
}