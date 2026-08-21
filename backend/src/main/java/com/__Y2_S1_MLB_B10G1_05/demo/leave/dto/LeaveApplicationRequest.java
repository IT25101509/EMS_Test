package com.__Y2_S1_MLB_B10G1_05.demo.leave.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.leave.LeaveType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveApplicationRequest {
    @NotNull
    private Long employeeId;

    @NotNull
    private LeaveType leaveType;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private String reason;
}
