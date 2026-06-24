package com.society.management.controller;

import com.society.management.dto.request.BuildingRequest;
import com.society.management.dto.response.ApiResponse;
import com.society.management.dto.response.BuildingDto;
import com.society.management.service.BuildingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Building management REST controller.
 */
@RestController
@RequestMapping("/api/v1/buildings")
@RequiredArgsConstructor
@Tag(name = "Buildings", description = "Building management APIs")
public class BuildingController {

    private final BuildingService buildingService;

    @GetMapping("/society/{societyId}")
    @Operation(summary = "Get buildings by society", description = "Get all buildings in a society")
    public ResponseEntity<ApiResponse<List<BuildingDto>>> getBuildingsBySociety(@PathVariable Long societyId) {
        List<BuildingDto> buildings = buildingService.getBuildingsBySociety(societyId);
        return ResponseEntity.ok(ApiResponse.success("Buildings retrieved", buildings));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get building by ID")
    public ResponseEntity<ApiResponse<BuildingDto>> getBuildingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Building retrieved", buildingService.getBuildingById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN')")
    @Operation(summary = "Create building")
    public ResponseEntity<ApiResponse<BuildingDto>> createBuilding(@Valid @RequestBody BuildingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Building created", buildingService.createBuilding(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN')")
    @Operation(summary = "Update building")
    public ResponseEntity<ApiResponse<BuildingDto>> updateBuilding(
            @PathVariable Long id, @Valid @RequestBody BuildingRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Building updated", buildingService.updateBuilding(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN')")
    @Operation(summary = "Delete building")
    public ResponseEntity<ApiResponse<Void>> deleteBuilding(@PathVariable Long id) {
        buildingService.deleteBuilding(id);
        return ResponseEntity.ok(ApiResponse.success("Building deleted"));
    }
}
