package com.__Y2_S1_MLB_B10G1_05.demo.department.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.department.Department;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {
    private Long departmentId;
    private String departmentName;
    private String description;

    public static DepartmentResponse fromEntity(Department d) {
        return DepartmentResponse.builder()
                .departmentId(d.getDepartmentId())
                .departmentName(d.getDepartmentName())
                .description(d.getDescription())
                .build();
    }
}
