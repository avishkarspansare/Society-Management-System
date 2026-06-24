package com.society.management.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Request payload for creating/updating societies.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocietyRequest {

    @NotBlank(message = "Society name is required")
    @Size(max = 255, message = "Society name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 100)
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^[0-9]{5,10}$", message = "Pincode must be 5-10 digits")
    private String pincode;

    private String country;

    private String registrationNumber;

    @Pattern(regexp = "^[+]?[0-9\\s-]{10,15}$", message = "Contact number should be valid")
    private String contactNumber;

    @Email(message = "Email should be valid")
    private String email;

    private String website;

    private String logoUrl;

    private LocalDate establishedDate;

    @Min(value = 0, message = "Total units cannot be negative")
    private Integer totalUnits;
}
