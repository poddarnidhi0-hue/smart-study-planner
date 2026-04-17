# Smart Study Planner — Full Stack Application

## Tech Stack
- **Frontend**: React JS, HTML, CSS, JavaScript
- **Backend**: Java 17, Spring Boot 3.x, REST API
- **Database**: MongoDB with Spring Data MongoDB (Hibernate/JPA pattern)
- **Tools**: Git, Postman
- **Deployment**: Cloud-based (Docker-ready)

---

## Project Structure

```
smart-study-planner/
├── frontend/          # React JS app
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page-level components
│   │   ├── services/     # API service calls
│   │   ├── context/      # React Context (global state)
│   │   └── hooks/        # Custom React hooks
│   └── package.json
└── backend/           # Spring Boot app
    └── src/main/java/com/studyplanner/
        ├── controller/   # REST Controllers
        ├── service/      # Business logic
        ├── repository/   # MongoDB repositories
        ├── model/        # Entity classes
        ├── dto/          # Data Transfer Objects
        └── config/       # CORS, Security config
```

---

## Getting Started

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### MongoDB
- Install MongoDB locally OR use MongoDB Atlas (cloud)
- Default connection: `mongodb://localhost:27017/studyplanner`
- Configure in `backend/src/main/resources/application.properties`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |
| PATCH | `/api/tasks/{id}/toggle` | Toggle task completion |
| GET | `/api/subjects` | Get all subjects |
| GET | `/api/stats` | Get dashboard statistics |
| GET | `/api/sessions` | Get focus sessions |
| POST | `/api/sessions` | Save focus session |
