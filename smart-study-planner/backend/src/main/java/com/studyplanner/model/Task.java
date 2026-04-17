package com.studyplanner.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Due date is required")
    private LocalDate due;

    private String priority = "medium";
    private boolean done = false;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public Task() {}

    // Getters
    public String getId()               { return id; }
    public String getTitle()            { return title; }
    public String getSubject()          { return subject; }
    public LocalDate getDue()           { return due; }
    public String getPriority()         { return priority; }
    public boolean isDone()             { return done; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(String id)              { this.id = id; }
    public void setTitle(String title)        { this.title = title; }
    public void setSubject(String subject)    { this.subject = subject; }
    public void setDue(LocalDate due)         { this.due = due; }
    public void setPriority(String p)         { this.priority = p; }
    public void setDone(boolean done)         { this.done = done; }
    public void setCreatedAt(LocalDateTime t) { this.createdAt = t; }
    public void setUpdatedAt(LocalDateTime t) { this.updatedAt = t; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id, title, subject, priority = "medium";
        private LocalDate due;
        private boolean done = false;

        public Builder id(String id)      { this.id = id; return this; }
        public Builder title(String t)    { this.title = t; return this; }
        public Builder subject(String s)  { this.subject = s; return this; }
        public Builder due(LocalDate d)   { this.due = d; return this; }
        public Builder priority(String p) { this.priority = p; return this; }
        public Builder done(boolean d)    { this.done = d; return this; }

        public Task build() {
            Task t = new Task();
            t.id = id; t.title = title; t.subject = subject;
            t.due = due; t.priority = priority; t.done = done;
            return t;
        }
    }
}