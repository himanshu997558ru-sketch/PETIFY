package com.kinandpaws.backend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PetVerificationStatus {
    PENDING_VERIFICATION("Pending Verification"),
    VERIFICATION_SCHEDULED("Verification Scheduled"),
    VERIFIED("Verified"),
    REJECTED("Rejected"),
    AVAILABLE_FOR_ADOPTION("Available for Adoption");

    private final String label;

    PetVerificationStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static PetVerificationStatus fromLabel(String label) {
        if (label == null) return null;
        for (PetVerificationStatus status : values()) {
            if (status.label.equalsIgnoreCase(label) || status.name().equalsIgnoreCase(label)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown PetVerificationStatus: " + label);
    }
}
