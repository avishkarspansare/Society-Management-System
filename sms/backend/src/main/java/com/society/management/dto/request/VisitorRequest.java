package com.society.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request payload for registering or pre-registering a visitor.
 */
@Data
public class VisitorRequest {

    @NotNull(message = "Unit ID is required")
    private Long unitId;

    @NotBlank(message = "Visitor name is required")
    private String visitorName;

    private String visitorPhone;
    private String visitorEmail;

    @NotBlank(message = "Purpose of visit is required")
    private String purpose;

    private String vehicleNumber;
    private String idProofType;
    private String idProofNumber;

    /** ISO-8601 string — optional expected arrival time. */
    private String expectedArrivalTime;

    private String notes;
}
