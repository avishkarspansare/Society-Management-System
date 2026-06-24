package com.society.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request payload for creating or updating an amenity.
 */
@Data
public class AmenityRequest {

    @NotNull(message = "Society ID is required")
    private Long societyId;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    private BigDecimal hourlyRate = BigDecimal.ZERO;

    /** Comma-separated days, e.g. "MON,TUE,WED,THU,FRI,SAT,SUN" */
    private String availableDays;

    /** HH:mm format */
    private String openTime;

    /** HH:mm format */
    private String closeTime;

    private List<String> imageUrls;
}
