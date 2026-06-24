package com.society.management.dto.response;

import com.society.management.model.enums.VisitorStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

/**
 * Response DTO for a visitor log entry.
 */
@Data
@Builder
public class VisitorDto {

    private Long id;
    private Long societyId;
    private Long unitId;
    private String unitNumber;
    private Long hostUserId;
    private String hostUserName;

    private String visitorName;
    private String visitorPhone;
    private String visitorEmail;
    private String purpose;
    private String vehicleNumber;
    private String idProofType;
    private String idProofNumber;

    private VisitorStatus status;
    private Instant checkInTime;
    private Instant checkOutTime;
    private Instant expectedArrivalTime;
    private String notes;

    private Long processedById;
    private String processedByName;

    private Instant createdAt;
}
