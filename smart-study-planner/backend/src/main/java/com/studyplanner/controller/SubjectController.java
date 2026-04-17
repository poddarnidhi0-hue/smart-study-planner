package com.studyplanner.controller;

import com.studyplanner.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final TaskRepository taskRepository;

    public SubjectController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    private static final List<Map<String, Object>> SUBJECTS = List.of(
        Map.of("key", "Math",    "label", "Mathematics",     "color", "#e8a630"),
        Map.of("key", "Physics", "label", "Physics",          "color", "#5b9bd5"),
        Map.of("key", "CS",      "label", "Computer Science", "color", "#5fba7d"),
        Map.of("key", "English", "label", "English",          "color", "#b97de8")
    );

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getSubjects() {
        List<Map<String, Object>> enriched = SUBJECTS.stream().map(s -> {
            String key   = (String) s.get("key");
            long total   = taskRepository.findBySubject(key).size();
            long pending = taskRepository.countBySubjectAndDone(key, false);
            return Map.of(
                "key",     key,
                "label",   s.get("label"),
                "color",   s.get("color"),
                "total",   total,
                "pending", pending
            );
        }).toList();
        return ResponseEntity.ok(enriched);
    }
}