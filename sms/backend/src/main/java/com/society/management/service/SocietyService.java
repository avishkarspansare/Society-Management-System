package com.society.management.service;

import com.society.management.dto.request.SocietyRequest;
import com.society.management.dto.response.DashboardStatsDto;
import com.society.management.dto.response.SocietyDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Society management service interface.
 */
public interface SocietyService {

    SocietyDto createSociety(SocietyRequest request);

    SocietyDto getSocietyById(Long id);

    Page<SocietyDto> getAllSocieties(Pageable pageable);

    SocietyDto updateSociety(Long id, SocietyRequest request);

    void deleteSociety(Long id);

    DashboardStatsDto getDashboardStats(Long societyId);
}
