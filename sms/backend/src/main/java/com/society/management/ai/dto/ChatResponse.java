package com.society.management.ai.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Response payload from the AI chatbot.
 */
@Data
@Builder
public class ChatResponse {

    /** The AI-generated reply text. */
    private String reply;

    /** Whether this was answered by a real AI model or the fallback stub. */
    private boolean aiPowered;

    /** Optional confidence score (0.0–1.0). */
    private Double confidence;
}
