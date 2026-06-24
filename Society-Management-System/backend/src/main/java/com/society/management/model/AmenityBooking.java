package com.society.management.model;

import com.society.management.model.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * A reservation made by a resident for a society amenity.
 */
@Entity
@Table(name = "amenity_booking",
       indexes = {
           @Index(name = "idx_booking_amenity_id", columnList = "amenity_id"),
           @Index(name = "idx_booking_user_id",    columnList = "user_id"),
           @Index(name = "idx_booking_date",        columnList = "booking_date"),
           @Index(name = "idx_booking_status",      columnList = "status")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmenityBooking extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amenity_id", nullable = false)
    private Amenity amenity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    /** Start time as ISO-8601 instant. */
    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    /** End time as ISO-8601 instant. */
    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "amount_charged", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal amountCharged = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
