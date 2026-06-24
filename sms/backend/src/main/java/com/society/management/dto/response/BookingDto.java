package com.society.management.dto.response;

import com.society.management.model.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Response DTO for an amenity booking.
 */
@Data
@Builder
public class BookingDto {

    private Long id;
    private Long amenityId;
    private String amenityName;
    private Long userId;
    private String userName;
    private LocalDate bookingDate;
    private Instant startTime;
    private Instant endTime;
    private BigDecimal amountCharged;
    private BookingStatus status;
    private String cancellationReason;
    private String notes;
    private Instant createdAt;
}
