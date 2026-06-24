package com.society.management.ai.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Result of AI-based complaint routing/classification.
 */
@Data
@Builder
public class RoutingDecision {

    /** Suggested category: ELECTRICAL, PLUMBING, CLEANING, SECURITY, ADMINISTRATIVE, LANDSCAPING, OTHER */
    private String category;

    /** Suggested priority: LOW, MEDIUM, HIGH, CRITICAL */
    private String priority;

    /** Optional: name or ID of suggested assignee staff member */
    private String recommendedAssignee;

    /** Confidence level of the classification (0.0–1.0) */
    private Double confidence;

    /** True if the decision was AI-driven, false if rule-based fallback */
    private boolean aiPowered;
}
