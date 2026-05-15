package com.church.cms.sundaySchool.fathers;

import com.church.cms.sundaySchool.common.User;
import com.church.cms.sundaySchool.common.UserRole;
import com.church.cms.sundaySchool.stages.Stage;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "fathers")
@Getter
@Setter
@NoArgsConstructor
public class Father extends User {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id", nullable = false)
    private Stage stage;

    @PrePersist
    public void prePersist() {
        this.setRole(UserRole.FATHER);
    }
}
