package com.society.management.model;

import com.society.management.model.enums.UnitStatus;
import com.society.management.model.enums.UnitType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Represents a flat/apartment/shop unit within a building.
 */
@Entity
@Table(name = "unit",
       uniqueConstraints = @UniqueConstraint(
           name = "unique_unit_per_building",
           columnNames = {"building_id", "unit_number"}
       ))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Unit extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;

    @Column(name = "unit_number", nullable = false, length = 50)
    private String unitNumber;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit_type", length = 50)
    private UnitType unitType;

    @Column(name = "area_sqft", precision = 10, scale = 2)
    private BigDecimal areaSqft;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id")
    private User tenant;

    @Column(name = "is_occupied")
    @Builder.Default
    private Boolean isOccupied = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    @Builder.Default
    private UnitStatus status = UnitStatus.ACTIVE;
}
