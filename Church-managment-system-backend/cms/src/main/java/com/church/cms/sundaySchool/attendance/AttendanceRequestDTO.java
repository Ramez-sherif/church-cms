package com.church.cms.sundaySchool.attendance;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AttendanceRequestDTO {

   @NotNull(message = "Attendance status cannot be empty")
   private Boolean status; // true = حاضر / false = غائب

   @NotNull(message = "User id cannot be empty")
   private UUID userId;

   @NotNull(message = "Lesson id cannot be empty")
   private UUID lessonId;
   // private long classGradeId;
}
