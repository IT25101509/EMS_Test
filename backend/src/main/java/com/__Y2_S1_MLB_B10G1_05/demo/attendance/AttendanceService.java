package com.__Y2_S1_MLB_B10G1_05.demo.attendance;

import com.__Y2_S1_MLB_B10G1_05.demo.attendance.dto.AttendanceResponse;
import com.__Y2_S1_MLB_B10G1_05.demo.attendance.dto.CheckInRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.BadRequestException;
import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.ResourceNotFoundException;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.Employee;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeService employeeService;

    public List<AttendanceResponse> getAll() {
        return attendanceRepository.findAll().stream()
                .map(AttendanceResponse::fromEntity)
                .toList();
    }

    public List<AttendanceResponse> getByEmployee(Long employeeId) {
        return attendanceRepository.findByEmployee_EmployeeId(employeeId).stream()
                .map(AttendanceResponse::fromEntity)
                .toList();
    }

    public List<AttendanceResponse> getByDate(LocalDate date) {
        return attendanceRepository.findByDate(date).stream()
                .map(AttendanceResponse::fromEntity)
                .toList();
    }

    public AttendanceResponse getById(Long id) {
        return AttendanceResponse.fromEntity(findEntity(id));
    }

    private Attendance findEntity(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));
    }

    public AttendanceResponse checkIn(CheckInRequest request) {
        Employee employee = employeeService.findEntity(request.getEmployeeId());
        LocalDate today = LocalDate.now();

        if (attendanceRepository.findByEmployee_EmployeeIdAndDate(employee.getEmployeeId(), today).isPresent()) {
            throw new BadRequestException("Employee has already checked in today");
        }

        LocalTime now = LocalTime.now();
        AttendanceStatus status = now.isAfter(LocalTime.of(9, 15)) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(today)
                .checkIn(now)
                .status(status)
                .build();

        return AttendanceResponse.fromEntity(attendanceRepository.save(attendance));
    }

    public AttendanceResponse checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployee_EmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new BadRequestException("Employee has not checked in today"));

        if (attendance.getCheckOut() != null) {
            throw new BadRequestException("Employee has already checked out today");
        }

        LocalTime now = LocalTime.now();
        attendance.setCheckOut(now);
        double hours = Duration.between(attendance.getCheckIn(), now).toMinutes() / 60.0;
        attendance.setWorkHours(Math.round(hours * 100.0) / 100.0);

        return AttendanceResponse.fromEntity(attendanceRepository.save(attendance));
    }
}
