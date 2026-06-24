package com.society.management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Response DTO for a community event.
 */
@Data
@Builder
public class EventDto {

    private Long id;
    private Long societyId;
    private String title;
    private String description;
    private Instant eventDate;
    private Instant endDate;
    private String venue;
    private Integer maxParticipants;
    private Boolean registrationRequired;
    private BigDecimal fee;
    private Boolean isActive;
    private List<String> imageUrls;
    private Long organiserId;
    private String organiserName;
    private long registeredCount;
    private Instant createdAt;
}
