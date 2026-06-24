package com.society.management.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request payload for booking an amenity slot.
 */
@Data
public class BookingRequest {

    @NotNull(message = "Amenity ID is required")
    private Long amenityId;

    /** ISO-8601 date string (yyyy-MM-dd). */
    @NotNull(message = "Booking date is required")
    private String bookingDate;

    /** ISO-8601 instant for start of slot. */
    @NotNull(message = "Start time is required")
    private String startTime;

    /** ISO-8601 instant for end of slot. */
    @NotNull(message = "End time is required")
    private String endTime;

    private String notes;
}
