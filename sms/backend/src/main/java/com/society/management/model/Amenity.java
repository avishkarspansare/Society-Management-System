package com.society.management.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * A shared facility in the society (e.g., clubhouse, gym, swimming pool).
 */
@Entity
@Table(name = "amenity",
       indexes = {
           @Index(name = "idx_amenity_society_id", columnList = "society_id"),
           @Index(name = "idx_amenity_is_active",  columnList = "is_active")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Amenity extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** Maximum number of concurrent users. */
    @Column(name = "capacity")
    private Integer capacity;

    /** Cost per hour to book (0 = free). */
    @Column(name = "hourly_rate", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal hourlyRate = BigDecimal.ZERO;

    /** Days available — stored as comma-separated day names, e.g. "MON,TUE,WED". */
    @Column(name = "available_days", length = 100)
    private String availableDays;

    /** Opening time in HH:mm format. */
    @Column(name = "open_time", length = 10)
    private String openTime;

    /** Closing time in HH:mm format. */
    @Column(name = "close_time", length = 10)
    private String closeTime;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @ElementCollection
    @CollectionTable(name = "amenity_images",
                     joinColumns = @JoinColumn(name = "amenity_id"))
    @Column(name = "url", length = 500)
    private List<String> imageUrls;
}
