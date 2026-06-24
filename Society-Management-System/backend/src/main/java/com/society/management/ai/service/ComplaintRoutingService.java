package com.society.management.ai.service;

import com.society.management.ai.dto.RoutingDecision;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Complaint;
import com.society.management.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * AI-powered complaint routing and classification service.
 *
 * <p>This implementation uses keyword-based classification as a fallback.
 * Replace the {@code classifyByKeyword()} call with a call to an NLP model
 * or Spring AI {@code ChatClient} for production use.</p>
 */
@Service
@RequiredArgsConstructor
public class ComplaintRoutingService {

    private static final Logger logger = LoggerFactory.getLogger(ComplaintRoutingService.class);

    private final ComplaintRepository complaintRepository;

    /**
     * Category keyword map — keys are complaint categories,
     * values are comma-separated keywords to match.
     */
    private static final Map<String, String[]> CATEGORY_KEYWORDS = new LinkedHashMap<>() {{
        put("ELECTRICAL",      new String[]{"electricity", "power", "light", "wiring", "socket", "switch", "fuse", "generator", "inverter"});
        put("PLUMBING",        new String[]{"water", "pipe", "leak", "drain", "tap", "toilet", "flush", "sewage", "clog", "plumb"});
        put("SECURITY",        new String[]{"security", "theft", "cctv", "camera", "guard", "gate", "access", "intruder", "lost"});
        put("CLEANING",        new String[]{"clean", "garbage", "dust", "waste", "hygiene", "sweep", "litter", "trash", "dirty"});
        put("LANDSCAPING",     new String[]{"garden", "plant", "tree", "grass", "lawn", "flower", "park", "landscape"});
        put("ADMINISTRATIVE",  new String[]{"parking", "noise", "neighbour", "rule", "regulation", "fee", "document", "admin", "noc"});
    }};

    /**
     * Priority keyword map — matched after category.
     */
    private static final Map<String, String[]> PRIORITY_KEYWORDS = new LinkedHashMap<>() {{
        put("CRITICAL", new String[]{"fire", "flood", "emergency", "urgent", "dangerous", "accident", "gas leak"});
        put("HIGH",     new String[]{"no water", "no electricity", "broken", "severe", "major", "immediately"});
        put("LOW",      new String[]{"minor", "small", "slight", "when possible", "not urgent"});
    }};

    /**
     * Routes a complaint by ID — classifies it and returns a routing decision.
     */
    public RoutingDecision routeComplaint(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + complaintId));

        String combined = (complaint.getTitle() + " " + complaint.getDescription()).toLowerCase();
        return classifyByKeyword(combined);
    }

    /**
     * Routes a complaint given raw title and description text (without DB lookup).
     */
    public RoutingDecision routeText(String title, String description) {
        String combined = (title + " " + description).toLowerCase();
        return classifyByKeyword(combined);
    }

    // ─── Internal classification ──────────────────────────────────────────────

    private RoutingDecision classifyByKeyword(String text) {
        String category = "OTHER";
        for (Map.Entry<String, String[]> entry : CATEGORY_KEYWORDS.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (text.contains(keyword)) {
                    category = entry.getKey();
                    break;
                }
            }
            if (!"OTHER".equals(category)) break;
        }

        String priority = "MEDIUM";  // default
        for (Map.Entry<String, String[]> entry : PRIORITY_KEYWORDS.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (text.contains(keyword)) {
                    priority = entry.getKey();
                    break;
                }
            }
            if (!"MEDIUM".equals(priority)) break;
        }

        logger.debug("Classified complaint → category={}, priority={}", category, priority);

        return RoutingDecision.builder()
                .category(category)
                .priority(priority)
                .recommendedAssignee(null)  // Can be enhanced to suggest specific staff
                .confidence(0.70)
                .aiPowered(false)
                .build();
    }
}
