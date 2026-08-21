package com.__Y2_S1_MLB_B10G1_05.demo.performance.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PerformanceRequest {
    @NotNull
    private Long employeeId;

    @NotNull
    private LocalDate evaluationDate;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double performanceScore;

    private String comments;

    @NotNull
    private Long evaluatedByUserId;
}
