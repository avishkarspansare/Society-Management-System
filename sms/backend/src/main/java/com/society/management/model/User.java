package com.society.management.model;

import com.society.management.model.enums.UserType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Represents a system user (admin, resident, security, staff, etc.).
 */
@Entity
@Table(name = "users",
       uniqueConstraints = {
           @UniqueConstraint(name = "uq_users_email", columnNames = {"email"}),
           @UniqueConstraint(name = "uq_users_phone", columnNames = {"phone"})
       },
       indexes = {
           @Index(name = "idx_users_society_id", columnList = "society_id"),
           @Index(name = "idx_users_email", columnList = "email"),
           @Index(name = "idx_users_phone", columnList = "phone"),
           @Index(name = "idx_users_user_type", columnList = "user_type")
       })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id")
    private Society society;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false, length = 50)
    private UserType userType;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(columnDefinition = "TEXT")
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "last_login")
    private Instant lastLogin;

    /**
     * Returns the user's full name.
     */
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
