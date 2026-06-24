package com.society.management.service;

import com.society.management.dto.request.VisitorRequest;
import com.society.management.dto.response.VisitorDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Visitor management operations.
 */
public interface VisitorService {

    VisitorDto registerVisitor(Long societyId, Long registeredByUserId, VisitorRequest request);

    VisitorDto checkIn(Long visitorId, Long securityUserId);

    VisitorDto checkOut(Long visitorId, Long securityUserId);

    VisitorDto getById(Long id);

    Page<VisitorDto> getBySociety(Long societyId, Pageable pageable);

    Page<VisitorDto> getByUnit(Long unitId, Pageable pageable);

    List<VisitorDto> getTodaysVisitors(Long societyId);

    List<VisitorDto> getActiveVisitors(Long societyId);
}
