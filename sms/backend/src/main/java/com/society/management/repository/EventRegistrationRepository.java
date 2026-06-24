package com.society.management.repository;

import com.society.management.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

    List<EventRegistration> findByEventIdAndStatus(Long eventId, String status);

    Optional<EventRegistration> findByEventIdAndUserId(Long eventId, Long userId);

    boolean existsByEventIdAndUserIdAndStatus(Long eventId, Long userId, String status);

    long countByEventIdAndStatus(Long eventId, String status);

    List<EventRegistration> findByUserIdAndStatus(Long userId, String status);
}
