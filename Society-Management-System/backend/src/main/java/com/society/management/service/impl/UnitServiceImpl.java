package com.society.management.service.impl;

import com.society.management.dto.request.UnitRequest;
import com.society.management.dto.response.UnitDto;
import com.society.management.exception.ConflictException;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Building;
import com.society.management.model.Society;
import com.society.management.model.Unit;
import com.society.management.model.User;
import com.society.management.model.enums.UnitStatus;
import com.society.management.repository.BuildingRepository;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UnitRepository;
import com.society.management.repository.UserRepository;
import com.society.management.service.UnitService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of unit management operations.
 */
@Service
@RequiredArgsConstructor
public class UnitServiceImpl implements UnitService {

    private static final Logger logger = LoggerFactory.getLogger(UnitServiceImpl.class);

    private final UnitRepository unitRepository;
    private final SocietyRepository societyRepository;
    private final BuildingRepository buildingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public UnitDto createUnit(UnitRequest request) {
        Society society = societyRepository.findById(request.getSocietyId())
                .orElseThrow(() -> new ResourceNotFoundException("Society", "id", request.getSocietyId()));

        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new ResourceNotFoundException("Building", "id", request.getBuildingId()));

        if (unitRepository.existsByBuildingIdAndUnitNumber(request.getBuildingId(), request.getUnitNumber())) {
            throw new ConflictException("Unit '" + request.getUnitNumber() + "' already exists in building '" + building.getName() + "'");
        }

        Unit unit = Unit.builder()
                .society(society)
                .building(building)
                .unitNumber(request.getUnitNumber())
                .floorNumber(request.getFloorNumber())
                .unitType(request.getUnitType())
                .areaSqft(request.getAreaSqft())
                .status(UnitStatus.ACTIVE)
                .isOccupied(false)
                .build();

        // Assign owner
        if (request.getOwnerId() != null) {
            User owner = userRepository.findById(request.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getOwnerId()));
            unit.setOwner(owner);
        }

        // Assign tenant
        if (request.getTenantId() != null) {
            User tenant = userRepository.findById(request.getTenantId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getTenantId()));
            unit.setTenant(tenant);
            unit.setIsOccupied(true);
        }

        Unit saved = unitRepository.save(unit);
        logger.info("Unit created: {} in building {}", saved.getUnitNumber(), building.getName());
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UnitDto getUnitById(Long id) {
        return mapToDto(unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit", "id", id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UnitDto> getUnitsBySociety(Long societyId, Pageable pageable) {
        return unitRepository.findBySocietyId(societyId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnitDto> getUnitsByBuilding(Long buildingId) {
        return unitRepository.findByBuildingId(buildingId).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UnitDto updateUnit(Long id, UnitRequest request) {
        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit", "id", id));

        // Check unit number uniqueness if changed
        if (!unit.getUnitNumber().equals(request.getUnitNumber())
                && unitRepository.existsByBuildingIdAndUnitNumber(unit.getBuilding().getId(), request.getUnitNumber())) {
            throw new ConflictException("Unit number '" + request.getUnitNumber() + "' already exists in this building");
        }

        unit.setUnitNumber(request.getUnitNumber());
        if (request.getFloorNumber() != null) unit.setFloorNumber(request.getFloorNumber());
        if (request.getUnitType() != null) unit.setUnitType(request.getUnitType());
        if (request.getAreaSqft() != null) unit.setAreaSqft(request.getAreaSqft());

        // Update owner
        if (request.getOwnerId() != null) {
            User owner = userRepository.findById(request.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getOwnerId()));
            unit.setOwner(owner);
        }

        // Update tenant
        if (request.getTenantId() != null) {
            User tenant = userRepository.findById(request.getTenantId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getTenantId()));
            unit.setTenant(tenant);
            unit.setIsOccupied(true);
        }

        Unit updated = unitRepository.save(unit);
        logger.info("Unit updated: {} (ID: {})", updated.getUnitNumber(), updated.getId());
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteUnit(Long id) {
        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unit", "id", id));
        unitRepository.delete(unit);
        logger.info("Unit deleted: {} (ID: {})", unit.getUnitNumber(), id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnitDto> getUnitsByOwner(Long ownerId) {
        return unitRepository.findByOwnerId(ownerId).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnitDto> getUnitsByTenant(Long tenantId) {
        return unitRepository.findByTenantId(tenantId).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    private UnitDto mapToDto(Unit u) {
        return UnitDto.builder()
                .id(u.getId())
                .societyId(u.getSociety().getId())
                .societyName(u.getSociety().getName())
                .buildingId(u.getBuilding().getId())
                .buildingName(u.getBuilding().getName())
                .unitNumber(u.getUnitNumber())
                .floorNumber(u.getFloorNumber())
                .unitType(u.getUnitType())
                .areaSqft(u.getAreaSqft())
                .ownerId(u.getOwner() != null ? u.getOwner().getId() : null)
                .ownerName(u.getOwner() != null ? u.getOwner().getFullName() : null)
                .tenantId(u.getTenant() != null ? u.getTenant().getId() : null)
                .tenantName(u.getTenant() != null ? u.getTenant().getFullName() : null)
                .isOccupied(u.getIsOccupied())
                .status(u.getStatus())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
