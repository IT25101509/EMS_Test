package com.__Y2_S1_MLB_B10G1_05.demo.payroll;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByEmployee_EmployeeId(Long employeeId);
}
