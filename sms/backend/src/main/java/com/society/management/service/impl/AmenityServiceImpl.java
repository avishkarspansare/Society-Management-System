package com.society.management.service.impl;

import com.society.management.dto.request.AmenityRequest;
import com.society.management.dto.request.BookingRequest;
import com.society.management.dto.response.AmenityDto;
import com.society.management.dto.response.BookingDto;
import com.society.management.exception.BadRequestException;
import com.society.management.exception.ConflictException;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Amenity;
import com.society.management.model.AmenityBooking;
import com.society.management.model.Society;
import com.society.management.model.User;
import com.society.management.model.enums.BookingStatus;
import com.society.management.repository.AmenityBookingRepository;
import com.society.management.repository.AmenityRepository;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UserRepository;
import com.society.management.service.AmenityService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AmenityServiceImpl implements AmenityService {

    private static final Logger logger = LoggerFactory.getLogger(AmenityServiceImpl.class);

    private final AmenityRepository amenityRepository;
    private final AmenityBookingRepository bookingRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;

    // ─── Amenity CRUD ─────────────────────────────────────────────────────────

    @Override
    @Transactional
    public AmenityDto createAmenity(AmenityRequest request) {
        Society society = societyRepository.findById(request.getSocietyId())
                .orElseThrow(() -> new ResourceNotFoundException("Society not found: " + request.getSocietyId()));

        if (amenityRepository.existsBySocietyIdAndNameIgnoreCase(request.getSocietyId(), request.getName())) {
            throw new ConflictException("An amenity named '" + request.getName() + "' already exists in this society");
        }

        Amenity amenity = Amenity.builder()
                .society(society)
                .name(request.getName())
                .description(request.getDescription())
                .capacity(request.getCapacity())
                .hourlyRate(request.getHourlyRate() != null ? request.getHourlyRate() : BigDecimal.ZERO)
                .availableDays(request.getAvailableDays())
                .openTime(request.getOpenTime())
                .closeTime(request.getCloseTime())
                .imageUrls(request.getImageUrls())
                .isActive(true)
                .build();

        Amenity saved = amenityRepository.save(amenity);
        logger.info("Amenity created: '{}' for society {}", saved.getName(), society.getId());
        return toAmenityDto(saved);
    }

    @Override
    @Transactional
    public AmenityDto updateAmenity(Long id, AmenityRequest request) {
        Amenity amenity = getAmenityOrThrow(id);

        amenity.setName(request.getName());
        amenity.setDescription(request.getDescription());
        amenity.setCapacity(request.getCapacity());
        if (request.getHourlyRate() != null) amenity.setHourlyRate(request.getHourlyRate());
        amenity.setAvailableDays(request.getAvailableDays());
        amenity.setOpenTime(request.getOpenTime());
        amenity.setCloseTime(request.getCloseTime());
        if (request.getImageUrls() != null) amenity.setImageUrls(request.getImageUrls());

        return toAmenityDto(amenityRepository.save(amenity));
    }

    @Override
    public AmenityDto getAmenityById(Long id) {
        return toAmenityDto(getAmenityOrThrow(id));
    }

    @Override
    public Page<AmenityDto> getAmenitiesBySociety(Long societyId, Pageable pageable) {
        return amenityRepository.findBySocietyId(societyId, pageable).map(this::toAmenityDto);
    }

    @Override
    public List<AmenityDto> getActiveAmenitiesBySociety(Long societyId) {
        return amenityRepository.findBySocietyIdAndIsActiveTrue(societyId)
                .stream().map(this::toAmenityDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteAmenity(Long id) {
        Amenity amenity = getAmenityOrThrow(id);
        amenity.setIsActive(false);
        amenityRepository.save(amenity);
        logger.info("Amenity {} soft-deleted", id);
    }

    // ─── Booking operations ───────────────────────────────────────────────────

    @Override
    @Transactional
    public BookingDto createBooking(Long userId, BookingRequest request) {
        Amenity amenity = getAmenityOrThrow(request.getAmenityId());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        LocalDate bookingDate;
        Instant startTime;
        Instant endTime;

        try {
            bookingDate = LocalDate.parse(request.getBookingDate());
            startTime   = Instant.parse(request.getStartTime());
            endTime     = Instant.parse(request.getEndTime());
        } catch (DateTimeParseException ex) {
            throw new BadRequestException("Invalid date/time format. Use ISO-8601.");
        }

        if (!startTime.isBefore(endTime)) {
            throw new BadRequestException("Start time must be before end time");
        }

        if (bookingRepository.existsConflict(amenity.getId(), bookingDate, startTime, endTime)) {
            throw new ConflictException("This slot is already booked for the selected amenity");
        }

        // Calculate charge based on hourly rate
        long minutes = Duration.between(startTime, endTime).toMinutes();
        BigDecimal hours = BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 2, java.math.RoundingMode.HALF_UP);
        BigDecimal charge = amenity.getHourlyRate().multiply(hours);

        AmenityBooking booking = AmenityBooking.builder()
                .amenity(amenity)
                .user(user)
                .bookingDate(bookingDate)
                .startTime(startTime)
                .endTime(endTime)
                .amountCharged(charge)
                .status(BookingStatus.CONFIRMED)
                .notes(request.getNotes())
                .build();

        AmenityBooking saved = bookingRepository.save(booking);
        logger.info("Booking created: {} → amenity '{}' on {}", userId, amenity.getName(), bookingDate);
        return toBookingDto(saved);
    }

    @Override
    @Transactional
    public BookingDto cancelBooking(Long bookingId, Long userId, String reason) {
        AmenityBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);
        return toBookingDto(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingDto confirmBooking(Long bookingId) {
        AmenityBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
        booking.setStatus(BookingStatus.CONFIRMED);
        return toBookingDto(bookingRepository.save(booking));
    }

    @Override
    public Page<BookingDto> getMyBookings(Long userId, Pageable pageable) {
        return bookingRepository.findByUserId(userId, pageable).map(this::toBookingDto);
    }

    @Override
    public Page<BookingDto> getBookingsByAmenity(Long amenityId, Pageable pageable) {
        return bookingRepository.findByAmenityId(amenityId, pageable).map(this::toBookingDto);
    }

    // ─── Mappers ──────────────────────────────────────────────────────────────

    private Amenity getAmenityOrThrow(Long id) {
        return amenityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Amenity not found: " + id));
    }

    private AmenityDto toAmenityDto(Amenity a) {
        return AmenityDto.builder()
                .id(a.getId())
                .societyId(a.getSociety() != null ? a.getSociety().getId() : null)
                .name(a.getName())
                .description(a.getDescription())
                .capacity(a.getCapacity())
                .hourlyRate(a.getHourlyRate())
                .availableDays(a.getAvailableDays())
                .openTime(a.getOpenTime())
                .closeTime(a.getCloseTime())
                .isActive(a.getIsActive())
                .imageUrls(a.getImageUrls())
                .build();
    }

    private BookingDto toBookingDto(AmenityBooking b) {
        return BookingDto.builder()
                .id(b.getId())
                .amenityId(b.getAmenity().getId())
                .amenityName(b.getAmenity().getName())
                .userId(b.getUser().getId())
                .userName(b.getUser().getFullName())
                .bookingDate(b.getBookingDate())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .amountCharged(b.getAmountCharged())
                .status(b.getStatus())
                .cancellationReason(b.getCancellationReason())
                .notes(b.getNotes())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
