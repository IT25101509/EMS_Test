package com.__Y2_S1_MLB_B10G1_05.demo.attendance.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.attendance.Attendance;
import com.__Y2_S1_MLB_B10G1_05.demo.attendance.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private Long attendanceId;
    private Long employeeId;
    private String employeeName;
    private LocalDate date;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private Double workHours;
    private AttendanceStatus status;

    public static AttendanceResponse fromEntity(Attendance a) {
        return AttendanceResponse.builder()
                .attendanceId(a.getAttendanceId())
                .employeeId(a.getEmployee().getEmployeeId())
                .employeeName(a.getEmployee().getUser().getFirstName() + " " + a.getEmployee().getUser().getLastName())
                .date(a.getDate())
                .checkIn(a.getCheckIn())
                .checkOut(a.getCheckOut())
                .workHours(a.getWorkHours())
                .status(a.getStatus())
                .build();
    }
}
