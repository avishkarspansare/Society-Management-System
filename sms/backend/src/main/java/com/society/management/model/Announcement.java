package com.society.management.model;

import com.society.management.model.enums.AnnouncementType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

/**
 * Represents a society-wide announcement (notice board post).
 */
@Entity
@Table(name = "announcement",
       indexes = {
           @Index(name = "idx_announcement_society_id", columnList = "society_id"),
           @Index(name = "idx_announcement_type",       columnList = "announcement_type"),
           @Index(name = "idx_announcement_expiry",     columnList = "expiry_date")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Announcement extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "announcement_type", nullable = false, length = 50)
    private AnnouncementType announcementType;

    /** Priority: 1 = highest. */
    @Column(nullable = false)
    @Builder.Default
    private Integer priority = 3;

    /** When the announcement goes live (null = immediately). */
    @Column(name = "publish_date")
    private Instant publishDate;

    /** After this date the announcement is hidden. */
    @Column(name = "expiry_date")
    private Instant expiryDate;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    /** Optional attached document / image URLs. */
    @ElementCollection
    @CollectionTable(name = "announcement_attachments",
                     joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "url", length = 500)
    private List<String> attachmentUrls;

    /** Author (admin / committee member). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdByUser;
}
