package com.__Y2_S1_MLB_B10G1_05.demo.department.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PositionRequest {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private Long departmentId;
}
