package com.society.management.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Records a resident's registration for a community event.
 */
@Entity
@Table(name = "event_registration",
       uniqueConstraints = {
           @UniqueConstraint(name = "uq_event_registration",
                             columnNames = {"event_id", "user_id"})
       },
       indexes = {
           @Index(name = "idx_event_reg_event_id", columnList = "event_id"),
           @Index(name = "idx_event_reg_user_id",  columnList = "user_id")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistration extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** REGISTERED | CANCELLED */
    @Column(length = 20, nullable = false)
    @Builder.Default
    private String status = "REGISTERED";

    @Column(name = "registered_at")
    @Builder.Default
    private Instant registeredAt = Instant.now();

    @Column(name = "cancelled_at")
    private Instant cancelledAt;
}
