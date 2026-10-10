package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfile {
    private String name;
    private String email;
    private String role;
    private String location;
    private String status;
    private String avatarUrl;
    private String livingSpace;
    private String activityLevel;
    private String currentPets;
    private String idVerification;
    private Boolean verified;

    public UserProfile() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getLivingSpace() { return livingSpace; }
    public void setLivingSpace(String livingSpace) { this.livingSpace = livingSpace; }

    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }

    public String getCurrentPets() { return currentPets; }
    public void setCurrentPets(String currentPets) { this.currentPets = currentPets; }

    public String getIdVerification() { return idVerification; }
    public void setIdVerification(String idVerification) { this.idVerification = idVerification; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
}
