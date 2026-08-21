package com.__Y2_S1_MLB_B10G1_05.demo.notification;

import com.__Y2_S1_MLB_B10G1_05.demo.auth.User;
import com.__Y2_S1_MLB_B10G1_05.demo.auth.UserRepository;
import com.__Y2_S1_MLB_B10G1_05.demo.common.exception.ResourceNotFoundException;
import com.__Y2_S1_MLB_B10G1_05.demo.notification.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> getByUser(Long userId) {
        return notificationRepository.findByUser_UserIdOrderByDateDesc(userId).stream()
                .map(NotificationResponse::fromEntity)
                .toList();
    }

    public List<NotificationResponse> getUnreadByUser(Long userId) {
        return notificationRepository.findByUser_UserIdAndIsReadFalseOrderByDateDesc(userId).stream()
                .map(NotificationResponse::fromEntity)
                .toList();
    }

    public NotificationResponse create(Long userId, String title, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .build();
        return NotificationResponse.fromEntity(notificationRepository.save(notification));
    }

    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notification.setRead(true);
        return NotificationResponse.fromEntity(notificationRepository.save(notification));
    }
}
