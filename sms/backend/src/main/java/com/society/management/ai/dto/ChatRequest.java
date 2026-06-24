package com.society.management.ai.dto;

import lombok.Data;

/**
 * Request payload for the AI chatbot endpoint.
 */
@Data
public class ChatRequest {

    /** The user's question or message. */
    private String message;

    /** Optional society context (societyId for scoping answers). */
    private Long societyId;
}
