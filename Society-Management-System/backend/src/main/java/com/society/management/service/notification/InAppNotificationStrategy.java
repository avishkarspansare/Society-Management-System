package com.society.management.service.notification;

import com.society.management.model.Notification;
import com.society.management.model.User;
import com.society.management.model.enums.NotificationType;
import com.society.management.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * In-app notification strategy: persists a {@link Notification} row that
 * the frontend can poll or display in real-time.
 */
@Component("inAppNotificationStrategy")
@RequiredArgsConstructor
public class InAppNotificationStrategy implements NotificationStrategy {

    private static final Logger logger = LoggerFactory.getLogger(InAppNotificationStrategy.class);

    private final NotificationRepository notificationRepository;

    @Override
    public void send(User user, String title, String message, NotificationType type) {
        try {
            Notification notification = Notification.builder()
                    .user(user)
                    .title(title)
                    .message(message)
                    .notificationType(type)
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
            logger.debug("In-app notification saved for user {} — {}", user.getId(), title);
        } catch (Exception ex) {
            logger.error("Failed to save in-app notification for user {}: {}",
                         user.getId(), ex.getMessage());
        }
    }
}
