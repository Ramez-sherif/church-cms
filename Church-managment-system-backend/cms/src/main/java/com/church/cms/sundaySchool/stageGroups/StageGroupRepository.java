package com.church.cms.sundaySchool.stageGroups;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StageGroupRepository extends JpaRepository<StageGroup, Long> {
  boolean existsByNameIgnoreCaseAndStage_Id(String name, Long stageId);
}
