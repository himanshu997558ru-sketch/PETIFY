package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class VerifiedShelterBadge {
    private String badgeId;
    private String shelterId;
    private String shelterName;
    private String accreditationCode; // e.g. KP-VERIFIED-2026-1309
    private String verificationId;
    private String issueDate;
    private String validUntil;
    private String verificationOfficer;
    private String approvedByAdmin;
    private String facilityRating;
    private String verificationSeal;
    private String status; // "ACTIVE" | "ACCREDITED" | "REVOKED" | "EXPIRED"

    public VerifiedShelterBadge() {}

    public String getBadgeId() { return badgeId; }
    public void setBadgeId(String badgeId) { this.badgeId = badgeId; }

    public String getShelterId() { return shelterId; }
    public void setShelterId(String shelterId) { this.shelterId = shelterId; }

    public String getShelterName() { return shelterName; }
    public void setShelterName(String shelterName) { this.shelterName = shelterName; }

    public String getAccreditationCode() { return accreditationCode; }
    public void setAccreditationCode(String accreditationCode) { this.accreditationCode = accreditationCode; }

    public String getVerificationId() { return verificationId; }
    public void setVerificationId(String verificationId) { this.verificationId = verificationId; }

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getValidUntil() { return validUntil; }
    public void setValidUntil(String validUntil) { this.validUntil = validUntil; }

    public String getVerificationOfficer() { return verificationOfficer; }
    public void setVerificationOfficer(String verificationOfficer) { this.verificationOfficer = verificationOfficer; }

    public String getApprovedByAdmin() { return approvedByAdmin; }
    public void setApprovedByAdmin(String approvedByAdmin) { this.approvedByAdmin = approvedByAdmin; }

    public String getFacilityRating() { return facilityRating; }
    public void setFacilityRating(String facilityRating) { this.facilityRating = facilityRating; }

    public String getVerificationSeal() { return verificationSeal; }
    public void setVerificationSeal(String verificationSeal) { this.verificationSeal = verificationSeal; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
