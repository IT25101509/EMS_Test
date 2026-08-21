package com.__Y2_S1_MLB_B10G1_05.demo.performance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceRepository extends JpaRepository<PerformanceEvaluation, Long> {
    List<PerformanceEvaluation> findByEmployee_EmployeeId(Long employeeId);
    List<PerformanceEvaluation> findByEmployee_Department_DepartmentId(Long departmentId);
}
