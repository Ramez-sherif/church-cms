package com.church.cms.config;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.church.cms.auth.Account;
import com.church.cms.auth.AccountRepository;

import com.church.cms.sundaySchool.common.ServiceRole;
import com.church.cms.sundaySchool.common.UserRole;

import com.church.cms.sundaySchool.teachers.Teacher;
import com.church.cms.sundaySchool.teachers.TeacherRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AdminSeeder {

    private final AccountRepository accountRepository;

    private final TeacherRepository teacherRepository;

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedAdmin() {

        return args -> {

            // =========================
            // Admin Exists
            // =========================
            if (accountRepository.existsByUsername(
                    "admin")) {

                return;
            }

            // =========================
            // Create Teacher
            // =========================
            Teacher adminTeacher = new Teacher();

            adminTeacher.setFirstName(
                    "General");

            adminTeacher.setLastName(
                    "Admin");

            adminTeacher.setPhoneNumber(
                    "01000000000");

            adminTeacher.setAddress(
                    "Church CMS");

            adminTeacher.setBirthDate(
                    LocalDate.of(
                            1990,
                            1,
                            1));

            // =========================
            // Service Role
            // =========================
            adminTeacher.setServiceRole(
                    ServiceRole.GENERAL_ADMIN);

            // =========================
            // User Type
            // =========================
            adminTeacher.setRole(
                    UserRole.TEACHER);

            // save teacher
            Teacher savedTeacher = teacherRepository.save(
                    adminTeacher);

            // =========================
            // Create Account
            // =========================
            Account admin = new Account();

            admin.setUsername(
                    "admin");

            admin.setPassword(
                    passwordEncoder.encode(
                            "123456"));

            admin.setRole(
                    UserRole.TEACHER);

            admin.setEnabled(true);

            // =========================
            // Link Teacher
            // =========================
            admin.setUser(
                    savedTeacher);

            // save account
            accountRepository.save(
                    admin);
        };
    }
}