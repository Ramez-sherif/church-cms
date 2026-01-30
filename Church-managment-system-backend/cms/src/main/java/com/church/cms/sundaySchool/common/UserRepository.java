package com.church.cms.sundaySchool.common;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, UUID>{
    List<User> findByRole(UserRole role);
    boolean existsByPhoneNumber(String phoneNumber);
}
