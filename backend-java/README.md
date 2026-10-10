# Kin & Paws - Java Backend Architecture

This module represents the converted Java implementation of the backend logic, domain models, services, scoring engines, and REST API controllers for **Kin & Paws** (Petify).

## Architecture & Conversion Summary

Per user requirements:
- **Frontend Layer**: Retains HTML, CSS (Tailwind v4), and JavaScript/TypeScript (React 19) in the root application to strictly preserve 100% of the UI, design, responsive layout, animations, client state, and browser compatibility.
- **Backend Logic Layer**: Converted to Java 17 + Spring Boot 3.

### Converted Java Components:
1. **Domain Models & Entities (`com.kinandpaws.backend.model`)**:
   - `Pet`: Companion listings, intake metrics, medical badges, status tracking (`Available`, `Adopted`, `Pending Verification`).
   - `UserProfile`: Adopter, shelter, and admin profiles, housing info, verification flags.
   - `ShelterRegistrationData`: 501(c)(3) registration, facility capacities, species handling.
   - `VerificationReport`: Field inspection audits, GPS check-in/out, detailed checklist, audit scoring.
   - `VerifiedShelterBadge`: Accreditation badge issuance (`KP-VERIFIED-2026-XXXX`).
   - `InspectionAuditScores` & `CategoryScore`: Facility, Hygiene, Welfare, Veterinary, Safety weighted scores.
   - `AdoptionApplication`: 4-step progressive adoption lifecycle.
   - `SyncedAppointment`: In-person and virtual screening appointments.

2. **Core Business Services (`com.kinandpaws.backend.service`)**:
   - `AuditScoreCalculator`: Categorical point weighting, percentage thresholds, and letter grade generation (`Grade A (Exemplary)`, `Grade B (Compliant)`, etc.).
   - `ShelterVerificationService`: 9-stage pipeline state machine (`SHELTER_REGISTRATION` -> `VERIFIED`/`REJECTED`).
   - `AdoptionWorkflowService`: Step-by-step state machine for adoption applications.
   - `PetService`: Listing management, status filtering, and search engine.
   - `AuthService`: Role-based synchronization (`adopter`, `shelter`, `admin`).

3. **REST API Controllers (`com.kinandpaws.backend.controller`)**:
   - `PetController` (`/api/pets`): Companion catalogue and verification endpoints.
   - `ShelterVerificationController` (`/api/verification`): Inspection requests, auditor assignments, audit report submission, accreditation badge generation.
   - `AdoptionController` (`/api/adoptions`): Application review, advancement, and rejection endpoints.
   - `AuthController` (`/api/auth`): Profiles and demo role switcher.

4. **Configuration & Security (`com.kinandpaws.backend.config`)**:
   - `WebSecurityConfig`: Stateless REST security and CORS filter mapping for web clients.
   - `application.properties`: Preserves existing environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `APP_URL`).

## Building & Running
```bash
# Build with Maven
mvn clean package

# Run Spring Boot Application
mvn spring-boot:run
```
