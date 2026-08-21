package com.__Y2_S1_MLB_B10G1_05.demo.performance.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.performance.PerformanceEvaluation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceResponse {
    private Long performanceId;
    private Long employeeId;
    private String employeeName;
    private LocalDate evaluationDate;
    private Double performanceScore;
    private String comments;
    private String evaluatedByName;

    public static PerformanceResponse fromEntity(PerformanceEvaluation p) {
        return PerformanceResponse.builder()
                .performanceId(p.getPerformanceId())
                .employeeId(p.getEmployee().getEmployeeId())
                .employeeName(p.getEmployee().getUser().getFirstName() + " " + p.getEmployee().getUser().getLastName())
                .evaluationDate(p.getEvaluationDate())
                .performanceScore(p.getPerformanceScore())
                .comments(p.getComments())
                .evaluatedByName(p.getEvaluatedBy() != null ? (p.getEvaluatedBy().getFirstName() + " " + p.getEvaluatedBy().getLastName()) : null)
                .build();
    }
}
