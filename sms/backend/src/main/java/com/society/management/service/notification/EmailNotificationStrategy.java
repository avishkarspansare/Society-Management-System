package com.society.management.service.notification;

import com.society.management.model.User;
import com.society.management.model.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * Email notification strategy using Spring Mail (JavaMailSender).
 * Configure SMTP settings in application.properties to enable.
 * Falls back gracefully to a log warning if no mail sender is available.
 */
@Component("emailNotificationStrategy")
@RequiredArgsConstructor
public class EmailNotificationStrategy implements NotificationStrategy {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationStrategy.class);

    private final JavaMailSender mailSender;

    @Override
    public void send(User user, String title, String message, NotificationType type) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            logger.warn("Cannot send email — user {} has no email address", user.getId());
            return;
        }

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(user.getEmail());
            mail.setSubject("[Society] " + title);
            mail.setText(message);
            mailSender.send(mail);
            logger.info("Email sent to {} — {}", user.getEmail(), title);
        } catch (Exception ex) {
            logger.error("Failed to send email to {}: {}", user.getEmail(), ex.getMessage());
        }
    }
}
