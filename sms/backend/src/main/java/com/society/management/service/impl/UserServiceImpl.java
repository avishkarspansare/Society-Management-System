package com.society.management.service.impl;

import com.society.management.dto.request.UserRequest;
import com.society.management.dto.response.UserDto;
import com.society.management.exception.ConflictException;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.model.Society;
import com.society.management.model.Unit;
import com.society.management.model.User;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UnitRepository;
import com.society.management.repository.UserRepository;
import com.society.management.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Implementation of user management operations.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final SocietyRepository societyRepository;
    private final UnitRepository unitRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDto createUser(UserRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already registered: " + request.getEmail());
        }

        // Check for duplicate phone
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new ConflictException("Phone number already registered: " + request.getPhone());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .userType(request.getUserType())
                .address(request.getAddress())
                .profileImageUrl(request.getProfileImageUrl())
                .isActive(true)
                .isVerified(false)
                .build();

        // Set password if provided
        if (StringUtils.hasText(request.getPassword())) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        } else {
            // Default password for admin-created users
            user.setPasswordHash(passwordEncoder.encode("ChangeMe@123"));
        }

        // Link to society
        if (request.getSocietyId() != null) {
            Society society = societyRepository.findById(request.getSocietyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Society", "id", request.getSocietyId()));
            user.setSociety(society);
        }

        // Link to unit
        if (request.getUnitId() != null) {
            Unit unit = unitRepository.findById(request.getUnitId())
                    .orElseThrow(() -> new ResourceNotFoundException("Unit", "id", request.getUnitId()));
            user.setUnit(unit);
        }

        User savedUser = userRepository.save(user);
        logger.info("User created: {} ({})", savedUser.getEmail(), savedUser.getUserType());
        return mapToDto(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDto> getUsersBySociety(Long societyId, Pageable pageable) {
        return userRepository.findBySocietyId(societyId, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Check email uniqueness if changed
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already in use: " + request.getEmail());
        }

        // Check phone uniqueness if changed
        if (!user.getPhone().equals(request.getPhone()) && userRepository.existsByPhone(request.getPhone())) {
            throw new ConflictException("Phone already in use: " + request.getPhone());
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setUserType(request.getUserType());
        user.setAddress(request.getAddress());
        user.setProfileImageUrl(request.getProfileImageUrl());

        // Update password if provided
        if (StringUtils.hasText(request.getPassword())) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        // Update society link
        if (request.getSocietyId() != null) {
            Society society = societyRepository.findById(request.getSocietyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Society", "id", request.getSocietyId()));
            user.setSociety(society);
        }

        // Update unit link
        if (request.getUnitId() != null) {
            Unit unit = unitRepository.findById(request.getUnitId())
                    .orElseThrow(() -> new ResourceNotFoundException("Unit", "id", request.getUnitId()));
            user.setUnit(unit);
        }

        User updatedUser = userRepository.save(user);
        logger.info("User updated: {}", updatedUser.getEmail());
        return mapToDto(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
        logger.info("User deleted: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        logger.info("User status toggled: {} -> active={}", user.getEmail(), user.getIsActive());
    }

    /**
     * Maps User entity to UserDto.
     */
    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .userType(user.getUserType())
                .societyId(user.getSociety() != null ? user.getSociety().getId() : null)
                .societyName(user.getSociety() != null ? user.getSociety().getName() : null)
                .unitId(user.getUnit() != null ? user.getUnit().getId() : null)
                .unitNumber(user.getUnit() != null ? user.getUnit().getUnitNumber() : null)
                .profileImageUrl(user.getProfileImageUrl())
                .address(user.getAddress())
                .isVerified(user.getIsVerified())
                .isActive(user.getIsActive())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
