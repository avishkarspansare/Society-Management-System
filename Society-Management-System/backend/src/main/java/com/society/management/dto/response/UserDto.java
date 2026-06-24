package com.society.management.dto.response;

import com.society.management.model.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * User data transfer object for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserType userType;
    private Long societyId;
    private String societyName;
    private Long unitId;
    private String unitNumber;
    private String profileImageUrl;
    private String address;
    private Boolean isVerified;
    private Boolean isActive;
    private Instant lastLogin;
    private Instant createdAt;

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
