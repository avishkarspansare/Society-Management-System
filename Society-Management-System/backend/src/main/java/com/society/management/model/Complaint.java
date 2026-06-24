package com.society.management.model;

import com.society.management.model.enums.ComplaintPriority;
import com.society.management.model.enums.ComplaintStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a complaint raised by a resident.
 */
@Entity
@Table(name = "complaint",
       indexes = {
           @Index(name = "idx_complaint_society_id", columnList = "society_id"),
           @Index(name = "idx_complaint_user_id", columnList = "user_id"),
           @Index(name = "idx_complaint_status", columnList = "status"),
           @Index(name = "idx_complaint_priority", columnList = "priority")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Complaint extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    @Builder.Default
    private ComplaintPriority priority = ComplaintPriority.MEDIUM;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    @Builder.Default
    private ComplaintStatus status = ComplaintStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "closure_reason", columnDefinition = "TEXT")
    private String closureReason;

    @ElementCollection
    @CollectionTable(name = "complaint_attachments", joinColumns = @JoinColumn(name = "complaint_id"))
    @Column(name = "attachment_url")
    @Builder.Default
    private List<String> attachmentUrls = new ArrayList<>();
}
