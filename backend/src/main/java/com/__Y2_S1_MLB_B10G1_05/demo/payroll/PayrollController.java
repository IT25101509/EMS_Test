package com.__Y2_S1_MLB_B10G1_05.demo.payroll;

import com.__Y2_S1_MLB_B10G1_05.demo.payroll.dto.PayrollRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.payroll.dto.PayrollResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<List<PayrollResponse>> getAll() {
        return ResponseEntity.ok(payrollService.getAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayrollResponse>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payrollService.getByEmployee(employeeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PayrollResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PayrollResponse> create(@Valid @RequestBody PayrollRequest request) {
        return ResponseEntity.ok(payrollService.create(request));
    }

    @PutMapping("/{id}/mark-paid")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PayrollResponse> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.markAsPaid(id));
    }
}
