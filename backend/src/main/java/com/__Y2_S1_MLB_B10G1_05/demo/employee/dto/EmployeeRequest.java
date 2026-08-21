package com.__Y2_S1_MLB_B10G1_05.demo.employee.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.auth.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeRequest {
    // --- Account details (used when creating a brand-new user+employee together) ---
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    private String phoneNumber;

    @NotBlank
    private String username;

    private String password; // required only on create

    @NotNull
    private Role role;

    // --- Employee-specific details ---
    @NotNull
    private Long departmentId;

    @NotNull
    private Long positionId;

    @NotNull
    private LocalDate joinedDate;
}
