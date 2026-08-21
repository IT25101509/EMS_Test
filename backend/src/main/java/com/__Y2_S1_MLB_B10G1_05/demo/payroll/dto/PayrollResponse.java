package com.__Y2_S1_MLB_B10G1_05.demo.payroll.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.payroll.PaymentStatus;
import com.__Y2_S1_MLB_B10G1_05.demo.payroll.Payroll;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollResponse {
    private Long payrollId;
    private Long employeeId;
    private String employeeName;
    private Double basicSalary;
    private Double allowances;
    private Double deductions;
    private Double netSalary;
    private LocalDate payPeriodStart;
    private LocalDate payPeriodEnd;
    private LocalDate paymentDate;
    private PaymentStatus paymentStatus;

    public static PayrollResponse fromEntity(Payroll p) {
        return PayrollResponse.builder()
                .payrollId(p.getPayrollId())
                .employeeId(p.getEmployee().getEmployeeId())
                .employeeName(p.getEmployee().getUser().getFirstName() + " " + p.getEmployee().getUser().getLastName())
                .basicSalary(p.getBasicSalary())
                .allowances(p.getAllowances())
                .deductions(p.getDeductions())
                .netSalary(p.getNetSalary())
                .payPeriodStart(p.getPayPeriodStart())
                .payPeriodEnd(p.getPayPeriodEnd())
                .paymentDate(p.getPaymentDate())
                .paymentStatus(p.getPaymentStatus())
                .build();
    }
}
