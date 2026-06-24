package com.society.management.model;

import com.society.management.model.enums.PaymentMode;
import com.society.management.model.enums.PaymentStatus;
import com.society.management.model.enums.PaymentType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Represents a payment record (maintenance, parking, event fees, etc.).
 */
@Entity
@Table(name = "payment",
       indexes = {
           @Index(name = "idx_payment_society_id", columnList = "society_id"),
           @Index(name = "idx_payment_user_id", columnList = "user_id"),
           @Index(name = "idx_payment_unit_id", columnList = "unit_id"),
           @Index(name = "idx_payment_status", columnList = "payment_status"),
           @Index(name = "idx_payment_due_date", columnList = "due_date"),
           @Index(name = "idx_payment_type_status", columnList = "payment_type, payment_status")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false, length = 50)
    private PaymentType paymentType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 50)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode", length = 50)
    private PaymentMode paymentMode;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "receipt_number", unique = true, length = 100)
    private String receiptNumber;

    @Column(name = "late_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal lateFee = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String notes;

    /**
     * Calculates the total amount including late fee.
     */
    @Transient
    public BigDecimal getTotalAmount() {
        return amount.add(lateFee != null ? lateFee : BigDecimal.ZERO);
    }
}
