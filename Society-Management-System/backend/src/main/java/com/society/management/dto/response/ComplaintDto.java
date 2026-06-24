package com.society.management.dto.response;

import com.society.management.model.enums.ComplaintPriority;
import com.society.management.model.enums.ComplaintStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * Complaint data transfer object for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDto {

    private Long id;
    private Long societyId;
    private Long userId;
    private String userName;
    private String category;
    private ComplaintPriority priority;
    private String title;
    private String description;
    private ComplaintStatus status;
    private Long assignedToId;
    private String assignedToName;
    private Long resolvedById;
    private String resolvedByName;
    private Instant resolvedAt;
    private String closureReason;
    private List<String> attachmentUrls;
    private Instant createdAt;
    private Instant updatedAt;
}
