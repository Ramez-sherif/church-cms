package com.church.cms.sundaySchool.stageGroups;

import java.util.List;

import org.springframework.stereotype.Service;

import com.church.cms.shared.exceptions.ConflictException;
import com.church.cms.shared.exceptions.NotFoundException;
import com.church.cms.sundaySchool.stages.Stage;
import com.church.cms.sundaySchool.stages.StageService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StageGroupService {
    private final StageGroupRepository stageGroupRepository;
    private final StageService stageService;

    public StageGroupResponseDTO create(StageGroupRequestDTO dto) {
        Stage stage = stageService.getById(dto.getStageId());

        if (stageGroupRepository.existsByNameIgnoreCaseAndStage_Id(dto.getName().trim(), stage.getId())) {
            throw new ConflictException("Stage group already exists in this stage");
        }

        StageGroup saved = stageGroupRepository.save(StageGroupMapper.toEntity(dto, stage));
        return StageGroupMapper.toDTO(saved);
    }

    public List<StageGroupResponseDTO> getAll() {
        return stageGroupRepository.findAll().stream().map(StageGroupMapper::toDTO).toList();
    }

    public StageGroup getById(Long id) {
        return stageGroupRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Stage group not found"));
    }
}
