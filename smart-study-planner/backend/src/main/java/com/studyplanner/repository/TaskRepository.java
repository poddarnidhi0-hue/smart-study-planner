package com.studyplanner.repository;

import com.studyplanner.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {

    // Find all tasks for a given subject
    List<Task> findBySubject(String subject);

    // Find all tasks due on a specific date
    List<Task> findByDue(LocalDate due);

    // Find tasks due on a date by completion status
    List<Task> findByDueAndDone(LocalDate due, boolean done);

    // Find all tasks by completion status
    List<Task> findByDone(boolean done);

    // Find tasks in a date range (for weekly planner)
    List<Task> findByDueBetween(LocalDate start, LocalDate end);

    // Count tasks by subject and done status
    long countBySubjectAndDone(String subject, boolean done);

    // Count tasks due today that are done
    long countByDueAndDone(LocalDate due, boolean done);
}
