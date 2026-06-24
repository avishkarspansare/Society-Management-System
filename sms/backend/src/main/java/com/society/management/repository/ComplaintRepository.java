package com.society.management.repository;

import com.society.management.model.Complaint;
import com.society.management.model.enums.ComplaintPriority;
import com.society.management.model.enums.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Page<Complaint> findBySocietyId(Long societyId, Pageable pageable);

    Page<Complaint> findByUserId(Long userId, Pageable pageable);

    List<Complaint> findBySocietyIdAndStatus(Long societyId, ComplaintStatus status);

    List<Complaint> findBySocietyIdAndPriority(Long societyId, ComplaintPriority priority);

    List<Complaint> findByAssignedToId(Long staffId);

    Page<Complaint> findBySocietyIdAndStatusIn(Long societyId, List<ComplaintStatus> statuses, Pageable pageable);
}
