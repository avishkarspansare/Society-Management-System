package com.society.management.service.impl;

import com.society.management.dto.request.LoginRequest;
import com.society.management.dto.request.RegisterRequest;
import com.society.management.dto.response.AuthResponse;
import com.society.management.exception.BadRequestException;
import com.society.management.exception.ConflictException;
import com.society.management.model.Society;
import com.society.management.model.User;
import com.society.management.model.enums.UserType;
import com.society.management.repository.SocietyRepository;
import com.society.management.repository.UserRepository;
import com.society.management.security.JwtTokenProvider;
import com.society.management.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Implementation of authentication operations.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final SocietyRepository societyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Update last login
        user.setLastLogin(Instant.now());
        userRepository.save(user);

        // Generate tokens with user type claim
        Map<String, Object> claims = new HashMap<>();
        claims.put("userType", user.getUserType().name());
        if (user.getSociety() != null) {
            claims.put("societyId", user.getSociety().getId());
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), claims);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        logger.info("User logged in: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpirationMs() / 1000)
                .user(buildUserInfo(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already registered: " + request.getEmail());
        }

        // Check for duplicate phone
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new ConflictException("Phone number already registered: " + request.getPhone());
        }

        // Build user entity
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .userType(request.getUserType())
                .address(request.getAddress())
                .isActive(true)
                .isVerified(false)
                .build();

        // Link to society if provided
        if (request.getSocietyId() != null) {
            Society society = societyRepository.findById(request.getSocietyId())
                    .orElseThrow(() -> new BadRequestException("Society not found with id: " + request.getSocietyId()));
            user.setSociety(society);
        }

        User savedUser = userRepository.save(user);

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(savedUser.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getEmail());

        logger.info("New user registered: {} ({})", savedUser.getEmail(), savedUser.getUserType());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpirationMs() / 1000)
                .user(buildUserInfo(savedUser))
                .build();
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        String email = jwtTokenProvider.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(email);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpirationMs() / 1000)
                .user(buildUserInfo(user))
                .build();
    }

    @Override
    public void logout(String email) {
        // In a stateless JWT setup, logout is handled client-side by discarding the token.
        // For enhanced security, implement a token blacklist using Redis.
        logger.info("User logged out: {}", email);
    }

    private AuthResponse.UserInfo buildUserInfo(User user) {
        return AuthResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userType(user.getUserType())
                .societyId(user.getSociety() != null ? user.getSociety().getId() : null)
                .build();
    }
}
