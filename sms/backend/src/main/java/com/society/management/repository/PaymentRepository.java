package com.society.management.repository;

import com.society.management.model.Payment;
import com.society.management.model.enums.PaymentStatus;
import com.society.management.model.enums.PaymentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findBySocietyId(Long societyId, Pageable pageable);

    Page<Payment> findByUserId(Long userId, Pageable pageable);

    Page<Payment> findByUnitId(Long unitId, Pageable pageable);

    List<Payment> findBySocietyIdAndPaymentStatus(Long societyId, PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.society.id = :societyId AND p.paymentStatus = 'PENDING' AND p.dueDate < :today")
    List<Payment> findOverduePayments(@Param("societyId") Long societyId, @Param("today") LocalDate today);

    @Query("SELECT p FROM Payment p WHERE p.society.id = :societyId AND p.paymentType = :type AND p.dueDate BETWEEN :startDate AND :endDate")
    List<Payment> findByTypeAndDateRange(
            @Param("societyId") Long societyId,
            @Param("type") PaymentType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
