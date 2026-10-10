package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Pet {
    private String id;
    private String name;
    private String species; // "Dog" | "Cat" | "Other"
    private String breed;
    private String age;
    private String gender; // "Male" | "Female"
    private String distance;
    private String description;
    private String imageUrl;
    private List<String> tags = new ArrayList<>();
    private String medicalBadge;
    private Boolean urgent;
    private Boolean isSaved;
    private String status; // "Available" | "Pending" | "Adopted" | "Foster Needed"
    private String adminStatus; // "Approved" | "Pending" | "Rejected"
    private String verificationStatus; // "Verified" | "Pending Verification"
    private String shelterName;
    private String shelterId;
    private String shelterAddress;
    private String shelterContact;
    private String intakeDate;
    private String microchipId;
    private String rabiesBatch;
    private String spayedNeutered;

    public Pet() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDistance() { return distance; }
    public void setDistance(String distance) { this.distance = distance; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getMedicalBadge() { return medicalBadge; }
    public void setMedicalBadge(String medicalBadge) { this.medicalBadge = medicalBadge; }

    public Boolean getUrgent() { return urgent; }
    public void setUrgent(Boolean urgent) { this.urgent = urgent; }

    public Boolean getIsSaved() { return isSaved; }
    public void setIsSaved(Boolean isSaved) { this.isSaved = isSaved; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminStatus() { return adminStatus; }
    public void setAdminStatus(String adminStatus) { this.adminStatus = adminStatus; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getShelterName() { return shelterName; }
    public void setShelterName(String shelterName) { this.shelterName = shelterName; }

    public String getShelterId() { return shelterId; }
    public void setShelterId(String shelterId) { this.shelterId = shelterId; }

    public String getShelterAddress() { return shelterAddress; }
    public void setShelterAddress(String shelterAddress) { this.shelterAddress = shelterAddress; }

    public String getShelterContact() { return shelterContact; }
    public void setShelterContact(String shelterContact) { this.shelterContact = shelterContact; }

    public String getIntakeDate() { return intakeDate; }
    public void setIntakeDate(String intakeDate) { this.intakeDate = intakeDate; }

    public String getMicrochipId() { return microchipId; }
    public void setMicrochipId(String microchipId) { this.microchipId = microchipId; }

    public String getRabiesBatch() { return rabiesBatch; }
    public void setRabiesBatch(String rabiesBatch) { this.rabiesBatch = rabiesBatch; }

    public String getSpayedNeutered() { return spayedNeutered; }
    public void setSpayedNeutered(String spayedNeutered) { this.spayedNeutered = spayedNeutered; }
}
