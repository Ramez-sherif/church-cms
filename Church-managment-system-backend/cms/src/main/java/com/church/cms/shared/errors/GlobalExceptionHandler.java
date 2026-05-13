package com.church.cms.shared.errors;
import com.church.cms.shared.exceptions.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

// @RestControllerAdvice is a Spring annotation that allows us to handle exceptions globally
// across all controllers in a consistent way.
// By annotating this class with @RestControllerAdvice, 
// we can define methods that will be invoked 
// whenever specific exceptions are thrown in any controller, 
// allowing us to return structured error responses to the client.
@RestControllerAdvice 
public class GlobalExceptionHandler {

    /*
    1)

    This method handles MethodArgumentNotValidException,
    which is thrown when validation on an argument annotated
    with @Valid fails on a request body (e.g., a DTO object in a POST or PUT request).
    ==> validation on  @RequestBody/@ModelAttribute

    It constructs an ApiErrorResponse with details about the validation errors 
    and returns it with a 400 Bad Request status code

    The method takes the exception and the HttpServletRequest as parameters
    to extract information about the error and the request that caused it.

    The resulting ApiErrorResponse includes a timestamp, status code,
    error description, detailed message, the path of the request, 
    and a map of field errors for any validation issues that occurred.

    Example usage: If a client sends a POST request to /api/users with an invalid email field,
    this method will catch the resulting MethodArgumentNotValidException, 
    extract the validation error for the email field, 
    and return a structured error response indicating that the email must be a valid email address.
    The response will look something like this:
    {
        "timestamp": "2024-06-01T12:34:56.789Z",
        "status": 400,
        "error": "Bad Request",
        "message": "One or more fields have validation errors",
        "path": "/api/users",
        "fieldErrors": {
        "email": "must be a valid email address"
    }
    }

    */

    /*
    This structured error response helps clients understand exactly
    what went wrong with their request and how to fix it,
    especially in cases of validation errors where multiple fields might have issues.

    The method is annotated with @ExceptionHandler(MethodArgumentNotValidException.class)
    to indicate that it should handle exceptions of this type. 

    When such an exception is thrown in any controller, 
    this method will be invoked to handle it and return a consistent error response format.

    The use of ResponseEntity allows us to control the HTTP status code 
    and the body of the response, ensuring that clients receive a clear 
    and informative error message when their request fails validation.

    Note: This method can be further expanded to handle other types of exceptions 
    (e.g., ResourceNotFoundException, UnauthorizedException) 
    by adding additional methods with @ExceptionHandler annotations for those specific exception types. 

    Each method would construct an appropriate ApiErrorResponse 
    based on the nature of the error and return it with the corresponding HTTP status code.

    */

