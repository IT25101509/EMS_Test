package com.__Y2_S1_MLB_B10G1_05.demo.auth.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.auth.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String username;
    private String fullName;
    private Role role;
}
