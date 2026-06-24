package com.society.management.scheduler;

import com.society.management.model.Payment;
import com.society.management.model.User;
import com.society.management.model.enums.NotificationType;
import com.society.management.model.enums.PaymentStatus;
import com.society.management.repository.PaymentRepository;
import com.society.management.repository.SocietyRepository;
import com.society.management.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduled task that sends payment reminders for overdue or near-due payments.
 * Runs daily at 09:00 UTC.
 */
@Component
@RequiredArgsConstructor
public class PaymentReminderScheduler {

    private static final Logger logger = LoggerFactory.getLogger(PaymentReminderScheduler.class);

    private final PaymentRepository paymentRepository;
    private final SocietyRepository societyRepository;
    private final NotificationService notificationService;

    /**
     * Sends payment reminders for all overdue PENDING payments across all societies.
     * Cron: every day at 09:00 UTC.
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendOverdueReminders() {
        logger.info("Running payment reminder scheduler...");

        LocalDate today = LocalDate.now();

        // Iterate all active societies
        societyRepository.findAll().stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsActive()))
                .forEach(society -> {
                    List<Payment> overduePayments =
                            paymentRepository.findOverduePayments(society.getId(), today);

                    overduePayments.forEach(payment -> {
                        // Mark as OVERDUE
                        if (payment.getPaymentStatus() == PaymentStatus.PENDING) {
                            payment.setPaymentStatus(PaymentStatus.OVERDUE);
                            paymentRepository.save(payment);
                        }

                        User user = payment.getUser();
                        if (user != null) {
                            String title = "Payment Overdue";
                            String message = String.format(
                                    "Your %s payment of ₹%.2f was due on %s. Please pay immediately to avoid additional late fees.",
                                    payment.getPaymentType().name().toLowerCase(),
                                    payment.getAmount(),
                                    payment.getDueDate());

                            notificationService.sendAll(user, title, message, NotificationType.PAYMENT_DUE);
                        }
                    });

                    if (!overduePayments.isEmpty()) {
                        logger.info("Sent {} overdue payment reminders for society {}",
                                overduePayments.size(), society.getName());
                    }
                });
    }

    /**
     * Sends advance reminders for payments due within the next 3 days.
     * Cron: every day at 08:00 UTC.
     */
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendAdvanceReminders() {
        logger.info("Running advance payment reminder scheduler...");

        LocalDate today = LocalDate.now();
        LocalDate in3Days = today.plusDays(3);

        societyRepository.findAll().stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsActive()))
                .forEach(society -> {
                    List<Payment> upcomingPayments =
                            paymentRepository.findBySocietyIdAndPaymentStatus(
                                    society.getId(), PaymentStatus.PENDING);

                    upcomingPayments.stream()
                            .filter(p -> p.getDueDate() != null
                                    && !p.getDueDate().isBefore(today)
                                    && !p.getDueDate().isAfter(in3Days))
                            .forEach(payment -> {
                                User user = payment.getUser();
                                if (user != null) {
                                    String title = "Payment Due Soon";
                                    String message = String.format(
                                            "Reminder: Your %s payment of ₹%.2f is due on %s.",
                                            payment.getPaymentType().name().toLowerCase(),
                                            payment.getAmount(),
                                            payment.getDueDate());

                                    notificationService.sendInApp(user, title, message,
                                            NotificationType.PAYMENT_DUE);
                                }
                            });
                });
    }
}
