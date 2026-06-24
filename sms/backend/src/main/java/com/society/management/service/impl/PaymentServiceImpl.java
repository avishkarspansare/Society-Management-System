package com.society.management.service.impl;

import com.society.management.dto.request.PaymentRequest;
import com.society.management.dto.response.PaymentDto;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Payment;
import com.society.management.model.Society;
import com.society.management.model.Unit;
import com.society.management.model.User;
import com.society.management.model.enums.PaymentStatus;
import com.society.management.repository.PaymentRepository;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UnitRepository;
import com.society.management.repository.UserRepository;
import com.society.management.service.PaymentService;
import com.society.management.util.DateUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of payment management operations.
 */
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentRepository paymentRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;
    private final UnitRepository unitRepository;

    @Override
    @Transactional
    public PaymentDto createPayment(PaymentRequest request) {
        Society society = societyRepository.findById(request.getSocietyId())
                .orElseThrow(() -> new ResourceNotFoundException("Society", "id", request.getSocietyId()));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException("Unit", "id", request.getUnitId()));

        BigDecimal lateFee = request.getLateFee() != null ? request.getLateFee() : BigDecimal.ZERO;

        Payment payment = Payment.builder()
                .society(society)
                .user(user)
                .unit(unit)
                .paymentType(request.getPaymentType())
                .amount(request.getAmount())
                .lateFee(lateFee)
                .dueDate(request.getDueDate())
                .paymentStatus(PaymentStatus.PENDING)
                .notes(request.getNotes())
                .build();

        // Auto-mark as overdue if due date is in the past
        if (DateUtils.isOverdue(request.getDueDate())) {
            payment.setPaymentStatus(PaymentStatus.OVERDUE);
        }

        Payment saved = paymentRepository.save(payment);
        logger.info("Payment created: type={}, amount={}, user={}", saved.getPaymentType(), saved.getAmount(), user.getEmail());
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDto getPaymentById(Long id) {
        return mapToDto(paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentDto> getPaymentsBySociety(Long societyId, Pageable pageable) {
        return paymentRepository.findBySocietyId(societyId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentDto> getPaymentsByUser(Long userId, Pageable pageable) {
        return paymentRepository.findByUserId(userId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentDto> getPaymentsByUnit(Long unitId, Pageable pageable) {
        return paymentRepository.findByUnitId(unitId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional
    public PaymentDto markAsPaid(Long id, PaymentRequest request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setPaidDate(request.getPaidDate() != null ? request.getPaidDate() : LocalDate.now());
        payment.setPaymentMode(request.getPaymentMode());
        payment.setTransactionId(request.getTransactionId());

        // Generate receipt number if not already set
        if (payment.getReceiptNumber() == null) {
            payment.setReceiptNumber("RCT-" + System.currentTimeMillis() + "-" +
                    UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }

        Payment updated = paymentRepository.save(payment);
        logger.info("Payment marked as paid: ID={}, receipt={}", id, updated.getReceiptNumber());
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDto> getOverduePayments(Long societyId) {
        return paymentRepository.findOverduePayments(societyId, DateUtils.today())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        paymentRepository.delete(payment);
        logger.info("Payment deleted: ID={}", id);
    }

    private PaymentDto mapToDto(Payment p) {
        return PaymentDto.builder()
                .id(p.getId())
                .societyId(p.getSociety().getId())
                .userId(p.getUser().getId())
                .userName(p.getUser().getFullName())
                .unitId(p.getUnit().getId())
                .unitNumber(p.getUnit().getUnitNumber())
                .paymentType(p.getPaymentType())
                .amount(p.getAmount())
                .lateFee(p.getLateFee())
                .totalAmount(p.getTotalAmount())
                .dueDate(p.getDueDate())
                .paidDate(p.getPaidDate())
                .paymentStatus(p.getPaymentStatus())
                .paymentMode(p.getPaymentMode())
                .transactionId(p.getTransactionId())
                .receiptNumber(p.getReceiptNumber())
                .notes(p.getNotes())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
