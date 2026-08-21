package com.__Y2_S1_MLB_B10G1_05.demo.leave;

import com.__Y2_S1_MLB_B10G1_05.demo.leave.dto.LeaveActionRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.leave.dto.LeaveApplicationRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.leave.dto.LeaveResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<List<LeaveResponse>> getAll() {
        return ResponseEntity.ok(leaveService.getAll());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<List<LeaveResponse>> getPending() {
        return ResponseEntity.ok(leaveService.getPending());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveResponse>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getByEmployee(employeeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getById(id));
    }

    @PostMapping
    public ResponseEntity<LeaveResponse> apply(@Valid @RequestBody LeaveApplicationRequest request) {
        return ResponseEntity.ok(leaveService.apply(request));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<LeaveResponse> approve(@PathVariable Long id, @RequestBody(required = false) LeaveActionRequest request) {
        return ResponseEntity.ok(leaveService.approve(id, request != null ? request : new LeaveActionRequest()));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<LeaveResponse> reject(@PathVariable Long id, @RequestBody(required = false) LeaveActionRequest request) {
        return ResponseEntity.ok(leaveService.reject(id, request != null ? request : new LeaveActionRequest()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<LeaveResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.cancel(id));
    }
}
