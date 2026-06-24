package com.society.management.dto.request;

import com.society.management.model.enums.AnnouncementType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.List;

/**
 * Request payload for creating or updating an announcement.
 */
@Data
public class AnnouncementRequest {

    @NotNull(message = "Society ID is required")
    private Long societyId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Announcement type is required")
    private AnnouncementType announcementType;

    /** 1 = highest priority, 5 = lowest. Defaults to 3. */
    private Integer priority = 3;

    /** ISO-8601. If null, announcement is immediately active. */
    private Instant publishDate;

    /** ISO-8601. If null, announcement never expires. */
    private Instant expiryDate;

    private List<String> attachmentUrls;
}
