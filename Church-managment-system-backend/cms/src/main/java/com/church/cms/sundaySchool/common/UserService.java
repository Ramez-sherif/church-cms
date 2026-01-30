package com.church.cms.sundaySchool.common;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserById(UUID id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new IllegalStateException("User not found"));
    }

    public List<User> getAllTeachers(){
        return userRepository.findByRole(UserRole.TEACHER);
    }

    public List<User> getAllStudents(){
        return userRepository.findByRole(UserRole.STUDENT);
    }

    
}
