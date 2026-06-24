# Society Management System - Comprehensive Plan

> **Tech Stack:** Java (Spring Boot) + Maven + JAR + React + PostgreSQL + AI Integration
> **Version:** 1.0.0
> **Last Updated:** June 23, 2026

---

## 📋 Table of Contents

1. [Overview & Objectives](#1-overview--objectives)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Database Design](#5-database-design)
6. [Design Patterns](#6-design-patterns)
7. [AI Integration](#7-ai-integration)
8. [API Design](#8-api-design)
9. [Feature List](#9-feature-list)
10. [Development Pipeline](#10-development-pipeline)
11. [Coding Standards](#11-coding-standards)
12. [Security Considerations](#12-security-considerations)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment Strategy](#14-deployment-strategy)
15. [Monitoring & Maintenance](#15-monitoring--maintenance)

---

## 1. Overview & Objectives

### 1.1 Purpose
The Society Management System is a comprehensive digital platform designed to streamline and automate the management of residential societies, housing complexes, and community associations. It provides an integrated solution for administrators, residents, and service providers to manage daily operations efficiently.

### 1.2 Key Objectives
- Automate society administrative tasks
- Provide transparent communication channels
- Enable online payment processing
- Manage visitor and security operations
- Facilitate community engagement
- Integrate AI for predictive maintenance and smart recommendations
- Ensure data security and compliance

### 1.3 Target Users
| User Type | Description |
|-----------|-------------|
| Super Admin | System administrator with full access |
| Society Admin | Society-level administrator |
| Committee Members | Elected committee members |
| Residents | Society residents/owners |
| Security Staff | Security personnel |
| Service Providers | Vendors and maintenance staff |
| Visitors | Temporary visitors |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```mermaid
flowchart TB
    subgraph Client
        A[React Web App] -->|HTTPS| B[API Gateway]
        C[React Admin App] -->|HTTPS| B
        D[Mobile App] -->|HTTPS| B
    end
    
    subgraph Backend
        B --> E[Spring Boot Application]
        E --> F[PostgreSQL]
        E --> G[Redis Cache]
        E --> H[File Storage]
        E --> I[AI Services]
    end
    
    subgraph External
        I --> J[OpenAI API]
        I --> K[Custom ML Models]
        E --> L[Payment Gateway]
        E --> M[SMS Gateway]
        E --> N[Email Service]
    end
```

### 2.2 Architecture Style
- **Backend:** Layered Architecture (Controller-Service-Repository)
- **Frontend:** Component-Based Architecture with State Management
- **Overall:** Microservices-Ready (Modular design for future scaling)

### 2.3 System Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | React 18+ | User interface for all user types |
| Backend | Spring Boot 3.x | Business logic and API layer |
| Database | PostgreSQL 15+ | Persistent data storage |
| Cache | Redis | Session and frequent data caching |
| API Gateway | Spring Cloud Gateway | Request routing and load balancing |
| File Storage | AWS S3 / Local | Document and image storage |
| AI Engine | Python + Spring AI | Predictive analytics and recommendations |
| Message Broker | RabbitMQ | Asynchronous event processing |

---

## 3. Technology Stack

### 3.1 Backend Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Spring Boot | 3.2.x | Core application framework |
| Build Tool | Apache Maven | 3.9.x | Dependency management and build |
| Packaging | JAR | - | Executable JAR with embedded Tomcat |
| Language | Java | 17+ | Core programming language |
| ORM | Spring Data JPA | 3.2.x | Database interaction |
| Database | PostgreSQL | 15+ | Primary database |
| Cache | Spring Data Redis | 3.2.x | Caching layer |
| API | Spring Web MVC | 6.1.x | REST API development |
| Security | Spring Security | 6.2.x | Authentication and authorization |
| Validation | Hibernate Validator | 8.x | Input validation |
| Documentation | SpringDoc OpenAPI | 2.3.x | API documentation |
| Testing | JUnit 5 | 5.10.x | Unit testing |
| Testing | Mockito | 5.x | Mocking framework |
| Testing | Testcontainers | - | Integration testing |

### 3.2 Frontend Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | React | 18.x | UI framework |
| State Management | Redux Toolkit | 2.x | Global state management |
| Routing | React Router | 6.x | Client-side routing |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| UI Components | Material-UI / Chakra UI | Latest | Pre-built components |
| Forms | React Hook Form | 7.x | Form handling |
| HTTP Client | Axios | 1.x | API communication |
| Testing | Jest | 29.x | Unit testing |
| Testing | React Testing Library | 14.x | Component testing |

### 3.3 DevOps & Tools

| Category | Technology | Purpose |
|----------|------------|---------|
| Version Control | Git | Source code management |
| CI/CD | GitHub Actions / Jenkins | Automated pipeline |
| Containerization | Docker | Application containerization |
| Orchestration | Docker Compose | Local development |
| Monitoring | Prometheus + Grafana | System monitoring |
| Logging | ELK Stack | Centralized logging |
| API Testing | Postman | API testing and documentation |

---

## 4. Project Structure

### 4.1 Backend Structure (Spring Boot)

```
society-management-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/society/management/
│   │   │   │   ├── config/                  # Configuration classes
│   │   │   │   │   ├── AppConfig.java
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   └── ...
│   │   │   │   ├── controller/               # REST Controllers
│   │   │   │   │   ├── admin/
│   │   │   │   │   │   ├── SocietyController.java
│   │   │   │   │   │   ├── UserController.java
│   │   │   │   │   │   └── ...
│   │   │   │   │   ├── resident/
│   │   │   │   │   │   ├── DashboardController.java
│   │   │   │   │   │   ├── PaymentController.java
│   │   │   │   │   │   └── ...
│   │   │   │   │   ├── security/
│   │   │   │   │   │   └── AuthController.java
│   │   │   │   │   └── ...
│   │   │   │   ├── dto/                      # Data Transfer Objects
│   │   │   │   │   ├── request/
│   │   │   │   │   │   ├── SocietyRequest.java
│   │   │   │   │   │   └── ...
│   │   │   │   │   ├── response/
│   │   │   │   │   │   ├── ApiResponse.java
│   │   │   │   │   │   └── ...
│   │   │   │   │   └── mapper/               # MapStruct mappers
│   │   │   │   ├── exception/                # Custom exceptions
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   └── ...
│   │   │   │   ├── model/                    # Entity classes (JPA)
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Society.java
│   │   │   │   │   ├── Payment.java
│   │   │   │   │   └── ...
│   │   │   │   ├── repository/               # Data access layer
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── SocietyRepository.java
│   │   │   │   │   └── ...
│   │   │   │   ├── service/                  # Business logic
│   │   │   │   │   ├── impl/                 # Service implementations
│   │   │   │   │   │   ├── UserServiceImpl.java
│   │   │   │   │   │   └── ...
│   │   │   │   │   ├── UserService.java       # Service interfaces
│   │   │   │   │   └── ...
│   │   │   │   ├── util/                     # Utility classes
│   │   │   │   │   ├── Constants.java
│   │   │   │   │   ├── DateUtils.java
│   │   │   │   │   └── ...
│   │   │   │   ├── security/                 # Security components
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   └── CustomUserDetailsService.java
│   │   │   │   ├── ai/                       # AI Integration
│   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── MaintenancePredictionService.java
│   │   │   │   │   │   ├── ChatbotService.java
│   │   │   │   │   │   └── ...
│   │   │   │   │   ├── dto/
│   │   │   │   │   └── config/
│   │   │   │   └── scheduler/                # Scheduled tasks
│   │   │   │       ├── PaymentReminderScheduler.java
│   │   │   │       └── ...
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       ├── application-prod.properties
│   │   │       └── ...
│   │   └── test/                            # Test classes
│   │       └── java/com/society/management/
│   │           ├── controller/
│   │           ├── service/
│   │           ├── repository/
│   │           └── ...
│   ├── pom.xml                              # Maven configuration
│   ├── Dockerfile
│   └── .env.example
```

### 4.2 Frontend Structure (React)

```
society-management-system/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── fonts/
│   │   │   └── styles/
│   │   │       ├── global.css
│   │   │       ├── tailwind.css
│   │   │       └── theme.js
│   │   ├── components/
│   │   │   ├── common/                      # Reusable components
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.jsx
│   │   │   │   │   └── Button.module.css
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Table/
│   │   │   │   ├── Card/
│   │   │   │   └── ...
│   │   │   ├── layout/                      # Layout components
│   │   │   │   ├── Header/
│   │   │   │   ├── Sidebar/
│   │   │   │   ├── Footer/
│   │   │   │   └── Layout.jsx
│   │   │   ├── admin/                       # Admin-specific components
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── UserManagement/
│   │   │   │   └── ...
│   │   │   ├── resident/                    # Resident-specific components
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── Payment/
│   │   │   │   └── ...
│   │   │   └── ai/                          # AI-specific components
│   │   │       ├── Chatbot/
│   │   │       └── Recommendation/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Users.jsx
│   │   │   │   └── ...
│   │   │   ├── resident/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Payments.jsx
│   │   │   │   └── ...
│   │   │   └── shared/
│   │   │       ├── NotFound.jsx
│   │   │       └── Maintenance.jsx
│   │   ├── hooks/                            # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   └── ...
│   │   ├── context/                          # React context
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── store/                            # Redux store
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── userSlice.js
│   │   │   │   └── ...
│   │   │   ├── store.js
│   │   │   └── rootReducer.js
│   │   ├── services/                         # API services
│   │   │   ├── api.js                       # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   └── ...
│   │   ├── utils/                            # Utility functions
│   │   │   ├── apiUtils.js
│   │   │   ├── dateUtils.js
│   │   │   └── validation.js
│   │   ├── routes/                           # Route configuration
│   │   │   ├── index.js
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── Dockerfile
```

### 4.3 Configuration Files Structure

```
backend/
├── src/main/resources/
│   ├── application.properties          # Base configuration
│   ├── application-dev.properties      # Development configuration
│   ├── application-test.properties     # Testing configuration
│   ├── application-prod.properties     # Production configuration
│   ├── application-staging.properties  # Staging configuration
│   ├── logback-spring.xml              # Logging configuration
│   └── messages.properties             # Internationalization
```

---

## 5. Database Design

### 5.1 Database Schema Overview

```mermaid
erDiagram
    SOCIETY ||--o{ BUILDING : contains
    BUILDING ||--o{ UNIT : contains
    UNIT ||--o{ RESIDENT : owns
    SOCIETY ||--o{ COMMITTEE_MEMBER : has
    SOCIETY ||--o{ STAFF : employs
    SOCIETY ||--o{ AMENITY : has
    SOCIETY ||--o{ VISITOR_LOG : records
    SOCIETY ||--o{ COMPLAINT : receives
    SOCIETY ||--o{ ANNOUNCEMENT : posts
    SOCIETY ||--o{ EVENT : organizes
    SOCIETY ||--o{ PAYMENT_CONFIGURATION : has
    
    RESIDENT ||--o{ PAYMENT : makes
    RESIDENT ||--o{ COMPLAINT : raises
    RESIDENT ||--o{ VISITOR_LOG : registers
    RESIDENT ||--o{ FEEDBACK : provides
    
    PAYMENT_CONFIGURATION ||--o{ PAYMENT : defines
    
    STAFF ||--o{ MAINTENANCE_REQUEST : handles
    
    COMMITTEE_MEMBER ||--o{ MEETING_MINUTES : records
    
    AMENITY ||--o{ BOOKING : has
    RESIDENT ||--o{ BOOKING : makes
```

### 5.2 Core Tables

#### 5.2.1 Society
```sql
CREATE TABLE society (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    registration_number VARCHAR(100) UNIQUE,
    contact_number VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    established_date DATE,
    total_units INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id)
);
```

#### 5.2.2 Users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    society_id BIGINT REFERENCES society(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER', 'RESIDENT', 'SECURITY', 'STAFF')),
    profile_image_url VARCHAR(500),
    address TEXT,
    unit_id BIGINT REFERENCES unit(id),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_per_society UNIQUE (society_id, email)
);
```

#### 5.2.3 Unit (Flat/Apartment)
```sql
CREATE TABLE unit (
    id BIGSERIAL PRIMARY KEY,
    society_id BIGINT REFERENCES society(id) ON DELETE CASCADE,
    building_id BIGINT REFERENCES building(id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL,
    floor_number INTEGER,
    unit_type VARCHAR(50) CHECK (unit_type IN ('FLAT', 'VILLA', 'ROW_HOUSE', 'SHOP', 'OFFICE')),
    area_sqft DECIMAL(10,2),
    owner_id BIGINT REFERENCES users(id),
    tenant_id BIGINT REFERENCES users(id),
    is_occupied BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_unit_per_building UNIQUE (building_id, unit_number)
);
```

#### 5.2.4 Payment
```sql
CREATE TABLE payment (
    id BIGSERIAL PRIMARY KEY,
    society_id BIGINT REFERENCES society(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    unit_id BIGINT REFERENCES unit(id) ON DELETE CASCADE,
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('MAINTENANCE', 'PARKING', 'CLUBHOUSE', 'EVENT', 'PENALTY', 'DEPOSIT')),
    amount DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED')),
    payment_mode VARCHAR(50) CHECK (payment_mode IN ('ONLINE', 'CASH', 'CHEQUE', 'UPI', 'BANK_TRANSFER')),
    transaction_id VARCHAR(255),
    receipt_number VARCHAR(100) UNIQUE,
    late_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(12,2) GENERATED ALWAYS AS (amount + late_fee) STORED,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 5.2.5 Complaint
```sql
CREATE TABLE complaint (
    id BIGSERIAL PRIMARY KEY,
    society_id BIGINT REFERENCES society(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED')),
    assigned_to BIGINT REFERENCES users(id),
    resolved_by BIGINT REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    closure_reason TEXT,
    attachment_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5.3 Indexes for Performance

```sql
-- Users table indexes
CREATE INDEX idx_users_society_id ON users(society_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_user_type ON users(user_type);

-- Payment table indexes
CREATE INDEX idx_payment_society_id ON payment(society_id);
CREATE INDEX idx_payment_user_id ON payment(user_id);
CREATE INDEX idx_payment_unit_id ON payment(unit_id);
CREATE INDEX idx_payment_status ON payment(payment_status);
CREATE INDEX idx_payment_due_date ON payment(due_date);
CREATE INDEX idx_payment_type_status ON payment(payment_type, payment_status);

-- Complaint table indexes
CREATE INDEX idx_complaint_society_id ON complaint(society_id);
CREATE INDEX idx_complaint_user_id ON complaint(user_id);
CREATE INDEX idx_complaint_status ON complaint(status);
CREATE INDEX idx_complaint_priority ON complaint(priority);

-- Unit table indexes
CREATE INDEX idx_unit_society_id ON unit(society_id);
CREATE INDEX idx_unit_building_id ON unit(building_id);
CREATE INDEX idx_unit_owner_id ON unit(owner_id);
```

### 5.4 Database Configuration (application.properties)

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/society_management
spring.datasource.username=society_user
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate/JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Connection Pool (HikariCP)
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# Flyway for database migrations
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
```

---

## 6. Design Patterns

### 6.1 Architectural Patterns

| Pattern | Implementation | Benefit |
|---------|----------------|---------|
| **Layered Architecture** | Controller → Service → Repository | Separation of concerns, maintainability |
| **Repository Pattern** | Spring Data JPA Repositories | Database abstraction, testability |
| **Service Layer Pattern** | Service interfaces and implementations | Business logic encapsulation |
| **DTO Pattern** | Request/Response DTOs | Data transfer optimization, security |
| **Factory Pattern** | Custom query builders, payment processors | Flexible object creation |
| **Singleton Pattern** | Spring beans (default scope) | Single instance management |
| **Observer Pattern** | Event listeners (Spring Events) | Loose coupling for notifications |
| **Strategy Pattern** | Payment processors, notification services | Interchangeable algorithms |
| **Decorator Pattern** | Logging, caching aspects | Dynamic behavior addition |
| **Builder Pattern** | Complex object creation (e.g., Society) | Fluent API for object creation |

### 6.2 Implementation Examples

#### 6.2.1 Repository Pattern
```java
// Repository Interface
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findBySocietyIdAndUserType(Long societyId, UserType userType);
    boolean existsByEmail(String email);
}
```

#### 6.2.2 Service Layer Pattern
```java
// Service Interface
public interface UserService {
    UserDto createUser(UserRequest request);
    UserDto getUserById(Long id);
    List<UserDto> getAllUsers(Long societyId);
    UserDto updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
}

// Service Implementation
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    @Override
    @Transactional
    public UserDto createUser(UserRequest request) {
        // Business logic
        User user = userMapper.toEntity(request);
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }
    
    // Other methods
}
```

#### 6.2.3 Factory Pattern (Payment Processor)
```java
// Payment Processor Interface
public interface PaymentProcessor {
    PaymentResult processPayment(PaymentRequest request);
    PaymentStatus getPaymentStatus(String transactionId);
}

// Factory
@Component
public class PaymentProcessorFactory {
    private final Map<String, PaymentProcessor> processors;
    
    public PaymentProcessorFactory(
        @Qualifier("razorpayProcessor") PaymentProcessor razorpayProcessor,
        @Qualifier("stripeProcessor") PaymentProcessor stripeProcessor,
        @Qualifier("paypalProcessor") PaymentProcessor paypalProcessor
    ) {
        this.processors = Map.of(
            "RAZORPAY", razorpayProcessor,
            "STRIPE", stripeProcessor,
            "PAYPAL", paypalProcessor
        );
    }
    
    public PaymentProcessor getProcessor(String provider) {
        return processors.get(provider.toUpperCase());
    }
}
```

#### 6.2.4 Observer Pattern (Event System)
```java
// Custom Event
public class PaymentReceivedEvent extends ApplicationEvent {
    private final Payment payment;
    
    public PaymentReceivedEvent(Object source, Payment payment) {
        super(source);
        this.payment = payment;
    }
    
    public Payment getPayment() {
        return payment;
    }
}

// Event Listener
@Component
@RequiredArgsConstructor
public class PaymentEventListener {
    private final NotificationService notificationService;
    
    @EventListener
    public void onPaymentReceived(PaymentReceivedEvent event) {
        Payment payment = event.getPayment();
        // Send notification to admin
        notificationService.sendPaymentConfirmation(payment);
        
        // Update analytics
        // ...
    }
}

// Event Publisher
@Service
@RequiredArgsConstructor
public class PaymentService {
    private final ApplicationEventPublisher eventPublisher;
    
    public Payment processPayment(PaymentRequest request) {
        Payment payment = savePayment(request);
        eventPublisher.publishEvent(new PaymentReceivedEvent(this, payment));
        return payment;
    }
}
```

#### 6.2.5 Strategy Pattern (Notification Service)
```java
// Notification Strategy Interface
public interface NotificationStrategy {
    void sendNotification(User user, String message);
}

// Email Notification
@Component
public class EmailNotificationStrategy implements NotificationStrategy {
    @Override
    public void sendNotification(User user, String message) {
        // Send email logic
    }
}

// SMS Notification
@Component
public class SmsNotificationStrategy implements NotificationStrategy {
    @Override
    public void sendNotification(User user, String message) {
        // Send SMS logic
    }
}

// Push Notification
@Component
public class PushNotificationStrategy implements NotificationStrategy {
    @Override
    public void sendNotification(User user, String message) {
        // Send push notification logic
    }
}

// Context
@Component
@RequiredArgsConstructor
public class NotificationService {
    private final Map<String, NotificationStrategy> strategies;
    
    public void sendNotification(User user, String message, NotificationType type) {
        NotificationStrategy strategy = strategies.get(type.name());
        if (strategy != null) {
            strategy.sendNotification(user, message);
        }
    }
}
```

---

## 7. AI Integration

### 7.1 AI Use Cases

| Use Case | Description | AI Technique | Benefit |
|----------|-------------|--------------|---------|
| **Predictive Maintenance** | Predict equipment failures based on usage patterns | Time-series forecasting, Anomaly detection | Reduce downtime, cost savings |
| **Smart Complaint Routing** | Automatically route complaints to the right department | NLP, Classification | Faster resolution |
| **Chatbot Assistant** | 24/7 support for residents and staff | Conversational AI, NLP | Improved user experience |
| **Fraud Detection** | Detect suspicious payment patterns | Anomaly detection, ML | Prevent financial losses |
| **Energy Optimization** | Optimize common area lighting/AC based on usage | Reinforcement learning | Energy savings |
| **Document Analysis** | Extract data from uploaded documents (bills, receipts) | OCR, NLP | Automated data entry |
| **Personalized Recommendations** | Suggest events, services based on user preferences | Collaborative filtering | Increased engagement |
| **Sentiment Analysis** | Analyze feedback and complaints for sentiment | NLP, Sentiment analysis | Proactive issue resolution |

### 7.2 AI Architecture

```mermaid
flowchart TB
    subgraph Frontend
        A[React App] -->|User Query| B[Chatbot UI]
        A -->|Complaint| C[Smart Routing]
    end
    
    subgraph Backend
        B --> D[AI Service Layer]
        C --> D
        D --> E[Spring AI]
        D --> F[Custom ML Models]
    end
    
    subgraph AI Services
        E --> G[OpenAI API]
        E --> H[Hugging Face]
        F --> I[Python ML Services]
    end
    
    subgraph Data
        I --> J[PostgreSQL]
        I --> K[Vector Database]
    end
```

### 7.3 AI Service Layer (Spring AI)

#### 7.3.1 Dependencies (pom.xml)
```xml
<!-- Spring AI -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>

<!-- For custom Python models -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

#### 7.3.2 Configuration
```properties
# OpenAI Configuration
spring.ai.openai.api-key=${OPENAI_API_KEY}
spring.ai.openai.chat.options.model=gpt-4
spring.ai.openai.chat.options.temperature=0.7

# Custom AI Service
ai.service.base-url=http://localhost:8000
```

#### 7.3.3 Chatbot Service
```java
@Service
@RequiredArgsConstructor
public class ChatbotService {
    
    private final ChatClient chatClient;
    private final UserRepository userRepository;
    private final SocietyRepository societyRepository;
    
    public String chat(String userId, String message) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Society society = societyRepository.findById(user.getSocietyId())
            .orElseThrow(() -> new ResourceNotFoundException("Society not found"));
        
        // Build context for the AI
        String context = buildContext(user, society);
        
        // Create prompt with context
        String prompt = """
            You are a helpful assistant for %s society management system.
            Current user: %s (%s)
            Society: %s
            
            Context:
            %s
            
            User question: %s
            
            Respond in a helpful, concise manner. If you don't know the answer, say so.
        """.formatted(
            society.getName(),
            user.getFullName(),
            user.getUserType(),
            society.getName(),
            context,
            message
        );
        
        // Call OpenAI
        return chatClient.call(prompt);
    }
    
    private String buildContext(User user, Society society) {
        // Build relevant context based on user and society
        // Include recent complaints, payments, announcements, etc.
        return "Recent context...";
    }
    
    // Stream response for better UX
    public Flux<String> chatStream(String userId, String message) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String prompt = buildPrompt(user, message);
        
        return chatClient.stream(prompt);
    }
}
```

#### 7.3.4 Predictive Maintenance Service
```java
@Service
@RequiredArgsConstructor
public class MaintenancePredictionService {
    
    private final MaintenanceRepository maintenanceRepository;
    private final EquipmentRepository equipmentRepository;
    private final RestClient restClient;
    
    @Value("${ai.service.base-url}")
    private String aiServiceUrl;
    
    public MaintenancePrediction predictEquipmentFailure(Long equipmentId) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Equipment not found"));
        
        // Get historical maintenance data
        List<MaintenanceRecord> history = maintenanceRepository
            .findByEquipmentIdOrderByMaintenanceDateDesc(equipmentId);
        
        // Prepare request for AI service
        MaintenancePredictionRequest request = MaintenancePredictionRequest.builder()
            .equipmentId(equipmentId)
            .equipmentType(equipment.getType())
            .installationDate(equipment.getInstallationDate())
            .maintenanceHistory(history)
            .currentReadings(getCurrentReadings(equipmentId))
            .build();
        
        // Call AI prediction service
        return restClient.post()
            .uri(aiServiceUrl + "/predict/maintenance")
            .body(request)
            .retrieve()
            .body(MaintenancePrediction.class);
    }
    
    public List<MaintenancePrediction> predictAllEquipmentFailures() {
        List<Equipment> allEquipment = equipmentRepository.findAll();
        
        return allEquipment.stream()
            .map(equipment -> predictEquipmentFailure(equipment.getId()))
            .collect(Collectors.toList());
    }
    
    // Scheduled task to run predictions daily
    @Scheduled(cron = "0 0 2 * * ?") // Run at 2 AM daily
    public void scheduledPredictionCheck() {
        List<MaintenancePrediction> predictions = predictAllEquipmentFailures();
        
        // Filter high-risk predictions
        List<MaintenancePrediction> highRisk = predictions.stream()
            .filter(p -> p.getRiskLevel() == RiskLevel.HIGH)
            .collect(Collectors.toList());
        
        // Send alerts
        if (!highRisk.isEmpty()) {
            alertAdmins(highRisk);
        }
    }
}
```

#### 7.3.5 Smart Complaint Routing
```java
@Service
@RequiredArgsConstructor
public class ComplaintRoutingService {
    
    private final ChatClient chatClient;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    
    public RoutingDecision routeComplaint(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        
        // Get all staff members who can handle complaints
        List<User> staffMembers = userRepository.findBySocietyIdAndUserType(
            complaint.getSocietyId(), UserType.STAF
        );
        
        // Build prompt for classification
        String prompt = """
            Classify the following complaint into one of these categories:
            - ELECTRICAL
            - PLUMBING
            - CLEANING
            - SECURITY
            - ADMINISTRATIVE
            - LANDSCAPING
            - OTHER
            
            Also determine the priority (LOW, MEDIUM, HIGH, CRITICAL).
            
            Complaint title: %s
            Complaint description: %s
            
            Respond in JSON format:
            {
                "category": "CATEGORY_NAME",
                "priority": "PRIORITY_LEVEL",
                "recommendedAssignee": "STAFF_NAME or null"
            }
        """.formatted(complaint.getTitle(), complaint.getDescription());
        
        String response = chatClient.call(prompt);
        
        // Parse JSON response
        RoutingDecision decision = parseRoutingDecision(response);
        
        // Find best staff member for this category
        User assignee = findBestStaffMember(decision.getCategory(), staffMembers);
        
        decision.setAssignee(assignee);
        
        return decision;
    }
    
    private RoutingDecision parseRoutingDecision(String json) {
        // Parse JSON and create RoutingDecision object
        // Implementation omitted for brevity
        return new RoutingDecision();
    }
    
    private User findBestStaffMember(String category, List<User> staffMembers) {
        // Logic to find staff member with relevant skills
        // Can also consider workload, availability, etc.
        return staffMembers.stream()
            .filter(u -> u.getSkills().contains(category))
            .findFirst()
            .orElse(null);
    }
}
```

### 7.4 Custom AI Services (Python)

For complex ML models that require Python, create a separate service:

```python
# app.py (FastAPI)
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
from datetime import datetime

app = FastAPI()

# Load trained models
maintenance_model = joblib.load("models/maintenance_prediction.pkl")
fraud_model = joblib.load("models/fraud_detection.pkl")

class MaintenancePredictionRequest(BaseModel):
    equipment_id: int
    equipment_type: str
    installation_date: str
    maintenance_history: list
    current_readings: dict

class MaintenancePredictionResponse(BaseModel):
    equipment_id: int
    failure_probability: float
    predicted_failure_date: str | None
    risk_level: str
    recommended_action: str

@app.post("/predict/maintenance", response_model=MaintenancePredictionResponse)
async def predict_maintenance(request: MaintenancePredictionRequest):
    # Preprocess data
    features = preprocess_maintenance_data(request)
    
    # Predict
    prediction = maintenance_model.predict([features])[0]
    probability = maintenance_model.predict_proba([features])[0][1]
    
    # Calculate risk level
    risk_level = calculate_risk_level(probability)
    
    # Generate recommendation
    recommended_action = generate_recommendation(risk_level, request.equipment_type)
    
    return MaintenancePredictionResponse(
        equipment_id=request.equipment_id,
        failure_probability=float(probability),
        predicted_failure_date=calculate_failure_date(probability) if probability > 0.5 else None,
        risk_level=risk_level,
        recommended_action=recommended_action
    )

# ... other endpoints
```

### 7.5 Vector Database for Semantic Search

For efficient document search and recommendation systems:

```java
// Using Spring AI with vector database
@Service
public class DocumentSearchService {
    
    private final VectorStore vectorStore;
    
    public List<Document> searchSimilarDocuments(String query, int limit) {
        // Convert query to embedding
        List<Double> queryEmbedding = embedQuery(query);
        
        // Search vector store
        return vectorStore.similaritySearch(queryEmbedding, limit);
    }
    
    public void indexDocument(Document document) {
        // Generate embedding for document
        List<Double> embedding = embedDocument(document.getContent());
        
        // Store in vector database
        vectorStore.addDocument(document, embedding);
    }
}
```

---

## 8. API Design

### 8.1 API Overview

- **Base URL:** `/api/v1`
- **Content-Type:** `application/json`
- **Authentication:** JWT Bearer Token
- **Authorization:** Role-based access control

### 8.2 RESTful Endpoints

#### 8.2.1 Authentication API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/register` | User registration | Public |
| POST | `/auth/refresh-token` | Refresh access token | Public |
| POST | `/auth/logout` | User logout | Private |
| POST | `/auth/forgot-password` | Request password reset | Public |
| POST | `/auth/reset-password` | Reset password | Public |
| POST | `/auth/verify-email` | Verify email | Public |

#### 8.2.2 User Management API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Get all users (paginated) | Admin |
| GET | `/users/{id}` | Get user by ID | Private |
| GET | `/users/me` | Get current user profile | Private |
| POST | `/users` | Create new user | Admin |
| PUT | `/users/{id}` | Update user | Admin/Owner |
| DELETE | `/users/{id}` | Delete user | Admin |
| PATCH | `/users/{id}/status` | Toggle user status | Admin |
| GET | `/users/society/{societyId}` | Get users by society | Admin |

#### 8.2.3 Society Management API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/societies` | Get all societies (paginated) | Super Admin |
| GET | `/societies/{id}` | Get society by ID | Private |
| POST | `/societies` | Create new society | Super Admin |
| PUT | `/societies/{id}` | Update society | Super Admin/Admin |
| DELETE | `/societies/{id}` | Delete society | Super Admin |
| GET | `/societies/{id}/dashboard` | Society dashboard | Admin |
| GET | `/societies/{id}/stats` | Society statistics | Admin |

#### 8.2.4 Unit Management API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/units` | Get all units (paginated) | Admin |
| GET | `/units/{id}` | Get unit by ID | Private |
| POST | `/units` | Create new unit | Admin |
| PUT | `/units/{id}` | Update unit | Admin |
| DELETE | `/units/{id}` | Delete unit | Admin |
| GET | `/units/society/{societyId}` | Get units by society | Admin |
| GET | `/units/building/{buildingId}` | Get units by building | Admin |
| POST | `/units/{id}/occupancy` | Update occupancy status | Admin |

#### 8.2.5 Payment API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/payments` | Get all payments (paginated) | Admin |
| GET | `/payments/{id}` | Get payment by ID | Private |
| GET | `/payments/user/{userId}` | Get user payments | Private |
| GET | `/payments/unit/{unitId}` | Get unit payments | Admin/Resident |
| POST | `/payments` | Create payment record | Admin |
| POST | `/payments/process` | Process payment (integrated) | Private |
| PUT | `/payments/{id}` | Update payment | Admin |
| PATCH | `/payments/{id}/status` | Update payment status | Admin |
| GET | `/payments/overdue` | Get overdue payments | Admin |
| GET | `/payments/reports` | Generate payment reports | Admin |
| POST | `/payments/reminder` | Send payment reminder | Admin |

#### 8.2.6 Complaint Management API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/complaints` | Get all complaints (paginated) | Admin |
| GET | `/complaints/{id}` | Get complaint by ID | Private |
| GET | `/complaints/user/{userId}` | Get user complaints | Private |
| POST | `/complaints` | Create new complaint | Private |
| PUT | `/complaints/{id}` | Update complaint | Admin/Assignee |
| PATCH | `/complaints/{id}/assign` | Assign complaint | Admin |
| PATCH | `/complaints/{id}/status` | Update complaint status | Admin/Assignee |
| PATCH | `/complaints/{id}/priority` | Update complaint priority | Admin |
| POST | `/complaints/{id}/comment` | Add comment to complaint | Private |
| GET | `/complaints/{id}/comments` | Get complaint comments | Private |

#### 8.2.7 Visitor Management API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/visitors` | Get all visitor logs (paginated) | Admin/Security |
| GET | `/visitors/{id}` | Get visitor log by ID | Private |
| POST | `/visitors` | Register new visitor | Security |
| POST | `/visitors/check-in` | Check-in visitor | Security |
| POST | `/visitors/check-out` | Check-out visitor | Security |
| GET | `/visitors/unit/{unitId}` | Get visitors for unit | Admin/Resident |
| GET | `/visitors/today` | Get today's visitors | Admin/Security |
| GET | `/visitors/active` | Get currently checked-in visitors | Admin/Security |

#### 8.2.8 Announcement API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/announcements` | Get all announcements (paginated) | Public |
| GET | `/announcements/{id}` | Get announcement by ID | Public |
| POST | `/announcements` | Create new announcement | Admin |
| PUT | `/announcements/{id}` | Update announcement | Admin |
| DELETE | `/announcements/{id}` | Delete announcement | Admin |
| GET | `/announcements/society/{societyId}` | Get society announcements | Public |
| POST | `/announcements/{id}/notify` | Send notification for announcement | Admin |

#### 8.2.9 Event Management API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/events` | Get all events (paginated) | Public |
| GET | `/events/{id}` | Get event by ID | Public |
| POST | `/events` | Create new event | Admin |
| PUT | `/events/{id}` | Update event | Admin |
| DELETE | `/events/{id}` | Delete event | Admin |
| POST | `/events/{id}/register` | Register for event | Private |
| POST | `/events/{id}/cancel-registration` | Cancel registration | Private |
| GET | `/events/{id}/participants` | Get event participants | Admin |

#### 8.2.10 AI API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ai/chat` | Chat with AI assistant | Private |
| POST | `/ai/chat/stream` | Stream chat response | Private |
| POST | `/ai/complaints/route` | Smart complaint routing | Admin |
| GET | `/ai/maintenance/predictions` | Get maintenance predictions | Admin |
| GET | `/ai/maintenance/predictions/{equipmentId}` | Get equipment prediction | Admin |
| POST | `/ai/documents/search` | Semantic document search | Private |
| POST | `/ai/recommendations` | Get personalized recommendations | Private |

### 8.3 Request/Response Examples

#### 8.3.1 Login Request/Response

**Request:**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "email": "admin@society.com",
    "password": "SecurePassword123!"
}
```

**Response (Success):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
        "tokenType": "Bearer",
        "expiresIn": 3600,
        "user": {
            "id": 1,
            "email": "admin@society.com",
            "firstName": "Admin",
            "lastName": "User",
            "userType": "SOCIETY_ADMIN",
            "societyId": 1
        }
    }
}
```

**Response (Error):**
```json
{
    "success": false,
    "message": "Invalid credentials",
    "error": {
        "code": "UNAUTHORIZED",
        "details": "Email or password is incorrect"
    },
    "timestamp": "2026-06-23T10:00:00Z"
}
```

#### 8.3.2 Create Payment Request/Response

**Request:**
```http
POST /api/v1/payments/process
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
    "unitId": 123,
    "paymentType": "MAINTENANCE",
    "amount": 5000.00,
    "paymentMode": "ONLINE",
    "paymentGateway": "RAZORPAY",
    "transactionId": "txn_123456789",
    "notes": "Monthly maintenance for June 2026"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Payment processed successfully",
    "data": {
        "id": 456,
        "unitId": 123,
        "userId": 789,
        "paymentType": "MAINTENANCE",
        "amount": 5000.00,
        "lateFee": 0.00,
        "totalAmount": 5000.00,
        "paymentStatus": "PAID",
        "paymentMode": "ONLINE",
        "transactionId": "txn_123456789",
        "receiptNumber": "RCT-2026-06-456",
        "paidDate": "2026-06-23",
        "dueDate": "2026-06-20",
        "notes": "Monthly maintenance for June 2026",
        "createdAt": "2026-06-23T10:00:00Z"
    }
}
```

#### 8.3.3 AI Chat Request/Response

**Request:**
```http
POST /api/v1/ai/chat/stream
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
    "message": "When is the next committee meeting?",
    "context": {
        "societyId": 1,
        "userId": 789
    }
}
```

**Response (Streaming):**
```json
{"chunk": "The next committee meeting is scheduled for "}
{"chunk": "July 5, 2026 at 7:00 PM"}
{"chunk": " in the community hall."}
{"chunk": null, "done": true}
```

### 8.4 API Documentation

Use SpringDoc OpenAPI for automatic API documentation:

```properties
# SpringDoc Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.operationsSorter=alpha
springdoc.default-produces-media-type=application/json
```

Access documentation at:
- OpenAPI JSON: `/api-docs`
- Swagger UI: `/swagger-ui.html`

---

## 9. Feature List

### 9.1 Core Features

#### 9.1.1 User Management
- [ ] User registration and login
- [ ] Role-based access control (RBAC)
- [ ] Profile management
- [ ] Password reset and recovery
- [ ] Email verification
- [ ] Multi-factor authentication (OTP)
- [ ] User activity logging

#### 9.1.2 Society Management
- [ ] Society creation and configuration
- [ ] Multi-society support
- [ ] Society profile management
- [ ] Committee member management
- [ ] Staff management
- [ ] Building and unit management

#### 9.1.3 Financial Management
- [ ] Maintenance fee configuration
- [ ] Payment processing (multiple gateways)
- [ ] Payment history and tracking
- [ ] Overdue payment management
- [ ] Late fee calculation
- [ ] Receipt generation
- [ ] Financial reports
- [ ] Budget management

#### 9.1.4 Complaint Management
- [ ] Complaint submission
- [ ] Complaint categorization
- [ ] Smart routing (AI-powered)
- [ ] Priority assignment
- [ ] Status tracking
- [ ] Assignment to staff
- [ ] Resolution tracking
- [ ] Feedback collection

#### 9.1.5 Visitor Management
- [ ] Visitor registration
- [ ] Check-in/check-out tracking
- [ ] Visitor pass generation
- [ ] Visitor history
- [ ] Blacklist management
- [ ] QR code-based entry

#### 9.1.6 Communication
- [ ] Announcements
- [ ] Notifications (email, SMS, push)
- [ ] Discussion forums
- [ ] Polls and surveys
- [ ] Event management
- [ ] Meeting minutes

### 9.2 Advanced Features

#### 9.2.1 AI-Powered Features
- [ ] AI chatbot for support
- [ ] Predictive maintenance
- [ ] Smart complaint routing
- [ ] Fraud detection
- [ ] Personalized recommendations
- [ ] Sentiment analysis for feedback
- [ ] Document analysis (OCR)
- [ ] Energy optimization suggestions

#### 9.2.2 Amenity Management
- [ ] Amenity booking
- [ ] Booking calendar
- [ ] Usage tracking
- [ ] Pricing configuration
- [ ] Availability management

#### 9.2.3 Maintenance Management
- [ ] Maintenance request submission
- [ ] Work order management
- [ ] Technician assignment
- [ ] Status tracking
- [ ] History and reporting

#### 9.2.4 Document Management
- [ ] Document upload and storage
- [ ] Document categorization
- [ ] Version control
- [ ] Access control
- [ ] Search and filtering

#### 9.2.5 Reporting & Analytics
- [ ] Custom report generation
- [ ] Dashboards with charts
- [ ] Export to PDF/Excel
- [ ] Scheduled reports
- [ ] Financial analytics
- [ ] Occupancy analytics
- [ ] Complaint analytics

### 9.3 Integration Features

#### 9.3.1 Payment Gateway Integration
- [ ] Razorpay
- [ ] Stripe
- [ ] PayPal
- [ ] Bank transfer reconciliation
- [ ] UPI payments

#### 9.3.2 Communication Integration
- [ ] Email (SMTP)
- [ ] SMS (Twilio, AWS SNS)
- [ ] Push notifications (Firebase)
- [ ] WhatsApp (Twilio API)

#### 9.3.3 Third-Party Integrations
- [ ] Google Maps (for location)
- [ ] Calendar integration
- [ ] Cloud storage (AWS S3, Google Drive)
- [ ] Accounting software (QuickBooks, Zoho)

### 9.4 Feature Priority Matrix

| Feature | Priority | Complexity | Estimated Effort |
|---------|----------|------------|------------------|
| User Authentication | P0 | Medium | 3-5 days |
| Society Management | P0 | Medium | 5-7 days |
| Unit Management | P0 | Medium | 3-5 days |
| Payment Processing | P0 | High | 7-10 days |
| Complaint Management | P1 | Medium | 5-7 days |
| Visitor Management | P1 | Medium | 3-5 days |
| AI Chatbot | P1 | High | 5-7 days |
| Predictive Maintenance | P2 | High | 7-10 days |
| Financial Reports | P1 | Medium | 3-5 days |
| Notifications | P1 | Medium | 3-5 days |
| Amenity Booking | P2 | Medium | 5-7 days |
| Document Management | P2 | Medium | 3-5 days |
| Dashboards | P1 | High | 5-7 days |

---

## 10. Development Pipeline

### 10.1 CI/CD Pipeline

```mermaid
flowchart LR
    A[Developer] -->|Push Code| B[Git Repository]
    B -->|Trigger| C[CI Pipeline]
    C --> D[Build & Test]
    D -->|Success| E[Build Artifacts]
    E --> F[Docker Images]
    F --> G[Container Registry]
    G --> H[CD Pipeline]
    H --> I[Deploy to Staging]
    I --> J[Automated Tests]
    J -->|Success| K[Deploy to Production]
    K --> L[Monitoring]
    L -->|Alerts| M[Rollback if needed]
```

### 10.2 GitHub Actions Workflow

#### 10.2.1 Backend CI/CD (.github/workflows/backend-ci-cd.yml)

```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: 'maven'
      
      - name: Build with Maven
        run: |
          cd backend
          mvn clean package -DskipTests
      
      - name: Run Tests
        run: |
          cd backend
          mvn test
      
      - name: Upload Build Artifact
        uses: actions/upload-artifact@v4
        with:
          name: society-backend-jar
          path: backend/target/*.jar
          retention-days: 7

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download Artifact
        uses: actions/download-artifact@v4
        with:
          name: society-backend-jar
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_TOKEN }}
      
      - name: Build and Push Docker Image
        run: |
          docker build -t society-backend:staging -f backend/Dockerfile .
          docker tag society-backend:staging ${{ secrets.DOCKER_HUB_USERNAME }}/society-backend:staging
          docker push ${{ secrets.DOCKER_HUB_USERNAME }}/society-backend:staging
      
      - name: Deploy to Staging
        run: |
          # SSH into staging server and deploy
          echo "Deploying to staging..."
          # Implementation depends on your deployment strategy

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download Artifact
        uses: actions/download-artifact@v4
        with:
          name: society-backend-jar
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_TOKEN }}
      
      - name: Build and Push Docker Image
        run: |
          docker build -t society-backend:production -f backend/Dockerfile .
          docker tag society-backend:production ${{ secrets.DOCKER_HUB_USERNAME }}/society-backend:production
          docker push ${{ secrets.DOCKER_HUB_USERNAME }}/society-backend:production
      
      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
          # Implementation depends on your deployment strategy
```

#### 10.2.2 Frontend CI/CD (.github/workflows/frontend-ci-cd.yml)

```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install Dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run Linter
        run: |
          cd frontend
          npm run lint
      
      - name: Run Tests
        run: |
          cd frontend
          npm test
      
      - name: Build Application
        run: |
          cd frontend
          npm run build
      
      - name: Upload Build Artifact
        uses: actions/upload-artifact@v4
        with:
          name: society-frontend-build
          path: frontend/dist/
          retention-days: 7

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download Artifact
        uses: actions/download-artifact@v4
        with:
          name: society-frontend-build
          path: frontend/dist
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_TOKEN }}
      
      - name: Build and Push Docker Image
        run: |
          docker build -t society-frontend:staging -f frontend/Dockerfile .
          docker tag society-frontend:staging ${{ secrets.DOCKER_HUB_USERNAME }}/society-frontend:staging
          docker push ${{ secrets.DOCKER_HUB_USERNAME }}/society-frontend:staging
      
      - name: Deploy to Staging
        run: |
          echo "Deploying to staging..."

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download Artifact
        uses: actions/download-artifact@v4
        with:
          name: society-frontend-build
          path: frontend/dist
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_TOKEN }}
      
      - name: Build and Push Docker Image
        run: |
          docker build -t society-frontend:production -f frontend/Dockerfile .
          docker tag society-frontend:production ${{ secrets.DOCKER_HUB_USERNAME }}/society-frontend:production
          docker push ${{ secrets.DOCKER_HUB_USERNAME }}/society-frontend:production
      
      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
```

### 10.3 Docker Configuration

#### 10.3.1 Backend Dockerfile

```dockerfile
# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy source files
COPY backend/pom.xml .
COPY backend/src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Copy application properties
COPY backend/src/main/resources/application.properties .
COPY backend/src/main/resources/application-prod.properties .

# Create non-root user
RUN useradd -r -m -U -d /home/appuser -s /bin/false appuser
USER appuser

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### 10.3.2 Frontend Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY frontend/ ./

# Build the application
RUN npm run build

# Runtime stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy built files from build stage
COPY --from=build /app/dist/ ./

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 10.3.3 Docker Compose (docker-compose.yml)

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: society-postgres
    environment:
      POSTGRES_DB: society_management
      POSTGRES_USER: society_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - society-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U society_user -d society_management"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: society-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - society-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Application
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: society-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/society_management
      SPRING_DATASOURCE_USERNAME: society_user
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      SPRING_REDIS_HOST: redis
      SPRING_REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "8080:8080"
    networks:
      - society-network
    restart: unless-stopped

  # Frontend Application
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    container_name: society-frontend
    environment:
      VITE_API_BASE_URL: http://localhost:8080/api/v1
    ports:
      - "3000:80"
    networks:
      - society-network
    restart: unless-stopped
    depends_on:
      - backend

  # AI Service (Optional - for custom Python models)
  ai-service:
    build:
      context: .
      dockerfile: ai-service/Dockerfile
    container_name: society-ai
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: society_management
      DB_USER: society_user
      DB_PASSWORD: ${DB_PASSWORD}
    ports:
      - "8000:8000"
    networks:
      - society-network
    depends_on:
      postgres:
        condition: service_healthy

  # Nginx Reverse Proxy (Optional)
  nginx:
    image: nginx:alpine
    container_name: society-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    networks:
      - society-network
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  redis_data:

networks:
  society-network:
    driver: bridge
```

### 10.4 Environment Variables

Create `.env.example` files for both backend and frontend:

**Backend .env.example:**
```properties
# Database
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=society_management
DB_USER=society_user

# JWT
JWT_SECRET=your_very_secure_jwt_secret_key_at_least_256_bits
JWT_EXPIRATION_MS=86400000
JWT_REFRESH_EXPIRATION_MS=604800000

# AI
OPENAI_API_KEY=your_openai_api_key
AI_SERVICE_URL=http://ai-service:8000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_email_password

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_secret

# File Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=society-documents

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**Frontend .env.example:**
```properties
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_BASE_URL=ws://localhost:8080

# App Configuration
VITE_APP_NAME=Society Management System
VITE_APP_VERSION=1.0.0

# Payment Gateways
VITE_RAZORPAY_KEY_ID=your_razorpay_key

# Analytics
VITE_GOOGLE_ANALYTICS_ID=
```

---

## 11. Coding Standards

### 11.1 Java Coding Standards

#### 11.1.1 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Class | PascalCase | `UserService`, `PaymentController` |
| Interface | PascalCase (prefix with I) | `IUserRepository`, `IPaymentService` |
| Method | camelCase | `getUserById()`, `processPayment()` |
| Variable | camelCase | `userId`, `paymentAmount` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT` |
| Package | lowercase | `com.society.management.controller` |

#### 11.1.2 Code Structure

```java
// Correct class structure
public class UserServiceImpl implements UserService {
    
    // Constants at the top
    private static final int MAX_RETRIES = 3;
    private static final String DEFAULT_SORT = "createdAt,desc";
    
    // Logger
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    
    // Dependencies (final, injected via constructor)
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    // Constructor (use Lombok @RequiredArgsConstructor)
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }
    
    // Public methods
    
    // Private helper methods
}
```

#### 11.1.3 Exception Handling

```java
// Custom exception
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(String.format("%s not found with %s: %s", resource, field, value));
    }
}

// Global exception handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex, WebRequest request
    ) {
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(Instant.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error(HttpStatus.NOT_FOUND.name())
            .message(ex.getMessage())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
        ValidationException ex, WebRequest request
    ) {
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(Instant.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error(HttpStatus.BAD_REQUEST.name())
            .message("Validation failed")
            .details(ex.getMessage())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(
        Exception ex, WebRequest request
    ) {
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(Instant.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error(HttpStatus.INTERNAL_SERVER_ERROR.name())
            .message("An unexpected error occurred")
            .details(ex.getMessage())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        logger.error("Unexpected error: ", ex);
        return ResponseEntity.internalServerError().body(error);
    }
}
```

#### 11.1.4 Validation

```java
// DTO with validation
public class UserRequest {
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s-]+$", message = "First name can only contain letters, spaces, and hyphens")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9\\s-]{10,15}$", message = "Phone number should be valid")
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
        message = "Password must contain at least one digit, one lowercase, one uppercase, one special character, and no whitespace"
    )
    private String password;
    
    @NotNull(message = "User type is required")
    @Enumerated(EnumType.STRING)
    private UserType userType;
    
    @AssertTrue(message = "Phone number must be unique per society")
    private boolean isPhoneUnique;
}

// Custom validator
@Component
public class UserValidator implements Validator {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public boolean supports(Class<?> clazz) {
        return UserRequest.class.isAssignableFrom(clazz);
    }
    
    @Override
    public void validate(Object target, Errors errors) {
        UserRequest request = (UserRequest) target;
        
        if (request.getSocietyId() != null) {
            boolean exists = userRepository.existsBySocietyIdAndPhone(
                request.getSocietyId(), request.getPhone()
            );
            if (exists) {
                errors.rejectValue("phone", "phone.unique", "Phone number already exists for this society");
            }
        }
    }
}
```

#### 11.1.5 Lombok Usage

Use Lombok to reduce boilerplate code:

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserType userType;
    private Long societyId;
    private Boolean isActive;
    private Instant createdAt;
}

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    // Lombok generates the constructor
}
```

### 11.2 React Coding Standards

#### 11.2.1 File Structure

```
components/
  Button/
    Button.jsx          # Component logic
    Button.module.css   # Component styles
    Button.test.jsx     # Component tests
    index.js            # Export
```

#### 11.2.2 Component Structure

```jsx
// Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button;
```

#### 11.2.3 Hooks Usage

```jsx
// useApi.js - Custom hook for API calls
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export const useApi = () => {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  const get = useCallback(async (url, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(url, config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  }, []);

  const post = useCallback(async (url, data, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(url, data, config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  }, []);

  // Other methods: put, patch, delete

  return { get, post, put, patch, delete: deleteRequest, loading, error };
};
```

#### 11.2.4 State Management (Redux Toolkit)

```jsx
// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useApi } from '../hooks/useApi';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { useApi } = await import('../hooks/useApi');
      const api = useApi();
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      localStorage.setItem('token', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
```

### 11.3 Database Standards

#### 11.3.1 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Table | singular, snake_case | `user`, `payment`, `complaint` |
| Column | snake_case | `first_name`, `created_at`, `is_active` |
| Primary Key | `id` | `id BIGSERIAL PRIMARY KEY` |
| Foreign Key | `[referenced_table]_id` | `society_id`, `user_id` |
| Index | `idx_[table]_[column]` | `idx_user_email` |
| Constraint | `[type]_[table]_[description]` | `uq_user_email` |

#### 11.3.2 Data Types

| Data Type | Usage |
|-----------|-------|
| `BIGSERIAL` | Primary keys (auto-incrementing) |
| `VARCHAR(n)` | Variable-length strings |
| `TEXT` | Long text (unlimited length) |
| `INTEGER` | Whole numbers |
| `BIGINT` | Large whole numbers (IDs, counts) |
| `DECIMAL(p,s)` | Precise numbers (money) |
| `BOOLEAN` | True/false values |
| `DATE` | Date only |
| `TIMESTAMP WITH TIME ZONE` | Date and time with timezone |
| `TIMESTAMPTZ` | Short form for timestamp with timezone |
| `JSONB` | JSON data |
| `ARRAY` | Arrays of values |

#### 11.3.3 Common Columns

All tables should include:
```sql
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
created_by BIGINT REFERENCES users(id),
updated_by BIGINT REFERENCES users(id)
```

Use triggers or application logic to update `updated_at` and `updated_by`.

### 11.4 Security Standards

#### 11.4.1 Password Security
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character
- No common passwords
- Hash using BCrypt with strength 12

```java
// Password encoding
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}
```

#### 11.4.2 JWT Security
- Use strong secret key (256+ bits)
- Set appropriate expiration times
- Use HTTPS only
- Store tokens securely (HttpOnly, Secure cookies)
- Implement token refresh mechanism

```java
// JWT Configuration
@Configuration
public class JwtConfig {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration.ms}")
    private long expirationMs;
    
    @Value("${jwt.refresh.expiration.ms}")
    private long refreshExpirationMs;
    
    @Bean
    public JwtTokenProvider jwtTokenProvider() {
        return new JwtTokenProvider(
            secret,
            expirationMs,
            refreshExpirationMs
        );
    }
}
```

#### 11.4.3 Input Sanitization
- Validate all inputs
- Sanitize HTML inputs to prevent XSS
- Use parameterized queries to prevent SQL injection
- Limit request sizes
- Implement rate limiting

```java
// Security configuration
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final JwtTokenProvider tokenProvider;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(CsrfConfig::disable)
            .cors(CorsConfig::configure)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/societies/**").hasAnyRole("ADMIN", "SOCIETY_ADMIN")
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    private static class CorsConfig {
        static void configure(CorsConfigurationSource source) {
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.setAllowedOrigins(List.of("*")); // Configure properly for production
            configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            configuration.setAllowedHeaders(List.of("*"));
            configuration.setExposedHeaders(List.of("Authorization"));
            configuration.setMaxAge(3600L);
        }
    }
}
```

---

## 12. Security Considerations

### 12.1 Authentication & Authorization

| Aspect | Implementation |
|--------|----------------|
| **Authentication** | JWT (Stateless) |
| **Password Storage** | BCrypt (Strength 12) |
| **Session Management** | Stateless (JWT) |
| **Role-Based Access** | Spring Security Roles |
| **Permission System** | Custom annotations |
| **Multi-Factor Auth** | OTP via Email/SMS |

### 12.2 Custom Security Annotations

```java
// Custom annotation for role-based access
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@PreAuthorize("hasRole('ADMIN')")
public @interface AdminOnly {
}

// Custom annotation for society-level access
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface SocietyAccess {
    String role() default "RESIDENT";
}

// Aspect to validate society access
@Aspect
@Component
@RequiredArgsConstructor
public class SocietyAccessAspect {
    
    private final UserRepository userRepository;
    
    @Around("@annotation(societyAccess)")
    public Object validateSocietyAccess(
        ProceedingJoinPoint joinPoint, SocietyAccess societyAccess
    ) throws Throwable {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Unauthorized");
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new AccessDeniedException("User not found"));
        
        // Extract societyId from method parameters
        Long societyId = extractSocietyId(joinPoint);
        
        if (societyId == null || !societyId.equals(user.getSocietyId())) {
            throw new AccessDeniedException("Access denied to this society");
        }
        
        // Check role if specified
        if (!societyAccess.role().equals("ANY") && 
            !user.getUserType().name().equals(societyAccess.role())) {
            throw new AccessDeniedException("Insufficient privileges");
        }
        
        return joinPoint.proceed();
    }
    
    private Long extractSocietyId(ProceedingJoinPoint joinPoint) {
        // Logic to extract societyId from method parameters
        // Can be from @PathVariable, @RequestParam, or DTO
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            if (arg instanceof Long) {
                return (Long) arg;
            }
            // Check for DTOs with societyId
            try {
                Field societyIdField = arg.getClass().getDeclaredField("societyId");
                societyIdField.setAccessible(true);
                return (Long) societyIdField.get(arg);
            } catch (Exception e) {
                // Ignore
            }
        }
        return null;
    }
}

// Usage
@RestController
@RequestMapping("/api/v1/societies/{societyId}/users")
@RequiredArgsConstructor
public class SocietyUserController {
    
    @GetMapping
    @SocietyAccess(role = "SOCIETY_ADMIN")
    public ResponseEntity<List<UserDto>> getSocietyUsers(@PathVariable Long societyId) {
        // Business logic
    }
}
```

### 12.3 Security Headers

```java
// Security headers configuration
@Configuration
public class SecurityHeadersConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("default-src 'self'; script-src 'self' 'unsafe-inline' cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' api.example.com; frame-src 'none'; object-src 'none'")
                )
                .httpStrictTransportSecurity(hsts -> hsts
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                    .preload(true)
                )
                .xssProtection(xss -> xss
                    .headerValue("1; mode=block")
                )
                .frameOptions(frame -> frame
                    .sameOrigin()
                )
                .referrerPolicy(referrer -> referrer
                    .policy(ReferrerPolicy.SAME_ORIGIN)
                )
                .permissionsPolicy(permissions -> permissions
                    .policy("geolocation=(), microphone=(), camera=()")
                )
            );
        
        return http.build();
    }
}
```

### 12.4 Rate Limiting

```java
// Rate limiting configuration
@Configuration
public class RateLimitConfig {
    
    @Bean
    public FilterRegistrationBean<RateLimitFilter> rateLimitFilter() {
        FilterRegistrationBean<RateLimitFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new RateLimitFilter());
        registrationBean.addUrlPatterns("/api/v1/*");
        return registrationBean;
    }
}

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {
    
    private final RateLimiterService rateLimiterService;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request, 
        HttpServletResponse response, 
        FilterChain filterChain
    ) throws ServletException, IOException {
        
        String ipAddress = request.getRemoteAddr();
        String endpoint = request.getRequestURI();
        String userId = getUserIdFromRequest(request);
        
        // Check rate limit
        boolean allowed = rateLimiterService.isAllowed(userId, ipAddress, endpoint);
        
        if (!allowed) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("""
                {
                    "success": false,
                    "message": "Rate limit exceeded",
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "details": "Too many requests. Please try again later."
                    }
                }
            """);
            return;
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                return Jwts.parserBuilder()
                    .setSigningKey(getPublicKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
}

@Service
@RequiredArgsConstructor
public class RateLimiterService {
    
    private final RedisTemplate<String, String> redisTemplate;
    
    public boolean isAllowed(String userId, String ipAddress, String endpoint) {
        String key = "rate_limit:" + (userId != null ? userId : ipAddress) + ":" + endpoint;
        
        // 100 requests per minute
        Long current = redisTemplate.opsForValue().increment(key);
        
        if (current == 1) {
            redisTemplate.expire(key, 60, TimeUnit.SECONDS);
        }
        
        return current <= 100;
    }
}
```

### 12.5 Audit Logging

```java
// Audit logging configuration
@Configuration
public class AuditConfig {
    
    @Bean
    public AuditorAware<Long> auditorAware() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.empty();
            }
            
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            
            return Optional.ofNullable(user != null ? user.getId() : null);
        };
    }
}

// Audit entity
@MappedSuperclass
public abstract class AuditableEntity {
    
    @CreatedBy
    @Column(updatable = false)
    private Long createdBy;
    
    @LastModifiedBy
    private Long updatedBy;
    
    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;
    
    @LastModifiedDate
    private Instant updatedAt;
    
    // Getters and setters
}

// Audit log entity
@Entity
@Table(name = "audit_log")
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String action;
    
    @Column(nullable = false)
    private String entityType;
    
    @Column(nullable = false)
    private Long entityId;
    
    @Column(columnDefinition = "jsonb")
    private String oldValues;
    
    @Column(columnDefinition = "jsonb")
    private String newValues;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String ipAddress;
    
    @Column(nullable = false)
    private String userAgent;
    
    @Column(nullable = false)
    private Instant timestamp;
    
    // Getters and setters
}

// Audit aspect
@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {
    
    private final AuditLogRepository auditLogRepository;
    
    @AfterReturning("@annotation(auditable)")
    public void afterReturning(JoinPoint joinPoint, Auditable auditable) {
        Object[] args = joinPoint.getArgs();
        Object result = ((AfterReturningAdvice) joinPoint.getSignature()).getReturnValue();
        
        String action = auditable.action();
        String entityType = auditable.entityType();
        Long entityId = extractEntityId(joinPoint, auditable);
        Long userId = getCurrentUserId();
        String ipAddress = getClientIp();
        String userAgent = getUserAgent();
        
        AuditLog auditLog = AuditLog.builder()
            .action(action)
            .entityType(entityType)
            .entityId(entityId)
            .userId(userId)
            .ipAddress(ipAddress)
            .userAgent(userAgent)
            .timestamp(Instant.now())
            .build();
        
        auditLogRepository.save(auditLog);
    }
    
    // Helper methods
}

// Custom annotation
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    String action();
    String entityType();
    String entityIdParam() default "id";
}

// Usage
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    
    @PutMapping("/{id}")
    @Auditable(action = "UPDATE", entityType = "USER", entityIdParam = "id")
    public ResponseEntity<UserDto> updateUser(
        @PathVariable Long id, 
        @Valid @RequestBody UserRequest request
    ) {
        // Business logic
    }
}
```

---

## 13. Testing Strategy

### 13.1 Testing Pyramid

```mermaid
flowchart TB
    subgraph Tests
        A[Unit Tests] --> B[Integration Tests]
        B --> C[API Tests]
        C --> D[E2E Tests]
    end
    
    style A fill:#4CAF50
    style B fill:#2196F3
    style C fill:#FF9800
    style D fill:#F44336
```

| Test Type | Coverage | Execution | Tools |
|-----------|----------|-----------|-------|
| Unit Tests | 80%+ | Fast | JUnit 5, Mockito |
| Integration Tests | 70%+ | Medium | Spring Boot Test, Testcontainers |
| API Tests | Key endpoints | Medium | Spring Boot Test, RestAssured |
| E2E Tests | Critical flows | Slow | Cypress, Playwright |

### 13.2 Backend Testing

#### 13.2.1 Unit Tests

```java
// Service unit test
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private UserMapper userMapper;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    @Test
    @DisplayName("Create user - Success")
    void createUser_Success() {
        // Given
        UserRequest request = UserRequest.builder()
            .firstName("John")
            .lastName("Doe")
            .email("john@example.com")
            .phone("9876543210")
            .password("Password123!")
            .userType(UserType.RESIDENT)
            .build();
        
        User user = User.builder()
            .id(1L)
            .firstName("John")
            .lastName("Doe")
            .email("john@example.com")
            .build();
        
        UserDto userDto = UserDto.builder()
            .id(1L)
            .firstName("John")
            .lastName("Doe")
            .email("john@example.com")
            .build();
        
        when(userMapper.toEntity(request)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);
        
        // When
        UserDto result = userService.createUser(request);
        
        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("John Doe", result.getFullName());
        
        verify(userRepository, times(1)).save(user);
    }
    
    @Test
    @DisplayName("Create user - Email already exists")
    void createUser_EmailExists_ThrowsException() {
        // Given
        UserRequest request = UserRequest.builder()
            .email("existing@example.com")
            .build();
        
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);
        
        // When & Then
        assertThrows(ConflictException.class, () -> {
            userService.createUser(request);
        });
    }
}
```

#### 13.2.2 Integration Tests

```java
// Integration test with Testcontainers
@Testcontainers
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");
    
    @Autowired
    private UserRepository userRepository;
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Test
    @DisplayName("Save and find user")
    void saveAndFindUser() {
        // Given
        User user = User.builder()
            .firstName("Test")
            .lastName("User")
            .email("test@example.com")
            .phone("1234567890")
            .password("password")
            .userType(UserType.RESIDENT)
            .build();
        
        // When
        User savedUser = userRepository.save(user);
        User foundUser = userRepository.findById(savedUser.getId()).orElse(null);
        
        // Then
        assertNotNull(foundUser);
        assertEquals("Test User", foundUser.getFullName());
        assertEquals("test@example.com", foundUser.getEmail());
    }
    
    @Test
    @DisplayName("Find by email")
    void findByEmail() {
        // Given
        User user = User.builder()
            .email("unique@example.com")
            .firstName("Unique")
            .lastName("User")
            .build();
        
        userRepository.save(user);
        
        // When
        Optional<User> result = userRepository.findByEmail("unique@example.com");
        
        // Then
        assertTrue(result.isPresent());
        assertEquals("Unique User", result.get().getFullName());
    }
}
```

#### 13.2.3 API Tests

```java
// API test with Spring Boot Test
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private UserService userService;
    
    @Test
    @DisplayName("Get all users - Success")
    @WithMockUser(roles = "ADMIN")
    void getAllUsers_Success() throws Exception {
        // Given
        List<UserDto> users = List.of(
            UserDto.builder().id(1L).firstName("John").lastName("Doe").build(),
            UserDto.builder().id(2L).firstName("Jane").lastName("Smith").build()
        );
        
        Page<UserDto> page = new PageImpl<>(users);
        
        when(userService.getAllUsers(any(Pageable.class))).thenReturn(page);
        
        // When & Then
        mockMvc.perform(get("/api/v1/users")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.content.length()").value(2))
            .andExpect(jsonPath("$.data.content[0].firstName").value("John"));
    }
    
    @Test
    @DisplayName("Create user - Unauthorized")
    void createUser_Unauthorized() throws Exception {
        // Given
        UserRequest request = UserRequest.builder()
            .firstName("John")
            .lastName("Doe")
            .email("john@example.com")
            .build();
        
        // When & Then
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized());
    }
    
    @Test
    @DisplayName("Create user - Validation error")
    @WithMockUser(roles = "ADMIN")
    void createUser_ValidationError() throws Exception {
        // Given
        UserRequest request = UserRequest.builder()
            .firstName("") // Invalid - empty
            .lastName("Doe")
            .email("invalid-email") // Invalid format
            .build();
        
        // When & Then
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }
}
```

### 13.3 Frontend Testing

#### 13.3.1 Unit Tests (Jest)

```jsx
// Button.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('applies correct variant class', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('button-primary');
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    const button = screen.getByText('Clickable');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### 13.3.2 Integration Tests

```jsx
// LoginForm.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import { setupStore } from '../store/store';

describe('LoginForm Component', () => {
  test('submits form with valid data', async () => {
    const store = setupStore();
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123!' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for async actions
    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: 'auth/login/pending',
        })
      );
    });
  });

  test('shows validation errors', async () => {
    const store = setupStore();
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for validation errors
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
```

#### 13.3.3 E2E Tests (Cypress)

```javascript
// cypress/e2e/auth.cy.js
describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.intercept('POST', '/api/v1/auth/login').as('loginRequest');
    
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body.success).to.be.true;
    });
    
    cy.url().should('include', '/dashboard');
    cy.getCookie('token').should('exist');
  });

  it('should show error with invalid credentials', () => {
    cy.intercept('POST', '/api/v1/auth/login').as('loginRequest');
    
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(401);
    });
    
    cy.get('.alert-error').should('be.visible');
    cy.get('.alert-error').should('contain', 'Invalid credentials');
  });

  it('should redirect to login if not authenticated', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});

// cypress/e2e/payment.cy.js
describe('Payment Processing', () => {
  beforeEach(() => {
    cy.login('resident@example.com', 'Resident123!');
  });

  it('should process payment successfully', () => {
    cy.visit('/payments');
    
    // Select payment
    cy.get('.payment-row').first().click();
    cy.get('.btn-pay').click();
    
    // Fill payment form
    cy.get('select[name="paymentMode"]').select('ONLINE');
    cy.get('select[name="paymentGateway"]').select('RAZORPAY');
    cy.get('.btn-submit').click();
    
    // Mock payment gateway response
    cy.intercept('POST', '/api/v1/payments/process').as('paymentRequest');
    cy.wait('@paymentRequest').then((interception) => {
      expect(interception.request.body.paymentStatus).to.eq('PAID');
    });
    
    // Verify success
    cy.get('.payment-success').should('be.visible');
    cy.get('.receipt-number').should('contain', 'RCT-');
  });
});
```

### 13.4 Test Coverage

| Module | Unit Test Coverage | Integration Test Coverage |
|--------|---------------------|----------------------------|
| Controllers | 90% | 70% |
| Services | 95% | 80% |
| Repositories | N/A | 85% |
| DTOs/Mappers | 80% | N/A |
| Utilities | 90% | N/A |
| Frontend Components | 85% | 70% |
| Frontend Hooks | 90% | N/A |
| Frontend Store | 95% | N/A |

---

## 14. Deployment Strategy

### 14.1 Deployment Environments

| Environment | Purpose | URL | Database |
|-------------|---------|-----|----------|
| Local | Development | localhost:3000 | Local PostgreSQL |
| Development | Team testing | dev.society.com | Dev PostgreSQL |
| Staging | Pre-production | staging.society.com | Staging PostgreSQL |
| Production | Live | society.com | Production PostgreSQL |

### 14.2 Deployment Workflow

```mermaid
flowchart TD
    A[Feature Branch] -->|PR| B[Develop Branch]
    B -->|Merge| C[CI Pipeline]
    C -->|Success| D[Build Artifacts]
    D --> E[Deploy to Development]
    E --> F[Automated Tests]
    F -->|Success| G[Ready for QA]
    G -->|Approval| H[Deploy to Staging]
    H --> I[Manual Testing]
    I -->|Approval| J[Merge to Main]
    J --> K[Deploy to Production]
    K --> L[Monitor]
```

### 14.3 Blue-Green Deployment

For zero-downtime deployments:

```mermaid
flowchart LR
    subgraph Production
        A[Blue Environment] -->|Active| B[Load Balancer]
        C[Green Environment] -->|Standby| B
    end
    
    B --> D[Users]
    
    style A fill:#2196F3
    style C fill:#4CAF50
```

Steps:
1. Deploy new version to Green environment
2. Run smoke tests on Green
3. Switch load balancer to Green
4. Monitor Green environment
5. If issues, rollback to Blue
6. If stable, decommission Blue (or make it the new Green)

### 14.4 Canary Deployment

For gradual rollout:

```mermaid
flowchart TD
    A[Load Balancer] -->|90%| B[Stable Version]
    A -->|10%| C[New Version]
    C --> D[Monitor]
    D -->|Success| E[Increase to 25%]
    E --> F[Monitor]
    F -->|Success| G[Increase to 50%]
    G --> H[Monitor]
    H -->|Success| I[100% to New Version]
```

### 14.5 Rollback Strategy

| Scenario | Rollback Action |
|----------|-----------------|
| Deployment failure | Automatic rollback to previous version |
| Critical bug | Manual rollback via CI/CD pipeline |
| Performance issues | Rollback and investigate |
| Data corruption | Restore from backup + rollback |

Rollback commands:
```bash
# For Docker
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# For Kubernetes
kubectl rollout undo deployment/society-backend
kubectl rollout undo deployment/society-frontend
```

### 14.6 Backup Strategy

| Data | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| Database | Daily | 30 days | AWS S3 |
| Database | Weekly | 3 months | AWS S3 |
| Database | Monthly | 1 year | AWS S3 Glacier |
| Application | Daily | 7 days | AWS S3 |
| Logs | Daily | 14 days | AWS CloudWatch |

Backup commands:
```bash
# PostgreSQL backup
pg_dump -U society_user -d society_management -F c -f backup_$(date +%Y%m%d).dump

# Restore
pg_restore -U society_user -d society_management -c backup.dump
```

### 14.7 Disaster Recovery Plan

1. **RTO (Recovery Time Objective):** 4 hours
2. **RPO (Recovery Point Objective):** 1 hour
3. **Steps:**
   - Identify the issue
   - Assess impact
   - Restore from backup
   - Verify data integrity
   - Restart services
   - Monitor for stability

---

## 15. Monitoring & Maintenance

### 15.1 Monitoring Tools

| Tool | Purpose | Metrics |
|------|---------|---------|
| Prometheus | Metrics collection | CPU, Memory, Requests, Errors |
| Grafana | Visualization | Dashboards, Alerts |
| ELK Stack | Logging | Application logs, Error logs |
| Sentry | Error tracking | JavaScript errors, Backend errors |
| New Relic | APM | Transaction tracing, Performance |

### 15.2 Key Metrics

#### 15.2.1 Application Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Response Time | Average API response time | < 500ms |
| Error Rate | Percentage of failed requests | < 1% |
| Throughput | Requests per second | > 100 RPS |
| Memory Usage | JVM heap usage | < 80% |
| CPU Usage | CPU utilization | < 70% |

#### 15.2.2 Business Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Active Users | Daily active users | Growing |
| Payment Success Rate | Successful payment percentage | > 95% |
| Complaint Resolution Time | Average time to resolve complaints | < 24 hours |
| System Uptime | Percentage of time system is available | > 99.9% |

### 15.3 Alerting Rules

```yaml
# Prometheus alerting rules
groups:
- name: application-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[1m]) / rate(http_requests_total[1m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate on {{ $labels.instance }}"
      description: "Error rate is {{ $value }} (5% threshold)"

  - alert: HighResponseTime
    expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time on {{ $labels.instance }}"
      description: "95th percentile response time is {{ $value }}s (1s threshold)"

  - alert: HighMemoryUsage
    expr: jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} > 0.85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage on {{ $labels.instance }}"
      description: "Heap usage is {{ $value }} (85% threshold)"

  - alert: HighCpuUsage
    expr: system_cpu_usage > 0.8
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage on {{ $labels.instance }}"
      description: "CPU usage is {{ $value }} (80% threshold)"

  - alert: ServiceDown
    expr: up == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Service down on {{ $labels.instance }}"
      description: "{{ $labels.instance }} has been down for more than 1 minute"
```

### 15.4 Logging Strategy

#### 15.4.1 Log Levels

| Level | Usage |
|-------|-------|
| TRACE | Very detailed debugging (development only) |
| DEBUG | Debugging information |
| INFO | Important application events |
| WARN | Potential issues |
| ERROR | Errors that need attention |
| FATAL | Critical errors that cause failure |

#### 15.4.2 Log Format

```properties
# logback-spring.xml
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/society-management.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/society-management.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/society-management-error.log</file>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/society-management-error.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>90</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n%ex</pattern>
        </encoder>
    </appender>
    
    <logger name="com.society.management" level="INFO" additivity="false">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="ERROR_FILE"/>
    </logger>
    
    <root level="WARN">
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>
```

#### 15.4.3 Structured Logging

```java
// Structured logging with Logstash
import net.logstash.logback.argument.StructuredArguments;

@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    
    public Payment processPayment(PaymentRequest request) {
        logger.info(
            "Processing payment",
            StructuredArguments.kv("userId", request.getUserId()),
            StructuredArguments.kv("amount", request.getAmount()),
            StructuredArguments.kv("paymentMode", request.getPaymentMode())
        );
        
        try {
            Payment payment = savePayment(request);
            logger.info(
                "Payment processed successfully",
                StructuredArguments.kv("paymentId", payment.getId()),
                StructuredArguments.kv("transactionId", payment.getTransactionId())
            );
            return payment;
        } catch (Exception e) {
            logger.error(
                "Payment processing failed",
                StructuredArguments.kv("userId", request.getUserId()),
                StructuredArguments.kv("amount", request.getAmount()),
                StructuredArguments.kv("error", e.getMessage()),
                e
            );
            throw new PaymentProcessingException("Payment failed", e);
        }
    }
}
```

### 15.5 Maintenance Tasks

| Task | Frequency | Responsible |
|------|-----------|-------------|
| Database backup | Daily | System |
| Log rotation | Daily | System |
| Security updates | Weekly | DevOps |
| Performance review | Monthly | DevOps |
| Database optimization | Quarterly | DBA |
| Disaster recovery test | Semi-annually | DevOps |

### 15.6 Performance Optimization

#### 15.6.1 Database Optimization

- Add indexes for frequently queried columns
- Use query optimization (EXPLAIN ANALYZE)
- Implement database partitioning for large tables
- Use connection pooling
- Implement read replicas for read-heavy workloads

#### 15.6.2 Application Optimization

- Implement caching (Redis) for frequent queries
- Use pagination for large datasets
- Implement lazy loading
- Optimize JPA queries (avoid N+1, use JOIN FETCH)
- Use projection queries (DTO projections)

```java
// Optimized query with projections
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Use projection to fetch only required fields
    @Query("SELECT u.id, u.firstName, u.lastName, u.email FROM User u WHERE u.societyId = :societyId")
    List<UserProjection> findBySocietyIdProjected(@Param("societyId") Long societyId);
    
    // Use JOIN FETCH to avoid N+1
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.unit WHERE u.societyId = :societyId")
    List<User> findBySocietyIdWithUnit(@Param("societyId") Long societyId);
    
    // Use native query for complex operations
    @Query(value = "SELECT * FROM users WHERE society_id = :societyId AND is_active = true", nativeQuery = true)
    List<User> findActiveUsersBySociety(@Param("societyId") Long societyId);
}

public interface UserProjection {
    Long getId();
    String getFirstName();
    String getLastName();
    String getEmail();
}
```

#### 15.6.3 Caching Strategy

```java
// Caching configuration
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .disableCachingNullValues()
            .serializeValuesWith(SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }
    
    @Bean
    public RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer() {
        return (builder) -> builder
            .withCacheConfiguration("users",
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(5)))
            .withCacheConfiguration("societies",
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(30)))
            .withCacheConfiguration("payments",
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(15)));
    }
}

// Service with caching
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    
    @Override
    @Cacheable(value = "users", key = "#societyId")
    public List<UserDto> getUsersBySociety(Long societyId) {
        return userRepository.findBySocietyId(societyId)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @CacheEvict(value = "users", key = "#societyId")
    public UserDto createUser(UserRequest request) {
        // Create user logic
    }
    
    @Override
    @CachePut(value = "users", key = "#user.societyId")
    public UserDto updateUser(Long id, UserRequest request) {
        // Update user logic
    }
}
```

---

## 🎯 Next Steps

1. **Setup Project Structure**
   - Initialize Spring Boot project with Spring Initializr
   - Set up React project with Vite
   - Configure PostgreSQL database
   - Set up Docker and Docker Compose

2. **Implement Core Modules**
   - Authentication and Authorization
   - User Management
   - Society Management
   - Unit Management

3. **Set Up CI/CD**
   - Configure GitHub Actions workflows
   - Set up Docker registry
   - Configure deployment environments

4. **Implement AI Features**
   - Set up Spring AI
   - Implement chatbot
   - Develop predictive maintenance
   - Add smart complaint routing

5. **Testing**
   - Write unit tests
   - Write integration tests
   - Set up E2E testing
   - Perform load testing

6. **Deployment**
   - Deploy to development environment
   - Test thoroughly
   - Deploy to staging for QA
   - Deploy to production

7. **Monitoring**
   - Set up Prometheus and Grafana
   - Configure alerts
   - Set up logging

8. **Maintenance**
   - Regular backups
   - Performance tuning
   - Security updates

---

## 📚 References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Spring AI Documentation](https://docs.spring.io/spring-ai/docs/current/reference/html/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)

---

> **Note:** This plan provides a comprehensive foundation for building a Society Management System. Adjust the scope, timeline, and specific technologies based on your team's expertise and project requirements.