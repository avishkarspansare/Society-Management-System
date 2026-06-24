package com.society.management.dto.response;

import com.society.management.model.enums.PaymentMode;
import com.society.management.model.enums.PaymentStatus;
import com.society.management.model.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Payment data transfer object for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {

    private Long id;
    private Long societyId;
    private Long userId;
    private String userName;
    private Long unitId;
    private String unitNumber;
    private PaymentType paymentType;
    private BigDecimal amount;
    private BigDecimal lateFee;
    private BigDecimal totalAmount;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private PaymentStatus paymentStatus;
    private PaymentMode paymentMode;
    private String transactionId;
    private String receiptNumber;
    private String notes;
    private Instant createdAt;
}
