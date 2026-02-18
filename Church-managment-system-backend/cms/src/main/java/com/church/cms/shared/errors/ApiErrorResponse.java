package com.church.cms.shared.errors;

import java.time.Instant;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;

@Getter  // Lombok annotation to generate getters for all fields in this class
@Builder // Lombok annotation to generate a builder pattern for this class
public class ApiErrorResponse {
    private Instant timestamp;      // when the error occurred
    private int status;             // HTTP status code (e.g., 400, 404, 500)
    private String error;           // short description of the error (e.g., "Bad Request")
    private String message;         // detailed error message (e.g., "User not found with ID 123")
    private String path;            // the endpoint path that caused the error (e.g., "/api/users")

    private Map<String,String> fieldErrors; // for validation errors, a map of field names to error messages (e.g., "email" -> "must be a valid email address")
}
