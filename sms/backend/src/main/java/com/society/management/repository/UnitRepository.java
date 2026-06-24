package com.society.management.repository;

import com.society.management.model.Unit;
import com.society.management.model.enums.UnitStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {

    Page<Unit> findBySocietyId(Long societyId, Pageable pageable);

    List<Unit> findByBuildingId(Long buildingId);

    List<Unit> findBySocietyIdAndStatus(Long societyId, UnitStatus status);

    boolean existsByBuildingIdAndUnitNumber(Long buildingId, String unitNumber);

    List<Unit> findByOwnerId(Long ownerId);

    List<Unit> findByTenantId(Long tenantId);

    long countBySocietyId(Long societyId);

    long countBySocietyIdAndIsOccupiedTrue(Long societyId);
}
