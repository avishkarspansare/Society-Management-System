package com.society.management.model;

import com.society.management.model.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;

/**
 * In-app notification stored per user.
 */
@Entity
@Table(name = "notification",
       indexes = {
           @Index(name = "idx_notification_user_id",  columnList = "user_id"),
           @Index(name = "idx_notification_is_read",  columnList = "is_read"),
           @Index(name = "idx_notification_type",     columnList = "notification_type")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false, length = 50)
    private NotificationType notificationType;

    /** Optional deep-link reference (e.g. payment ID, complaint ID). */
    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;
}
