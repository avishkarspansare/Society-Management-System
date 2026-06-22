# Society Management System — Master Plan

> Single-file reference. Production-grade, multi-tenant housing society management platform.
> **Java 21 · Spring Boot 3.x · Maven · Clean Architecture · CQRS · @Async (no Kafka) · Docker**

---

## TABLE OF CONTENTS

1. [Domain Overview & Modules](#1-domain-overview--modules)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture (Layer Diagram)](#4-architecture)
5. [Domain Model (Entity Relationship)](#5-domain-model)
6. [REST API Design (60+ Endpoints)](#6-rest-api-design)
7. [Database Schema (19 Tables)](#7-database-schema)
8. [Design Patterns (22 Patterns)](#8-design-patterns)
9. [Asynchronous Execution (Spring @Async + Events)](#9-asynchronous-execution)
10. [Stability Assessment (What Loses Guarantees Without Kafka)](#10-stability-assessment)
11. [Java Stream Collectors (partitioningBy / groupingBy)](#11-java-stream-collectors)
12. [SDLC & Development Methodology](#12-sdlc--development-methodology)
13. [Security Model (RBAC, 8 Roles)](#13-security-model)
14. [Deployment (Docker Compose Only)](#14-deployment)
15. [Key Code Snippets (Cheat Sheet)](#15-key-code-snippets)
16. [Infrastructure (Docker Compose Services)](#16-infrastructure)
17. [Build Configuration (Maven pom.xml)](#17-build-configuration)

---

## 1. Domain Overview & Modules

| Module | Description |
|--------|-------------|
| **Resident Management** | Member profiles, family units, ownership/tenant tracking, vehicles |
| **Facility Management** | Clubhouse, pool, gym, park bookings with slot management |
| **Billing & Payments** | Maintenance fees, utility bills, penalty calculations, receipts |
| **Complaint & Helpdesk** | Grievance ticketing, SLA tracking, auto-assignment, escalation |
| **Security & Visitor** | Gate management, visitor QR passes, vehicle tracking, RFID |
| **Events & Announcements** | Community events, RSVPs, polls, emergency alerts |
| **Admin & Committee** | RBAC, committee workflows, audit logs, dashboards |
| **Communication** | SMS/Email/Push notifications via @Async |
| **Reports & Analytics** | Financial reports, occupancy stats, complaint analytics |

---

## 2. Technology Stack

```
Language:       Java 21 (Records, Sealed Classes, Pattern Matching, Virtual Threads)
                Java 17 compatible (LTS) — just drop sealed classes and use Lombok @Value
Framework:      Spring Boot 3.3+
Build:          Maven 3.9+ (pom.xml, multi-module)
Database:       PostgreSQL 16 (primary)
Cache:          Redis 7 (session, rate limiting, hot data)
Search:         Elasticsearch 8 (resident search, full-text, audit log indexing)
File Storage:   MinIO (S3-compatible, local dev)
Messaging:      Spring Application Events + @Async + @Scheduled (no external broker)
Auth:           Keycloak 25 (OAuth2/OIDC, JWT)
API Docs:       SpringDoc OpenAPI 3 (Swagger)
Observability:  Micrometer + Prometheus + Grafana
Resilience:     Resilience4j (Circuit Breaker, Retry, Bulkhead, TimeLimiter)
Container:      Docker + Docker Compose (single-host deployment)
Migration:      Flyway
```

### Why No Kafka?

| Aspect | With Kafka | With @Async (this plan) |
|--------|-----------|------------------------|
| Setup complexity | Zookeeper + Kafka cluster | Zero extra infra |
| Delivery guarantee | Exactly-once | At-most-once (fire-and-forget) |
| Event replay | Full log replay | ❌ No replay |
| Audit trail | Event-sourced, immutable | DB audit table (eventual) |
| Cross-module decoupling | Fully async via topics | In-process events, same JVM |
| Ops overhead | 3 brokers minimum for prod | None |
| **Decision** | Better for distributed systems | **Better for monolith / single-team** |

This plan uses `@Async` because: (a) you're deploying on a single Docker host, (b) no distributed system needed yet, (c) simpler operations. See §10 for what loses guarantees.

---

## 3. Project Structure

```
society-management-system/
├── pom.xml                               # Root Maven POM (multi-module)
│
├── society-common/                       # Shared kernel
│   ├── pom.xml
│   └── src/main/java/com/society/common/
│       ├── dto/                          # Shared DTOs
│       ├── exception/                    # Base exceptions
│       ├── util/                         # Utilities
│       └── annotation/                   # Custom annotations
│
├── society-domain/                       # PURE JAVA — zero framework dependencies
│   ├── pom.xml
│   └── src/main/java/com/society/domain/
│       ├── resident/
│       │   ├── Resident.java             # Aggregate root (factory + commands)
│       │   ├── ResidentComponents.java   # FamilyMember, Vehicle
│       │   └── ResidentRepository.java   # Repository port (interface)
│       ├── facility/
│       │   ├── Facility.java             # Slot management + booking logic
│       │   ├── Booking.java              # Lifecycle: PENDING→CONFIRMED→COMPLETED
│       │   └── FacilityRepository.java
│       ├── complaint/
│       │   └── Complaint.java            # Full lifecycle + SLA + escalation
│       ├── billing/
│       │   └── PenaltyStrategy.java      # Strategy pattern
│       └── shared/
│           ├── Ids.java                  # Strongly-typed IDs
│           ├── ValueObjects.java         # Email, Phone, Money, TimeSlot, Address
│           ├── Enums.java                # 18 domain enums
│           ├── DomainExceptions.java
│           ├── event/
│           │   └── DomainEvents.java     # Spring ApplicationEvent hierarchy
│           ├── specification/
│           │   └── SpecificationPattern.java
│           └── patterns/
│               └── BuilderPattern.java
│
├── society-application/                  # Use cases (CQRS + @Async services)
│   ├── pom.xml
│   └── src/main/java/com/society/application/
│       ├── resident/
│       │   ├── command/
│       │   │   ├── ResidentCommands.java
│       │   │   └── ResidentCommandHandler.java
│       │   └── query/
│       │       └── ResidentQueryHandler.java
│       ├── facility/
│       │   ├── command/
│       │   │   ├── FacilityCommands.java
│       │   │   └── FacilityCommandHandler.java
│       │   └── query/
│       │       └── FacilityQueryHandler.java
│       ├── complaint/
│       │   └── ComplaintHandlerChain.java  # Chain of Responsibility
│       ├── saga/
│       │   └── SagaPattern.java
│       ├── async/                          # @Async event-driven services
│       │   ├── AsyncNotificationService.java
│       │   ├── AsyncAuditService.java
│       │   └── ScheduledTasks.java         # @Scheduled batch jobs
│       └── analytics/
│           └── SocietyAnalytics.java       # partitioningBy / groupingBy
│
├── society-infrastructure/               # Adapters (JPA, Redis, ES, MinIO)
│   ├── pom.xml
│   └── src/main/java/com/society/infrastructure/
│       ├── persistence/resident/
│       │   ├── ResidentEntity.java
│       │   └── ResidentJpaRepository.java
│       ├── notification/
│       │   ├── SmsGateway.java
│       │   ├── EmailGateway.java
│       │   └── PushNotificationGateway.java
│       ├── resilience/
│       │   └── ResiliencePatterns.java     # CB + Retry + Bulkhead
│       └── resources/db/migration/
│           └── V1__initial_schema.sql
│
├── society-api/                          # REST delivery layer
│   ├── pom.xml
│   └── src/main/java/com/society/api/
│       ├── controller/
│       │   ├── ResidentController.java
│       │   └── FacilityController.java
│       ├── dto/
│       │   └── DTOs.java
│       ├── exception/
│       │   └── GlobalExceptionHandler.java
│       ├── security/
│       │   ├── SecurityConfig.java
│       │   └── KeycloakRoleConverter.java
│       └── config/
│           ├── OpenApiConfig.java
│           └── AsyncConfig.java           # @EnableAsync + thread pool
│
└── society-boot/                         # Application bootstrap
    ├── pom.xml
    └── src/main/java/com/society/
        ├── SocietyApplication.java
        └── resources/
            └── application.yml
```

---

## 4. Architecture

### 4.1 Layer Diagram (Clean Architecture — Monolith)

```
┌─────────────────────────────────────────────────────────────┐
│                     DELIVERY LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              REST Controllers (Thin)                  │  │
│  │         @PreAuthorize role-based access              │  │
│  └──────────────────────┬───────────────────────────────┘  │
├─────────────────────────┼──────────────────────────────────┤
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              APPLICATION LAYER                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────────┐   │  │
│  │  │ Command   │ │ Query    │ │ @Async Services    │   │  │
│  │  │ Handlers  │ │ Handlers │ │ (Events, Notify,   │   │  │
│  │  │ (CQRS)   │ │ (CQRS)   │ │  Audit, Scheduled) │   │  │
│  │  └────┬─────┘ └────┬─────┘ └────────┬───────────┘   │  │
│  └───────┼─────────────┼───────────────┼───────────────┘  │
│          ▼             ▼               ▼                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                DOMAIN LAYER (Pure Java)              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────────┐    │  │
│  │  │Aggregates│ │  Value   │ │Spring App Events  │    │  │
│  │  │(Rich     │ │  Objects │ │+ Specifications   │    │  │
│  │  │ Domain)  │ │          │ │+ Domain Services  │    │  │
│  │  └────┬─────┘ └────┬─────┘ └────────┬──────────┘    │  │
│  └───────┼─────────────┼───────────────┼───────────────┘  │
│          ▼             ▼               ▼                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             INFRASTRUCTURE LAYER                      │  │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌──────┐ ┌───────┐  │  │
│  │  │  JPA  │ │ Redis │ │  ES   │ │MinIO │ │SMS/   │  │  │
│  │  │  Repos│ │ Cache │ │Search │ │Store │ │Email  │  │  │
│  │  └───────┘ └───────┘ └───────┘ └──────┘ └───────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Key Design Rules

1. **Domain layer has ZERO framework dependencies** — pure Java
2. **No setters on aggregates** — all mutations via named command methods
3. **Strongly-typed IDs** — `ResidentId`, `FacilityId` records, not raw `UUID`
4. **Money as `BigDecimal`** — never `double`/`float` for financial amounts
5. **Ports in domain, Adapters in infrastructure** — Dependency Inversion
6. **Cross-module via Spring ApplicationEvents** — `@EventListener` + `@Async`
7. **Batch jobs via `@Scheduled`** — penalty calculation, SLA checks, report generation
8. **Optimistic locking** (`@Version`) on all aggregate roots
9. **Multi-tenancy** via `society_id` discriminator + Hibernate filter

---

## 5. Domain Model

### 5.1 Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Society    │1───*│      Block       │1───*│     Unit      │
│              │     │                  │     │               │
│ name         │     │ name (A,B,C...)  │     │ unitNumber    │
│ address      │     │ floorCount       │     │ floor         │
│ totalUnits   │     │ unitCount        │     │ areaSqFt      │
│ established  │     │                  │     │ type (1/2/3BH) │
└──────┬───────┘     └──────────────────┘     └───────┬───────┘
       │                                              │
       │                                     ┌────────▼────────┐
       │                              ┌──────┤   Resident      │
       │                              │      │                 │
       │                              │      │ name, email     │
       │                              │      │ phone, photo    │
       │                              │ owns  │ type: OWNER/   │
       │                              │      │       TENANT   │
       │                              │      │ status: ACTIVE/ │
       │                              │      │  INACTIVE/MOVED │
       │                              │      └────────┬────────┘
       │                              │               │
       │                              │      ┌────────▼────────┐
       │                              │      │  FamilyMember   │
       │                              │      └─────────────────┘
       │                              │      ┌─────────────────┐
       │                              │1───* │    Vehicle      │
       │                              │      └─────────────────┘
       │                              │
       ├──────────────────────────────┤
       │                              │
┌──────▼───────┐              ┌───────▼──────┐
│   Facility   │              │   Billing    │
│              │              │              │
│ name, type   │              │ resident     │
│ capacity     │              │ billType     │
│ hourlyRate   │              │ amount       │
│ status       │              │ dueDate      │
│      │       │              │ status       │
│      ▼       │              └──────────────┘
│ ┌──────────┐ │
│ │ Booking  │ │       ┌──────────────┐     ┌──────────────┐
│ │ resident │ │       │  Complaint   │     │   Visitor    │
│ │ date     │ │       │              │     │              │
│ │ slot     │ │       │ category     │     │ name, phone  │
│ │ amount   │ │       │ priority     │     │ hostResident │
│ │ status   │ │       │ status       │     │ purpose      │
│ └──────────┘ │       │ assignedTo   │     │ checkIn/Out  │
└──────────────┘       │ slaDeadline  │     │ qrCodeToken  │
                       │ comments[]   │     └──────────────┘
                       └──────────────┘
┌──────────────┐       ┌──────────────┐     ┌──────────────┐
│    Event     │       │Announcement  │     │    Poll      │
│ title, desc  │       │ title,content│     │ question     │
│ venue, time  │       │ priority     │     │ options[]    │
│ maxAttendees │       │ targetAud    │     │ votes[]      │
│ rsvps[]      │       │ expiryAt     │     │ closesAt     │
└──────────────┘       └──────────────┘     └──────────────┘
```

### 5.2 Aggregate Roots

| Aggregate | Internal Entities | Repository Port |
|-----------|------------------|-----------------|
| `Resident` | `FamilyMember`, `Vehicle` | `ResidentRepository` |
| `Facility` | `Booking` | `FacilityRepository` |
| `Complaint` | `ComplaintComment` | `ComplaintRepository` |
| `Society` | `Block`, `Unit` | `SocietyRepository` |
| `Event` | `EventRsvp` | `EventRepository` |
| `Bill` | — | `BillRepository` |
| `Visitor` | — | `VisitorRepository` |

### 5.3 Value Objects

| VO | Type | Validation |
|----|------|-----------|
| `ResidentId`, `SocietyId`, `FacilityId`, etc. | `record(UUID)` | Non-null |
| `EmailAddress` | `record(String)` | Regex: `^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$` |
| `PhoneNumber` | `record(String)` | Regex: `^\+?[1-9]\d{6,14}$` |
| `Money` | `record(BigDecimal, String)` | Scale ≤ 2, non-null |
| `TimeSlot` | `record(LocalTime, LocalTime)` | end > start |
| `Address` | `record(String...)` | line1, city, state, pinCode required |

---

## 6. REST API Design

### 6.1 Resident Management
```
POST   /api/v1/residents                    Register new resident
GET    /api/v1/residents?page=&size=        List residents (paginated)
GET    /api/v1/residents/{id}               Get resident detail
PUT    /api/v1/residents/{id}               Update resident contact
PATCH  /api/v1/residents/{id}/status        Change status (active/moved-out)
GET    /api/v1/residents/search?name=       Search by name
POST   /api/v1/residents/{id}/family        Add family member
DELETE /api/v1/residents/{id}/family/{fid}  Remove family member
POST   /api/v1/residents/{id}/vehicles      Register vehicle
GET    /api/v1/residents/{id}/vehicles      List vehicles
```

### 6.2 Facility Management
```
GET    /api/v1/facilities?societyId=        List all facilities
GET    /api/v1/facilities/{id}              Facility detail
GET    /api/v1/facilities/{id}/slots?date=  Available time slots
POST   /api/v1/facilities/{id}/bookings     Create booking
GET    /api/v1/facilities/bookings          My bookings
DELETE /api/v1/facilities/{id}/bookings/{bid} Cancel booking
```

### 6.3 Billing & Payments
```
GET    /api/v1/bills                        My bills
GET    /api/v1/bills/{id}                   Bill detail
POST   /api/v1/bills/{id}/pay               Initiate payment
GET    /api/v1/bills/{id}/receipt           Download receipt PDF
GET    /api/v1/bills/outstanding            Outstanding dues
POST   /api/v1/bills/generate               [Admin] Generate monthly bills
GET    /api/v1/bills/reports/monthly        Monthly collection report
GET    /api/v1/bills/reports/defaulter      Defaulter list
POST   /api/v1/bills/penalty/calculate      Calculate late payment penalty
```

### 6.4 Complaint & Helpdesk
```
POST   /api/v1/complaints                   Raise complaint
GET    /api/v1/complaints                   List (filter: status, category)
GET    /api/v1/complaints/{id}              Detail + timeline
PATCH  /api/v1/complaints/{id}/status       Change status
POST   /api/v1/complaints/{id}/comments     Add comment
POST   /api/v1/complaints/{id}/assign       Assign to staff
POST   /api/v1/complaints/{id}/escalate     Escalate complaint
GET    /api/v1/complaints/stats             Complaint statistics
```

### 6.5 Security & Visitor Management
```
POST   /api/v1/visitors                     Pre-register visitor
GET    /api/v1/visitors                     Visitor log
POST   /api/v1/visitors/{id}/check-in       Mark check-in
POST   /api/v1/visitors/{id}/check-out      Mark check-out
POST   /api/v1/visitors/qr/generate         Generate QR pass
GET    /api/v1/visitors/qr/{token}/validate Validate QR (public)
GET    /api/v1/security/entry-log           Entry/exit logs
POST   /api/v1/security/alert               Raise security alert
```

### 6.6 Events & Announcements
```
POST   /api/v1/events                       Create event
GET    /api/v1/events                       List events
GET    /api/v1/events/{id}                  Event detail
POST   /api/v1/events/{id}/rsvp             RSVP
GET    /api/v1/events/{id}/attendees        Attendee list
POST   /api/v1/announcements                Post announcement
POST   /api/v1/polls                        Create poll
POST   /api/v1/polls/{id}/vote              Cast vote
GET    /api/v1/polls/{id}/results           Poll results
```

### 6.7 Admin
```
GET    /api/v1/admin/dashboard              Admin stats
GET    /api/v1/admin/users                  User management
POST   /api/v1/admin/users/{id}/roles       Assign roles
GET    /api/v1/admin/audit-logs             Audit trail
GET    /api/v1/admin/settings               Society settings
PUT    /api/v1/admin/settings               Update settings
POST   /api/v1/admin/backup                 Trigger backup
```

### 6.8 Standard Response Wrapper
```json
{ "success": true, "message": "Success", "data": { ... }, "timestamp": "2026-06-23T00:51:00" }
```

### 6.9 HTTP → Exception Mapping
| Exception | HTTP Status |
|-----------|------------|
| `ResourceNotFoundException` | 404 |
| `BusinessRuleViolationException` | 422 |
| `IllegalArgumentException` | 400 |
| `MethodArgumentNotValidException` | 400 |
| `AccessDeniedException` | 403 |
| Unhandled `Exception` | 500 |

---

## 7. Database Schema

### 7.1 Tables (19 total)

```sql
-- Core
societies (id, name, code, address_*, total_units, established_year, contact_*, is_active)
blocks (id, society_id, name, floor_count, unit_count)
units (id, block_id, society_id, unit_number, floor, area_sq_ft, unit_type, is_occupied)

-- Residents
residents (id, society_id, unit_id, full_name, email, phone, photo_url, type, status, move_in_date, move_out_date, version)
family_members (id, resident_id, name, relation, phone, date_of_birth, blood_group)
vehicles (id, resident_id, registration_number, make, model, type, color, parking_slot_number, rfid_tag, is_active)

-- Facilities
facilities (id, society_id, name, type, description, capacity, hourly_rate, rules[], status, version)
bookings (id, facility_id, resident_id, booking_date, start_time, end_time, purpose, amount, status, version)
  UNIQUE INDEX on (facility_id, booking_date, start_time) WHERE status NOT IN ('CANCELLED','NO_SHOW')

-- Billing
bills (id, society_id, resident_id, bill_type, amount, description, due_date, payment_date, payment_mode, transaction_id, receipt_url, status, version)

-- Complaints
complaints (id, society_id, raised_by, unit_id, category, priority, description, photo_urls[], status, assigned_to, sla_deadline, resolved_at, version)
complaint_comments (id, complaint_id, author_id, text, is_internal, created_at)

-- Visitors
visitors (id, society_id, host_resident_id, name, phone, purpose, vehicle_number, check_in_time, check_out_time, status, qr_code_token, qr_expires_at)

-- Community
events (id, society_id, title, description, organizer_id, venue, start_time, end_time, max_attendees, rsvp_deadline, image_url, status)
event_rsvps (id, event_id, resident_id, status, guest_count, rsvp_at) UNIQUE(event_id, resident_id)
announcements (id, society_id, title, content, priority, target_audience, published_by, published_at, expires_at)
polls (id, society_id, question, options[], created_by, closes_at, is_active)
poll_votes (id, poll_id, resident_id, option_index, voted_at) UNIQUE(poll_id, resident_id)

-- System
audit_logs (id, society_id, entity_type, entity_id, action, changed_by, old_values JSONB, new_values JSONB, ip_address, created_at)
```

### 7.2 Key Indexes
- `residents(society_id, status)` — active resident lookup
- `bookings(facility_id, booking_date)` — slot availability check
- `bookings(facility_id, booking_date, start_time)` — unique slot (partial index)
- `complaints(society_id, status)` — open complaint dashboard
- `bills(society_id, status)` — payment collection view
- `visitors(society_id, status)` — active visitors
- `events(society_id, start_time)` — upcoming events
- `audit_logs(society_id, created_at DESC)` — audit trail queries

---

## 8. Design Patterns

### 8.1 Pattern Inventory (22 patterns)

| # | Pattern | Layer | Purpose |
|---|---------|-------|---------|
| 1 | **Repository** | Domain/Infra | Domain defines port, JPA implements adapter |
| 2 | **Factory Method** | Domain | `Resident.register()`, `Complaint.raise()` — enforce invariants |
| 3 | **CQRS** | Application | Commands (mutations) + Queries (reads) separated |
| 4 | **Adapter** | Infra | `ResidentEntity` ↔ `Resident` mapping, domain never touches `@Entity` |
| 5 | **Aggregate (DDD)** | Domain | `Resident` owns `FamilyMember`+`Vehicle`; `Facility` owns `Booking` |
| 6 | **Value Object** | Domain | `Email`, `Phone`, `Money`, `TimeSlot`, `Address` — immutable records |
| 7 | **Observer (Spring Events)** | Domain/App | `ApplicationEventPublisher` + `@EventListener` + `@Async` |
| 8 | **Template Method** | Application | `ComplaintHandler.doHandle()` — chain base |
| 9 | **Strategy** | Domain | `PenaltyStrategy` — flat-rate, progressive, fixed, with grace period |
| 10 | **Specification** | Domain | `isActive().and(isOwner())` — composable business predicates |
| 11 | **Chain of Responsibility** | Application | Complaint pipeline: Validate→Assign→SLA→Notify |
| 12 | **Builder** | Domain | Fluent `SocietyBuilder` with nested `BlockBuilder`, `UnitBuilder` |
| 13 | **Saga** | Application | Distributed transactions with compensating rollbacks |
| 14 | **Circuit Breaker** | Infra | Resilience4j CB + Retry + Bulkhead for SMS/Payment/Push |
| 15 | **Decorator** | Infra | `Decorators.ofSupplier().withCircuitBreaker().withRetry()` |
| 16 | **Converter** | API | `KeycloakRoleConverter` — JWT claim → GrantedAuthority |
| 17 | **Singleton** | All | Spring-managed beans |
| 18 | **Dependency Injection** | All | Constructor injection throughout |
| 19 | **DTO** | API | Java records: `ResidentResponse`, `RegisterResidentRequest` |
| 20 | **Sealed Class** | Domain | `sealed class DomainEvent permits ResidentEvent, ...` |
| 21 | **Scheduler** | Application | `@Scheduled` — batch SLA checks, penalty accrual, report generation |
| 22 | **Async Pipeline** | Application | `@Async` + `CompletableFuture` — fire-and-forget notifications |

### 8.2 Pattern Density by Layer

```
Domain:         ████████████  Aggregate, VO, Factory, Strategy, Specification, Builder, Event, Sealed Class
Application:    ██████████    CQRS, Chain, Saga, Template Method, Observer, Scheduler, Async Pipeline
Infrastructure: ████████      Adapter, Repository, CB, Decorator
API:            ████          DTO, Converter, Exception Handler
```

---

## 9. Asynchronous Execution

### 9.1 Architecture: Spring Events + @Async + @Scheduled

```
                          ┌──────────────────────────┐
                          │    Spring Application     │
                          │      Event Publisher      │
                          └────────────┬─────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ @Async        │  │ @Async       │  │ @Async       │
            │ Notification  │  │ Audit        │  │ Cache        │
            │ Listener      │  │ Listener     │  │ Invalidator  │
            └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
                   ▼                 ▼                 ▼
            ┌──────────┐    ┌──────────────┐    ┌──────────┐
            │ SMS/Email│    │ audit_logs   │    │  Redis   │
            │ /Push    │    │ (PostgreSQL) │    │  DEL key │
            └──────────┘    └──────────────┘    └──────────┘

            ┌──────────────────────────────────────────────┐
            │          @Scheduled (Cron-based)              │
            │  ┌────────────┐ ┌──────────┐ ┌────────────┐  │
            │  │Penalty     │ │ SLA      │ │ Monthly    │  │
            │  │Accrual     │ │ Breach   │ │ Report Gen │  │
            │  │(daily 2AM) │ │(hourly)  │ │(1st of mo) │  │
            │  └────────────┘ └──────────┘ └────────────┘  │
            └──────────────────────────────────────────────┘
```

### 9.2 @Async Configuration

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean("notificationExecutor")
    public Executor notificationExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("notify-");
        executor.setRejectedExecutionHandler(new CallerRunsPolicy()); // Degrade gracefully
        executor.initialize();
        return executor;
    }

    @Bean("auditExecutor")
    public Executor auditExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("audit-");
        executor.initialize();
        return executor;
    }
}
```

### 9.3 Event-Driven Cross-Module Communication

```java
// 1. Publish event from domain/application layer
@Component
public class DomainEventPublisher {
    private final ApplicationEventPublisher publisher;

    public void publish(DomainEvent event) {
        publisher.publishEvent(event);  // Synchronous by default
    }
}

// 2. Async listener picks it up on a separate thread
@Component
public class NotificationEventListener {

    @Async("notificationExecutor")
    @EventListener
    public void onVisitorCheckedIn(VisitorCheckedInEvent event) {
        smsGateway.send(event.getHostPhone(),
            "Visitor " + event.getVisitorName() + " has arrived. Purpose: " + event.getPurpose());
    }

    @Async("notificationExecutor")
    @EventListener
    public void onComplaintEscalated(ComplaintEscalatedEvent event) {
        pushGateway.sendToStaff(event.getAssignedStaffId(),
            "URGENT: Complaint #" + event.getComplaintId() + " has been escalated.");
    }

    @Async("notificationExecutor")
    @EventListener
    public void onBillOverdue(BillOverdueEvent event) {
        smsGateway.send(event.getResidentPhone(),
            "Your maintenance bill of ₹" + event.getAmount() + " is overdue. Penalty may apply.");
    }
}

// 3. Audit listener — records every domain event
@Component
public class AuditEventListener {

    @Async("auditExecutor")
    @EventListener
    public void onAnyDomainEvent(DomainEvent event) {
        auditLogRepository.save(new AuditLog(
            event.getAggregateType(), event.getAggregateId(),
            event.getClass().getSimpleName(), event.getOccurredAt()));
    }
}
```

### 9.4 @Scheduled Batch Jobs

```java
@Component
@EnableScheduling
public class ScheduledTasks {

    private final BillRepository billRepository;
    private final PenaltyCalculator penaltyCalculator;

    // Daily at 2 AM: calculate penalties on overdue bills
    @Scheduled(cron = "0 0 2 * * *")
    public void accruePenalties() {
        List<Bill> overdueBills = billRepository.findOverdueUnpenalized();
        overdueBills.forEach(bill -> {
            Money penalty = penaltyCalculator.calculatePenalty(bill.getAmount(), bill.getDueDate());
            bill.addPenalty(penalty);
            billRepository.save(bill);
        });
    }

    // Every hour: check SLA breaches
    @Scheduled(cron = "0 0 * * * *")
    public void checkSlaBreaches() {
        List<Complaint> breaches = complaintRepository.findOpenAndSlaBreached();
        breaches.forEach(complaint -> {
            complaint.escalate(ComplaintPriority.URGENT, "SLA breached");
            complaintRepository.save(complaint);
            eventPublisher.publish(new ComplaintSlaBreachedEvent(complaint));
        });
    }

    // 1st of every month at 6 AM: generate monthly bills
    @Scheduled(cron = "0 0 6 1 * *")
    public void generateMonthlyBills() {
        societyRepository.findAllActive().forEach(society ->
            billingService.generateMonthlyMaintenanceBills(society));
    }
}
```

### 9.5 Async Pipeline Map (Replaces Kafka Pipelines)

| # | Pipeline | Trigger | Executor | Delivery |
|---|----------|---------|----------|----------|
| 1 | Visitor Check-in → Host Notification | `ApplicationEvent` | `notificationExecutor` | Push/SMS |
| 2 | Complaint Raised → Auto-Assign | `ApplicationEvent` | `notificationExecutor` | Assign + SMS to staff |
| 3 | Complaint Escalated → Staff Alert | `ApplicationEvent` | `notificationExecutor` | Push notification |
| 4 | Bill Overdue → Penalty + SMS | `@Scheduled` (daily 2AM) | Scheduled thread | DB update + SMS |
| 5 | Security Alert → Fan-out | `ApplicationEvent` | `notificationExecutor` | SMS + Push + Email |
| 6 | All Events → Audit Log | `ApplicationEvent` | `auditExecutor` | PostgreSQL audit_logs |
| 7 | Facility Booking → Cache Invalidation | `ApplicationEvent` | `notificationExecutor` | Redis DEL |
| 8 | SLA Breach Detection | `@Scheduled` (hourly) | Scheduled thread | Escalation + SMS |

---

## 10. Stability Assessment

### ⚠️ What Loses Guarantees Without Kafka

| Feature | With Kafka | Without Kafka (this plan) | Severity |
|---------|-----------|--------------------------|----------|
| **Audit Trail** | Immutable event log, replayable | DB table — an async task failure loses the audit entry | **Medium** |
| **Notification Delivery** | At-least-once, retry via consumer group | At-most-once — if `@Async` thread dies, notification is gone | **Medium** |
| **SLA Breach Detection** | Real-time via Streams windowing | Polling via `@Scheduled` — max 1-hour delay | **Low** |
| **Penalty Accrual** | Real-time event-driven | Daily batch at 2AM — max 24-hour delay | **Low** |
| **Event Ordering** | Partition-ordered | No ordering guarantee across @Async threads | **Low** (not critical for this domain) |
| **Event Replay** | Full Kafka log replay | ❌ Impossible without external broker | **Low** (rarely needed) |
| **Dead Letter Queue** | Built-in Kafka DLQ | ❌ No DLQ — must implement retry table yourself | **Medium** |
| **Cross-Service Scaling** | Services decoupled via topics | All in-process — must split to microservices later | **Low** (monolith is fine for this scale) |

### ✅ What Remains Fully Stable

| Feature | Status |
|---------|--------|
| All CRUD APIs | ✅ Fully stable — synchronous, transactional |
| Domain logic (aggregates, VOs, specifications) | ✅ Pure Java, framework-independent |
| Security (Keycloak, RBAC, JWT) | ✅ External service, no Kafka dependency |
| Circuit Breaker (Resilience4j) | ✅ Wraps external HTTP calls, not events |
| Design patterns (Strategy, Chain, Builder, etc.) | ✅ In-process, no broker needed |
| Database schema (19 tables, Flyway) | ✅ PostgreSQL-only |
| Docker Compose deployment | ✅ Simplified — 2 fewer services to run |

### 🔧 Mitigations (If You Need Guarantees Later)

1. **For reliable notifications:** Add an `outbox` table — persist notification before `@Async`, retry on failure
2. **For audit completeness:** Write audit synchronously (inline) for critical events, async for rest
3. **For guaranteed delivery:** Upgrade to RabbitMQ (lighter than Kafka, still gives DLQ + retry + ordering)
4. **For event replay:** Add Spring Event sourcing with a dedicated `events` table (append-only)

---

## 11. Java Stream Collectors

### 11.1 `partitioningBy()` — Binary Split

```java
// Basic: split owners vs tenants
Map<Boolean, List<Resident>> = residents.stream()
    .collect(partitioningBy(Resident::isOwner));
// → {true=[142 owners], false=[58 tenants]}

// With counting downstream
Map<Boolean, Long> = residents.stream()
    .collect(partitioningBy(Resident::isOwner, counting()));
// → {true=142, false=58}

// With reducing downstream
Map<Boolean, BigDecimal> = bills.stream()
    .collect(partitioningBy(
        b -> b.getStatus() == PAID,
        mapping(Bill::getAmount, reducing(ZERO, BigDecimal::add))));
// → {true=0.00, false=245000.00}

// With averaging downstream
Map<Boolean, Double> = residents.stream()
    .collect(partitioningBy(Resident::isOwner,
        averagingInt(r -> r.getFamilyMembers().size())));
// → {true=3.2, false=1.5}
```

### 11.2 `groupingBy()` — Multi-Bucket

```java
// Basic: group by category
Map<ComplaintCategory, List<Complaint>> = complaints.stream()
    .collect(groupingBy(Complaint::getCategory));
// → {PLUMBING=[...], ELECTRICAL=[...], CIVIL=[...]}

// With counting
Map<ComplaintCategory, Long> = complaints.stream()
    .collect(groupingBy(Complaint::getCategory, counting()));
// → {PLUMBING=23, ELECTRICAL=15, CIVIL=8}

// With reducing (sum amounts)
Map<BillType, BigDecimal> = bills.stream()
    .collect(groupingBy(Bill::getBillType,
        mapping(Bill::getAmount, reducing(ZERO, BigDecimal::add))));
// → {MAINTENANCE=500000.00, UTILITY=120000.00}

// With averaging (avg resolution time)
Map<ComplaintCategory, Double> = complaints.stream()
    .filter(c -> c.getStatus() == RESOLVED)
    .collect(groupingBy(Complaint::getCategory,
        averagingDouble(c -> hoursBetween(c.getCreatedAt(), c.getResolvedAt()))));
// → {PLUMBING=4.5, ELECTRICAL=2.1}

// With collectingAndThen (top category per priority)
Map<ComplaintPriority, ComplaintCategory> = complaints.stream()
    .collect(groupingBy(Complaint::getPriority,
        collectingAndThen(
            groupingBy(Complaint::getCategory, counting()),
            map -> map.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse(null))));
// → {URGENT=ELECTRICAL, HIGH=PLUMBING}
```

### 11.3 Nested `groupingBy()` — Two-Level

```java
// Category → Priority
Map<ComplaintCategory, Map<ComplaintPriority, List<Complaint>>> = complaints.stream()
    .collect(groupingBy(Complaint::getCategory, groupingBy(Complaint::getPriority)));
// → {PLUMBING={URGENT=[...], HIGH=[...]}, ELECTRICAL={URGENT=[...]}}

// Category → Priority → Count
Map<ComplaintCategory, Map<ComplaintPriority, Long>> = complaints.stream()
    .collect(groupingBy(Complaint::getCategory,
        groupingBy(Complaint::getPriority, counting())));
// → {PLUMBING={URGENT=3, HIGH=7}}
```

### 11.4 Combined: `partitioningBy()` + `groupingBy()`

```java
// Partition by ownership, then group each by status
Map<Boolean, Map<ResidentStatus, List<Resident>>> = residents.stream()
    .collect(partitioningBy(Resident::isOwner, groupingBy(Resident::getStatus)));
// → {true={ACTIVE=[...], MOVED_OUT=[]}, false={ACTIVE=[...]}}

// Partition bills by paid/unpaid, count unpaid by type
Map<Boolean, Map<BillType, Long>> = bills.stream()
    .collect(partitioningBy(b -> b.getStatus() == PAID,
        groupingBy(Bill::getBillType, counting())));
// → {true={}, false={MAINTENANCE=12, PENALTY=5}}
```

---

## 12. SDLC & Development Methodology

| Aspect | Approach |
|--------|----------|
| **Methodology** | Agile Scrum (2-week sprints) |
| **Discovery** | Event Storming → Domain Events |
| **Design** | Domain-Driven Design (ubiquitous language) |
| **Development** | TDD/BDD (Specifications → tests → code) |
| **Branching** | Trunk-Based Development |
| **CI/CD** | GitHub Actions / Jenkins → Maven → Docker → Deploy |
| **Testing** | Unit (domain) → Integration (adapters) → E2E (API) → Chaos (resilience) |
| **Deployment** | Docker Compose — single `docker compose up` |

### Lifecycle Phases

```
PHASE 1: EVENT STORMING (Discovery)
  Stakeholders + devs map domain events → identify aggregates, commands, read models

PHASE 2: DOMAIN MODELING (DDD)
  Define aggregates, VOs, repository ports → Specification pattern for business rules
  → Pure Java, zero framework, fully testable

PHASE 3: SPRINT DELIVERY (Vertical Slicing)
  Each feature = complete slice: Command → Handler → Domain → Repository → Controller → DTO
  → Test → Code → Review → Merge → Deploy

PHASE 4: CI/CD
  Push → mvn verify → docker build → docker compose up -d (staging)
  → Smoke tests → docker compose up -d (prod)

PHASE 5: OBSERVABILITY & EVOLUTION
  Prometheus + Grafana dashboards → New features = new event types + @Async listeners
  → Flyway migrations, versioned + rollback-safe
```

---

## 13. Security Model

### 13.1 RBAC (8 Roles)

| Role | Permissions |
|------|------------|
| **SUPER_ADMIN** | Full system access, society creation, backup |
| **SOCIETY_ADMIN** | Resident CRUD, billing, reports, staff management |
| **COMMITTEE_MEMBER** | Approve bookings, view complaints, view reports |
| **SECURITY_STAFF** | Visitor management, gate logs, CCTV access |
| **MAINTENANCE_STAFF** | View/update assigned complaints, facility maintenance |
| **ACCOUNTANT** | Billing, payment reconciliation, financial reports |
| **RESIDENT** | Self-service: bookings, bills, complaints, events |
| **TENANT** | Limited self-service (no voting, no committee access) |

### 13.2 Auth Flow

```
Client → Keycloak (OAuth2/OIDC) → JWT → Spring Security → @PreAuthorize("hasRole('XXX')")
```

---

## 14. Deployment

### 14.1 Docker Compose (Single Host — 7 Services)

```yaml
version: '3.9'
services:
  postgres:        # PostgreSQL 16-alpine — primary database
  redis:           # Redis 7-alpine — cache, sessions, rate limiting
  elasticsearch:   # ES 8.13 — full-text search + audit indexing
  minio:           # MinIO — S3-compatible object storage
  keycloak:        # Keycloak 25 — identity provider
  prometheus:      # Prometheus — metrics
  grafana:         # Grafana — dashboards

  society-app:     # Our Spring Boot application
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/society_db
      SPRING_REDIS_HOST: redis
      SPRING_ELASTICSEARCH_URIS: elasticsearch:9200
    depends_on: [postgres, redis, elasticsearch, keycloak]
```

**7 services total** (vs. 9+ with Kafka/Zookeeper/K8s). Zero external broker dependencies.

### 14.2 Quick Start

```bash
git clone <repo>
cd society-management-system
docker compose up -d              # Start all infra + app
open http://localhost:8080/swagger-ui.html
```

---

## 15. Key Code Snippets

### 15.1 Aggregate Root with Factory
```java
public class Resident {
    private ResidentId id;
    private ResidentStatus status;
    // NO public setters

    public static Resident register(SocietyId sid, UnitId uid, ...) {
        var r = new Resident();
        r.id = ResidentId.generate();
        r.status = ResidentStatus.ACTIVE;
        return r;
    }

    public void markMovedOut(LocalDate date) {
        if (this.status == ResidentStatus.MOVED_OUT)
            throw new DomainException("Already moved out");
        this.status = ResidentStatus.MOVED_OUT;
        this.moveOutDate = date;
    }
}
```

### 15.2 Strongly-Typed ID
```java
public record ResidentId(UUID value) {
    public ResidentId { Objects.requireNonNull(value); }
    public static ResidentId generate() { return new ResidentId(UUID.randomUUID()); }
    public static ResidentId from(String id) { return new ResidentId(UUID.fromString(id)); }
}
```

### 15.3 CQRS Command + Handler
```java
public record RegisterResidentCommand(
    SocietyId societyId, UnitId unitId, String fullName,
    EmailAddress email, PhoneNumber phone, ResidentType type) {}

public class ResidentCommandHandler {
    private final ResidentRepository repo;
    private final ApplicationEventPublisher events;

    public Resident handle(RegisterResidentCommand cmd) {
        var resident = Resident.register(cmd.societyId(), cmd.unitId(), ...);
        var saved = repo.save(resident);
        events.publishEvent(new ResidentRegisteredEvent(saved)); // Triggers @Async listeners
        return saved;
    }
}
```

### 15.4 @Async Event Listener (Replaces Kafka Consumer)
```java
@Component
public class NotificationEventListener {

    @Async("notificationExecutor")
    @EventListener
    public void onResidentRegistered(ResidentRegisteredEvent event) {
        smsGateway.send(event.getPhone(),
            "Welcome to " + event.getSocietyName() + ", " + event.getResidentName() + "!");
    }
}
```

### 15.5 @Scheduled Batch Job (Replaces Kafka Streams)
```java
@Component
public class ScheduledTasks {

    @Scheduled(cron = "0 0 2 * * *")  // Daily 2 AM
    public void accruePenalties() {
        billRepository.findOverdueUnpenalized().forEach(bill -> {
            Money penalty = penaltyCalculator.calculatePenalty(
                bill.getAmount(), bill.getDueDate());
            bill.addPenalty(penalty);
            billRepository.save(bill);
        });
    }
}
```

### 15.6 Circuit Breaker for External Calls
```java
Supplier<PaymentResult> resilient = Decorators.ofSupplier(() -> paymentGateway.charge(amount))
    .withCircuitBreaker(cb)
    .withRetry(retry)
    .withBulkhead(bulkhead)
    .withFallback(ex -> PaymentResult.failed())
    .decorate();
```

### 15.7 Controller
```java
@RestController
@RequestMapping("/api/v1/residents")
public class ResidentController {
    private final ResidentCommandHandler cmdHandler;

    @PostMapping
    @PreAuthorize("hasRole('SOCIETY_ADMIN')")
    public ResponseEntity<ResidentResponse> register(@Valid @RequestBody RegisterResidentRequest req) {
        var resident = cmdHandler.handle(/* map from req */);
        return ResponseEntity.created(URI.create("/api/v1/residents/" + resident.getId().value()))
            .body(ResidentResponse.from(resident));
    }
}
```

### 15.8 Global Exception Handler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(ApiResponse.error(ex.getMessage()));
    }
    @ExceptionHandler(BusinessRuleViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessRule(BusinessRuleViolationException ex) {
        return ResponseEntity.status(422).body(ApiResponse.error(ex.getMessage()));
    }
}
```

---

## 16. Infrastructure

### 16.1 Docker Compose (Full File)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: society_db
      POSTGRES_USER: society
      POSTGRES_PASSWORD: society_secret
    ports: ["5432:5432"]
    volumes: [pg_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U society -d society_db"]

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass redis_secret --maxmemory 512mb --maxmemory-policy allkeys-lru
    ports: ["6379:6379"]
    volumes: [redis_data:/data]

  elasticsearch:
    image: elasticsearch:8.13.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports: ["9200:9200"]
    volumes: [es_data:/usr/share/elasticsearch/data]

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin_secret
    ports: ["9000:9000", "9001:9001"]
    volumes: [minio_data:/data]

  keycloak:
    image: quay.io/keycloak/keycloak:25.0
    command: start-dev
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin_secret
    ports: ["8081:8080"]

  prometheus:
    image: prom/prometheus:latest
    volumes: [./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml]
    ports: ["9090:9090"]

  grafana:
    image: grafana/grafana:latest
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    ports: ["3000:3000"]

  society-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports: ["8080:8080"]
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/society_db
      SPRING_DATASOURCE_USERNAME: society
      SPRING_DATASOURCE_PASSWORD: society_secret
      SPRING_DATA_REDIS_HOST: redis
      SPRING_DATA_REDIS_PASSWORD: redis_secret
      SPRING_ELASTICSEARCH_URIS: elasticsearch:9200
      APP_STORAGE_MINIO_ENDPOINT: http://minio:9000
      SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI: http://keycloak:8080/realms/society
    depends_on:
      postgres:    { condition: service_healthy }
      redis:       { condition: service_started }
      elasticsearch: { condition: service_started }
      keycloak:    { condition: service_started }

volumes:
  pg_data:
  redis_data:
  es_data:
  minio_data:
```

### 16.2 Dockerfile

```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY society-boot/target/society-boot-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseZGC", "-jar", "app.jar"]
```

---

## 17. Build Configuration

### 17.1 Root pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.society</groupId>
    <artifactId>society-management-system</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.0</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>21</java.version>
        <!-- For Java 17, change to: <java.version>17</java.version> -->
        <springdoc.version>2.5.0</springdoc.version>
        <resilience4j.version>2.2.0</resilience4j.version>
        <minio.version>8.5.7</minio.version>
        <testcontainers.version>1.19.7</testcontainers.version>
    </properties>

    <modules>
        <module>society-common</module>
        <module>society-domain</module>
        <module>society-application</module>
        <module>society-infrastructure</module>
        <module>society-api</module>
        <module>society-boot</module>
    </modules>

    <dependencyManagement>
        <dependencies>
            <!-- Internal modules -->
            <dependency>
                <groupId>com.society</groupId>
                <artifactId>society-common</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.society</groupId>
                <artifactId>society-domain</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.society</groupId>
                <artifactId>society-application</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.society</groupId>
                <artifactId>society-infrastructure</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.society</groupId>
                <artifactId>society-api</artifactId>
                <version>${project.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <release>21</release>  <!-- Use 17 for Java 17 -->
                    <parameters>true</parameters>  <!-- For constructor injection -->
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 17.2 Module pom.xml Examples

**society-domain/pom.xml** — Zero dependencies:
```xml
<project>
    <parent>
        <groupId>com.society</groupId>
        <artifactId>society-management-system</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <artifactId>society-domain</artifactId>
    <!-- No dependencies — pure Java -->
</project>
```

**society-application/pom.xml** — Depends on domain:
```xml
<project>
    <parent>
        <groupId>com.society</groupId>
        <artifactId>society-management-system</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <artifactId>society-application</artifactId>
    <dependencies>
        <dependency>
            <groupId>com.society</groupId>
            <artifactId>society-domain</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
    </dependencies>
</project>
```

**society-infrastructure/pom.xml**:
```xml
<project>
    <parent>
        <groupId>com.society</groupId>
        <artifactId>society-management-system</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <artifactId>society-infrastructure</artifactId>
    <dependencies>
        <dependency><groupId>com.society</groupId><artifactId>society-domain</artifactId></dependency>
        <dependency><groupId>com.society</groupId><artifactId>society-application</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-redis</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-elasticsearch</artifactId></dependency>
        <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId></dependency>
        <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-core</artifactId></dependency>
        <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-database-postgresql</artifactId></dependency>
        <dependency><groupId>io.minio</groupId><artifactId>minio</artifactId><version>${minio.version}</version></dependency>
        <dependency><groupId>io.github.resilience4j</groupId><artifactId>resilience4j-spring-boot3</artifactId></dependency>
        <dependency><groupId>io.github.resilience4j</groupId><artifactId>resilience4j-circuitbreaker</artifactId></dependency>
        <dependency><groupId>io.github.resilience4j</groupId><artifactId>resilience4j-retry</artifactId></dependency>
        <dependency><groupId>io.github.resilience4j</groupId><artifactId>resilience4j-bulkhead</artifactId></dependency>
    </dependencies>
</project>
```

**society-api/pom.xml** (Spring Boot application):
```xml
<project>
    <parent>
        <groupId>com.society</groupId>
        <artifactId>society-management-system</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <artifactId>society-api</artifactId>
    <dependencies>
        <dependency><groupId>com.society</groupId><artifactId>society-application</artifactId></dependency>
        <dependency><groupId>com.society</groupId><artifactId>society-infrastructure</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-oauth2-resource-server</artifactId></dependency>
        <dependency><groupId>org.springdoc</groupId><artifactId>springdoc-openapi-starter-webmvc-ui</artifactId><version>${springdoc.version}</version></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-actuator</artifactId></dependency>
        <dependency><groupId>io.micrometer</groupId><artifactId>micrometer-registry-prometheus</artifactId></dependency>
    </dependencies>
</project>
```

**society-boot/pom.xml** (Entry point):
```xml
<project>
    <parent>
        <groupId>com.society</groupId>
        <artifactId>society-management-system</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <artifactId>society-boot</artifactId>
    <dependencies>
        <dependency><groupId>com.society</groupId><artifactId>society-api</artifactId></dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 17.3 Key application.yml

```yaml
spring:
  application.name: society-management-system
  datasource:
    url: jdbc:postgresql://localhost:5432/society_db
    username: society
    password: society_secret
  jpa:
    hibernate.ddl-auto: validate
    open-in-view: false
  flyway.enabled: true
  data.redis:
    host: localhost
    port: 6379
    password: redis_secret
  elasticsearch.uris: localhost:9200

  security.oauth2.resourceserver.jwt:
    issuer-uri: http://localhost:8081/realms/society
    jwk-set-uri: http://localhost:8081/realms/society/protocol/openid-connect/certs

app:
  async:
    notification.pool.core: 4
    notification.pool.max: 10
    audit.pool.core: 2
    audit.pool.max: 4
  billing.penalty:
    grace-period-days: 15
    rate-percent: 2.0
  facility.booking:
    max-days-advance: 30
    cancellation-deadline-hours: 24
  security.visitor.qr-expiry-minutes: 480

server.port: 8080
```

### 17.4 Build & Run Commands

```bash
# Build everything
mvn clean package -DskipTests

# Run tests
mvn verify

# Build & run with Docker
docker compose up --build -d

# Run locally (needs infra running)
mvn -pl society-boot spring-boot:run

# Run a single module's tests
mvn -pl society-domain test
```

---

## QUICK REFERENCE CARD

```
┌─────────────────────────────────────────────────────────────┐
│  SOCIETY MANAGEMENT SYSTEM — QUICK REFERENCE               │
├─────────────────────────────────────────────────────────────┤
│  Language:     Java 21 (or 17)  │  Framework:  Spring Boot 3│
│  Architecture: Clean/Hexagonal  │  Pattern:    CQRS + DDD  │
│  Build:        Maven 3.9+       │  Async:      @Async + App│
│                                     Events + @Scheduled    │
│  Database:     PostgreSQL 16    │  Cache:      Redis 7     │
│  Search:       Elasticsearch 8  │  Storage:    MinIO       │
│  Auth:         Keycloak 25      │  Deploy:     Docker      │
│                                       Compose (7 services) │
├─────────────────────────────────────────────────────────────┤
│  Modules:      6 (Domain, App, Infra, API, Boot, Common)   │
│  Aggregates:   7 (Resident, Facility, Complaint, Bill,     │
│                    Visitor, Event, Society)                 │
│  API Endpoints: 60+ across 7 controllers                   │
│  DB Tables:    19 with indexes + Flyway migrations         │
│  Patterns:     22 design patterns                          │
│  Async Pipes:  8 pipeline equivalents (@Async + @Scheduled)│
│  Roles:        8 RBAC roles                                │
│  Collectors:   partitioningBy, groupingBy (nested),        │
│                counting, reducing, averagingDouble,        │
│                mapping, collectingAndThen                  │
├─────────────────────────────────────────────────────────────┤
│  SDLC:         Agile Scrum + DDD + TDD + Trunk-Based Dev   │
│  Testing:      Unit → Integration → E2E → Chaos            │
│  CI/CD:        Maven → Docker → docker compose up          │
├─────────────────────────────────────────────────────────────┤
│  ⚠ STABILITY: Notifications are at-most-once.              │
│     For guaranteed delivery, add outbox pattern table.     │
│     Audit entries may be lost if @Async executor dies.     │
│     SLA checks have max 1-hour delay (polling, not stream).│
│     All CRUD + domain logic + security are fully stable.   │
└─────────────────────────────────────────────────────────────┘
```

---

*Generated as a single-file master reference. Java 21 · Spring Boot 3 · Maven · @Async · Docker Compose. No Kafka, no Kubernetes.*
