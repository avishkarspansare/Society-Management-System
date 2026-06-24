package com.society.management.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a building/block within a society.
 */
@Entity
@Table(name = "building",
       uniqueConstraints = @UniqueConstraint(
           name = "unique_building_per_society",
           columnNames = {"society_id", "name"}
       ))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Building extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @Column(nullable = false)
    private String name;

    @Column(name = "total_floors")
    private Integer totalFloors;

    @Column(name = "total_units")
    @Builder.Default
    private Integer totalUnits = 0;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    // Relationships
    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Unit> units = new ArrayList<>();
}
