package com.studyplanner.dto;

public class AuthResponse {
    private String id;
    private String name;
    private String email;
    private String token;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String id, String name, String email, String token) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.token = token;
    }

    public String getId()      { return id; }
    public String getName()    { return name; }
    public String getEmail()   { return email; }
    public String getToken()   { return token; }
    public String getMessage() { return message; }

    public void setId(String id)           { this.id = id; }
    public void setName(String name)       { this.name = name; }
    public void setEmail(String email)     { this.email = email; }
    public void setToken(String token)     { this.token = token; }
    public void setMessage(String message) { this.message = message; }
}