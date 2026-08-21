package com.__Y2_S1_MLB_B10G1_05.demo.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByUser_UserId(Long userId);

    @Query("""
        SELECT e FROM Employee e
        WHERE (:name IS NULL OR LOWER(e.user.firstName) LIKE LOWER(CONCAT('%', :name, '%'))
               OR LOWER(e.user.lastName) LIKE LOWER(CONCAT('%', :name, '%')))
        AND (:departmentId IS NULL OR e.department.departmentId = :departmentId)
        AND (:positionId IS NULL OR e.position.positionId = :positionId)
        """)
    List<Employee> search(@Param("name") String name,
                           @Param("departmentId") Long departmentId,
                           @Param("positionId") Long positionId);
}
