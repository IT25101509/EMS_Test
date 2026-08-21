package com.__Y2_S1_MLB_B10G1_05.demo.department;

import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.BadRequestException;
import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.ResourceNotFoundException;
import com.__Y2_S1_MLB_B10G1_05.demo.department.dto.DepartmentRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.department.dto.DepartmentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll().stream()
                .map(DepartmentResponse::fromEntity)
                .toList();
    }

    public DepartmentResponse getById(Long id) {
        return DepartmentResponse.fromEntity(findEntity(id));
    }

    public Department findEntity(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    public DepartmentResponse create(DepartmentRequest request) {
        if (departmentRepository.existsByDepartmentName(request.getDepartmentName())) {
            throw new BadRequestException("Department already exists: " + request.getDepartmentName());
        }
        Department department = Department.builder()
                .departmentName(request.getDepartmentName())
                .description(request.getDescription())
                .build();
        return DepartmentResponse.fromEntity(departmentRepository.save(department));
    }

    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department department = findEntity(id);
        department.setDepartmentName(request.getDepartmentName());
        department.setDescription(request.getDescription());
        return DepartmentResponse.fromEntity(departmentRepository.save(department));
    }

    public void delete(Long id) {
        Department department = findEntity(id);
        departmentRepository.delete(department);
    }
}
