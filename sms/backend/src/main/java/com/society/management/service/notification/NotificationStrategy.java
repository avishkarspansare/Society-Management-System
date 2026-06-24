package com.society.management.service.notification;

import com.society.management.model.User;
import com.society.management.model.enums.NotificationType;

/**
 * Strategy interface for delivering notifications through a specific channel.
 */
public interface NotificationStrategy {

    /**
     * Send a notification to the given user.
     *
     * @param user    the recipient
     * @param title   short notification title
     * @param message body of the notification
     * @param type    the notification type (for routing / categorisation)
     */
    void send(User user, String title, String message, NotificationType type);
}
