package com.church.cms.sundaySchool.fathers;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FatherRepository extends JpaRepository<Father, UUID> {

    boolean existsByPhoneNumber(String phoneNumber);

}
