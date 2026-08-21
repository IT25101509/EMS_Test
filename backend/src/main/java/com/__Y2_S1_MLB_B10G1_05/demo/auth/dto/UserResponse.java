package com.__Y2_S1_MLB_B10G1_05.demo.auth.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.auth.AccountStatus;
import com.__Y2_S1_MLB_B10G1_05.demo.auth.Role;
import com.__Y2_S1_MLB_B10G1_05.demo.auth.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String username;
    private Role role;
    private AccountStatus accountStatus;

    public static UserResponse fromEntity(User u) {
        return UserResponse.builder()
                .userId(u.getUserId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .username(u.getUsername())
                .role(u.getRole())
                .accountStatus(u.getAccountStatus())
                .build();
    }
}
