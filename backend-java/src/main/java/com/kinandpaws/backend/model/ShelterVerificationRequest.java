package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kinandpaws.backend.model.enums.VerificationStage;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ShelterVerificationRequest {
    private String requestId;
    private String shelterId;
    private ShelterRegistrationData shelter;
    private VerificationStage stage;
    private String requestDate;
    private String priority; // "Normal" | "High" | "Expedited"
    private FieldWorker assignedWorker;
    private String scheduledVisitDate;
    private String scheduledVisitTime;
    private String adminAssignmentNotes;
    private String workerVisitStartedAt;
    private VerificationReport report;
    private VerifiedShelterBadge badge;

    public ShelterVerificationRequest() {}

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getShelterId() { return shelterId; }
    public void setShelterId(String shelterId) { this.shelterId = shelterId; }

    public ShelterRegistrationData getShelter() { return shelter; }
    public void setShelter(ShelterRegistrationData shelter) { this.shelter = shelter; }

    public VerificationStage getStage() { return stage; }
    public void setStage(VerificationStage stage) { this.stage = stage; }

    public String getRequestDate() { return requestDate; }
    public void setRequestDate(String requestDate) { this.requestDate = requestDate; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public FieldWorker getAssignedWorker() { return assignedWorker; }
    public void setAssignedWorker(FieldWorker assignedWorker) { this.assignedWorker = assignedWorker; }

    public String getScheduledVisitDate() { return scheduledVisitDate; }
    public void setScheduledVisitDate(String scheduledVisitDate) { this.scheduledVisitDate = scheduledVisitDate; }

    public String getScheduledVisitTime() { return scheduledVisitTime; }
    public void setScheduledVisitTime(String scheduledVisitTime) { this.scheduledVisitTime = scheduledVisitTime; }

    public String getAdminAssignmentNotes() { return adminAssignmentNotes; }
    public void setAdminAssignmentNotes(String adminAssignmentNotes) { this.adminAssignmentNotes = adminAssignmentNotes; }

    public String getWorkerVisitStartedAt() { return workerVisitStartedAt; }
    public void setWorkerVisitStartedAt(String workerVisitStartedAt) { this.workerVisitStartedAt = workerVisitStartedAt; }

    public VerificationReport getReport() { return report; }
    public void setReport(VerificationReport report) { this.report = report; }

    public VerifiedShelterBadge getBadge() { return badge; }
    public void setBadge(VerifiedShelterBadge badge) { this.badge = badge; }
}
