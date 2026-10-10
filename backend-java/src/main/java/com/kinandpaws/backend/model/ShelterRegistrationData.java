package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ShelterRegistrationData {
    private String id;
    private String shelterName;
    private String legalRegNumber;
    private String taxId;
    private String shelterType; // "Sanctuary" | "Rescue Center" | "Foster Network" | "Municipal Partner"
    private String directorName;
    private String ownerName;
    private String contactPhone;
    private String contactEmail;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private Integer animalCapacity;
    private Integer currentAnimalCount;
    private List<String> speciesHandled = new ArrayList<>();
    private List<String> facilities = new ArrayList<>();
    private String veterinarySupportDetails;
    private String operatingHours;
    private String shelterDescription;
    private String registeredAt;

    public ShelterRegistrationData() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getShelterName() { return shelterName; }
    public void setShelterName(String shelterName) { this.shelterName = shelterName; }

    public String getLegalRegNumber() { return legalRegNumber; }
    public void setLegalRegNumber(String legalRegNumber) { this.legalRegNumber = legalRegNumber; }

    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { this.taxId = taxId; }

    public String getShelterType() { return shelterType; }
    public void setShelterType(String shelterType) { this.shelterType = shelterType; }

    public String getDirectorName() { return directorName; }
    public void setDirectorName(String directorName) { this.directorName = directorName; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getStreetAddress() { return streetAddress; }
    public void setStreetAddress(String streetAddress) { this.streetAddress = streetAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public Integer getAnimalCapacity() { return animalCapacity; }
    public void setAnimalCapacity(Integer animalCapacity) { this.animalCapacity = animalCapacity; }

    public Integer getCurrentAnimalCount() { return currentAnimalCount; }
    public void setCurrentAnimalCount(Integer currentAnimalCount) { this.currentAnimalCount = currentAnimalCount; }

    public List<String> getSpeciesHandled() { return speciesHandled; }
    public void setSpeciesHandled(List<String> speciesHandled) { this.speciesHandled = speciesHandled; }

    public List<String> getFacilities() { return facilities; }
    public void setFacilities(List<String> facilities) { this.facilities = facilities; }

    public String getVeterinarySupportDetails() { return veterinarySupportDetails; }
    public void setVeterinarySupportDetails(String veterinarySupportDetails) { this.veterinarySupportDetails = veterinarySupportDetails; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public String getShelterDescription() { return shelterDescription; }
    public void setShelterDescription(String shelterDescription) { this.shelterDescription = shelterDescription; }

    public String getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(String registeredAt) { this.registeredAt = registeredAt; }
}
