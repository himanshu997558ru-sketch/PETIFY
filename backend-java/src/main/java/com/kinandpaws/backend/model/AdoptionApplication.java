package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdoptionApplication {
    private String id;
    private String petId;
    private String petName;
    private String breed;
    private String species;
    private String shelterName;
    private String submittedDate;
    private String status;
    private String statusVariant; // "success" | "warning" | "info"
    private int currentStep; // 1: Review/Form, 2: Phone Screening, 3: Meet & Greet, 4: Adoption Finalized
    private List<String> steps = new ArrayList<>();
    private String petImageUrl;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String nextMilestone;
    private String scheduledTime;
    private String certId;
    private String notes;

    public AdoptionApplication() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPetId() { return petId; }
    public void setPetId(String petId) { this.petId = petId; }

    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }

    public String getShelterName() { return shelterName; }
    public void setShelterName(String shelterName) { this.shelterName = shelterName; }

    public String getSubmittedDate() { return submittedDate; }
    public void setSubmittedDate(String submittedDate) { this.submittedDate = submittedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStatusVariant() { return statusVariant; }
    public void setStatusVariant(String statusVariant) { this.statusVariant = statusVariant; }

    public int getCurrentStep() { return currentStep; }
    public void setCurrentStep(int currentStep) { this.currentStep = currentStep; }

    public List<String> getSteps() { return steps; }
    public void setSteps(List<String> steps) { this.steps = steps; }

    public String getPetImageUrl() { return petImageUrl; }
    public void setPetImageUrl(String petImageUrl) { this.petImageUrl = petImageUrl; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }

    public String getApplicantPhone() { return applicantPhone; }
    public void setApplicantPhone(String applicantPhone) { this.applicantPhone = applicantPhone; }

    public String getNextMilestone() { return nextMilestone; }
    public void setNextMilestone(String nextMilestone) { this.nextMilestone = nextMilestone; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getCertId() { return certId; }
    public void setCertId(String certId) { this.certId = certId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
