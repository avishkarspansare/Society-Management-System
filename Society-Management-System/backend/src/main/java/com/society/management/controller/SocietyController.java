package com.society.management.controller;

import com.society.management.dto.request.SocietyRequest;
import com.society.management.dto.response.ApiResponse;
import com.society.management.dto.response.SocietyDto;
import com.society.management.service.SocietyService;
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

/**
 * Society management REST controller.
 */
@RestController
@RequestMapping("/api/v1/societies")
@RequiredArgsConstructor
@Tag(name = "Societies", description = "Society management APIs")
public class SocietyController {

    private final SocietyService societyService;

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get all societies", description = "Get all societies with pagination (Super Admin only)")
    public ResponseEntity<ApiResponse<Page<SocietyDto>>> getAllSocieties(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<SocietyDto> societies = societyService.getAllSocieties(pageable);
        return ResponseEntity.ok(ApiResponse.success("Societies retrieved", societies));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get society by ID", description = "Get society details by ID")
    public ResponseEntity<ApiResponse<SocietyDto>> getSocietyById(@PathVariable Long id) {
        SocietyDto society = societyService.getSocietyById(id);
        return ResponseEntity.ok(ApiResponse.success("Society retrieved", society));
    }

    @GetMapping("/{id}/dashboard")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get society dashboard stats")
    public ResponseEntity<ApiResponse<?>> getDashboard(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(null, societyService.getDashboardStats(id)));
    }

    @GetMapping("/{id}/stats")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN')")
    @Operation(summary = "Get society statistics")
    public ResponseEntity<ApiResponse<?>> getStats(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(null, societyService.getDashboardStats(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Create society", description = "Create a new society (Super Admin only)")
    public ResponseEntity<ApiResponse<SocietyDto>> createSociety(
            @Valid @RequestBody SocietyRequest request) {
        SocietyDto society = societyService.createSociety(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Society created", society));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN')")
    @Operation(summary = "Update society", description = "Update an existing society")
    public ResponseEntity<ApiResponse<SocietyDto>> updateSociety(
            @PathVariable Long id,
            @Valid @RequestBody SocietyRequest request) {
        SocietyDto society = societyService.updateSociety(id, request);
        return ResponseEntity.ok(ApiResponse.success("Society updated", society));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete society", description = "Delete a society (Super Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteSociety(@PathVariable Long id) {
        societyService.deleteSociety(id);
        return ResponseEntity.ok(ApiResponse.success("Society deleted"));
    }
}
