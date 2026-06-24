package com.society.management.repository;

import com.society.management.model.AmenityBooking;
import com.society.management.model.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AmenityBookingRepository extends JpaRepository<AmenityBooking, Long> {

    Page<AmenityBooking> findByUserId(Long userId, Pageable pageable);

    Page<AmenityBooking> findByAmenityId(Long amenityId, Pageable pageable);

    List<AmenityBooking> findByAmenityIdAndBookingDateAndStatus(
            Long amenityId, LocalDate date, BookingStatus status);

    /** Conflict check: does the requested slot overlap an existing CONFIRMED booking? */
    @Query("SELECT COUNT(b) > 0 FROM AmenityBooking b " +
           "WHERE b.amenity.id = :amenityId " +
           "AND b.status = 'CONFIRMED' " +
           "AND b.bookingDate = :date " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    boolean existsConflict(@Param("amenityId") Long amenityId,
                           @Param("date") LocalDate date,
                           @Param("startTime") Instant startTime,
                           @Param("endTime") Instant endTime);
}
