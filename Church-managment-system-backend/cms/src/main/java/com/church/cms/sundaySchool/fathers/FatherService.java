package com.church.cms.sundaySchool.fathers;

import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.church.cms.auth.Account;
import com.church.cms.auth.AccountRepository;
import com.church.cms.shared.exceptions.ConflictException;
import com.church.cms.shared.exceptions.NotFoundException;
import com.church.cms.sundaySchool.common.UserRole;
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

    private final AccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    // =========================
    // Add Father
    // =========================
    public FatherResponseDTO addFather(
            FatherRequestDTO dto) {

        // phone exists
        if (fatherRepository.existsByPhoneNumber(
                dto.getPhoneNumber())) {

            throw new ConflictException(
                    "Phone number already exists");
        }

        // username exists
        if (accountRepository.existsByUsername(
                dto.getUsername())) {

            throw new ConflictException(
                    "Username already exists");
        }

        // get stage
        Stage stage = stageService.getById(dto.getStageId());

        // create father
        Father father = FatherMapper.toEntity(dto, stage);

        // save father
        Father savedFather = fatherRepository.save(father);

        // =========================
        // Create Account
        // =========================

        Account account = new Account();

        account.setUsername(dto.getUsername());

        account.setPassword(
                passwordEncoder.encode(
                        dto.getPassword()));

        account.setRole(UserRole.FATHER);

        account.setEnabled(true);

        account.setUser(savedFather);

        accountRepository.save(account);

        return FatherMapper.toDTO(savedFather);
    }

    // =========================
    // Get Father By ID
    // =========================
    public FatherResponseDTO getById(UUID id) {

        return fatherRepository.findById(id)
                .map(FatherMapper::toDTO)
                .orElseThrow(() -> new NotFoundException(
                        "Father not found"));
    }

    // =========================
    // Get All Fathers
    // =========================
    public List<FatherResponseDTO> getAll() {

        return fatherRepository.findAll()
                .stream()
                .map(FatherMapper::toDTO)
                .toList();
    }
}