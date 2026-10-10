package com.kinandpaws.backend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ChecklistItemStatus {
    PASS("Pass"),
    NEEDS_IMPROVEMENT("Needs Improvement"),
    FAIL("Fail"),
    NOT_APPLICABLE("Not Applicable");

    private final String label;

    ChecklistItemStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static ChecklistItemStatus fromLabel(String label) {
        if (label == null) return null;
        for (ChecklistItemStatus status : values()) {
            if (status.label.equalsIgnoreCase(label) || status.name().equalsIgnoreCase(label)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown ChecklistItemStatus: " + label);
    }
}
