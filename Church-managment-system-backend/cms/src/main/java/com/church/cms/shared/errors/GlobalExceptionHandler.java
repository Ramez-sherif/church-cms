package com.church.cms.shared.errors;

import com.church.cms.shared.exceptions.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.validation.FieldError;

import org.springframework.web.bind.MethodArgumentNotValidException;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================
    // @Valid DTO Validation
    // =========================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        Map<String, String> fieldErrors = new LinkedHashMap<>();

        for (FieldError fe : ex.getBindingResult()
                .getFieldErrors()) {

            String fieldName = fe.getField();

            String errorMessage = fe.getDefaultMessage();

            fieldErrors.putIfAbsent(
                    fieldName,
                    errorMessage);
        }

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(
                        HttpStatus.BAD_REQUEST.value())
                .error(
                        HttpStatus.BAD_REQUEST
                                .getReasonPhrase())
                .message(
                        "One or more fields have validation errors")
                .path(
                        request.getRequestURI())
                .fieldErrors(fieldErrors)
                .build();

        return ResponseEntity
                .badRequest()
                .body(body);
    }

    // =========================
    // @PathVariable / @RequestParam Validation
    // =========================
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request) {

        Map<String, String> fieldErrors = new LinkedHashMap<>();

        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {

            String fieldName = violation
                    .getPropertyPath()
                    .toString();

            String errorMessage = violation.getMessage();

            fieldErrors.put(
                    fieldName,
                    errorMessage);
        }

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(
                        HttpStatus.BAD_REQUEST.value())
                .error(
                        HttpStatus.BAD_REQUEST
                                .getReasonPhrase())
                .message(
                        "One or more fields have constraint violations")
                .path(
                        request.getRequestURI())
                .fieldErrors(fieldErrors)
                .build();

        return ResponseEntity
                .badRequest()
                .body(body);
    }

    // =========================
    // 404 Not Found
    // =========================
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFoundException(
            NotFoundException ex,
            HttpServletRequest request) {

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(
                        HttpStatus.NOT_FOUND.value())
                .error(
                        HttpStatus.NOT_FOUND
                                .getReasonPhrase())
                .message(ex.getMessage())
                .path(
                        request.getRequestURI())
                .fieldErrors(null)
                .build();

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(body);
    }

    // =========================
    // 400 Bad Request
    // =========================
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequestException(
            BadRequestException ex,
            HttpServletRequest request) {

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(
                        HttpStatus.BAD_REQUEST.value())
                .error(
                        HttpStatus.BAD_REQUEST
                                .getReasonPhrase())
                .message(ex.getMessage())
                .path(
                        request.getRequestURI())
                .fieldErrors(null)
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(body);
    }

    // =========================
    // 409 Conflict
    // =========================
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiErrorResponse> handleConflictException(
            ConflictException ex,
            HttpServletRequest request) {

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(
                        HttpStatus.CONFLICT.value())
                .error(
                        HttpStatus.CONFLICT
                                .getReasonPhrase())
                .message(ex.getMessage())
                .path(
                        request.getRequestURI())
                .fieldErrors(null)
                .build();

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(body);
    }

    // =========================
    // 403 Forbidden
    // =========================
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiErrorResponse> handleForbidden(
            ForbiddenException ex,
            HttpServletRequest request) {

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(
                        HttpStatus.FORBIDDEN.value())
                .error(
                        HttpStatus.FORBIDDEN
                                .getReasonPhrase())
                .message(ex.getMessage())
                .path(
                        request.getRequestURI())
                .fieldErrors(null)
                .build();

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(body);
    }

    // =========================
    // Invalid Login Credentials
    // =========================
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request) {

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(
                        HttpStatus.UNAUTHORIZED.value())
                .error(
                        HttpStatus.UNAUTHORIZED
                                .getReasonPhrase())
                .message(
                        "Invalid username or password")
                .path(
                        request.getRequestURI())
                .fieldErrors(null)
                .build();

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(body);
    }

    // =========================
    // 500 Internal Server Error
    // =========================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request) {

        return buildError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Unexpected error",
                request);
    }

    // =========================
    // Shared Builder
    // =========================
    private ResponseEntity<ApiErrorResponse> buildError(
            HttpStatus status,
            String message,
            HttpServletRequest request) {

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error(
                        status.getReasonPhrase())
                .message(message)
                .path(
                        request.getRequestURI())
                .fieldErrors(null)
                .build();

        return ResponseEntity
                .status(status)
                .body(body);
    }
}