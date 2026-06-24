package com.society.management.controller;

import com.society.management.ai.dto.ChatRequest;
import com.society.management.ai.dto.ChatResponse;
import com.society.management.ai.dto.RoutingDecision;
import com.society.management.ai.service.ChatbotService;
import com.society.management.ai.service.ComplaintRoutingService;
import com.society.management.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for AI-powered features.
 */
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI", description = "AI-powered features: chatbot and smart complaint routing")
public class AiController {

    private final ChatbotService chatbotService;
    private final ComplaintRoutingService routingService;

    @PostMapping("/chat")
    @Operation(summary = "Chat with the Society AI Assistant")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ChatResponse>> chat(@RequestBody ChatRequest request) {
        ChatResponse response = chatbotService.chat(request);
        return ResponseEntity.ok(ApiResponse.success(null, response));
    }

    @PostMapping("/complaints/route")
    @Operation(summary = "Smart-route a complaint by ID")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<RoutingDecision>> routeComplaint(
            @RequestBody Map<String, Long> body) {
        Long complaintId = body.get("complaintId");
        RoutingDecision decision = routingService.routeComplaint(complaintId);
        return ResponseEntity.ok(ApiResponse.success("Complaint routed", decision));
    }

    @PostMapping("/complaints/classify")
    @Operation(summary = "Classify complaint text without a DB lookup")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<RoutingDecision>> classifyText(
            @RequestBody Map<String, String> body) {
        String title = body.getOrDefault("title", "");
        String description = body.getOrDefault("description", "");
        RoutingDecision decision = routingService.routeText(title, description);
        return ResponseEntity.ok(ApiResponse.success("Classified", decision));
    }
}
