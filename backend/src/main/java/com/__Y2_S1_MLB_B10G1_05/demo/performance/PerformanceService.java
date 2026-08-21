package com.__Y2_S1_MLB_B10G1_05.demo.performance;

import com.__Y2_S1_MLB_B10G1_05.demo.auth.User;
import com.__Y2_S1_MLB_B10G1_05.demo.auth.UserRepository;
import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.ResourceNotFoundException;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.Employee;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.EmployeeService;
import com.__Y2_S1_MLB_B10G1_05.demo.performance.dto.PerformanceRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.performance.dto.PerformanceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceService {

    private final PerformanceRepository performanceRepository;
    private final EmployeeService employeeService;
    private final UserRepository userRepository;

    public List<PerformanceResponse> getAll() {
        return performanceRepository.findAll().stream()
                .map(PerformanceResponse::fromEntity)
                .toList();
    }

    public List<PerformanceResponse> getByEmployee(Long employeeId) {
        return performanceRepository.findByEmployee_EmployeeId(employeeId).stream()
                .map(PerformanceResponse::fromEntity)
                .toList();
    }

    public List<PerformanceResponse> getByDepartment(Long departmentId) {
        return performanceRepository.findByEmployee_Department_DepartmentId(departmentId).stream()
                .map(PerformanceResponse::fromEntity)
                .toList();
    }

    public PerformanceResponse getById(Long id) {
        return PerformanceResponse.fromEntity(findEntity(id));
    }

    private PerformanceEvaluation findEntity(Long id) {
        return performanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance evaluation not found with id: " + id));
    }

    public PerformanceResponse create(PerformanceRequest request) {
        Employee employee = employeeService.findEntity(request.getEmployeeId());
        User evaluator = userRepository.findById(request.getEvaluatedByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Evaluator user not found with id: " + request.getEvaluatedByUserId()));

        PerformanceEvaluation evaluation = PerformanceEvaluation.builder()
                .employee(employee)
                .evaluationDate(request.getEvaluationDate())
                .performanceScore(request.getPerformanceScore())
                .comments(request.getComments())
                .evaluatedBy(evaluator)
                .build();

        return PerformanceResponse.fromEntity(performanceRepository.save(evaluation));
    }
}
