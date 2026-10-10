package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SyncedAppointment {
    private String id;
    private String petName;
    private String shelterName;
    private String adopter;
    private String email;
    private String phone;
    private String date;
    private String timeSlot;
    private String type; // "In-Person Visit" | "Video Screening Call"
    private String status; // "Pending Shelter Confirmation" | "Confirmed" | "Completed" | "Cancelled"
    private String notes;

    public SyncedAppointment() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }

    public String getShelterName() { return shelterName; }
    public void setShelterName(String shelterName) { this.shelterName = shelterName; }

    public String getAdopter() { return adopter; }
    public void setAdopter(String adopter) { this.adopter = adopter; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
