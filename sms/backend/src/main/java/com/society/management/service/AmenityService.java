package com.society.management.service;

import com.society.management.dto.request.AmenityRequest;
import com.society.management.dto.request.BookingRequest;
import com.society.management.dto.response.AmenityDto;
import com.society.management.dto.response.BookingDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Amenity and booking management operations.
 */
public interface AmenityService {

    AmenityDto createAmenity(AmenityRequest request);

    AmenityDto updateAmenity(Long id, AmenityRequest request);

    AmenityDto getAmenityById(Long id);

    Page<AmenityDto> getAmenitiesBySociety(Long societyId, Pageable pageable);

    List<AmenityDto> getActiveAmenitiesBySociety(Long societyId);

    void deleteAmenity(Long id);

    BookingDto createBooking(Long userId, BookingRequest request);

    BookingDto cancelBooking(Long bookingId, Long userId, String reason);

    BookingDto confirmBooking(Long bookingId);

    Page<BookingDto> getMyBookings(Long userId, Pageable pageable);

    Page<BookingDto> getBookingsByAmenity(Long amenityId, Pageable pageable);
}
