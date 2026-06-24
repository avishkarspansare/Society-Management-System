package com.society.management.controller;

import com.society.management.dto.request.VisitorRequest;
import com.society.management.dto.response.ApiResponse;
import com.society.management.dto.response.VisitorDto;
import com.society.management.service.VisitorService;
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
 * REST controller for visitor management.
 */
@RestController
@RequestMapping("/api/v1/visitors")
@RequiredArgsConstructor
@Tag(name = "Visitors", description = "Visitor log management APIs")
public class VisitorController {

    private final VisitorService visitorService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @Operation(summary = "Register a visitor")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<VisitorDto>> register(
            @RequestParam Long societyId,
            @Valid @RequestBody VisitorRequest request) {

        Long userId = securityUtils.getCurrentUserId();
        VisitorDto dto = visitorService.registerVisitor(societyId, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Visitor registered", dto));
    }

    @PostMapping("/{id}/check-in")
    @Operation(summary = "Check-in a visitor")
    @PreAuthorize("hasAnyRole('SECURITY', 'SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<VisitorDto>> checkIn(@PathVariable Long id) {
        Long securityUserId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Visitor checked in",
                visitorService.checkIn(id, securityUserId)));
    }

    @PostMapping("/{id}/check-out")
    @Operation(summary = "Check-out a visitor")
    @PreAuthorize("hasAnyRole('SECURITY', 'SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<VisitorDto>> checkOut(@PathVariable Long id) {
        Long securityUserId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Visitor checked out",
                visitorService.checkOut(id, securityUserId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get visitor by ID")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<VisitorDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(null, visitorService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all visitors for a society (paginated)")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN', 'SECURITY')")
    public ResponseEntity<ApiResponse<Page<VisitorDto>>> getBySociety(
            @RequestParam Long societyId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(null,
                visitorService.getBySociety(societyId, pageable)));
    }

    @GetMapping("/unit/{unitId}")
    @Operation(summary = "Get visitor history for a specific unit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<VisitorDto>>> getByUnit(
            @PathVariable Long unitId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(null,
                visitorService.getByUnit(unitId, pageable)));
    }

    @GetMapping("/today")
    @Operation(summary = "Get today's visitors for a society")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN', 'SECURITY')")
    public ResponseEntity<ApiResponse<List<VisitorDto>>> getToday(@RequestParam Long societyId) {
        return ResponseEntity.ok(ApiResponse.success(null,
                visitorService.getTodaysVisitors(societyId)));
    }

    @GetMapping("/active")
    @Operation(summary = "Get currently checked-in visitors")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN', 'SECURITY')")
    public ResponseEntity<ApiResponse<List<VisitorDto>>> getActive(@RequestParam Long societyId) {
        return ResponseEntity.ok(ApiResponse.success(null,
                visitorService.getActiveVisitors(societyId)));
    }
}
