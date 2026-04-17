package com.studyplanner.controller;

import com.studyplanner.dto.AuthRequest;
import com.studyplanner.dto.AuthResponse;
import com.studyplanner.model.User;
import com.studyplanner.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        if (req.getEmail() == null || req.getPassword() == null || req.getName() == null) {
            AuthResponse err = new AuthResponse();
            err.setMessage("Name, email and password are required");
            return ResponseEntity.badRequest().body(err);
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            AuthResponse err = new AuthResponse();
            err.setMessage("Email already registered");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail().toLowerCase());
        user.setPassword(req.getPassword());
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            new AuthResponse(saved.getId(), saved.getName(), saved.getEmail(), generateToken(saved.getId()))
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            AuthResponse err = new AuthResponse();
            err.setMessage("Email and password are required");
            return ResponseEntity.badRequest().body(err);
        }
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail().toLowerCase());
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(req.getPassword())) {
            AuthResponse err = new AuthResponse();
            err.setMessage("Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }
        User user = userOpt.get();
        return ResponseEntity.ok(
            new AuthResponse(user.getId(), user.getName(), user.getEmail(), generateToken(user.getId()))
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token");
        }
        String userId = extractUserId(auth.substring(7));
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        return userRepository.findById(userId)
            .map(u -> ResponseEntity.ok(new AuthResponse(u.getId(), u.getName(), u.getEmail(), auth.substring(7))))
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    private String generateToken(String userId) {
        String raw = userId + ":" + System.currentTimeMillis();
        return java.util.Base64.getEncoder().encodeToString(raw.getBytes());
    }

    private String extractUserId(String token) {
        try {
            return new String(java.util.Base64.getDecoder().decode(token)).split(":")[0];
        } catch (Exception e) { return null; }
    }
}