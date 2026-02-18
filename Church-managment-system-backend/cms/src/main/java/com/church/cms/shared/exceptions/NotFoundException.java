package com.church.cms.shared.exceptions;

//404 Not Found → when the requested resource is not found 
// (e.g., user with ID 123 does not exist)
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
    
}
