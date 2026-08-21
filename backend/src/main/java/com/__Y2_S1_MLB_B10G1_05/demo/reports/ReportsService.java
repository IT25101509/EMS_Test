package com.__Y2_S1_MLB_B10G1_05.demo.reports;

import com.__Y2_S1_MLB_B10G1_05.demo.attendance.AttendanceRepository;
import com.__Y2_S1_MLB_B10G1_05.demo.department.DepartmentRepository;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.EmployeeRepository;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.EmployeeStatus;
import com.__Y2_S1_MLB_B10G1_05.demo.leave.LeaveRequestRepository;
import com.__Y2_S1_MLB_B10G1_05.demo.leave.LeaveStatus;
import com.__Y2_S1_MLB_B10G1_05.demo.performance.PerformanceRepository;
import com.__Y2_S1_MLB_B10G1_05.demo.reports.dto.AdminDashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportsService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PerformanceRepository performanceRepository;
    private final DepartmentRepository departmentRepository;

    public AdminDashboardResponse getDashboardSummary() {
        long total = employeeRepository.count();
        long active = employeeRepository.findAll().stream()
                .filter(e -> e.getStatus() == EmployeeStatus.ACTIVE).count();
        long inactive = total - active;

        LocalDate today = LocalDate.now();
        long presentToday = attendanceRepository.findByDate(today).size();

        long pendingLeaves = leaveRequestRepository.findByStatus(LeaveStatus.PENDING).size();
        long onLeaveToday = leaveRequestRepository.findByStatus(LeaveStatus.APPROVED).stream()
                .filter(l -> !today.isBefore(l.getStartDate()) && !today.isAfter(l.getEndDate()))
                .count();

        double avgPerformance = performanceRepository.findAll().stream()
                .mapToDouble(p -> p.getPerformanceScore() != null ? p.getPerformanceScore() : 0.0)
                .average()
                .orElse(0.0);

        return AdminDashboardResponse.builder()
                .totalEmployees(total)
                .activeEmployees(active)
                .inactiveEmployees(inactive)
                .employeesOnLeaveToday(onLeaveToday)
                .presentToday(presentToday)
                .pendingLeaveRequests(pendingLeaves)
                .averagePerformanceScore(Math.round(avgPerformance * 100.0) / 100.0)
                .totalDepartments(departmentRepository.count())
                .build();
    }
}
