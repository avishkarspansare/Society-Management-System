package com.society.management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * Application-wide configuration.
 * Provides the AuditorAware bean for JPA auditing (createdBy/updatedBy).
 */
@Configuration
public class AppConfig {

    /**
     * Provides the current user ID for JPA auditing.
     * Returns the authenticated user's email (used as a proxy since we use email-based auth).
     * In a production setup, this would return the user's Long ID.
     */
    @Bean
    public AuditorAware<Long> auditorAware() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())) {
                return Optional.empty();
            }
            // For now, return empty. In production, resolve email -> userId
            return Optional.empty();
        };
    }
}
