package com.studyplanner.controller;

import com.studyplanner.model.FocusSession;
import com.studyplanner.repository.FocusSessionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final FocusSessionRepository sessionRepository;

    public SessionController(FocusSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @GetMapping
    public ResponseEntity<List<FocusSession>> getAllSessions() {
        return ResponseEntity.ok(sessionRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<FocusSession> createSession(@RequestBody Map<String, String> body) {
        String mode = body.getOrDefault("mode", "pomodoro");
        int duration = switch (mode) {
            case "short"  -> 5;
            case "long"   -> 15;
            case "custom" -> 45;
            default       -> 25;
        };
        FocusSession session = FocusSession.builder()
            .mode(mode)
            .durationMinutes(duration)
            .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionRepository.save(session));
    }
}