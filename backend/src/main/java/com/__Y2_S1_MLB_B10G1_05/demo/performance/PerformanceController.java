package com.__Y2_S1_MLB_B10G1_05.demo.performance;

import com.__Y2_S1_MLB_B10G1_05.demo.performance.dto.PerformanceRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.performance.dto.PerformanceResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<List<PerformanceResponse>> getAll() {
        return ResponseEntity.ok(performanceService.getAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PerformanceResponse>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(performanceService.getByEmployee(employeeId));
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<List<PerformanceResponse>> getByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(performanceService.getByDepartment(departmentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerformanceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(performanceService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<PerformanceResponse> create(@Valid @RequestBody PerformanceRequest request) {
        return ResponseEntity.ok(performanceService.create(request));
    }
}
