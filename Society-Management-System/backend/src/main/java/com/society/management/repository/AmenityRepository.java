package com.society.management.repository;

import com.society.management.model.Amenity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    Page<Amenity> findBySocietyIdAndIsActiveTrue(Long societyId, Pageable pageable);

    List<Amenity> findBySocietyIdAndIsActiveTrue(Long societyId);

    Page<Amenity> findBySocietyId(Long societyId, Pageable pageable);

    boolean existsBySocietyIdAndNameIgnoreCase(Long societyId, String name);
}
