package com.kinandpaws.backend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RoleType {
    ADOPTER("adopter"),
    SHELTER("shelter"),
    ADMIN("admin"),
    INSPECTOR("inspector");

    private final String value;

    RoleType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static RoleType fromValue(String value) {
        if (value == null) return null;
        for (RoleType type : values()) {
            if (type.value.equalsIgnoreCase(value) || type.name().equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown RoleType: " + value);
    }
}
