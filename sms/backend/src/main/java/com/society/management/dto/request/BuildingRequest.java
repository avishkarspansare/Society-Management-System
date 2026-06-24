package com.society.management.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for creating/updating a building.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildingRequest {

    @NotNull(message = "Society ID is required")
    private Long societyId;

    @NotBlank(message = "Building name is required")
    @Size(max = 255, message = "Building name must not exceed 255 characters")
    private String name;

    @Min(value = 1, message = "Total floors must be at least 1")
    private Integer totalFloors;

    @Min(value = 0, message = "Total units cannot be negative")
    private Integer totalUnits;

    private String description;
}
