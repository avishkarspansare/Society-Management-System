# Society Management System

A full-stack residential society management platform built with **Spring Boot** (Java) + **React** + **PostgreSQL**.

---

## 🚀 Quick Start

### Prerequisites
- Java 17+, Maven 3.9+
- Node.js 20+
- Docker & Docker Compose (optional)

---

## Option A – Docker Compose (Recommended)

```bash
# Copy env and start everything
cp backend/.env.example backend/.env
docker-compose up --build
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:8080
- Swagger UI → http://localhost:8080/swagger-ui.html

---

## Option B – Run Locally

### Backend

```bash
cd backend
cp .env.example .env        # fill in DB_PASSWORD, JWT_SECRET, etc.
mvn clean install -DskipTests
mvn spring-boot:run
```

The backend starts on port **8080**.

### Frontend

```bash
cd frontend
cp .env.example .env        # set VITE_API_URL=http://localhost:8080
npm install
npm run dev
```

The dev server starts on **http://localhost:5173**.

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Redux Toolkit, Tailwind CSS v4, Vite |
| Backend  | Spring Boot 3, Spring Security, Spring Data JPA |
| Database | PostgreSQL 15 |
| Auth     | JWT (RS256 / HS256) |
| Docs     | SpringDoc OpenAPI / Swagger UI |
| AI       | OpenAI API (chatbot + complaint routing) |

---

## 👥 User Roles

| Role | Access |
|------|--------|
| SUPER_ADMIN | Full system access |
| SOCIETY_ADMIN | Society-level management |
| COMMITTEE_MEMBER | Read + limited actions |
| RESIDENT | Own data + bookings |
| SECURITY | Visitor management |
| STAFF | Complaint handling |

### Default Admin Login
After first run, register a SUPER_ADMIN via `POST /api/v1/auth/register`.

---

## 📦 Features

### Admin Panel
- **Dashboard** – real-time stats, charts (payments, complaints trends)
- **Users** – add/edit/delete residents and staff
- **Units** – flat/villa management per building
- **Payments** – track dues, overdue, send reminders
- **Complaints** – assign, update status, resolve
- **Visitors** – check-in / check-out log
- **Announcements** – publish with type (URGENT / GENERAL / EVENT)
- **Events** – create and manage community events
- **Amenities** – manage bookable facilities

### Resident Portal
- **Dashboard** – pending dues, recent complaints, announcements
- **Payments** – view history, submit payment records
- **Complaints** – raise, track, follow up
- **Visitors** – pre-register guests
- **Announcements** – read society news
- **Amenities** – browse and book facilities

### AI Features
- **Chatbot** – society Q&A assistant (Claude/OpenAI)
- **Complaint Routing** – auto-assign to right department

---

## 🗂 Project Structure

```
Society-Management-System/
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/society/management/
│   │   ├── ai/              # AI chatbot & routing
│   │   ├── config/          # Security, CORS, Mail
│   │   ├── controller/      # REST endpoints
│   │   ├── dto/             # Request / Response DTOs
│   │   ├── exception/       # Global error handling
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Spring Data repos
│   │   ├── scheduler/       # Cron jobs
│   │   ├── security/        # JWT filter & provider
│   │   └── service/         # Business logic
│   └── pom.xml
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Layout, common UI
│   │   ├── hooks/           # useAuth, useApi
│   │   ├── pages/           # admin/, resident/, auth/, shared/
│   │   ├── routes/          # PrivateRoute
│   │   ├── services/        # Axios API wrappers
│   │   └── store/           # Redux slices
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

---

## 🔒 Environment Variables

### Backend (`backend/.env`)
```env
DB_PASSWORD=your_db_password
JWT_SECRET=your_256bit_secret_key
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your_app_password
OPENAI_API_KEY=sk-...
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8080
```

---

## 📚 API Documentation

After starting the backend, visit:
- Swagger UI → http://localhost:8080/swagger-ui.html
- OpenAPI JSON → http://localhost:8080/api-docs
