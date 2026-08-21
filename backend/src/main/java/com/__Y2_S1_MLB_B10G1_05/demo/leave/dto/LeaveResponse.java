package com.__Y2_S1_MLB_B10G1_05.demo.leave.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.leave.LeaveRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.leave.LeaveStatus;
import com.__Y2_S1_MLB_B10G1_05.demo.leave.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveResponse {
    private Long leaveId;
    private Long employeeId;
    private String employeeName;
    private LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private long numberOfDays;
    private String reason;
    private LeaveStatus status;
    private String approverComment;

    public static LeaveResponse fromEntity(LeaveRequest l) {
        return LeaveResponse.builder()
                .leaveId(l.getLeaveId())
                .employeeId(l.getEmployee().getEmployeeId())
                .employeeName(l.getEmployee().getUser().getFirstName() + " " + l.getEmployee().getUser().getLastName())
                .leaveType(l.getLeaveType())
                .startDate(l.getStartDate())
                .endDate(l.getEndDate())
                .numberOfDays(java.time.temporal.ChronoUnit.DAYS.between(l.getStartDate(), l.getEndDate()) + 1)
                .reason(l.getReason())
                .status(l.getStatus())
                .approverComment(l.getApproverComment())
                .build();
    }
}
