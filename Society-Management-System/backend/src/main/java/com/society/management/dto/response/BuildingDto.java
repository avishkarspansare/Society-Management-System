package com.society.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Building data transfer object for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildingDto {

    private Long id;
    private Long societyId;
    private String societyName;
    private String name;
    private Integer totalFloors;
    private Integer totalUnits;
    private String description;
    private Boolean isActive;
    private Instant createdAt;
}
