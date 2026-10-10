package com.kinandpaws.backend.service;

import com.kinandpaws.backend.model.*;
import com.kinandpaws.backend.model.enums.VerificationStage;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ShelterVerificationService {

    private final Map<String, ShelterVerificationRequest> requests = new ConcurrentHashMap<>();
    private final AuditScoreCalculator scoreCalculator;

    public ShelterVerificationService(AuditScoreCalculator scoreCalculator) {
        this.scoreCalculator = scoreCalculator;
        seedDefaultVerification();
    }

    public List<ShelterVerificationRequest> getAllRequests() {
        return new ArrayList<>(requests.values());
    }

    public Optional<ShelterVerificationRequest> getRequestById(String requestId) {
        return Optional.ofNullable(requests.get(requestId));
    }

    public ShelterVerificationRequest createRequest(ShelterRegistrationData shelterData, String priority) {
        String requestId = "req-" + UUID.randomUUID().toString().substring(0, 8);
        ShelterVerificationRequest req = new ShelterVerificationRequest();
        req.setRequestId(requestId);
        req.setShelterId(shelterData.getId() != null ? shelterData.getId() : "sh-" + UUID.randomUUID().toString().substring(0, 8));
        req.setShelter(shelterData);
        req.setStage(VerificationStage.VERIFICATION_REQUESTED);
        req.setRequestDate(LocalDate.now().toString());
        req.setPriority(priority != null ? priority : "Normal");
        requests.put(requestId, req);
        return req;
    }

    public Optional<ShelterVerificationRequest> assignFieldWorker(String requestId, FieldWorker worker, String visitDate, String visitTime, String adminNotes) {
        ShelterVerificationRequest req = requests.get(requestId);
        if (req == null) return Optional.empty();

        req.setAssignedWorker(worker);
        req.setScheduledVisitDate(visitDate);
        req.setScheduledVisitTime(visitTime);
        req.setAdminAssignmentNotes(adminNotes);
        req.setStage(VerificationStage.WORKER_ASSIGNED);
        return Optional.of(req);
    }

    public Optional<ShelterVerificationRequest> submitInspectionReport(String requestId, VerificationReport report) {
        ShelterVerificationRequest req = requests.get(requestId);
        if (req == null) return Optional.empty();

        if (report.getDetailedChecklist() != null && !report.getDetailedChecklist().isEmpty()) {
            InspectionAuditScores scores = scoreCalculator.calculateScores(report.getDetailedChecklist());
            report.setAuditScores(scores);
            report.setOverallScore(scores.getTotalScore());
            report.setOverallGrade(scores.getGrade());
        }

        req.setReport(report);
        req.setStage(VerificationStage.REPORT_UPLOADED);
        return Optional.of(req);
    }

    public Optional<ShelterVerificationRequest> adminDecision(String requestId, boolean approved, String adminNotes, String reviewerName) {
        ShelterVerificationRequest req = requests.get(requestId);
        if (req == null) return Optional.empty();

        if (approved) {
            req.setStage(VerificationStage.VERIFIED);

            VerifiedShelterBadge badge = new VerifiedShelterBadge();
            badge.setBadgeId("bdg-" + UUID.randomUUID().toString().substring(0, 8));
            badge.setShelterId(req.getShelterId());
            badge.setShelterName(req.getShelter() != null ? req.getShelter().getShelterName() : "Shelter");
            badge.setAccreditationCode("KP-VERIFIED-2026-" + (1000 + new Random().nextInt(9000)));
            badge.setVerificationId(req.getRequestId());
            badge.setIssueDate(LocalDate.now().toString());
            badge.setValidUntil(LocalDate.now().plusYears(1).toString());
            badge.setVerificationOfficer(req.getAssignedWorker() != null ? req.getAssignedWorker().getName() : "Officer");
            badge.setApprovedByAdmin(reviewerName != null ? reviewerName : "Admin Council");
            badge.setFacilityRating(req.getReport() != null ? req.getReport().getOverallGrade() : "Grade A (Exemplary)");
            badge.setStatus("ACTIVE");
            req.setBadge(badge);
        } else {
            req.setStage(VerificationStage.REJECTED);
        }

        return Optional.of(req);
    }

    private void seedDefaultVerification() {
        ShelterRegistrationData shelter = new ShelterRegistrationData();
        shelter.setId("sh-haven");
        shelter.setShelterName("Haven Woods Animal Sanctuary");
        shelter.setLegalRegNumber("501C3-994821");
        shelter.setTaxId("XX-982144");
        shelter.setShelterType("Sanctuary");
        shelter.setDirectorName("Elena Rostova");
        shelter.setContactPhone("+1 (555) 234-5678");
        shelter.setContactEmail("contact@havenwoods.org");
        shelter.setStreetAddress("1400 Pine Valley Way");
        shelter.setCity("Seattle");
        shelter.setState("WA");
        shelter.setZipCode("98101");
        shelter.setAnimalCapacity(60);
        shelter.setCurrentAnimalCount(42);
        shelter.setSpeciesHandled(List.of("Canine", "Feline"));
        shelter.setFacilities(List.of("Climate-controlled kennels", "Outdoor agility paddock", "Dedicated medical suite"));
        shelter.setRegisteredAt(LocalDate.now().minusDays(14).toString());

        ShelterVerificationRequest req = new ShelterVerificationRequest();
        req.setRequestId("req-haven-01");
        req.setShelterId(shelter.getId());
        req.setShelter(shelter);
        req.setStage(VerificationStage.VERIFIED);
        req.setRequestDate(LocalDate.now().minusDays(14).toString());
        req.setPriority("High");

        FieldWorker worker = new FieldWorker();
        worker.setId("fw-1");
        worker.setName("Dr. Julian Thorne");
        worker.setDesignation("Lead Veterinary Auditor");
        worker.setBadgeNumber("KP-AUD-042");
        worker.setRegion("Pacific Northwest");
        req.setAssignedWorker(worker);

        VerifiedShelterBadge badge = new VerifiedShelterBadge();
        badge.setBadgeId("bdg-haven-01");
        badge.setShelterId(shelter.getId());
        badge.setShelterName(shelter.getShelterName());
        badge.setAccreditationCode("KP-VERIFIED-2026-1309");
        badge.setIssueDate(LocalDate.now().minusDays(5).toString());
        badge.setValidUntil(LocalDate.now().plusMonths(11).toString());
        badge.setVerificationOfficer("Dr. Julian Thorne");
        badge.setApprovedByAdmin("Chief Ethics Officer");
        badge.setFacilityRating("Grade A (Exemplary)");
        badge.setStatus("ACTIVE");
        req.setBadge(badge);

        requests.put(req.getRequestId(), req);
    }
}
