package com.example.tpo.service;

import com.example.tpo.dto.LoginRequest;
import com.example.tpo.dto.LoginResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private static final String STATIC_EMAIL = "admin@gmail.com";
    private static final String STATIC_PASSWORD = "12345678";

    public LoginResponse authenticate(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Email and password are required")
                    .build();
        }

        if (STATIC_EMAIL.equalsIgnoreCase(request.getEmail().trim()) &&
            STATIC_PASSWORD.equals(request.getPassword())) {
            
            String token = "tpo_token_" + UUID.randomUUID().toString();
            return LoginResponse.builder()
                    .success(true)
                    .message("Login successful")
                    .token(token)
                    .email(STATIC_EMAIL)
                    .role("ADMIN")
                    .build();
        }

        return LoginResponse.builder()
                .success(false)
                .message("Invalid email or password")
                .build();
    }
}
