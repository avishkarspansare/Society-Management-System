package com.society.management.scheduler;

import com.society.management.model.Complaint;
import com.society.management.model.enums.ComplaintPriority;
import com.society.management.model.enums.ComplaintStatus;
import com.society.management.model.enums.NotificationType;
import com.society.management.repository.ComplaintRepository;
import com.society.management.repository.SocietyRepository;
import com.society.management.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Escalates unresolved HIGH-priority complaints to CRITICAL after 48 hours.
 * Also sends reminders for complaints that have been OPEN for more than 24 hours.
 * Runs every 6 hours.
 */
@Component
@RequiredArgsConstructor
public class ComplaintEscalationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ComplaintEscalationScheduler.class);

    private final ComplaintRepository complaintRepository;
    private final SocietyRepository societyRepository;
    private final NotificationService notificationService;

    /**
     * Escalates unresolved HIGH-priority complaints older than 48 hours to CRITICAL.
     * Cron: every 6 hours.
     */
    @Scheduled(cron = "0 0 */6 * * ?")
    public void escalateHighPriorityComplaints() {
        logger.info("Running complaint escalation scheduler...");

        Instant threshold48h = Instant.now().minus(48, ChronoUnit.HOURS);

        societyRepository.findAll().stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsActive()))
                .forEach(society -> {
                    List<Complaint> highPriorityComplaints =
                            complaintRepository.findBySocietyIdAndPriority(
                                    society.getId(), ComplaintPriority.HIGH);

                    highPriorityComplaints.stream()
                            .filter(c -> c.getStatus() == ComplaintStatus.OPEN
                                    || c.getStatus() == ComplaintStatus.IN_PROGRESS)
                            .filter(c -> c.getCreatedAt() != null
                                    && c.getCreatedAt().isBefore(threshold48h))
                            .forEach(complaint -> {
                                complaint.setPriority(ComplaintPriority.CRITICAL);
                                complaintRepository.save(complaint);

                                // Notify the complaint owner
                                if (complaint.getUser() != null) {
                                    notificationService.sendInApp(
                                            complaint.getUser(),
                                            "Complaint Escalated to CRITICAL",
                                            "Your complaint '" + complaint.getTitle()
                                                    + "' has been escalated to CRITICAL priority as it remains unresolved after 48 hours.",
                                            NotificationType.COMPLAINT_UPDATE
                                    );
                                }

                                logger.warn("Complaint {} escalated to CRITICAL (was HIGH, unresolved >48h)",
                                        complaint.getId());
                            });
                });
    }

    /**
     * Sends a reminder to admins for complaints that have been OPEN for more than 24 hours.
     * Cron: every day at 10:00 UTC.
     */
    @Scheduled(cron = "0 0 10 * * ?")
    public void remindOpenComplaints() {
        Instant threshold24h = Instant.now().minus(24, ChronoUnit.HOURS);

        societyRepository.findAll().stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsActive()))
                .forEach(society -> {
                    List<Complaint> openComplaints =
                            complaintRepository.findBySocietyIdAndStatus(
                                    society.getId(), ComplaintStatus.OPEN);

                    long staleCount = openComplaints.stream()
                            .filter(c -> c.getCreatedAt() != null
                                    && c.getCreatedAt().isBefore(threshold24h))
                            .count();

                    if (staleCount > 0) {
                        logger.info("{} stale open complaints in society {} (>24h old)",
                                staleCount, society.getName());
                    }
                });
    }
}
