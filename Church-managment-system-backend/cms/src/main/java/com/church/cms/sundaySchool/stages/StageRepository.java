package com.church.cms.sundaySchool.stages;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StageRepository extends JpaRepository<Stage, Long>{
    
    boolean existsByNameIgnoreCase(String name);
}
