package com.society.management.repository;

import com.society.management.model.Visitor;
import com.society.management.model.enums.VisitorStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    Page<Visitor> findBySocietyId(Long societyId, Pageable pageable);

    Page<Visitor> findByUnitId(Long unitId, Pageable pageable);

    List<Visitor> findBySocietyIdAndStatus(Long societyId, VisitorStatus status);

    /** Visitors who checked in today (UTC day boundaries). */
    @Query("SELECT v FROM Visitor v WHERE v.society.id = :societyId " +
           "AND v.checkInTime >= :startOfDay AND v.checkInTime < :endOfDay")
    List<Visitor> findTodaysVisitors(@Param("societyId") Long societyId,
                                     @Param("startOfDay") Instant startOfDay,
                                     @Param("endOfDay") Instant endOfDay);

    /** Currently inside — checked in but not yet checked out. */
    List<Visitor> findBySocietyIdAndStatusAndCheckOutTimeIsNull(
            Long societyId, VisitorStatus status);

    long countBySocietyIdAndStatus(Long societyId, VisitorStatus status);
}
