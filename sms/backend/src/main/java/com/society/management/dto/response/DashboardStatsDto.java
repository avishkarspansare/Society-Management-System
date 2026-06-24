package com.society.management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * Aggregated dashboard statistics for a society.
 */
@Data
@Builder
public class DashboardStatsDto {

    // Units
    private long totalUnits;
    private long occupiedUnits;
    private long vacantUnits;

    // Residents
    private long totalResidents;

    // Payments
    private long pendingPayments;
    private long overduePayments;
    private BigDecimal totalCollectedThisMonth;
    private BigDecimal totalDueThisMonth;

    // Complaints
    private long openComplaints;
    private long inProgressComplaints;
    private long resolvedComplaintsThisMonth;

    // Visitors
    private long visitorsToday;
    private long activeVisitors;

    // Events / Announcements
    private long upcomingEvents;
    private long activeAnnouncements;

    // Recent items for quick-view (optional, lightweight)
    private List<AnnouncementDto> recentAnnouncements;
}
