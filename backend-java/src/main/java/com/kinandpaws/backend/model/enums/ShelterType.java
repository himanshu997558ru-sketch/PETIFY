package com.kinandpaws.backend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ShelterType {
    SANCTUARY("Sanctuary"),
    RESCUE_CENTER("Rescue Center"),
    FOSTER_NETWORK("Foster Network"),
    MUNICIPAL_PARTNER("Municipal Partner");

    private final String label;

    ShelterType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static ShelterType fromLabel(String label) {
        if (label == null) return null;
        for (ShelterType type : values()) {
            if (type.label.equalsIgnoreCase(label) || type.name().equalsIgnoreCase(label)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown ShelterType: " + label);
    }
}
