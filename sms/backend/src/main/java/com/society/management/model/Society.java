package com.society.management.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a residential society / housing complex.
 */
@Entity
@Table(name = "society")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Society extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 20)
    private String pincode;

    @Column(length = 100)
    @Builder.Default
    private String country = "India";

    @Column(name = "registration_number", unique = true, length = 100)
    private String registrationNumber;

    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    @Column(length = 255)
    private String email;

    @Column(length = 255)
    private String website;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "established_date")
    private LocalDate establishedDate;

    @Column(name = "total_units")
    @Builder.Default
    private Integer totalUnits = 0;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    // Relationships
    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Building> buildings = new ArrayList<>();

    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL)
    @Builder.Default
    private List<User> users = new ArrayList<>();
}