    // This annotation indicates that this method should handle exceptions
    // of type MethodArgumentNotValidException
    // This exception is thrown when validation on an argument annotated with @Valid fails
    @ExceptionHandler(MethodArgumentNotValidException.class) 
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(
        MethodArgumentNotValidException ex,
        HttpServletRequest request) {
        
     // Extract field errors from the exception and put them in a map
     // LinkedHashMap is used to maintain the order of fields as they appear in the request
     // ex.getBindingResult().getFieldErrors()
     // returns a list of FieldError objects, each representing a validation error for a specific field
     // For each FieldError, we put the field name and the default error message into the fieldErrors map
     // If there are multiple validation errors for the same field,
     // putIfAbsent ensures that only the first error message is kept for that field

     // Example: if the "email" field is invalid, we might have a FieldError with field="email"
     // and defaultMessage="must be a valid email address". 
     // This would result in an entry in the fieldErrors map like "email" -> "must be a valid email address".
     // This map will then be included in the ApiErrorResponse 
     // to provide detailed information about which fields had validation errors and what those errors were.
            
            // to maintain the order of fields
            Map<String,String> fieldErrors= new LinkedHashMap<>();     

            // Loop through each FieldError in the exception's binding result 
            // and populate the fieldErrors map
            for(FieldError fe : ex.getBindingResult().getFieldErrors()){

              // get the name of the field that has the error from the FieldError object
              //(e.g., "email") from the DTO class that was validated
               String fieldName = fe.getField(); 

              // get the default error message for that field that describes the validation issue
              // from the annotation (e.g., "must not be blank", "must be a valid email address")
              // that was at the field in the DTO class  
               String errorMessage = fe.getDefaultMessage(); 
               
             // add to the map if not already present in case of
             // multiple errors for the same field 
             // to avoid overwriting the first error message for that field
             fieldErrors.putIfAbsent(fieldName, errorMessage); 
            } 
            
            ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now()) // current time
                .status(HttpStatus.BAD_REQUEST.value()) // 400 Bad Request
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase()) // "Bad Request"
                .message("One or more fields have validation errors") // detailed message
                .path(request.getRequestURI()) // the endpoint that caused the error
                .fieldErrors(fieldErrors) // the map of field errors
                .build();
        
        return ResponseEntity.badRequest().body(body); // return 400 Bad Request with the error response body
    
    }

    /*
    2)

    This method handles ConstraintViolationException, 
    which is thrown when a validation constraint is violated on a method parameter 
    (e.g., @RequestParam, @PathVariable,@Positive) that is not part of the request body.

    It constructs an ApiErrorResponse with details about the constraint violations 
    and returns it with a 400 Bad Request status code.

    The method takes the exception and the HttpServletRequest 
    as parameters to extract information about the error and the request that caused it.

    The resulting ApiErrorResponse includes 
    a timestamp, status code, error description, detailed message, 
    the path of the request, and a map of field errors for any constraint violations that occurred.

    Example usage: If a client sends a GET request to /api/users/abc 
    where the user ID is expected to be a numeric value,

    this method will catch the resulting ConstraintViolationException, 
    extract the violation for the user ID parameter, 
    and return a structured error response indicating that the user ID must be a valid number.
    The response will look something like this:
    {
        "timestamp": "2024-06-01T12:34:56.789Z",
        "status": 400,
        "error": "Bad Request",
        "message": "One or more fields have constraint violations",
        "path": "/api/users/abc",
        "fieldErrors": {
        "userId": "must be a valid number"
        }
    } 

    This structured error response helps clients understand exactly
    what went wrong with their request and how to fix it, 
    especially in cases of constraint violations on method parameters.

    The method is annotated with @ExceptionHandler(ConstraintViolationException.class)
    to indicate that it should handle exceptions of this type. 

    When such an exception is thrown in any controller, 
    this method will be invoked to handle it and return a consistent error response format.
    The use of ResponseEntity allows us to control the HTTP status code 
    and the body of the response, ensuring that clients receive a clear 
    and informative error message when their request fails due to constraint violations.
    */


    // This annotation indicates that this method should handle exceptions
    // of type ConstraintViolationException
    @ExceptionHandler(ConstraintViolationException.class) 
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
        ConstraintViolationException ex, 
        HttpServletRequest request){

        // Extract constraint violations from the exception and put them in a map from
        // field name to error message and maintain the order of fields as they appear in the request
        Map<String,String> fieldErrors = new LinkedHashMap<>();

        // Loop through each ConstraintViolation in the exception and populate the fieldErrors map
        // ex.getConstraintViolations() returns a set of ConstraintViolation objects,
        // each representing a specific constraint violation that occurred on a method parameter
        // For each violation, we extract the property path 
        // (which indicates the name of the parameter that violated the constraint)
        // and the violation message (which describes the nature of the constraint violation)
        //<?> means that the ConstraintViolation can be for any type of object,
        // since it could be a violation on a @RequestParam, @PathVariable, 
        // or any other method parameter that has validation constraints
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {

            // get the name of the parameter that violated the constraint
            // (e.g., "userId") that is expected to be a valid number 
            String fieldName = violation.getPropertyPath().toString(); 

                // get the error message that describes the constraint violation 
                // that was at field in dto class 
                // (e.g., "must be a valid number") from the annotation
                // (e.g., @Positive, @Min, @Max) that was on the method parameter
                // in the controller that was violated in the request 
            String errorMessage = violation.getMessage();
            fieldErrors.put(fieldName, errorMessage);
        }

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())// current time
                .status(HttpStatus.BAD_REQUEST.value())// 400 Bad Request
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())// "Bad Request"
                .message("One or more fields have constraint violations")
                .path(request.getRequestURI())// the endpoint that caused the error
                .fieldErrors(fieldErrors) // the map of field errors
                .build(); // build the ApiErrorResponse object with all the error details

        return ResponseEntity.badRequest().body(body);
    }


    // This method handles NotFoundException, 
    // which is a custom exception that we can throw in our service layer
    // when a requested resource is not found (e.g., user with ID 123 does not exist).
    //404 Not Found → when the requested resource is not found
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFoundException(
        NotFoundException ex,
        HttpServletRequest request) {

            ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .fieldErrors(null)
                .build();

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    //400
    // This method handles BadRequestException,
    // which is a custom exception that we can throw in our service layer
    // when the client sends invalid data 
    // (e.g., missing required fields, invalid format, etc).
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequestException(
        BadRequestException ex,
        HttpServletRequest request) {

            ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .fieldErrors(null)
                .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    //409
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiErrorResponse> handleConflictException(
        ConflictException ex,
        HttpServletRequest request) {

            ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.CONFLICT.value())
                .error(HttpStatus.CONFLICT.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .fieldErrors(null)
                .build();

            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

     @ExceptionHandler(ForbiddenException.class)
     public ResponseEntity<ApiErrorResponse> handleForbidden(
        ForbiddenException ex, 
        HttpServletRequest request) {
            ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error(HttpStatus.FORBIDDEN.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .fieldErrors(null)
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

 // fallback 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request) {

        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error", request);
    }

    private ResponseEntity<ApiErrorResponse> buildError(
            HttpStatus status,
            String message,
            HttpServletRequest request) {

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .fieldErrors(null)
                .build();

        return ResponseEntity.status(status).body(body);
    }




}
