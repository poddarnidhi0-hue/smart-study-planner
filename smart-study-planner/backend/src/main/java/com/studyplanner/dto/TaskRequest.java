package com.studyplanner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Due date is required")
    private LocalDate due;

    private String priority = "medium";

    public TaskRequest() {}

    public String getTitle()    { return title; }
    public String getSubject()  { return subject; }
    public LocalDate getDue()   { return due; }
    public String getPriority() { return priority; }

    public void setTitle(String title)       { this.title = title; }
    public void setSubject(String subject)   { this.subject = subject; }
    public void setDue(LocalDate due)        { this.due = due; }
    public void setPriority(String priority) { this.priority = priority; }
}