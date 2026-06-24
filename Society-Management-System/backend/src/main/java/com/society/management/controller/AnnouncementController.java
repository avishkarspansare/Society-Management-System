package com.society.management.controller;

import com.society.management.dto.request.AnnouncementRequest;
import com.society.management.dto.response.AnnouncementDto;
import com.society.management.dto.response.ApiResponse;
import com.society.management.service.AnnouncementService;
import com.society.management.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for announcement management.
 */
@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
@Tag(name = "Announcements", description = "Society announcement APIs")
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @Operation(summary = "Create a new announcement")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN', 'COMMITTEE_MEMBER')")
    public ResponseEntity<ApiResponse<AnnouncementDto>> create(
            @Valid @RequestBody AnnouncementRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Announcement created",
                        announcementService.create(userId, request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an announcement")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN', 'COMMITTEE_MEMBER')")
    public ResponseEntity<ApiResponse<AnnouncementDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody AnnouncementRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Announcement updated",
                announcementService.update(id, request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get announcement by ID")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AnnouncementDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(null, announcementService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all announcements for a society (paginated)")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<AnnouncementDto>>> getBySociety(
            @RequestParam Long societyId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(null,
                announcementService.getBySociety(societyId, pageable)));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active (non-expired) announcements for a society")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<AnnouncementDto>>> getActive(
            @RequestParam Long societyId) {
        return ResponseEntity.ok(ApiResponse.success(null,
                announcementService.getActiveAnnouncements(societyId)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete (soft) an announcement")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        announcementService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted"));
    }

    @PostMapping("/{id}/notify")
    @Operation(summary = "Send notification to all residents for this announcement")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> sendNotification(@PathVariable Long id) {
        announcementService.sendNotification(id);
        return ResponseEntity.ok(ApiResponse.success("Notification sent to all residents"));
    }
}
