package com.example.tpo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentStatsDto {
    private long totalStudents;
    private long leetcodeProfiles;
    private long missingProfiles;
    private long activeStudents;
    
    // Additional breakdown metrics for Analytics
    private Map<String, Long> yearDistribution;
    private Map<String, Long> departmentDistribution;
    private Map<String, Long> batchDistribution;
    private Map<String, Long> placementStatusDistribution;
    private Map<String, Double> completionRates;
}
