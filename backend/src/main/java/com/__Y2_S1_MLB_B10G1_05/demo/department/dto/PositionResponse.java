package com.__Y2_S1_MLB_B10G1_05.demo.department.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.department.Position;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionResponse {
    private Long positionId;
    private String title;
    private String description;
    private Long departmentId;
    private String departmentName;

    public static PositionResponse fromEntity(Position p) {
        return PositionResponse.builder()
                .positionId(p.getPositionId())
                .title(p.getTitle())
                .description(p.getDescription())
                .departmentId(p.getDepartment() != null ? p.getDepartment().getDepartmentId() : null)
                .departmentName(p.getDepartment() != null ? p.getDepartment().getDepartmentName() : null)
                .build();
    }
}
