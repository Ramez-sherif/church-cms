package com.church.cms.sundaySchool.stageGroups;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/stage-groups")
public class StageGroupController {

    private final StageGroupService stageGroupService;

    @PostMapping
    public ResponseEntity<StageGroupResponseDTO> create(@Valid @RequestBody StageGroupRequestDTO dto) {
        return new ResponseEntity<>(stageGroupService.create(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StageGroupResponseDTO>> getAll() {
        return ResponseEntity.ok(stageGroupService.getAll());
    }
}
