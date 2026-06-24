package com.society.management.util;

import java.time.*;
import java.time.format.DateTimeFormatter;

/**
 * Utility class for date/time operations.
 */
public final class DateUtils {

    private DateUtils() {
        // Prevent instantiation
    }

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern(Constants.DATE_FORMAT);

    private static final DateTimeFormatter DATETIME_FORMATTER =
            DateTimeFormatter.ofPattern(Constants.DATETIME_FORMAT);

    private static final ZoneId DEFAULT_ZONE = ZoneId.of("Asia/Kolkata");

    /**
     * Formats a LocalDate to string (yyyy-MM-dd).
     */
    public static String formatDate(LocalDate date) {
        return date != null ? date.format(DATE_FORMATTER) : null;
    }

    /**
     * Formats a LocalDateTime to string (yyyy-MM-dd HH:mm:ss).
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATETIME_FORMATTER) : null;
    }

    /**
     * Formats an Instant to string using the default timezone.
     */
    public static String formatInstant(Instant instant) {
        if (instant == null) return null;
        return instant.atZone(DEFAULT_ZONE).format(DATETIME_FORMATTER);
    }

    /**
     * Parses a date string to LocalDate.
     */
    public static LocalDate parseDate(String dateStr) {
        return dateStr != null ? LocalDate.parse(dateStr, DATE_FORMATTER) : null;
    }

    /**
     * Gets the current date in the default timezone.
     */
    public static LocalDate today() {
        return LocalDate.now(DEFAULT_ZONE);
    }

    /**
     * Gets the current timestamp.
     */
    public static Instant now() {
        return Instant.now();
    }

    /**
     * Checks if a date is in the past.
     */
    public static boolean isPast(LocalDate date) {
        return date != null && date.isBefore(today());
    }

    /**
     * Checks if a date is overdue (past the due date).
     */
    public static boolean isOverdue(LocalDate dueDate) {
        return isPast(dueDate);
    }
}
