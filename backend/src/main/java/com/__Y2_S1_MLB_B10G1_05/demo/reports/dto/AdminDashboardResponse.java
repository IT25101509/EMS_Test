package com.__Y2_S1_MLB_B10G1_05.demo.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;
    private long employeesOnLeaveToday;
    private long presentToday;
    private long pendingLeaveRequests;
    private double averagePerformanceScore;
    private long totalDepartments;
}
