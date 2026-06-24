package com.society.management.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Represents a community event organised by the society.
 */
@Entity
@Table(name = "event",
       indexes = {
           @Index(name = "idx_event_society_id",  columnList = "society_id"),
           @Index(name = "idx_event_date",         columnList = "event_date"),
           @Index(name = "idx_event_is_active",    columnList = "is_active")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_date", nullable = false)
    private Instant eventDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "venue", length = 255)
    private String venue;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "registration_required")
    @Builder.Default
    private Boolean registrationRequired = false;

    /** 0 means free event. */
    @Column(name = "fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal fee = BigDecimal.ZERO;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @ElementCollection
    @CollectionTable(name = "event_images",
                     joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "url", length = 500)
    private List<String> imageUrls;

    /** Organiser / admin who created the event. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organiser_id")
    private User organiser;
}
