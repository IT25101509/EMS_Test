package com.__Y2_S1_MLB_B10G1_05.demo.department.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentRequest {
    @NotBlank
    private String departmentName;
    private String description;
}
