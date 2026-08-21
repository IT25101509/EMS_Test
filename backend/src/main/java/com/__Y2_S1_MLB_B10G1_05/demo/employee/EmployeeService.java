package com.__Y2_S1_MLB_B10G1_05.demo.employee;

import com.__Y2_S1_MLB_B10G1_05.demo.auth.AccountStatus;
import com.__Y2_S1_MLB_B10G1_05.demo.auth.User;
import com.__Y2_S1_MLB_B10G1_05.demo.auth.UserRepository;
import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.BadRequestException;
import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.ResourceNotFoundException;
import com.__Y2_S1_MLB_B10G1_05.demo.department.Department;
import com.__Y2_S1_MLB_B10G1_05.demo.department.DepartmentService;
import com.__Y2_S1_MLB_B10G1_05.demo.department.Position;
import com.__Y2_S1_MLB_B10G1_05.demo.department.PositionService;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.dto.EmployeeRequest;
import com.__Y2_S1_MLB_B10G1_05.demo.employee.dto.EmployeeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final DepartmentService departmentService;
    private final PositionService positionService;
    private final PasswordEncoder passwordEncoder;

    public List<EmployeeResponse> getAll() {
        return employeeRepository.findAll().stream()
                .map(EmployeeResponse::fromEntity)
                .toList();
    }

    public List<EmployeeResponse> search(String name, Long departmentId, Long positionId) {
        return employeeRepository.search(
                        (name == null || name.isBlank()) ? null : name,
                        departmentId,
                        positionId)
                .stream()
                .map(EmployeeResponse::fromEntity)
                .toList();
    }

    public EmployeeResponse getById(Long id) {
        return EmployeeResponse.fromEntity(findEntity(id));
    }

    public EmployeeResponse getByUserId(Long userId) {
        Employee employee = employeeRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for user id: " + userId));
        return EmployeeResponse.fromEntity(employee);
    }

    public Employee findEntity(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    public EmployeeResponse create(EmployeeRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required when creating a new employee account");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .accountStatus(AccountStatus.ACTIVE)
                .build();
        User savedUser = userRepository.save(user);

        Department department = departmentService.findEntity(request.getDepartmentId());
        Position position = positionService.findEntity(request.getPositionId());

        Employee employee = Employee.builder()
                .user(savedUser)
                .department(department)
                .position(position)
                .joinedDate(request.getJoinedDate())
                .status(EmployeeStatus.ACTIVE)
                .build();

        return EmployeeResponse.fromEntity(employeeRepository.save(employee));
    }

    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = findEntity(id);
        User user = employee.getUser();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);

        employee.setDepartment(departmentService.findEntity(request.getDepartmentId()));
        employee.setPosition(positionService.findEntity(request.getPositionId()));
        employee.setJoinedDate(request.getJoinedDate());

        return EmployeeResponse.fromEntity(employeeRepository.save(employee));
    }

    public void deactivate(Long id) {
        Employee employee = findEntity(id);
        employee.setStatus(EmployeeStatus.INACTIVE);
        employee.getUser().setAccountStatus(AccountStatus.INACTIVE);
        userRepository.save(employee.getUser());
        employeeRepository.save(employee);
    }

    public void delete(Long id) {
        Employee employee = findEntity(id);
        employeeRepository.delete(employee);
        userRepository.delete(employee.getUser());
    }
}
