package com.society.management.controller;

import com.society.management.dto.request.PaymentRequest;
import com.society.management.dto.response.ApiResponse;
import com.society.management.dto.response.PaymentDto;
import com.society.management.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Payment management REST controller.
 */
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment management APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/society/{societyId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get payments by society")
    public ResponseEntity<ApiResponse<Page<PaymentDto>>> getPaymentsBySociety(
            @PathVariable Long societyId,
            @PageableDefault(size = 20, sort = "dueDate") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved",
                paymentService.getPaymentsBySociety(societyId, pageable)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get payments by user")
    public ResponseEntity<ApiResponse<Page<PaymentDto>>> getPaymentsByUser(
            @PathVariable Long userId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("User payments retrieved",
                paymentService.getPaymentsByUser(userId, pageable)));
    }

    @GetMapping("/unit/{unitId}")
    @Operation(summary = "Get payments by unit")
    public ResponseEntity<ApiResponse<Page<PaymentDto>>> getPaymentsByUnit(
            @PathVariable Long unitId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Unit payments retrieved",
                paymentService.getPaymentsByUnit(unitId, pageable)));
    }

    @GetMapping("/society/{societyId}/overdue")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get overdue payments")
    public ResponseEntity<ApiResponse<List<PaymentDto>>> getOverduePayments(@PathVariable Long societyId) {
        return ResponseEntity.ok(ApiResponse.success("Overdue payments retrieved",
                paymentService.getOverduePayments(societyId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<ApiResponse<PaymentDto>> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved", paymentService.getPaymentById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Create payment")
    public ResponseEntity<ApiResponse<PaymentDto>> createPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment created", paymentService.createPayment(request)));
    }

    @PatchMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Mark payment as paid", description = "Record a payment as received")
    public ResponseEntity<ApiResponse<PaymentDto>> markAsPaid(
            @PathVariable Long id,
            @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payment marked as paid", paymentService.markAsPaid(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SOCIETY_ADMIN')")
    @Operation(summary = "Delete payment")
    public ResponseEntity<ApiResponse<Void>> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok(ApiResponse.success("Payment deleted"));
    }
}
