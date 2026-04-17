package com.studyplanner.repository;

import com.studyplanner.model.FocusSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FocusSessionRepository extends MongoRepository<FocusSession, String> {

    List<FocusSession> findByCompletedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByCompletedAtBetween(LocalDateTime start, LocalDateTime end);
}
