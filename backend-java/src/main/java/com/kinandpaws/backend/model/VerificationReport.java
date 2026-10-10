package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class VerificationReport {
    private String reportId;
    private String workerId;
    private String workerName;
    private String workerBadge;
    private String visitDate;
    private String visitStartTime;
    private String visitEndTime;
    private double overallScore; // 0 - 100
    private String overallGrade; // "Grade A (Exemplary)" | "Grade B (Compliant)" | "Grade C (Conditional)" | "Fail (Non-Compliant)"
    private InspectionChecklist checklist;
    private Map<String, String> checklistNotes = new HashMap<>();
    private List<ChecklistItem> detailedChecklist = new ArrayList<>();
    private InspectionAuditScores auditScores;
    private String inspectorObservations;
    private String inspectorRecommendation; // "Recommend Verification" | "Requires Rectification" | "Recommend Rejection"
    private String workerSignature;
    private String uploadedAt;
    private String checkInTime;
    private String checkOutTime;
    private List<String> recommendations = new ArrayList<>();

    public VerificationReport() {}

    public String getReportId() { return reportId; }
    public void setReportId(String reportId) { this.reportId = reportId; }

    public String getWorkerId() { return workerId; }
    public void setWorkerId(String workerId) { this.workerId = workerId; }

    public String getWorkerName() { return workerName; }
    public void setWorkerName(String workerName) { this.workerName = workerName; }

    public String getWorkerBadge() { return workerBadge; }
    public void setWorkerBadge(String workerBadge) { this.workerBadge = workerBadge; }

    public String getVisitDate() { return visitDate; }
    public void setVisitDate(String visitDate) { this.visitDate = visitDate; }

    public String getVisitStartTime() { return visitStartTime; }
    public void setVisitStartTime(String visitStartTime) { this.visitStartTime = visitStartTime; }

    public String getVisitEndTime() { return visitEndTime; }
    public void setVisitEndTime(String visitEndTime) { this.visitEndTime = visitEndTime; }

    public double getOverallScore() { return overallScore; }
    public void setOverallScore(double overallScore) { this.overallScore = overallScore; }

    public String getOverallGrade() { return overallGrade; }
    public void setOverallGrade(String overallGrade) { this.overallGrade = overallGrade; }

    public InspectionChecklist getChecklist() { return checklist; }
    public void setChecklist(InspectionChecklist checklist) { this.checklist = checklist; }

    public Map<String, String> getChecklistNotes() { return checklistNotes; }
    public void setChecklistNotes(Map<String, String> checklistNotes) { this.checklistNotes = checklistNotes; }

    public List<ChecklistItem> getDetailedChecklist() { return detailedChecklist; }
    public void setDetailedChecklist(List<ChecklistItem> detailedChecklist) { this.detailedChecklist = detailedChecklist; }

    public InspectionAuditScores getAuditScores() { return auditScores; }
    public void setAuditScores(InspectionAuditScores auditScores) { this.auditScores = auditScores; }

    public String getInspectorObservations() { return inspectorObservations; }
    public void setInspectorObservations(String inspectorObservations) { this.inspectorObservations = inspectorObservations; }

    public String getInspectorRecommendation() { return inspectorRecommendation; }
    public void setInspectorRecommendation(String inspectorRecommendation) { this.inspectorRecommendation = inspectorRecommendation; }

    public String getWorkerSignature() { return workerSignature; }
    public void setWorkerSignature(String workerSignature) { this.workerSignature = workerSignature; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }

    public String getCheckInTime() { return checkInTime; }
    public void setCheckInTime(String checkInTime) { this.checkInTime = checkInTime; }

    public String getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
}
