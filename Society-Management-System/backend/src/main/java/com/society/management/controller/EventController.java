package com.society.management.controller;

import com.society.management.dto.request.EventRequest;
import com.society.management.dto.response.ApiResponse;
import com.society.management.dto.response.EventDto;
import com.society.management.dto.response.UserDto;
import com.society.management.service.EventService;
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
 * REST controller for community event management.
 */
@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Community event management APIs")
public class EventController {

    private final EventService eventService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @Operation(summary = "Create a new event")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN', 'COMMITTEE_MEMBER')")
    public ResponseEntity<ApiResponse<EventDto>> create(@Valid @RequestBody EventRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created", eventService.create(userId, request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an event")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN', 'COMMITTEE_MEMBER')")
    public ResponseEntity<ApiResponse<EventDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Event updated", eventService.update(id, request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EventDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(null, eventService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all events for a society (paginated)")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<EventDto>>> getBySociety(
            @RequestParam Long societyId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(null,
                eventService.getBySociety(societyId, pageable)));
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming events for a society")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<EventDto>>> getUpcoming(@RequestParam Long societyId) {
        return ResponseEntity.ok(ApiResponse.success(null,
                eventService.getUpcomingEvents(societyId)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete (soft) an event")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted"));
    }

    @PostMapping("/{id}/register")
    @Operation(summary = "Register current user for an event")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> register(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        eventService.registerUser(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Registered for event successfully"));
    }

    @PostMapping("/{id}/cancel-registration")
    @Operation(summary = "Cancel current user's registration for an event")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> cancelRegistration(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        eventService.cancelRegistration(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Registration cancelled"));
    }

    @GetMapping("/{id}/participants")
    @Operation(summary = "Get registered participants for an event")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN', 'COMMITTEE_MEMBER')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getParticipants(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(null, eventService.getParticipants(id)));
    }
}
