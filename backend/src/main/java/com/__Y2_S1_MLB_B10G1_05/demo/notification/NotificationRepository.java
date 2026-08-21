package com.__Y2_S1_MLB_B10G1_05.demo.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser_UserIdOrderByDateDesc(Long userId);
    List<Notification> findByUser_UserIdAndIsReadFalseOrderByDateDesc(Long userId);
}
