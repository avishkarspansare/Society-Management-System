package com.society.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Society data transfer object for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocietyDto {

    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private String registrationNumber;
    private String contactNumber;
    private String email;
    private String website;
    private String logoUrl;
    private LocalDate establishedDate;
    private Integer totalUnits;
    private Boolean isActive;
    private Instant createdAt;
}
