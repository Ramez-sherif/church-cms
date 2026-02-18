package com.church.cms.shared.exceptions;

//400 Bad Request → when the client sends invalid data 
// (e.g., missing required fields, invalid format, etc)
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
    
}
