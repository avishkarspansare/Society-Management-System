package com.society.management.repository;

import com.society.management.model.User;
import com.society.management.model.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    List<User> findBySocietyIdAndUserType(Long societyId, UserType userType);

    Page<User> findBySocietyId(Long societyId, Pageable pageable);

    List<User> findBySocietyId(Long societyId);

    @Query("SELECT u FROM User u WHERE u.society.id = :societyId AND u.isActive = true")
    List<User> findActiveBySocietyId(@Param("societyId") Long societyId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.unit WHERE u.society.id = :societyId")
    List<User> findBySocietyIdWithUnit(@Param("societyId") Long societyId);

    boolean existsBySocietyIdAndPhone(Long societyId, String phone);

    boolean existsBySocietyIdAndEmail(Long societyId, String email);
}
