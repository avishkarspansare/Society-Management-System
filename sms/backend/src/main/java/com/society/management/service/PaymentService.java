package com.society.management.service;

import com.society.management.dto.request.PaymentRequest;
import com.society.management.dto.response.PaymentDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Payment management service interface.
 */
public interface PaymentService {

    PaymentDto createPayment(PaymentRequest request);

    PaymentDto getPaymentById(Long id);

    Page<PaymentDto> getPaymentsBySociety(Long societyId, Pageable pageable);

    Page<PaymentDto> getPaymentsByUser(Long userId, Pageable pageable);

    Page<PaymentDto> getPaymentsByUnit(Long unitId, Pageable pageable);

    PaymentDto markAsPaid(Long id, PaymentRequest request);

    List<PaymentDto> getOverduePayments(Long societyId);

    void deletePayment(Long id);
}
