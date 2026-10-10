# 🐾 PETIFY — Online Pet Adoption Platform

## 📌 Project Overview

PETIFY is an online pet adoption platform that connects adopters with shelters and rescue organizations.

It brings together pet discovery, adoption applications, shelter registration, inspection workflows, and listing approval. Shelters submit pet listings, verification workers inspect shelters or listings, and administrators review the results before pets are shown as available for adoption.

The project has two main parts:

- **Frontend:** React 19, TypeScript, and Tailwind CSS v4
- **Backend:** Java 17 and Spring Boot 3, organized into configuration, REST controllers, domain models, and services

## 🎯 Project Objective

- Java object-oriented programming and domain modelling
- Java 17 and Spring Boot backend development
- REST API design
- Separation of controllers, models, services, and configuration
- Role-based workflows for adopters, shelters, administrators, and field workers
- Pet listing and adoption application management
- Shelter verification and inspection scoring
- Frontend-to-backend integration
- Web security and CORS configuration

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React 19 | Frontend components and user interface |
| TypeScript | Frontend application logic |
| Tailwind CSS v4 | UI styling |
| Java 17 | Backend programming language |
| Spring Boot 3 | Backend framework |
| Spring Security | Security and CORS configuration |
| Maven | Backend dependency management and build |
| Supabase | Frontend authentication/services |
| Gemini API | AI integration |
| Git and GitHub | Version control |
| VS Code | Development environment |

## ✨ Features

### 👤 Adopter

- Browse available pets
- View pet details and status
- Submit adoption applications
- Track application progress
- Schedule screening appointments
- Maintain profile information

### 🏠 Shelter

- Maintain shelter registration information
- Submit pet listings
- Provide facility and animal-care information
- Take part in shelter verification
- Track verification and approval status

### 👨‍💼 Admin

- Review pet listings
- Review shelter verification information
- Manage verification workflows and assign field workers
- Review inspection reports
- Review adoption application progress
- Award verified shelter badges

### 🔍 Shelter and Pet Verification

Workflow:

1. A shelter registers and submits its information.
2. A verification request is created.
3. A field worker is assigned.
4. An inspection is carried out and recorded.
5. Checklist results and audit scores are submitted.
6. The result is reviewed.
7. The shelter or listing is approved, rejected, or sent for further review.
8. Approved pet listings become available for adoption.

### 📊 Inspection and Audit Scoring

`InspectionAuditScores` and `CategoryScore` represent the scoring information collected during inspections.

## 🧠 Java OOP Concepts

- **Encapsulation:** Domain models such as `Pet`, `UserProfile`, and `VerificationReport` group related data into classes.
- **Abstraction:** Controllers expose operations while business logic stays in service classes.
- **Inheritance and Polymorphism:** Base classes, interfaces, and overridden methods.
- **Separation of Responsibilities:**
  - **Models:** Domain data
  - **Controllers:** HTTP requests
  - **Services:** Business rules and workflows
  - **Configuration:** Backend and security setup
- **Enums:** Domain values such as roles and workflow states, in `model/enums`.

## 🗂️ Backend Domain Models

Located under `com.kinandpaws.backend.model`.

| Model | Purpose |
|---|---|
| `AdoptionApplication.java` | Adoption application information and status |
| `CategoryScore.java` | Category-level inspection score |
| `ChecklistItem.java` | Individual inspection checklist item |
| `FieldWorker.java` | Field worker / inspector information |
| `InspectionAuditScores.java` | Inspection scoring data |
| `InspectionChecklist.java` | Inspection checklist |
| `Pet.java` | Pet listing and status |
| `ShelterMessage.java` | Shelter-related messages |
| `ShelterRegistrationData.java` | Shelter registration and facility information |
| `ShelterVerificationRequest.java` | Shelter verification request |
| `SyncedAppointment.java` | Screening appointment |
| `UserProfile.java` | User profile |
| `VerificationReport.java` | Inspection and verification report |
| `VerifiedShelterBadge.java` | Verified shelter accreditation |

