package com.society.management.service;

import com.society.management.dto.request.UserRequest;
import com.society.management.dto.response.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * User management service interface.
 */
public interface UserService {

    UserDto createUser(UserRequest request);

    UserDto getUserById(Long id);

    UserDto getUserByEmail(String email);

    Page<UserDto> getAllUsers(Pageable pageable);

    Page<UserDto> getUsersBySociety(Long societyId, Pageable pageable);

    UserDto updateUser(Long id, UserRequest request);

    void deleteUser(Long id);

    void toggleUserStatus(Long id);
}
