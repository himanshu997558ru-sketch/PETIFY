package com.kinandpaws.backend.service;

import com.kinandpaws.backend.model.AdoptionApplication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AdoptionWorkflowService {

    private final Map<String, AdoptionApplication> applications = new ConcurrentHashMap<>();

    public AdoptionWorkflowService() {
        seedSampleApplications();
    }

    public List<AdoptionApplication> getAllApplications() {
        return new ArrayList<>(applications.values());
    }

    public Optional<AdoptionApplication> getApplicationById(String id) {
        return Optional.ofNullable(applications.get(id));
    }

    public AdoptionApplication submitApplication(AdoptionApplication app) {
        if (app.getId() == null || app.getId().isBlank()) {
            app.setId("app-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (app.getSubmittedDate() == null) {
            app.setSubmittedDate(LocalDate.now().toString());
        }
        app.setCurrentStep(1);
        app.setStatus("Pending Review");
        app.setStatusVariant("info");
        app.setSteps(List.of("Review", "Phone Screening", "Meet & Greet", "Final Adoption"));
        applications.put(app.getId(), app);
        return app;
    }

    public Optional<AdoptionApplication> advanceStep(String id, int targetStep, String note) {
        AdoptionApplication app = applications.get(id);
        if (app == null) return Optional.empty();

        app.setCurrentStep(targetStep);
        if (note != null) app.setNotes(note);

        switch (targetStep) {
            case 1 -> {
                app.setStatus("Under Review");
                app.setStatusVariant("info");
                app.setNextMilestone("Phone Screening call with adoption counselor");
            }
            case 2 -> {
                app.setStatus("Phone Screening Scheduled");
                app.setStatusVariant("warning");
                app.setNextMilestone("Coordinate visit & companion interaction");
            }
            case 3 -> {
                app.setStatus("Meet & Greet Completed");
                app.setStatusVariant("warning");
                app.setNextMilestone("Final contract signature and transfer of guardianship");
            }
            case 4 -> {
                app.setStatus("Adoption Approved");
                app.setStatusVariant("success");
                app.setCertId("CERT-ADOPT-" + (10000 + new Random().nextInt(90000)));
                app.setNextMilestone("Companion welcomed home!");
            }
            default -> {}
        }

        return Optional.of(app);
    }

    public Optional<AdoptionApplication> rejectApplication(String id, String reason) {
        AdoptionApplication app = applications.get(id);
        if (app == null) return Optional.empty();

        app.setStatus("Application Declined");
        app.setStatusVariant("warning");
        app.setNotes(reason);
        return Optional.of(app);
    }

    private void seedSampleApplications() {
        AdoptionApplication app1 = new AdoptionApplication();
        app1.setId("app-001");
        app1.setPetId("p-1");
        app1.setPetName("Barnaby");
        app1.setBreed("Golden Retriever");
        app1.setShelterName("Haven Woods Sanctuary");
        app1.setSubmittedDate(LocalDate.now().minusDays(3).toString());
        app1.setStatus("Meet & Greet Scheduled");
        app1.setStatusVariant("warning");
        app1.setCurrentStep(3);
        app1.setSteps(List.of("Review", "Phone Screening", "Meet & Greet", "Final Adoption"));
        app1.setPetImageUrl("https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600");
        app1.setApplicantName("Sarah Jenkins");
        app1.setApplicantEmail("sarah.j@example.com");
        app1.setApplicantPhone("+1 (555) 789-0123");
        app1.setNextMilestone("Meet & Greet on Saturday at 2:00 PM");
        app1.setScheduledTime("Saturday, 2:00 PM");
        applications.put(app1.getId(), app1);
    }
}
