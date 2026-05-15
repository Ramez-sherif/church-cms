package com.church.cms.sundaySchool.stageGroups;

import com.church.cms.sundaySchool.stages.Stage;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stage_groups", uniqueConstraints = @UniqueConstraint(columnNames = { "name", "stage_id" }))
@Getter
@Setter
@NoArgsConstructor
public class StageGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // "G1 (1st+2nd)" - "G2 (3rd+4th)" - "G3 (5th+6th)"

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id", nullable = false)
    private Stage stage;
}