package com.society.management.ai.service;

import com.society.management.ai.dto.ChatRequest;
import com.society.management.ai.dto.ChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * AI Chatbot service for answering common society-related questions.
 *
 * <p>This implementation is a <strong>rule-based stub</strong> that matches
 * keywords to canned responses. It is designed to be swapped with a real
 * {@code ChatClient} (Spring AI / OpenAI) by injecting it here once an API
 * key is configured in {@code application.properties}.</p>
 *
 * <p>To enable real AI: add {@code spring.ai.openai.api-key=...} to
 * application.properties and replace the {@code stubReply()} call below
 * with {@code chatClient.call(prompt)}.</p>
 */
@Service
public class ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);

    /**
     * Keyword → canned response map (case-insensitive matching).
     * Keys are checked in declaration order; first match wins.
     */
    private static final Map<String, String> FAQ = Map.ofEntries(
        Map.entry("payment", "You can pay your maintenance fees online through the Payments section. We accept UPI, credit/debit card, and bank transfer."),
        Map.entry("maintenance", "For maintenance requests, please go to the Complaints section and raise a new request with the category 'MAINTENANCE'."),
        Map.entry("visitor", "To register a visitor, go to the Visitors section and click 'Register Visitor'. Your visitor will receive a confirmation with check-in details."),
        Map.entry("complaint", "To raise a complaint, navigate to Complaints → New Complaint. You can track the status of your complaint in real-time."),
        Map.entry("parking", "Parking slot issues can be raised as a complaint under the ADMINISTRATIVE category, or contact the society office directly."),
        Map.entry("amenity", "You can book amenities like the clubhouse, gym, or swimming pool from the Amenities section. Check availability and confirm your slot."),
        Map.entry("announcement", "All society announcements are posted in the Announcements section. You will also receive notifications for important updates."),
        Map.entry("event", "Upcoming society events are listed in the Events section. You can register for events directly from there."),
        Map.entry("water", "For water supply issues, please raise a complaint under the PLUMBING category. Our team will respond within 24 hours."),
        Map.entry("electricity", "For electrical issues, please raise a complaint under the ELECTRICAL category. Emergency issues are escalated automatically."),
        Map.entry("security", "For security concerns, contact the security desk directly or raise a complaint under the SECURITY category."),
        Map.entry("contact", "You can contact the society office via email or phone. Visit the Society Info section for contact details."),
        Map.entry("receipt", "Payment receipts are available in the Payments section. Click on any paid payment to download the receipt."),
        Map.entry("late fee", "Late fees are applied automatically after the due date. Please pay before the due date to avoid additional charges."),
        Map.entry("overdue", "You have overdue payments. Please visit the Payments section and clear them to avoid further late fees.")
    );

    /**
     * Processes a chat message and returns a reply.
     *
     * @param request the chat request containing the user's message
     * @return a ChatResponse with the reply text
     */
    public ChatResponse chat(ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return ChatResponse.builder()
                    .reply("Please type your question and I'll do my best to help!")
                    .aiPowered(false)
                    .confidence(1.0)
                    .build();
        }

        String reply = stubReply(request.getMessage().toLowerCase());
        logger.debug("Chatbot replied to: '{}'", request.getMessage());

        return ChatResponse.builder()
                .reply(reply)
                .aiPowered(false)   // Set to true when real AI is wired
                .confidence(0.75)
                .build();
    }

    /**
     * Looks up a matching FAQ entry using keyword matching.
     * Falls back to a generic response if no keyword matches.
     */
    private String stubReply(String messageLower) {
        for (Map.Entry<String, String> entry : FAQ.entrySet()) {
            if (messageLower.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return "I'm your Society Assistant! I can help with payments, maintenance requests, visitor management, complaints, amenity bookings, and more. "
             + "Could you rephrase your question or be more specific?";
    }
}
