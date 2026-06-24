package com.society.management.service.impl;

import com.society.management.dto.request.VisitorRequest;
import com.society.management.dto.response.VisitorDto;
import com.society.management.exception.BadRequestException;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Society;
import com.society.management.model.Unit;
import com.society.management.model.User;
import com.society.management.model.Visitor;
import com.society.management.model.enums.VisitorStatus;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UnitRepository;
import com.society.management.repository.UserRepository;
import com.society.management.repository.VisitorRepository;
import com.society.management.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitorServiceImpl implements VisitorService {

    private static final Logger logger = LoggerFactory.getLogger(VisitorServiceImpl.class);

    private final VisitorRepository visitorRepository;
    private final SocietyRepository societyRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public VisitorDto registerVisitor(Long societyId, Long registeredByUserId, VisitorRequest request) {
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new ResourceNotFoundException("Society not found: " + societyId));

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException("Unit not found: " + request.getUnitId()));

        User registeredBy = userRepository.findById(registeredByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + registeredByUserId));

        Instant expectedArrival = null;
        if (request.getExpectedArrivalTime() != null && !request.getExpectedArrivalTime().isBlank()) {
            expectedArrival = Instant.parse(request.getExpectedArrivalTime());
        }

        Visitor visitor = Visitor.builder()
                .society(society)
                .unit(unit)
                .hostUser(registeredBy)
                .visitorName(request.getVisitorName())
                .visitorPhone(request.getVisitorPhone())
                .visitorEmail(request.getVisitorEmail())
                .purpose(request.getPurpose())
                .vehicleNumber(request.getVehicleNumber())
                .idProofType(request.getIdProofType())
                .idProofNumber(request.getIdProofNumber())
                .status(VisitorStatus.EXPECTED)
                .expectedArrivalTime(expectedArrival)
                .notes(request.getNotes())
                .build();

        Visitor saved = visitorRepository.save(visitor);
        logger.info("Visitor registered: {} for unit {}", saved.getVisitorName(), unit.getUnitNumber());
        return toDto(saved);
    }

    @Override
    @Transactional
    public VisitorDto checkIn(Long visitorId, Long securityUserId) {
        Visitor visitor = getVisitorOrThrow(visitorId);

        if (visitor.getStatus() == VisitorStatus.CHECKED_IN) {
            throw new BadRequestException("Visitor is already checked in");
        }
        if (visitor.getStatus() == VisitorStatus.CHECKED_OUT) {
            throw new BadRequestException("Visitor has already checked out");
        }

        User security = userRepository.findById(securityUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Security user not found: " + securityUserId));

        visitor.setStatus(VisitorStatus.CHECKED_IN);
        visitor.setCheckInTime(Instant.now());
        visitor.setProcessedBy(security);

        logger.info("Visitor {} checked in at {}", visitor.getVisitorName(), visitor.getCheckInTime());
        return toDto(visitorRepository.save(visitor));
    }

    @Override
    @Transactional
    public VisitorDto checkOut(Long visitorId, Long securityUserId) {
        Visitor visitor = getVisitorOrThrow(visitorId);

        if (visitor.getStatus() != VisitorStatus.CHECKED_IN) {
            throw new BadRequestException("Visitor is not currently checked in");
        }

        visitor.setStatus(VisitorStatus.CHECKED_OUT);
        visitor.setCheckOutTime(Instant.now());

        logger.info("Visitor {} checked out at {}", visitor.getVisitorName(), visitor.getCheckOutTime());
        return toDto(visitorRepository.save(visitor));
    }

    @Override
    public VisitorDto getById(Long id) {
        return toDto(getVisitorOrThrow(id));
    }

    @Override
    public Page<VisitorDto> getBySociety(Long societyId, Pageable pageable) {
        return visitorRepository.findBySocietyId(societyId, pageable).map(this::toDto);
    }

    @Override
    public Page<VisitorDto> getByUnit(Long unitId, Pageable pageable) {
        return visitorRepository.findByUnitId(unitId, pageable).map(this::toDto);
    }

    @Override
    public List<VisitorDto> getTodaysVisitors(Long societyId) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        Instant startOfDay = today.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        return visitorRepository.findTodaysVisitors(societyId, startOfDay, endOfDay)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<VisitorDto> getActiveVisitors(Long societyId) {
        return visitorRepository
                .findBySocietyIdAndStatusAndCheckOutTimeIsNull(societyId, VisitorStatus.CHECKED_IN)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private Visitor getVisitorOrThrow(Long id) {
        return visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor not found: " + id));
    }

    private VisitorDto toDto(Visitor v) {
        return VisitorDto.builder()
                .id(v.getId())
                .societyId(v.getSociety() != null ? v.getSociety().getId() : null)
                .unitId(v.getUnit() != null ? v.getUnit().getId() : null)
                .unitNumber(v.getUnit() != null ? v.getUnit().getUnitNumber() : null)
                .hostUserId(v.getHostUser() != null ? v.getHostUser().getId() : null)
                .hostUserName(v.getHostUser() != null ? v.getHostUser().getFullName() : null)
                .visitorName(v.getVisitorName())
                .visitorPhone(v.getVisitorPhone())
                .visitorEmail(v.getVisitorEmail())
                .purpose(v.getPurpose())
                .vehicleNumber(v.getVehicleNumber())
                .idProofType(v.getIdProofType())
                .idProofNumber(v.getIdProofNumber())
                .status(v.getStatus())
                .checkInTime(v.getCheckInTime())
                .checkOutTime(v.getCheckOutTime())
                .expectedArrivalTime(v.getExpectedArrivalTime())
                .notes(v.getNotes())
                .processedById(v.getProcessedBy() != null ? v.getProcessedBy().getId() : null)
                .processedByName(v.getProcessedBy() != null ? v.getProcessedBy().getFullName() : null)
                .createdAt(v.getCreatedAt())
                .build();
    }
}
