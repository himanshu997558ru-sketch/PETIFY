package com.kinandpaws.backend.controller;

import com.kinandpaws.backend.model.AdoptionApplication;
import com.kinandpaws.backend.service.AdoptionWorkflowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/adoptions")
@CrossOrigin(origins = "*")
public class AdoptionController {

    private final AdoptionWorkflowService adoptionService;

    public AdoptionController(AdoptionWorkflowService adoptionService) {
        this.adoptionService = adoptionService;
    }

    @GetMapping
    public ResponseEntity<List<AdoptionApplication>> listApplications() {
        return ResponseEntity.ok(adoptionService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdoptionApplication> getApplication(@PathVariable String id) {
        return adoptionService.getApplicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AdoptionApplication> submitApplication(@RequestBody AdoptionApplication application) {
        return ResponseEntity.ok(adoptionService.submitApplication(application));
    }

    @PatchMapping("/{id}/step")
    public ResponseEntity<AdoptionApplication> advanceStep(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {
        int targetStep = ((Number) payload.getOrDefault("step", 1)).intValue();
        String note = (String) payload.getOrDefault("notes", null);
        return adoptionService.advanceStep(id, targetStep, note)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<AdoptionApplication> rejectApplication(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String reason = payload.getOrDefault("reason", "Application requirements not met");
        return adoptionService.rejectApplication(id, reason)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
