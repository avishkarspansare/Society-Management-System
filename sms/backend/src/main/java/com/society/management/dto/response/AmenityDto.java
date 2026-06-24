package com.society.management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * Full amenity details DTO.
 */
@Data
@Builder
public class AmenityDto {

    private Long id;
    private Long societyId;
    private String name;
    private String description;
    private Integer capacity;
    private BigDecimal hourlyRate;
    private String availableDays;
    private String openTime;
    private String closeTime;
    private Boolean isActive;
    private List<String> imageUrls;
    private Long createdByUserId;
}
