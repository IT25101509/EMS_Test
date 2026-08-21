package com.__Y2_S1_MLB_B10G1_05.demo.performance;

import com.__Y2_S1_MLB_B10G1_05.demo.auth.User;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "performance_evaluations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long performanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private LocalDate evaluationDate;

    private Double performanceScore;

    @Column(length = 2000)
    private String comments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluated_by")
    private User evaluatedBy;
}
