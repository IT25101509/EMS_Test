package com.__Y2_S1_MLB_B10G1_05.demo.department;

import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.ResourceNotFoundException;
import com.__Y2_S1_MLB_B10G1_05.demo.department.dto.PositionRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.department.dto.PositionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PositionService {

    private final PositionRepository positionRepository;
    private final DepartmentService departmentService;

    public List<PositionResponse> getAll() {
        return positionRepository.findAll().stream()
                .map(PositionResponse::fromEntity)
                .toList();
    }

    public List<PositionResponse> getByDepartment(Long departmentId) {
        return positionRepository.findByDepartment_DepartmentId(departmentId).stream()
                .map(PositionResponse::fromEntity)
                .toList();
    }

    public PositionResponse getById(Long id) {
        return PositionResponse.fromEntity(findEntity(id));
    }

    public Position findEntity(Long id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + id));
    }

    public PositionResponse create(PositionRequest request) {
        Position position = Position.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .department(departmentService.findEntity(request.getDepartmentId()))
                .build();
        return PositionResponse.fromEntity(positionRepository.save(position));
    }

    public PositionResponse update(Long id, PositionRequest request) {
        Position position = findEntity(id);
        position.setTitle(request.getTitle());
        position.setDescription(request.getDescription());
        position.setDepartment(departmentService.findEntity(request.getDepartmentId()));
        return PositionResponse.fromEntity(positionRepository.save(position));
    }

    public void delete(Long id) {
        Position position = findEntity(id);
        positionRepository.delete(position);
    }
}
