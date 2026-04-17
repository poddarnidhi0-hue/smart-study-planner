package com.studyplanner.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "focus_sessions")
public class FocusSession {

    @Id
    private String id;

    private String mode;
    private int durationMinutes;

    @CreatedDate
    private LocalDateTime completedAt;

    public FocusSession() {}

    // Getters
    public String getId()                { return id; }
    public String getMode()              { return mode; }
    public int getDurationMinutes()      { return durationMinutes; }
    public LocalDateTime getCompletedAt(){ return completedAt; }

    // Setters
    public void setId(String id)                 { this.id = id; }
    public void setMode(String mode)             { this.mode = mode; }
    public void setDurationMinutes(int d)        { this.durationMinutes = d; }
    public void setCompletedAt(LocalDateTime t)  { this.completedAt = t; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String mode;
        private int durationMinutes;

        public Builder mode(String m)         { this.mode = m; return this; }
        public Builder durationMinutes(int d) { this.durationMinutes = d; return this; }

        public FocusSession build() {
            FocusSession s = new FocusSession();
            s.mode = mode;
            s.durationMinutes = durationMinutes;
            return s;
        }
    }
}