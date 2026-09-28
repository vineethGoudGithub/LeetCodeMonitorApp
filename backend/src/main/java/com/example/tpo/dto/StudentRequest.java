package com.example.tpo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    private String email;

    private String rollNumber;
    private String year;
    private String department;
    private String section;
    private String batch;
    private String leetcodeUrl;
    private String githubUrl;
    private String linkedinUrl;
    private Integer codingScore;
    private Integer problemsSolved;
    private String placementStatus;
}
