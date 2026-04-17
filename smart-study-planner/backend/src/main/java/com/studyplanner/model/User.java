package com.studyplanner.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    @CreatedDate
    private LocalDateTime createdAt;

    public User() {}

    public String getId()               { return id; }
    public String getName()             { return name; }
    public String getEmail()            { return email; }
    public String getPassword()         { return password; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(String id)               { this.id = id; }
    public void setName(String name)           { this.name = name; }
    public void setEmail(String email)         { this.email = email; }
    public void setPassword(String password)   { this.password = password; }
    public void setCreatedAt(LocalDateTime t)  { this.createdAt = t; }
}