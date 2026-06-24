package com.society.management.service;

import com.society.management.dto.request.AnnouncementRequest;
import com.society.management.dto.response.AnnouncementDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Announcement management operations.
 */
public interface AnnouncementService {

    AnnouncementDto create(Long createdByUserId, AnnouncementRequest request);

    AnnouncementDto update(Long id, AnnouncementRequest request);

    AnnouncementDto getById(Long id);

    Page<AnnouncementDto> getBySociety(Long societyId, Pageable pageable);

    List<AnnouncementDto> getActiveAnnouncements(Long societyId);

    void delete(Long id);

    void sendNotification(Long announcementId);
}
