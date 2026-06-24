package com.society.management.service.impl;

import com.society.management.dto.request.SocietyRequest;
import com.society.management.dto.response.AnnouncementDto;
import com.society.management.dto.response.DashboardStatsDto;
import com.society.management.dto.response.SocietyDto;
import com.society.management.exception.ConflictException;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Society;
import com.society.management.model.enums.ComplaintStatus;
import com.society.management.model.enums.PaymentStatus;
import com.society.management.model.enums.VisitorStatus;
import com.society.management.repository.AnnouncementRepository;
import com.society.management.repository.ComplaintRepository;
import com.society.management.repository.EventRepository;
import com.society.management.repository.PaymentRepository;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UnitRepository;
import com.society.management.repository.UserRepository;
import com.society.management.repository.VisitorRepository;
import com.society.management.service.AnnouncementService;
import com.society.management.service.SocietyService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of society management operations.
 */
@Service
@RequiredArgsConstructor
public class SocietyServiceImpl implements SocietyService {

    private static final Logger logger = LoggerFactory.getLogger(SocietyServiceImpl.class);

    private final SocietyRepository societyRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final ComplaintRepository complaintRepository;
    private final VisitorRepository visitorRepository;
    private final EventRepository eventRepository;
    private final AnnouncementRepository announcementRepository;
    private final AnnouncementService announcementService;

    @Override
    @Transactional
    public SocietyDto createSociety(SocietyRequest request) {
        // Check for duplicate registration number
        if (StringUtils.hasText(request.getRegistrationNumber())
                && societyRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new ConflictException("Registration number already exists: " + request.getRegistrationNumber());
        }

        Society society = Society.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .country(request.getCountry() != null ? request.getCountry() : "India")
                .registrationNumber(request.getRegistrationNumber())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .website(request.getWebsite())
                .logoUrl(request.getLogoUrl())
                .establishedDate(request.getEstablishedDate())
                .totalUnits(request.getTotalUnits() != null ? request.getTotalUnits() : 0)
                .isActive(true)
                .build();

        Society savedSociety = societyRepository.save(society);
        logger.info("Society created: {} (ID: {})", savedSociety.getName(), savedSociety.getId());
        return mapToDto(savedSociety);
    }

    @Override
    @Transactional(readOnly = true)
    public SocietyDto getSocietyById(Long id) {
        Society society = societyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Society", "id", id));
        return mapToDto(society);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SocietyDto> getAllSocieties(Pageable pageable) {
        return societyRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional
    public SocietyDto updateSociety(Long id, SocietyRequest request) {
        Society society = societyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Society", "id", id));

        // Check registration number uniqueness if changed
        if (StringUtils.hasText(request.getRegistrationNumber())
                && !request.getRegistrationNumber().equals(society.getRegistrationNumber())
                && societyRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new ConflictException("Registration number already exists: " + request.getRegistrationNumber());
        }

        society.setName(request.getName());
        society.setAddress(request.getAddress());
        society.setCity(request.getCity());
        society.setState(request.getState());
        society.setPincode(request.getPincode());
        if (request.getCountry() != null) {
            society.setCountry(request.getCountry());
        }
        society.setRegistrationNumber(request.getRegistrationNumber());
        society.setContactNumber(request.getContactNumber());
        society.setEmail(request.getEmail());
        society.setWebsite(request.getWebsite());
        society.setLogoUrl(request.getLogoUrl());
        society.setEstablishedDate(request.getEstablishedDate());
        if (request.getTotalUnits() != null) {
            society.setTotalUnits(request.getTotalUnits());
        }

        Society updatedSociety = societyRepository.save(society);
        logger.info("Society updated: {} (ID: {})", updatedSociety.getName(), updatedSociety.getId());
        return mapToDto(updatedSociety);
    }

    @Override
    @Transactional
    public void deleteSociety(Long id) {
        Society society = societyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Society", "id", id));
        societyRepository.delete(society);
        logger.info("Society deleted: {} (ID: {})", society.getName(), id);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(Long societyId) {
        societyRepository.findById(societyId)
                .orElseThrow(() -> new ResourceNotFoundException("Society", "id", societyId));

        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        Instant startOfDay = today.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        long totalUnits    = unitRepository.countBySocietyId(societyId);
        long occupiedUnits = unitRepository.countBySocietyIdAndIsOccupiedTrue(societyId);

        long pendingPayments = paymentRepository
                .findBySocietyIdAndPaymentStatus(societyId, PaymentStatus.PENDING).size();
        long overduePayments = paymentRepository
                .findOverduePayments(societyId, today).size();

        long openComplaints = complaintRepository
                .findBySocietyIdAndStatus(societyId, ComplaintStatus.OPEN).size();
        long inProgressComplaints = complaintRepository
                .findBySocietyIdAndStatus(societyId, ComplaintStatus.IN_PROGRESS).size();

        long visitorsToday  = visitorRepository.findTodaysVisitors(societyId, startOfDay, endOfDay).size();
        long activeVisitors = visitorRepository
                .findBySocietyIdAndStatusAndCheckOutTimeIsNull(societyId, VisitorStatus.CHECKED_IN).size();

        long upcomingEvents      = eventRepository.countBySocietyIdAndIsActiveTrue(societyId);
        long activeAnnouncements = announcementRepository.countBySocietyIdAndIsActiveTrue(societyId);

        List<AnnouncementDto> recentAnnouncements =
                announcementService.getActiveAnnouncements(societyId)
                        .stream().limit(5).collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalUnits(totalUnits)
                .occupiedUnits(occupiedUnits)
                .vacantUnits(totalUnits - occupiedUnits)
                .pendingPayments(pendingPayments)
                .overduePayments(overduePayments)
                .openComplaints(openComplaints)
                .inProgressComplaints(inProgressComplaints)
                .visitorsToday(visitorsToday)
                .activeVisitors(activeVisitors)
                .upcomingEvents(upcomingEvents)
                .activeAnnouncements(activeAnnouncements)
                .recentAnnouncements(recentAnnouncements)
                .build();
    }

    private SocietyDto mapToDto(Society society) {
        return SocietyDto.builder()
                .id(society.getId())
                .name(society.getName())
                .address(society.getAddress())
                .city(society.getCity())
                .state(society.getState())
                .pincode(society.getPincode())
                .country(society.getCountry())
                .registrationNumber(society.getRegistrationNumber())
                .contactNumber(society.getContactNumber())
                .email(society.getEmail())
                .website(society.getWebsite())
                .logoUrl(society.getLogoUrl())
                .establishedDate(society.getEstablishedDate())
                .totalUnits(society.getTotalUnits())
                .isActive(society.getIsActive())
                .createdAt(society.getCreatedAt())
                .build();
    }
}
