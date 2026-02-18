package com.church.cms.shared.exceptions;

//409 Conflict → when there is a conflict with the current state of the resource
// (e.g., trying to create a user with an email that already exists)
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
    
}
