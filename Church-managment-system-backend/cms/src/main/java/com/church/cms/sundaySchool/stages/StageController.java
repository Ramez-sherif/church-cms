package com.church.cms.sundaySchool.stages;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/stages")
public class StageController {

    private final StageService stageService;

    @PostMapping
    public ResponseEntity<StageResponseDTO> createStage(@Valid @RequestBody StageRequestDTO dto) {

        StageResponseDTO response = this.stageService.createStage(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StageResponseDTO>> getAllStages() {

        return ResponseEntity.ok(this.stageService.getALL());
    }

}
