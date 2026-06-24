package com.society.management.repository;

import com.society.management.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findBySocietyIdAndIsActiveTrue(Long societyId, Pageable pageable);

    Page<Event> findBySocietyId(Long societyId, Pageable pageable);

    /** Upcoming events (event date is in the future). */
    @Query("SELECT e FROM Event e WHERE e.society.id = :societyId " +
           "AND e.isActive = true AND e.eventDate > :now ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents(@Param("societyId") Long societyId,
                                   @Param("now") Instant now);

    long countBySocietyIdAndIsActiveTrue(Long societyId);
}
