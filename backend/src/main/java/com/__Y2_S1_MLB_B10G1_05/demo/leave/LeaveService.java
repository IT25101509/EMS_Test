package com.__Y2_S1_MLB_B10G1_05.demo.leave;

import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.BadRequestException;
import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.ResourceNotFoundException;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.Employee;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.EmployeeService;
import com.__Y2_S1_MLB_B10G1_05.demo.leave.dto.LeaveActionRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.leave.dto.LeaveApplicationRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.leave.dto.LeaveResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeService employeeService;

    public List<LeaveResponse> getAll() {
        return leaveRequestRepository.findAll().stream()
                .map(LeaveResponse::fromEntity)
                .toList();
    }

    public List<LeaveResponse> getPending() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING).stream()
                .map(LeaveResponse::fromEntity)
                .toList();
    }

    public List<LeaveResponse> getByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployee_EmployeeId(employeeId).stream()
                .map(LeaveResponse::fromEntity)
                .toList();
    }

    public LeaveResponse getById(Long id) {
        return LeaveResponse.fromEntity(findEntity(id));
    }

    private LeaveRequest findEntity(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
    }

    public LeaveResponse apply(LeaveApplicationRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }
        Employee employee = employeeService.findEntity(request.getEmployeeId());

        LeaveRequest leave = LeaveRequest.builder()
                .employee(employee)
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        return LeaveResponse.fromEntity(leaveRequestRepository.save(leave));
    }

    public LeaveResponse approve(Long id, LeaveActionRequest request) {
        LeaveRequest leave = findEntity(id);
        assertPending(leave);
        leave.setStatus(LeaveStatus.APPROVED);
        leave.setApproverComment(request.getComment());
        return LeaveResponse.fromEntity(leaveRequestRepository.save(leave));
    }

    public LeaveResponse reject(Long id, LeaveActionRequest request) {
        LeaveRequest leave = findEntity(id);
        assertPending(leave);
        leave.setStatus(LeaveStatus.REJECTED);
        leave.setApproverComment(request.getComment());
        return LeaveResponse.fromEntity(leaveRequestRepository.save(leave));
    }

    public LeaveResponse cancel(Long id) {
        LeaveRequest leave = findEntity(id);
        assertPending(leave);
        leave.setStatus(LeaveStatus.CANCELLED);
        return LeaveResponse.fromEntity(leaveRequestRepository.save(leave));
    }

    private void assertPending(LeaveRequest leave) {
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only pending leave requests can be modified");
        }
    }
}
