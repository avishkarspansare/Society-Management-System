package com.society.management.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Request payload for creating or updating a society event.
 */
@Data
public class EventRequest {

    @NotNull(message = "Society ID is required")
    private Long societyId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    private Instant eventDate;

    private Instant endDate;

    private String venue;

    private Integer maxParticipants;

    private Boolean registrationRequired = false;

    private BigDecimal fee = BigDecimal.ZERO;

    private List<String> imageUrls;
}
