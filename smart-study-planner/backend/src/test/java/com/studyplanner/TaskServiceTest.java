package com.studyplanner;

import com.studyplanner.dto.TaskRequest;
import com.studyplanner.model.Task;
import com.studyplanner.repository.TaskRepository;
import com.studyplanner.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        sampleTask = Task.builder()
            .id("abc123")
            .title("Test Task")
            .subject("Math")
            .due(LocalDate.now())
            .priority("high")
            .done(false)
            .build();
    }

    @Test
    void getAllTasks_shouldReturnAllTasks() {
        when(taskRepository.findAll()).thenReturn(List.of(sampleTask));
        List<Task> tasks = taskService.getAllTasks();
        assertThat(tasks).hasSize(1);
        assertThat(tasks.get(0).getTitle()).isEqualTo("Test Task");
    }

    @Test
    void createTask_shouldSaveAndReturnTask() {
        TaskRequest req = new TaskRequest();
        req.setTitle("New Task");
        req.setSubject("CS");
        req.setDue(LocalDate.now());
        req.setPriority("medium");

        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        Task result = taskService.createTask(req);
        assertThat(result).isNotNull();
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void toggleTask_shouldFlipDoneStatus() {
        when(taskRepository.findById("abc123")).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task toggled = taskService.toggleTask("abc123");
        assertThat(toggled.isDone()).isTrue();
    }

    @Test
    void deleteTask_shouldCallRepositoryDelete() {
        doNothing().when(taskRepository).deleteById("abc123");
        taskService.deleteTask("abc123");
        verify(taskRepository, times(1)).deleteById("abc123");
    }
}
