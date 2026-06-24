package com.society.management.dto.request;

import com.society.management.model.enums.PaymentMode;
import com.society.management.model.enums.PaymentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request payload for creating a payment record.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotNull(message = "Society ID is required")
    private Long societyId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Unit ID is required")
    private Long unitId;

    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private LocalDate paidDate;

    private PaymentMode paymentMode;

    private String transactionId;

    private String notes;

    @DecimalMin(value = "0.0", message = "Late fee cannot be negative")
    private BigDecimal lateFee;
}
