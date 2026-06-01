package com.church.cms.sundaySchool.teachers;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.church.cms.sundaySchool.common.ServiceRole;

public interface TeacherRepository extends JpaRepository<Teacher, UUID> {
    List<Teacher> findByClassGrade_Id(Long classGradeId);

    List<Teacher> findByStageGroup_Id(Long stageGroupId);

    List<Teacher> findByStage_Id(Long stageId);

    List<Teacher> findByStage_IdAndServiceRole(Long stageId, ServiceRole serviceRole);
}
