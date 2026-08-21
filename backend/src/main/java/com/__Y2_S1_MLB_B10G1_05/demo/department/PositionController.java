package com.__Y2_S1_MLB_B10G1_05.demo.department;

import com.__Y2_S1_MLB_B10G1_05.demo.department.dto.PositionRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.department.dto.PositionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    public ResponseEntity<List<PositionResponse>> getAll() {
        return ResponseEntity.ok(positionService.getAll());
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<PositionResponse>> getByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(positionService.getByDepartment(departmentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PositionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(positionService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PositionResponse> create(@Valid @RequestBody PositionRequest request) {
        return ResponseEntity.ok(positionService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PositionResponse> update(@PathVariable Long id, @Valid @RequestBody PositionRequest request) {
        return ResponseEntity.ok(positionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        positionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
