package com.society.management.service;

import com.society.management.dto.request.ComplaintRequest;
import com.society.management.dto.response.ComplaintDto;
import com.society.management.model.enums.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Complaint management service interface.
 */
public interface ComplaintService {

    ComplaintDto createComplaint(ComplaintRequest request);

    ComplaintDto getComplaintById(Long id);

    Page<ComplaintDto> getComplaintsBySociety(Long societyId, Pageable pageable);

    Page<ComplaintDto> getComplaintsByUser(Long userId, Pageable pageable);

    ComplaintDto updateStatus(Long id, ComplaintStatus status, String closureReason);

    ComplaintDto assignComplaint(Long id, Long staffId);

    ComplaintDto resolveComplaint(Long id, Long resolvedById, String closureReason);

    void deleteComplaint(Long id);
}
