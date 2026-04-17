package com.studyplanner.service;

import com.studyplanner.dto.DashboardStats;
import com.studyplanner.repository.FocusSessionRepository;
import com.studyplanner.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class StatsService {

    private final TaskRepository taskRepository;
    private final FocusSessionRepository sessionRepository;

    public StatsService(TaskRepository taskRepository, FocusSessionRepository sessionRepository) {
        this.taskRepository = taskRepository;
        this.sessionRepository = sessionRepository;
    }

    public DashboardStats getDashboard() {
        LocalDate today    = LocalDate.now();
        LocalDateTime dayStart = today.atStartOfDay();
        LocalDateTime dayEnd   = today.atTime(23, 59, 59);

        long totalTasks     = taskRepository.count();
        long completedToday = taskRepository.countByDueAndDone(today, true);
        long pendingToday   = taskRepository.countByDueAndDone(today, false);
        long totalCompleted = taskRepository.findByDone(true).size();
        long totalPending   = taskRepository.findByDone(false).size();
        long focusToday     = sessionRepository.countByCompletedAtBetween(dayStart, dayEnd);

        return new DashboardStats(totalTasks, completedToday, pendingToday,
                                  totalCompleted, totalPending, focusToday, 7);
    }
}