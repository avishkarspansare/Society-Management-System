package com.society.management.service.impl;

import com.society.management.dto.request.ComplaintRequest;
import com.society.management.dto.response.ComplaintDto;
import com.society.management.exception.BadRequestException;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Complaint;
import com.society.management.model.Society;
import com.society.management.model.User;
import com.society.management.model.enums.ComplaintPriority;
import com.society.management.model.enums.ComplaintStatus;
import com.society.management.repository.ComplaintRepository;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UserRepository;
import com.society.management.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;

/**
 * Implementation of complaint management operations.
 */
@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

    private static final Logger logger = LoggerFactory.getLogger(ComplaintServiceImpl.class);

    private final ComplaintRepository complaintRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ComplaintDto createComplaint(ComplaintRequest request) {
        Society society = societyRepository.findById(request.getSocietyId())
                .orElseThrow(() -> new ResourceNotFoundException("Society", "id", request.getSocietyId()));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));

        Complaint complaint = Complaint.builder()
                .society(society)
                .user(user)
                .category(request.getCategory())
                .priority(request.getPriority() != null ? request.getPriority() : ComplaintPriority.MEDIUM)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(ComplaintStatus.OPEN)
                .attachmentUrls(request.getAttachmentUrls() != null ? request.getAttachmentUrls() : new ArrayList<>())
                .build();

        Complaint saved = complaintRepository.save(complaint);
        logger.info("Complaint created: '{}' by user {}", saved.getTitle(), user.getEmail());
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintDto getComplaintById(Long id) {
        return mapToDto(complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComplaintDto> getComplaintsBySociety(Long societyId, Pageable pageable) {
        return complaintRepository.findBySocietyId(societyId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComplaintDto> getComplaintsByUser(Long userId, Pageable pageable) {
        return complaintRepository.findByUserId(userId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional
    public ComplaintDto updateStatus(Long id, ComplaintStatus status, String closureReason) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        if (complaint.getStatus() == ComplaintStatus.CLOSED && status != ComplaintStatus.REOPENED) {
            throw new BadRequestException("Cannot change status of a closed complaint (use REOPENED)");
        }

        complaint.setStatus(status);
        if (closureReason != null) complaint.setClosureReason(closureReason);

        Complaint updated = complaintRepository.save(complaint);
        logger.info("Complaint ID={} status updated to {}", id, status);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public ComplaintDto assignComplaint(Long id, Long staffId) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", staffId));

        complaint.setAssignedTo(staff);
        complaint.setStatus(ComplaintStatus.IN_PROGRESS);

        Complaint updated = complaintRepository.save(complaint);
        logger.info("Complaint ID={} assigned to {}", id, staff.getEmail());
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public ComplaintDto resolveComplaint(Long id, Long resolvedById, String closureReason) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        User resolver = userRepository.findById(resolvedById)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", resolvedById));

        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setResolvedBy(resolver);
        complaint.setResolvedAt(Instant.now());
        complaint.setClosureReason(closureReason);

        Complaint updated = complaintRepository.save(complaint);
        logger.info("Complaint ID={} resolved by {}", id, resolver.getEmail());
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));
        complaintRepository.delete(complaint);
        logger.info("Complaint deleted: ID={}", id);
    }

    private ComplaintDto mapToDto(Complaint c) {
        return ComplaintDto.builder()
                .id(c.getId())
                .societyId(c.getSociety().getId())
                .userId(c.getUser().getId())
                .userName(c.getUser().getFullName())
                .category(c.getCategory())
                .priority(c.getPriority())
                .title(c.getTitle())
                .description(c.getDescription())
                .status(c.getStatus())
                .assignedToId(c.getAssignedTo() != null ? c.getAssignedTo().getId() : null)
                .assignedToName(c.getAssignedTo() != null ? c.getAssignedTo().getFullName() : null)
                .resolvedById(c.getResolvedBy() != null ? c.getResolvedBy().getId() : null)
                .resolvedByName(c.getResolvedBy() != null ? c.getResolvedBy().getFullName() : null)
                .resolvedAt(c.getResolvedAt())
                .closureReason(c.getClosureReason())
                .attachmentUrls(c.getAttachmentUrls())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
