package com.society.management.repository;

import com.society.management.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {

    List<Building> findBySocietyId(Long societyId);

    boolean existsBySocietyIdAndName(Long societyId, String name);
}
