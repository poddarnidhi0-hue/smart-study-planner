package com.studyplanner.service;

import com.studyplanner.dto.TaskRequest;
import com.studyplanner.model.Task;
import com.studyplanner.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.logging.Logger;

@Service
public class TaskService {

    private static final Logger log = Logger.getLogger(TaskService.class.getName());
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksBySubject(String subject) {
        return taskRepository.findBySubject(subject);
    }

    public List<Task> getTodayTasks() {
        return taskRepository.findByDue(LocalDate.now());
    }

    public List<Task> getWeekTasks() {
        LocalDate today    = LocalDate.now();
        LocalDate sunday   = today.minusDays(today.getDayOfWeek().getValue() % 7);
        LocalDate saturday = sunday.plusDays(6);
        return taskRepository.findByDueBetween(sunday, saturday);
    }

    public Task createTask(TaskRequest req) {
        Task task = Task.builder()
            .title(req.getTitle())
            .subject(req.getSubject())
            .due(req.getDue())
            .priority(req.getPriority())
            .done(false)
            .build();
        Task saved = taskRepository.save(task);
        log.info("Created task: " + saved.getId());
        return saved;
    }

    public Task updateTask(String id, TaskRequest req) {
        Task existing = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found: " + id));
        existing.setTitle(req.getTitle());
        existing.setSubject(req.getSubject());
        existing.setDue(req.getDue());
        existing.setPriority(req.getPriority());
        return taskRepository.save(existing);
    }

    public Task toggleTask(String id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found: " + id));
        task.setDone(!task.isDone());
        return taskRepository.save(task);
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
        log.info("Deleted task: " + id);
    }
}