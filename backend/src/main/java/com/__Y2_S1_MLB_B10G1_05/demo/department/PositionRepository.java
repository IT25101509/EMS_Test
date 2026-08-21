package com.__Y2_S1_MLB_B10G1_05.demo.department;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByDepartment_DepartmentId(Long departmentId);
}
