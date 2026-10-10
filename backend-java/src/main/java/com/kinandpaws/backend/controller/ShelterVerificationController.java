package com.kinandpaws.backend.controller;

import com.kinandpaws.backend.model.*;
import com.kinandpaws.backend.service.ShelterVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin(origins = "*")
public class ShelterVerificationController {

    private final ShelterVerificationService verificationService;

    public ShelterVerificationController(ShelterVerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @GetMapping("/requests")
    public ResponseEntity<List<ShelterVerificationRequest>> getAllRequests() {
        return ResponseEntity.ok(verificationService.getAllRequests());
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<ShelterVerificationRequest> getRequest(@PathVariable String id) {
        return verificationService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/requests")
    public ResponseEntity<ShelterVerificationRequest> createRequest(
            @RequestBody ShelterRegistrationData shelter,
            @RequestParam(required = false, defaultValue = "Normal") String priority) {
        return ResponseEntity.ok(verificationService.createRequest(shelter, priority));
    }

    @PostMapping("/requests/{id}/assign-worker")
    public ResponseEntity<ShelterVerificationRequest> assignWorker(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {
        FieldWorker worker = new FieldWorker();
        worker.setName((String) payload.getOrDefault("workerName", "Assigned Officer"));
        worker.setBadgeNumber((String) payload.getOrDefault("badgeNumber", "KP-AUD-100"));
        worker.setDesignation((String) payload.getOrDefault("designation", "Field Auditor"));

        String visitDate = (String) payload.getOrDefault("visitDate", "");
        String visitTime = (String) payload.getOrDefault("visitTime", "");
        String adminNotes = (String) payload.getOrDefault("adminNotes", "");

        return verificationService.assignFieldWorker(id, worker, visitDate, visitTime, adminNotes)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/requests/{id}/report")
    public ResponseEntity<ShelterVerificationRequest> submitReport(
            @PathVariable String id,
            @RequestBody VerificationReport report) {
        return verificationService.submitInspectionReport(id, report)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/requests/{id}/decision")
    public ResponseEntity<ShelterVerificationRequest> adminDecision(
            @PathVariable String id,
            @RequestParam boolean approved,
            @RequestParam(required = false, defaultValue = "") String notes,
            @RequestParam(required = false, defaultValue = "Admin Council") String reviewer) {
        return verificationService.adminDecision(id, approved, notes, reviewer)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
