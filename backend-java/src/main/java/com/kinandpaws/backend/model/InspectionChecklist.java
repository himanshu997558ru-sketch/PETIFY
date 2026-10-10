package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class InspectionChecklist {
    private boolean enclosureSpace;
    private boolean climateVentilation;
    private boolean cleanWaterFood;
    private boolean quarantineIsolation;
    private boolean vetCareRecords;
    private boolean sanitationPestControl;
    private boolean staffRatioSafety;
    private boolean humaneTreatment;

    public InspectionChecklist() {}

    public boolean isEnclosureSpace() { return enclosureSpace; }
    public void setEnclosureSpace(boolean enclosureSpace) { this.enclosureSpace = enclosureSpace; }

    public boolean isClimateVentilation() { return climateVentilation; }
    public void setClimateVentilation(boolean climateVentilation) { this.climateVentilation = climateVentilation; }

    public boolean isCleanWaterFood() { return cleanWaterFood; }
    public void setCleanWaterFood(boolean cleanWaterFood) { this.cleanWaterFood = cleanWaterFood; }

    public boolean isQuarantineIsolation() { return quarantineIsolation; }
    public void setQuarantineIsolation(boolean quarantineIsolation) { this.quarantineIsolation = quarantineIsolation; }

    public boolean isVetCareRecords() { return vetCareRecords; }
    public void setVetCareRecords(boolean vetCareRecords) { this.vetCareRecords = vetCareRecords; }

    public boolean isSanitationPestControl() { return sanitationPestControl; }
    public void setSanitationPestControl(boolean sanitationPestControl) { this.sanitationPestControl = sanitationPestControl; }

    public boolean isStaffRatioSafety() { return staffRatioSafety; }
    public void setStaffRatioSafety(boolean staffRatioSafety) { this.staffRatioSafety = staffRatioSafety; }

    public boolean isHumaneTreatment() { return humaneTreatment; }
    public void setHumaneTreatment(boolean humaneTreatment) { this.humaneTreatment = humaneTreatment; }
}
