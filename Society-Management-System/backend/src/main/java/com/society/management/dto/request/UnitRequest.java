package com.society.management.dto.request;

import com.society.management.model.enums.UnitType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request payload for creating/updating a unit.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitRequest {

    @NotNull(message = "Society ID is required")
    private Long societyId;

    @NotNull(message = "Building ID is required")
    private Long buildingId;

    @NotBlank(message = "Unit number is required")
    @Size(max = 50, message = "Unit number must not exceed 50 characters")
    private String unitNumber;

    private Integer floorNumber;

    private UnitType unitType;

    @Min(value = 0, message = "Area cannot be negative")
    private BigDecimal areaSqft;

    private Long ownerId;

    private Long tenantId;
}
