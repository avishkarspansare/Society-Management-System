package com.society.management.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * Mail configuration — provides a no-op mail sender if no SMTP settings
 * are configured, so the application starts cleanly without mail credentials.
 */
@Configuration
public class MailConfig {

    /**
     * Fallback JavaMailSender used when spring.mail.host is NOT configured.
     * The EmailNotificationStrategy logs a warning instead of crashing.
     */
    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    public JavaMailSender fallbackMailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost("localhost");
        sender.setPort(25);
        return sender;
    }
}
