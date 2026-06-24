package com.society.management.repository;

import com.society.management.model.Society;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocietyRepository extends JpaRepository<Society, Long> {

    Optional<Society> findByRegistrationNumber(String registrationNumber);

    boolean existsByRegistrationNumber(String registrationNumber);

    Page<Society> findByIsActiveTrue(Pageable pageable);

    Page<Society> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Optional<Society> findByEmail(String email);
}
