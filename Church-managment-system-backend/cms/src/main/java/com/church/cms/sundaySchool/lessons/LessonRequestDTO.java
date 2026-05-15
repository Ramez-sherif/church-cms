package com.church.cms.sundaySchool.lessons;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LessonRequestDTO {
    @NotBlank(message = "Title cannot be empty")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @NotNull(message = "Date cannot be empty")
    private LocalDate date; // date of lesson

    // @NotNull(message = "Teacher id cannot be empty")
    // private UUID teacherId;

    @Positive(message = "Class grade id must be positive")
    private long classGradeId;

    @NotNull(message = "PDF file cannot be empty")
    private MultipartFile pdf;

}
