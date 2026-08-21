package com.__Y2_S1_MLB_B10G1_05.demo.attendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckInRequest {
    @NotNull
    private Long employeeId;
}
