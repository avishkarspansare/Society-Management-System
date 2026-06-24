package com.society.management.service;

import com.society.management.dto.request.UnitRequest;
import com.society.management.dto.response.UnitDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Unit management service interface.
 */
public interface UnitService {

    UnitDto createUnit(UnitRequest request);

    UnitDto getUnitById(Long id);

    Page<UnitDto> getUnitsBySociety(Long societyId, Pageable pageable);

    List<UnitDto> getUnitsByBuilding(Long buildingId);

    UnitDto updateUnit(Long id, UnitRequest request);

    void deleteUnit(Long id);

    List<UnitDto> getUnitsByOwner(Long ownerId);

    List<UnitDto> getUnitsByTenant(Long tenantId);
}
