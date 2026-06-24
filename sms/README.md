# Society Management System

Full-stack society management platform built with **Spring Boot** (Java) + **React** + **PostgreSQL**.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, PostgreSQL
- **Frontend**: React 19, Redux Toolkit, React Router 6, Tailwind CSS 4, Vite
- **AI**: Anthropic Claude API for complaint routing & chatbot
- **Infra**: Docker + Docker Compose

## Project Structure
```
├── backend/           # Spring Boot API (runs on :8080)
├── frontend/          # React SPA (runs on :5173 dev / :3000 prod)
└── docker-compose.yml # PostgreSQL + backend + frontend
```

## Quick Start

### Prerequisites
- Java 17+, Maven 3.9+
- Node.js 20+
- PostgreSQL 15+ (or use Docker Compose)

### Backend
```bash
cd backend
cp .env.example .env          # fill in DB_PASSWORD, JWT_SECRET
./mvnw spring-boot:run
# API at http://localhost:8080
# Swagger at http://localhost:8080/swagger-ui.html
```

### Frontend
```bash
cd frontend
cp .env.example .env          # set VITE_API_URL=http://localhost:8080
npm install
npm run dev
# App at http://localhost:5173
```

### Docker Compose (all-in-one)
```bash
cp backend/.env.example backend/.env
docker-compose up -d
```

## Default Credentials
After first run, seed a super admin via:
```
POST /api/v1/auth/register
{
  "firstName": "Super",
  "lastName": "Admin",
  "email": "admin@society.com",
  "password": "Admin@1234",
  "phone": "9999999999",
  "userType": "SUPER_ADMIN"
}
```

## Features
| Module | Admin | Resident |
|--------|-------|----------|
| Dashboard | Stats + charts | Personal summary |
| Residents | Full CRUD | View profile |
| Units/Flats | Full CRUD | — |
| Payments | View all + reminders | View own |
| Complaints | View + update status | Submit + track |
| Visitors | View all + check-in/out | Register + view own |
| Announcements | Create + manage | Browse |
| Events | Create + manage | — |
| Amenities | Create + manage | Browse + book |
| AI Chatbot | — | Complaint auto-classify |
| Profile | Edit + change password | Edit + change password |

## API Docs
Swagger UI: `http://localhost:8080/swagger-ui.html`

## Environment Variables
See `backend/.env.example` for all required variables.
