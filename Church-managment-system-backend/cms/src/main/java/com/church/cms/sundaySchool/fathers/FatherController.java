package com.church.cms.sundaySchool.fathers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fathers")
public class FatherController {

    private final FatherService fatherService;

    @PostMapping
    public ResponseEntity<FatherResponseDTO> create(@Valid @RequestBody FatherRequestDTO dto) {
        return new ResponseEntity<>(fatherService.addFather(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FatherResponseDTO>> getAll() {
        return ResponseEntity.ok(fatherService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FatherResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(fatherService.getById(id));
    }
}
