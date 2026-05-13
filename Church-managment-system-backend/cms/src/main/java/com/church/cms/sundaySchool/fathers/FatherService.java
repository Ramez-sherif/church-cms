package com.church.cms.sundaySchool.fathers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.church.cms.shared.exceptions.NotFoundException;

import com.church.cms.sundaySchool.stages.Stage;
import com.church.cms.sundaySchool.stages.StageService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FatherService {

    private final FatherRepository fatherRepository;
    private final StageService stageService;

    public FatherResponseDTO addFather(FatherRequestDTO dto) {
        if (fatherRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists");
        }
        Stage stage = stageService.getById(dto.getStageId());
        Father father = FatherMapper.toEntity(dto, stage);
        Father saved = fatherRepository.save(father);
        return FatherMapper.toDTO(saved);
    }

    public FatherResponseDTO getById(UUID id) {
        return fatherRepository.findById(id)
                .map(FatherMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Father not found"));
    }

    public List<FatherResponseDTO> getAll() {
        return fatherRepository.findAll().stream().map(FatherMapper::toDTO).toList();
    }
}
