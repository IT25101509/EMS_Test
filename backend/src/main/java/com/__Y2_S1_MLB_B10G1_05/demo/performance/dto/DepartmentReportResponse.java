package com.__Y2_S1_MLB_B10G1_05.demo.performance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentReportResponse {
    private Long departmentId;
    private String departmentName;
    private long totalEmployees;
    private long activeEmployees;
    private long employeesOnLeave;
    private double averagePerformanceScore;
}
