package com.society.management.service.impl;

import com.society.management.dto.request.BuildingRequest;
import com.society.management.dto.response.BuildingDto;
import com.society.management.exception.ConflictException;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Building;
import com.society.management.model.Society;
import com.society.management.repository.BuildingRepository;
import com.society.management.repository.SocietyRepository;
import com.society.management.service.BuildingService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of building management operations.
 */
@Service
@RequiredArgsConstructor
public class BuildingServiceImpl implements BuildingService {

    private static final Logger logger = LoggerFactory.getLogger(BuildingServiceImpl.class);

    private final BuildingRepository buildingRepository;
    private final SocietyRepository societyRepository;

    @Override
    @Transactional
    public BuildingDto createBuilding(BuildingRequest request) {
        Society society = societyRepository.findById(request.getSocietyId())
                .orElseThrow(() -> new ResourceNotFoundException("Society", "id", request.getSocietyId()));

        if (buildingRepository.existsBySocietyIdAndName(request.getSocietyId(), request.getName())) {
            throw new ConflictException("Building '" + request.getName() + "' already exists in this society");
        }

        Building building = Building.builder()
                .society(society)
                .name(request.getName())
                .totalFloors(request.getTotalFloors())
                .totalUnits(request.getTotalUnits() != null ? request.getTotalUnits() : 0)
                .description(request.getDescription())
                .isActive(true)
                .build();

        Building saved = buildingRepository.save(building);
        logger.info("Building created: {} in society {}", saved.getName(), society.getName());
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public BuildingDto getBuildingById(Long id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Building", "id", id));
        return mapToDto(building);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BuildingDto> getBuildingsBySociety(Long societyId) {
        return buildingRepository.findBySocietyId(societyId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BuildingDto updateBuilding(Long id, BuildingRequest request) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Building", "id", id));

        // Check name uniqueness if changed
        if (!building.getName().equals(request.getName())
                && buildingRepository.existsBySocietyIdAndName(building.getSociety().getId(), request.getName())) {
            throw new ConflictException("Building name '" + request.getName() + "' already exists in this society");
        }

        building.setName(request.getName());
        if (request.getTotalFloors() != null) building.setTotalFloors(request.getTotalFloors());
        if (request.getTotalUnits() != null) building.setTotalUnits(request.getTotalUnits());
        if (request.getDescription() != null) building.setDescription(request.getDescription());

        Building updated = buildingRepository.save(building);
        logger.info("Building updated: {} (ID: {})", updated.getName(), updated.getId());
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteBuilding(Long id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Building", "id", id));
        buildingRepository.delete(building);
        logger.info("Building deleted: {} (ID: {})", building.getName(), id);
    }

    private BuildingDto mapToDto(Building b) {
        return BuildingDto.builder()
                .id(b.getId())
                .societyId(b.getSociety().getId())
                .societyName(b.getSociety().getName())
                .name(b.getName())
                .totalFloors(b.getTotalFloors())
                .totalUnits(b.getTotalUnits())
                .description(b.getDescription())
                .isActive(b.getIsActive())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
