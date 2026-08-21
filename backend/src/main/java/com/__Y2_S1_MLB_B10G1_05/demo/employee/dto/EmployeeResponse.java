package com.__Y2_S1_MLB_B10G1_05.demo.employee.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.auth.Role;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.Employee;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.EmployeeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private Long employeeId;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String username;
    private Role role;
    private Long departmentId;
    private String departmentName;
    private Long positionId;
    private String positionTitle;
    private LocalDate joinedDate;
    private EmployeeStatus status;

    public static EmployeeResponse fromEntity(Employee e) {
        return EmployeeResponse.builder()
                .employeeId(e.getEmployeeId())
                .userId(e.getUser().getUserId())
                .firstName(e.getUser().getFirstName())
                .lastName(e.getUser().getLastName())
                .email(e.getUser().getEmail())
                .phoneNumber(e.getUser().getPhoneNumber())
                .username(e.getUser().getUsername())
                .role(e.getUser().getRole())
                .departmentId(e.getDepartment() != null ? e.getDepartment().getDepartmentId() : null)
                .departmentName(e.getDepartment() != null ? e.getDepartment().getDepartmentName() : null)
                .positionId(e.getPosition() != null ? e.getPosition().getPositionId() : null)
                .positionTitle(e.getPosition() != null ? e.getPosition().getTitle() : null)
                .joinedDate(e.getJoinedDate())
                .status(e.getStatus())
                .build();
    }
}
