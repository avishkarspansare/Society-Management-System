package com.society.management.service.impl;

import com.society.management.dto.request.AnnouncementRequest;
import com.society.management.dto.response.AnnouncementDto;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Announcement;
import com.society.management.model.Society;
import com.society.management.model.User;
import com.society.management.model.enums.NotificationType;
import com.society.management.repository.AnnouncementRepository;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UserRepository;
import com.society.management.service.AnnouncementService;
import com.society.management.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private static final Logger logger = LoggerFactory.getLogger(AnnouncementServiceImpl.class);

    private final AnnouncementRepository announcementRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public AnnouncementDto create(Long createdByUserId, AnnouncementRequest request) {
        Society society = societyRepository.findById(request.getSocietyId())
                .orElseThrow(() -> new ResourceNotFoundException("Society not found: " + request.getSocietyId()));

        User author = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + createdByUserId));

        Announcement announcement = Announcement.builder()
                .society(society)
                .title(request.getTitle())
                .content(request.getContent())
                .announcementType(request.getAnnouncementType())
                .priority(request.getPriority() != null ? request.getPriority() : 3)
                .publishDate(request.getPublishDate())
                .expiryDate(request.getExpiryDate())
                .attachmentUrls(request.getAttachmentUrls())
                .createdByUser(author)
                .isActive(true)
                .build();

        Announcement saved = announcementRepository.save(announcement);
        logger.info("Announcement created: '{}' for society {}", saved.getTitle(), society.getId());
        return toDto(saved);
    }

    @Override
    @Transactional
    public AnnouncementDto update(Long id, AnnouncementRequest request) {
        Announcement announcement = getOrThrow(id);

        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setAnnouncementType(request.getAnnouncementType());
        if (request.getPriority() != null) announcement.setPriority(request.getPriority());
        announcement.setPublishDate(request.getPublishDate());
        announcement.setExpiryDate(request.getExpiryDate());
        if (request.getAttachmentUrls() != null) announcement.setAttachmentUrls(request.getAttachmentUrls());

        return toDto(announcementRepository.save(announcement));
    }

    @Override
    public AnnouncementDto getById(Long id) {
        return toDto(getOrThrow(id));
    }

    @Override
    public Page<AnnouncementDto> getBySociety(Long societyId, Pageable pageable) {
        return announcementRepository.findBySocietyId(societyId, pageable).map(this::toDto);
    }

    @Override
    public List<AnnouncementDto> getActiveAnnouncements(Long societyId) {
        return announcementRepository.findActiveAnnouncements(societyId, Instant.now())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Announcement announcement = getOrThrow(id);
        announcement.setIsActive(false);
        announcementRepository.save(announcement);
        logger.info("Announcement {} soft-deleted", id);
    }

    @Override
    public void sendNotification(Long announcementId) {
        Announcement announcement = getOrThrow(announcementId);
        // Load all residents of the society and send in-app notifications
        List<User> residents = userRepository.findBySocietyId(announcement.getSociety().getId());
        notificationService.sendBulkInApp(
                residents,
                "New Announcement: " + announcement.getTitle(),
                announcement.getContent(),
                NotificationType.ANNOUNCEMENT
        );
        logger.info("Announcement notification sent to {} residents", residents.size());
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private Announcement getOrThrow(Long id) {
        return announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found: " + id));
    }

    private AnnouncementDto toDto(Announcement a) {
        return AnnouncementDto.builder()
                .id(a.getId())
                .societyId(a.getSociety() != null ? a.getSociety().getId() : null)
                .title(a.getTitle())
                .content(a.getContent())
                .announcementType(a.getAnnouncementType())
                .priority(a.getPriority())
                .publishDate(a.getPublishDate())
                .expiryDate(a.getExpiryDate())
                .isActive(a.getIsActive())
                .attachmentUrls(a.getAttachmentUrls())
                .createdByUserId(a.getCreatedByUser() != null ? a.getCreatedByUser().getId() : null)
                .createdByUserName(a.getCreatedByUser() != null ? a.getCreatedByUser().getFullName() : null)
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}
