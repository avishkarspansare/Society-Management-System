package com.society.management.dto.response;

import com.society.management.model.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

/**
 * Response DTO for an in-app notification.
 */
@Data
@Builder
public class NotificationDto {

    private Long id;
    private String title;
    private String message;
    private NotificationType notificationType;
    private Long referenceId;
    private String referenceType;
    private Boolean isRead;
    private Instant createdAt;
}
