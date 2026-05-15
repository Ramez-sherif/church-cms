package com.church.cms.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CurrentUserResponseDTO {

    private String username;

    private String role;

    private String fullName;
}