## ⚙️ Backend Components

**Configuration:** `WebSecurityConfig.java` configures web security and CORS.

**REST Controllers**

| Controller | Base Path | Responsibility |
|---|---|---|
| `PetController.java` | `/api/pets` | Pet operations |
| `AuthController.java` | `/api/auth` | Authentication and profiles |
| `AdoptionController.java` | `/api/adoptions` | Adoption applications |
| `ShelterVerificationController.java` | `/api/verification` | Shelter verification |

**Entry point:** `KinAndPawsApplication.java` in `com.kinandpaws.backend`.

## 🔐 Configuration and Security

Environment variables (see `.env.example`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `APP_URL`

Guidelines:

- Never commit real secrets or private API keys.
- Never expose server-only credentials in frontend variables.
- Enforce authorization on the backend.
- Restrict CORS to the intended frontend origins in production.

## 📂 Project Structure

```text
Petify/
│
├── backend-java/
│   ├── pom.xml
│   ├── README.md
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/
│           │       └── kinandpaws/
│           │           └── backend/
│           │               ├── config/
│           │               │   └── WebSecurityConfig.java
│           │               ├── controller/
│           │               │   ├── AdoptionController.java
│           │               │   ├── AuthController.java
│           │               │   ├── PetController.java
│           │               │   └── ShelterVerificationController.java
│           │               ├── model/
│           │               │   ├── enums/
│           │               │   ├── AdoptionApplication.java
│           │               │   ├── CategoryScore.java
│           │               │   ├── ChecklistItem.java
│           │               │   ├── FieldWorker.java
│           │               │   ├── InspectionAuditScores.java
│           │               │   ├── InspectionChecklist.java
│           │               │   ├── Pet.java
│           │               │   ├── ShelterMessage.java
│           │               │   ├── ShelterRegistrationData.java
│           │               │   ├── ShelterVerificationRequest.java
│           │               │   ├── SyncedAppointment.java
│           │               │   ├── UserProfile.java
│           │               │   ├── VerificationReport.java
│           │               │   └── VerifiedShelterBadge.java
│           │               ├── service/
│           │               └── KinAndPawsApplication.java
│           └── resources/
│
├── public/
│   ├── assets/
│   │   └── aistudio/
│   ├── petify-logo.png
│   └── petify-logo.svg
│
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── lib/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── .env.example
├── .gitignore
├── bun.lock
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚙️ Setup and Run

### Prerequisites

- JDK 17
- Apache Maven
- Node.js and npm (or Bun)
- Git

### Run the Backend

```bash
cd backend-java
mvn clean package
mvn spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

### Run the Frontend

From the repository root:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal.

### Environment Setup

Copy `.env.example` to a local environment file and fill in the required values.

## 🧪 Testing Checklist

- [ ] Frontend starts successfully
- [ ] Backend builds successfully
- [ ] REST endpoints respond as expected
- [ ] Pet listings can be retrieved
- [ ] Shelter verification requests can be processed
- [ ] Inspection checklists and reports are handled correctly
- [ ] Adoption applications progress through valid states
- [ ] Role-based authorization is enforced
- [ ] Invalid requests return suitable error responses

## 🔮 Future Improvements

- Persistent database integration (JDBC or Spring Data JPA)
- Automated unit and integration tests
- API documentation with OpenAPI/Swagger
- Token-based authentication and role-based authorization
- Email notifications for adoption updates
- Improved validation and error handling
- Deployment automation and monitoring

## 👨‍💻 Author

**Himanshu Sharma**

## 📄 Project Type

College Project — Online Pet Adoption Platform

- **Frontend:** React 19, TypeScript, Tailwind CSS v4
- **Backend:** Java 17, Spring Boot 3
- **API Style:** REST
- **Build Tool:** Maven
