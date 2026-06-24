package com.society.management.dto.response;

import com.society.management.model.enums.UnitStatus;
import com.society.management.model.enums.UnitType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Unit data transfer object for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitDto {

    private Long id;
    private Long societyId;
    private String societyName;
    private Long buildingId;
    private String buildingName;
    private String unitNumber;
    private Integer floorNumber;
    private UnitType unitType;
    private BigDecimal areaSqft;
    private Long ownerId;
    private String ownerName;
    private Long tenantId;
    private String tenantName;
    private Boolean isOccupied;
    private UnitStatus status;
    private Instant createdAt;
}
