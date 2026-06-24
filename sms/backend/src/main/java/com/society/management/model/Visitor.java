package com.society.management.model;

import com.society.management.model.enums.VisitorStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Represents a visitor log entry for a society gate.
 */
@Entity
@Table(name = "visitor",
       indexes = {
           @Index(name = "idx_visitor_society_id",  columnList = "society_id"),
           @Index(name = "idx_visitor_unit_id",     columnList = "unit_id"),
           @Index(name = "idx_visitor_status",      columnList = "status"),
           @Index(name = "idx_visitor_check_in",    columnList = "check_in_time")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Visitor extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    /** The unit (flat) being visited. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    /** The resident who is receiving the visitor. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_user_id")
    private User hostUser;

    @Column(name = "visitor_name", nullable = false, length = 150)
    private String visitorName;

    @Column(name = "visitor_phone", length = 20)
    private String visitorPhone;

    @Column(name = "visitor_email", length = 255)
    private String visitorEmail;

    @Column(name = "purpose", length = 255)
    private String purpose;

    @Column(name = "vehicle_number", length = 30)
    private String vehicleNumber;

    @Column(name = "id_proof_type", length = 50)
    private String idProofType;

    @Column(name = "id_proof_number", length = 100)
    private String idProofNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VisitorStatus status = VisitorStatus.EXPECTED;

    @Column(name = "check_in_time")
    private Instant checkInTime;

    @Column(name = "check_out_time")
    private Instant checkOutTime;

    @Column(name = "expected_arrival_time")
    private Instant expectedArrivalTime;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /** Security guard who processed the entry. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    private User processedBy;
}
