package com.studyplanner.config;

import com.studyplanner.model.Task;
import com.studyplanner.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.logging.Logger;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = Logger.getLogger(DataSeeder.class.getName());
    private final TaskRepository taskRepository;

    public DataSeeder(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) {
        try {
            if (taskRepository.count() == 0) {
                log.info("Seeding demo tasks...");
                LocalDate today    = LocalDate.now();
                LocalDate tomorrow = today.plusDays(1);
                LocalDate nextWeek = today.plusDays(5);

                List<Task> seed = List.of(
                    Task.builder().title("Solve Integration Problems Set 3") .subject("Math")   .due(today)    .priority("high")  .done(false).build(),
                    Task.builder().title("Read Chapter 7 Electromagnetism")  .subject("Physics").due(today)    .priority("medium").done(true) .build(),
                    Task.builder().title("Implement Binary Search Tree")      .subject("CS")     .due(today)    .priority("high")  .done(false).build(),
                    Task.builder().title("Write essay outline Macbeth")       .subject("English").due(today)    .priority("low")   .done(true) .build(),
                    Task.builder().title("Review Thermodynamics notes")       .subject("Physics").due(tomorrow) .priority("medium").done(false).build(),
                    Task.builder().title("Practice Graph Algorithms")         .subject("CS")     .due(tomorrow) .priority("high")  .done(false).build(),
                    Task.builder().title("Math Assignment 3")                 .subject("Math")   .due(nextWeek) .priority("high")  .done(false).build(),
                    Task.builder().title("Physics Lab Report")                .subject("Physics").due(nextWeek) .priority("medium").done(false).build(),
                    Task.builder().title("English Essay Final Draft")         .subject("English").due(nextWeek) .priority("medium").done(false).build()
                );

                taskRepository.saveAll(seed);
                log.info("Seeded " + seed.size() + " tasks.");
            } else {
                log.info("Database already has data, skipping seed.");
            }
        } catch (Exception e) {
            log.warning("Could not connect to MongoDB on startup: " + e.getMessage());
            log.warning("App will still run - MongoDB will retry in background.");
        }
    }
}