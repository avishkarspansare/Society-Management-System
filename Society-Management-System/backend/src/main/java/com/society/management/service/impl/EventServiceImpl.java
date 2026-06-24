package com.society.management.service.impl;

import com.society.management.dto.request.EventRequest;
import com.society.management.dto.response.EventDto;
import com.society.management.dto.response.UserDto;
import com.society.management.exception.BadRequestException;
import com.society.management.exception.ConflictException;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Event;
import com.society.management.model.EventRegistration;
import com.society.management.model.Society;
import com.society.management.model.User;
import com.society.management.repository.EventRegistrationRepository;
import com.society.management.repository.EventRepository;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UserRepository;
import com.society.management.service.EventService;
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
public class EventServiceImpl implements EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public EventDto create(Long organiserId, EventRequest request) {
        Society society = societyRepository.findById(request.getSocietyId())
                .orElseThrow(() -> new ResourceNotFoundException("Society not found: " + request.getSocietyId()));

        User organiser = userRepository.findById(organiserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + organiserId));

        Event event = Event.builder()
                .society(society)
                .title(request.getTitle())
                .description(request.getDescription())
                .eventDate(request.getEventDate())
                .endDate(request.getEndDate())
                .venue(request.getVenue())
                .maxParticipants(request.getMaxParticipants())
                .registrationRequired(request.getRegistrationRequired() != null ? request.getRegistrationRequired() : false)
                .fee(request.getFee())
                .imageUrls(request.getImageUrls())
                .organiser(organiser)
                .isActive(true)
                .build();

        Event saved = eventRepository.save(event);
        logger.info("Event created: '{}' for society {}", saved.getTitle(), society.getId());
        return toDto(saved);
    }

    @Override
    @Transactional
    public EventDto update(Long id, EventRequest request) {
        Event event = getOrThrow(id);

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setEndDate(request.getEndDate());
        event.setVenue(request.getVenue());
        event.setMaxParticipants(request.getMaxParticipants());
        if (request.getRegistrationRequired() != null) event.setRegistrationRequired(request.getRegistrationRequired());
        if (request.getFee() != null) event.setFee(request.getFee());
        if (request.getImageUrls() != null) event.setImageUrls(request.getImageUrls());

        return toDto(eventRepository.save(event));
    }

    @Override
    public EventDto getById(Long id) {
        return toDto(getOrThrow(id));
    }

    @Override
    public Page<EventDto> getBySociety(Long societyId, Pageable pageable) {
        return eventRepository.findBySocietyId(societyId, pageable).map(this::toDto);
    }

    @Override
    public List<EventDto> getUpcomingEvents(Long societyId) {
        return eventRepository.findUpcomingEvents(societyId, Instant.now())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Event event = getOrThrow(id);
        event.setIsActive(false);
        eventRepository.save(event);
        logger.info("Event {} soft-deleted", id);
    }

    @Override
    @Transactional
    public void registerUser(Long eventId, Long userId) {
        Event event = getOrThrow(eventId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (registrationRepository.existsByEventIdAndUserIdAndStatus(eventId, userId, "REGISTERED")) {
            throw new ConflictException("User is already registered for this event");
        }

        if (event.getMaxParticipants() != null) {
            long registered = registrationRepository.countByEventIdAndStatus(eventId, "REGISTERED");
            if (registered >= event.getMaxParticipants()) {
                throw new BadRequestException("Event is at full capacity");
            }
        }

        EventRegistration reg = EventRegistration.builder()
                .event(event)
                .user(user)
                .status("REGISTERED")
                .registeredAt(Instant.now())
                .build();

        registrationRepository.save(reg);
        logger.info("User {} registered for event {}", userId, eventId);
    }

    @Override
    @Transactional
    public void cancelRegistration(Long eventId, Long userId) {
        EventRegistration reg = registrationRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found for event " + eventId));

        if (!"REGISTERED".equals(reg.getStatus())) {
            throw new BadRequestException("Registration is already cancelled");
        }

        reg.setStatus("CANCELLED");
        reg.setCancelledAt(Instant.now());
        registrationRepository.save(reg);
        logger.info("User {} cancelled registration for event {}", userId, eventId);
    }

    @Override
    public List<UserDto> getParticipants(Long eventId) {
        return registrationRepository.findByEventIdAndStatus(eventId, "REGISTERED")
                .stream()
                .map(r -> toUserDto(r.getUser()))
                .collect(Collectors.toList());
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private Event getOrThrow(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));
    }

    private EventDto toDto(Event e) {
        long count = registrationRepository.countByEventIdAndStatus(e.getId(), "REGISTERED");
        return EventDto.builder()
                .id(e.getId())
                .societyId(e.getSociety() != null ? e.getSociety().getId() : null)
                .title(e.getTitle())
                .description(e.getDescription())
                .eventDate(e.getEventDate())
                .endDate(e.getEndDate())
                .venue(e.getVenue())
                .maxParticipants(e.getMaxParticipants())
                .registrationRequired(e.getRegistrationRequired())
                .fee(e.getFee())
                .isActive(e.getIsActive())
                .imageUrls(e.getImageUrls())
                .organiserId(e.getOrganiser() != null ? e.getOrganiser().getId() : null)
                .organiserName(e.getOrganiser() != null ? e.getOrganiser().getFullName() : null)
                .registeredCount(count)
                .createdAt(e.getCreatedAt())
                .build();
    }

    private UserDto toUserDto(User u) {
        return UserDto.builder()
                .id(u.getId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .userType(u.getUserType())
                .isActive(u.getIsActive())
                .build();
    }
}
