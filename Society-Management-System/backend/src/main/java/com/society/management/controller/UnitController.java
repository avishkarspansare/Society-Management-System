package com.society.management.controller;

import com.society.management.dto.request.UnitRequest;
import com.society.management.dto.response.ApiResponse;
import com.society.management.dto.response.UnitDto;
import com.society.management.service.UnitService;
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
 * Unit management REST controller.
 */
@RestController
@RequestMapping("/api/v1/units")
@RequiredArgsConstructor
@Tag(name = "Units", description = "Unit management APIs")
public class UnitController {

    private final UnitService unitService;

    @GetMapping("/society/{societyId}")
    @Operation(summary = "Get units by society")
    public ResponseEntity<ApiResponse<Page<UnitDto>>> getUnitsBySociety(
            @PathVariable Long societyId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Units retrieved", unitService.getUnitsBySociety(societyId, pageable)));
    }

    @GetMapping("/building/{buildingId}")
    @Operation(summary = "Get units by building")
    public ResponseEntity<ApiResponse<List<UnitDto>>> getUnitsByBuilding(@PathVariable Long buildingId) {
        return ResponseEntity.ok(ApiResponse.success("Units retrieved", unitService.getUnitsByBuilding(buildingId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get unit by ID")
    public ResponseEntity<ApiResponse<UnitDto>> getUnitById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Unit retrieved", unitService.getUnitById(id)));
    }

    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Get units by owner")
    public ResponseEntity<ApiResponse<List<UnitDto>>> getUnitsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(ApiResponse.success("Owner units retrieved", unitService.getUnitsByOwner(ownerId)));
    }

    @GetMapping("/tenant/{tenantId}")
    @Operation(summary = "Get units by tenant")
    public ResponseEntity<ApiResponse<List<UnitDto>>> getUnitsByTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(ApiResponse.success("Tenant units retrieved", unitService.getUnitsByTenant(tenantId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN')")
    @Operation(summary = "Create unit")
    public ResponseEntity<ApiResponse<UnitDto>> createUnit(@Valid @RequestBody UnitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Unit created", unitService.createUnit(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN')")
    @Operation(summary = "Update unit")
    public ResponseEntity<ApiResponse<UnitDto>> updateUnit(
            @PathVariable Long id, @Valid @RequestBody UnitRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Unit updated", unitService.updateUnit(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN')")
    @Operation(summary = "Delete unit")
    public ResponseEntity<ApiResponse<Void>> deleteUnit(@PathVariable Long id) {
        unitService.deleteUnit(id);
        return ResponseEntity.ok(ApiResponse.success("Unit deleted"));
    }
}
