package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FieldWorker {
    private String id;
    private String name;
    private String designation;
    private String avatarUrl;
    private String phone;
    private String email;
    private String badgeNumber;
    private String specialty;
    private String region;
    private int activeAuditsCount;

    public FieldWorker() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public int getActiveAuditsCount() { return activeAuditsCount; }
    public void setActiveAuditsCount(int activeAuditsCount) { this.activeAuditsCount = activeAuditsCount; }
}
