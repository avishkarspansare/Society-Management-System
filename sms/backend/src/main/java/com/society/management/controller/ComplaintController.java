package com.society.management.controller;

import com.society.management.dto.request.ComplaintRequest;
import com.society.management.dto.response.ApiResponse;
import com.society.management.dto.response.ComplaintDto;
import com.society.management.model.enums.ComplaintStatus;
import com.society.management.service.ComplaintService;
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

import java.util.Map;

/**
 * Complaint management REST controller.
 */
@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaints", description = "Complaint management APIs")
public class ComplaintController {

    private final ComplaintService complaintService;

    @GetMapping("/society/{societyId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get complaints by society")
    public ResponseEntity<ApiResponse<Page<ComplaintDto>>> getComplaintsBySociety(
            @PathVariable Long societyId,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Complaints retrieved",
                complaintService.getComplaintsBySociety(societyId, pageable)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get complaints by user")
    public ResponseEntity<ApiResponse<Page<ComplaintDto>>> getComplaintsByUser(
            @PathVariable Long userId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("User complaints retrieved",
                complaintService.getComplaintsByUser(userId, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get complaint by ID")
    public ResponseEntity<ApiResponse<ComplaintDto>> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Complaint retrieved", complaintService.getComplaintById(id)));
    }

    @PostMapping
    @Operation(summary = "Raise complaint", description = "Raise a new complaint")
    public ResponseEntity<ApiResponse<ComplaintDto>> createComplaint(@Valid @RequestBody ComplaintRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint raised", complaintService.createComplaint(request)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER', 'STAFF')")
    @Operation(summary = "Update complaint status")
    public ResponseEntity<ApiResponse<ComplaintDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        ComplaintStatus status = ComplaintStatus.valueOf(body.get("status"));
        String reason = body.get("closureReason");
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                complaintService.updateStatus(id, status, reason)));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Assign complaint to staff")
    public ResponseEntity<ApiResponse<ComplaintDto>> assignComplaint(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ApiResponse.success("Complaint assigned",
                complaintService.assignComplaint(id, body.get("staffId"))));
    }

    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER', 'STAFF')")
    @Operation(summary = "Resolve complaint")
    public ResponseEntity<ApiResponse<ComplaintDto>> resolveComplaint(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Long resolvedById = Long.parseLong(body.get("resolvedById").toString());
        String closureReason = (String) body.get("closureReason");
        return ResponseEntity.ok(ApiResponse.success("Complaint resolved",
                complaintService.resolveComplaint(id, resolvedById, closureReason)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN')")
    @Operation(summary = "Delete complaint")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok(ApiResponse.success("Complaint deleted"));
    }
}
