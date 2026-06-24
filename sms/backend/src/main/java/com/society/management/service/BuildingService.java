package com.society.management.service;

import com.society.management.dto.request.BuildingRequest;
import com.society.management.dto.response.BuildingDto;

import java.util.List;

/**
 * Building management service interface.
 */
public interface BuildingService {

    BuildingDto createBuilding(BuildingRequest request);

    BuildingDto getBuildingById(Long id);

    List<BuildingDto> getBuildingsBySociety(Long societyId);

    BuildingDto updateBuilding(Long id, BuildingRequest request);

    void deleteBuilding(Long id);
}
