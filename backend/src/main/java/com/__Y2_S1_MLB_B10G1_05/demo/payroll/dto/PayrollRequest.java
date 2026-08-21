package com.__Y2_S1_MLB_B10G1_05.demo.payroll.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PayrollRequest {
    @NotNull
    private Long employeeId;

    @NotNull
    @PositiveOrZero
    private Double basicSalary;

    @PositiveOrZero
    private Double allowances = 0.0;

    @PositiveOrZero
    private Double deductions = 0.0;

    @NotNull
    private LocalDate payPeriodStart;

    @NotNull
    private LocalDate payPeriodEnd;
}
