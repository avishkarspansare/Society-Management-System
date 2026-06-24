package com.society.management.dto.response;

import com.society.management.model.enums.AnnouncementType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

/**
 * Response DTO for an announcement.
 */
@Data
@Builder
public class AnnouncementDto {

    private Long id;
    private Long societyId;
    private String title;
    private String content;
    private AnnouncementType announcementType;
    private Integer priority;
    private Instant publishDate;
    private Instant expiryDate;
    private Boolean isActive;
    private List<String> attachmentUrls;
    private Long createdByUserId;
    private String createdByUserName;
    private Instant createdAt;
    private Instant updatedAt;
}
