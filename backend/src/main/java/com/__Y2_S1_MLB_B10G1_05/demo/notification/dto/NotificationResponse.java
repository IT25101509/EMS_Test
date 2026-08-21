package com.__Y2_S1_MLB_B10G1_05.demo.notification.dto;

import com.__Y2_S1_MLB_B10G1_05.demo.notification.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long notificationId;
    private Long userId;
    private String title;
    private String message;
    private LocalDateTime date;
    private boolean isRead;

    public static NotificationResponse fromEntity(Notification n) {
        return NotificationResponse.builder()
                .notificationId(n.getNotificationId())
                .userId(n.getUser().getUserId())
                .title(n.getTitle())
                .message(n.getMessage())
                .date(n.getDate())
                .isRead(n.isRead())
                .build();
    }
}
