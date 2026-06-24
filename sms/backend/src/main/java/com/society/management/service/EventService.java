package com.society.management.service;

import com.society.management.dto.request.EventRequest;
import com.society.management.dto.response.EventDto;
import com.society.management.dto.response.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Event management operations.
 */
public interface EventService {

    EventDto create(Long organiserId, EventRequest request);

    EventDto update(Long id, EventRequest request);

    EventDto getById(Long id);

    Page<EventDto> getBySociety(Long societyId, Pageable pageable);

    List<EventDto> getUpcomingEvents(Long societyId);

    void delete(Long id);

    void registerUser(Long eventId, Long userId);

    void cancelRegistration(Long eventId, Long userId);

    List<UserDto> getParticipants(Long eventId);
}
