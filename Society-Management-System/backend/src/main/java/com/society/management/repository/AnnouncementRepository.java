package com.society.management.repository;

import com.society.management.model.Announcement;
import com.society.management.model.enums.AnnouncementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    Page<Announcement> findBySocietyIdAndIsActiveTrue(Long societyId, Pageable pageable);

    Page<Announcement> findBySocietyId(Long societyId, Pageable pageable);

    List<Announcement> findBySocietyIdAndAnnouncementTypeAndIsActiveTrue(
            Long societyId, AnnouncementType type);

    /** Active, not expired announcements. */
    @Query("SELECT a FROM Announcement a WHERE a.society.id = :societyId " +
           "AND a.isActive = true " +
           "AND (a.expiryDate IS NULL OR a.expiryDate > :now) " +
           "ORDER BY a.priority ASC, a.createdAt DESC")
    List<Announcement> findActiveAnnouncements(@Param("societyId") Long societyId,
                                               @Param("now") Instant now);

    long countBySocietyIdAndIsActiveTrue(Long societyId);
}
