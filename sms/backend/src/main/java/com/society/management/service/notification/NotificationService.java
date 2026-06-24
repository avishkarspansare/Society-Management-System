package com.society.management.service.notification;

import com.society.management.dto.response.NotificationDto;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Notification;
import com.society.management.model.User;
import com.society.management.model.enums.NotificationType;
import com.society.management.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Orchestrator for all notification channels.
 * By default sends both in-app and email notifications.
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final InAppNotificationStrategy inAppStrategy;
    private final EmailNotificationStrategy emailStrategy;
    private final NotificationRepository notificationRepository;

    /**
     * Sends an in-app notification only.
     */
    public void sendInApp(User user, String title, String message, NotificationType type) {
        inAppStrategy.send(user, title, message, type);
    }

    /**
     * Sends both in-app and email notifications.
     */
    public void sendAll(User user, String title, String message, NotificationType type) {
        inAppStrategy.send(user, title, message, type);
        emailStrategy.send(user, title, message, type);
    }

    /**
     * Sends notifications to a list of users (in-app only for bulk ops).
     */
    public void sendBulkInApp(List<User> users, String title, String message, NotificationType type) {
        users.forEach(user -> inAppStrategy.send(user, title, message, type));
        logger.info("Bulk in-app notification sent to {} users — {}", users.size(), title);
    }

    // ─── Query operations ────────────────────────────────────────────────────

    public Page<NotificationDto> getMyNotifications(Long userId, Pageable pageable) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toDto);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        int updated = notificationRepository.markOneRead(notificationId, userId);
        if (updated == 0) {
            throw new ResourceNotFoundException("Notification not found or not owned by user");
        }
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllReadForUser(userId);
    }

    // ─── Mapper ──────────────────────────────────────────────────────────────

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .notificationType(n.getNotificationType())
                .referenceId(n.getReferenceId())
                .referenceType(n.getReferenceType())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
