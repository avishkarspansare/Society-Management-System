package com.society.management.controller;

import com.society.management.dto.request.AmenityRequest;
import com.society.management.dto.request.BookingRequest;
import com.society.management.dto.response.AmenityDto;
import com.society.management.dto.response.ApiResponse;
import com.society.management.dto.response.BookingDto;
import com.society.management.service.AmenityService;
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
import java.util.Map;

/**
 * REST controller for amenity and booking management.
 */
@RestController
@RequestMapping("/api/v1/amenities")
@RequiredArgsConstructor
@Tag(name = "Amenities", description = "Amenity and booking management APIs")
public class AmenityController {

    private final AmenityService amenityService;
    private final SecurityUtils securityUtils;

    // ─── Amenity CRUD ─────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a new amenity")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<AmenityDto>> create(@Valid @RequestBody AmenityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Amenity created", amenityService.createAmenity(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an amenity")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<AmenityDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody AmenityRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Amenity updated",
                amenityService.updateAmenity(id, request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get amenity by ID")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AmenityDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(null, amenityService.getAmenityById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all amenities for a society (paginated)")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<AmenityDto>>> getBySociety(
            @RequestParam Long societyId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(null,
                amenityService.getAmenitiesBySociety(societyId, pageable)));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active amenities for a society")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<AmenityDto>>> getActive(@RequestParam Long societyId) {
        return ResponseEntity.ok(ApiResponse.success(null,
                amenityService.getActiveAmenitiesBySociety(societyId)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete (soft) an amenity")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        amenityService.deleteAmenity(id);
        return ResponseEntity.ok(ApiResponse.success("Amenity deleted"));
    }

    // ─── Booking operations ───────────────────────────────────────────────────

    @PostMapping("/bookings")
    @Operation(summary = "Book an amenity slot")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @Valid @RequestBody BookingRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking confirmed",
                        amenityService.createBooking(userId, request)));
    }

    @PostMapping("/bookings/{bookingId}/cancel")
    @Operation(summary = "Cancel a booking")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) Map<String, String> body) {
        Long userId = securityUtils.getCurrentUserId();
        String reason = body != null ? body.getOrDefault("reason", null) : null;
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled",
                amenityService.cancelBooking(bookingId, userId, reason)));
    }

    @PatchMapping("/bookings/{bookingId}/confirm")
    @Operation(summary = "Confirm a pending booking (Admin)")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> confirmBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed",
                amenityService.confirmBooking(bookingId)));
    }

    @GetMapping("/bookings/my")
    @Operation(summary = "Get my bookings (paginated)")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<BookingDto>>> getMyBookings(
            @PageableDefault(size = 20) Pageable pageable) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(null,
                amenityService.getMyBookings(userId, pageable)));
    }

    @GetMapping("/{id}/bookings")
    @Operation(summary = "Get all bookings for a specific amenity (Admin)")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Page<BookingDto>>> getByAmenity(
            @PathVariable Long id,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(null,
                amenityService.getBookingsByAmenity(id, pageable)));
    }
}
