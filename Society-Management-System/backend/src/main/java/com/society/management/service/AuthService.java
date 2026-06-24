package com.society.management.service;

import com.society.management.dto.request.LoginRequest;
import com.society.management.dto.request.RegisterRequest;
import com.society.management.dto.response.AuthResponse;

/**
 * Authentication service interface.
 */
public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    AuthResponse refreshToken(String refreshToken);

    void logout(String email);
}
