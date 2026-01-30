package com.church.cms.sundaySchool.common;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor //  فاضي constructor محتاج  Hibernate   
@Inheritance(strategy=InheritanceType.JOINED)
@Entity
@Table(name="users")
public abstract  class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;


    
    @Column(nullable=false)
    private String firstName;
    
    @Column(nullable=false)
    private String lastName;

    @Column(name = "birth_date")
    private LocalDate birthDate;  //YYYY-MM-DD 

    private String phoneNumber;
    private String address;
    
}
