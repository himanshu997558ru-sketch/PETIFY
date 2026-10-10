package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kinandpaws.backend.model.enums.ChecklistItemStatus;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChecklistItem {
    private String id;
    private String name;
    private String category; // "Facility" | "Hygiene" | "Animal Welfare" | "Veterinary Care" | "Safety"
    private ChecklistItemStatus status;
    private String notes;

    public ChecklistItem() {}

    public ChecklistItem(String id, String name, String category, ChecklistItemStatus status, String notes) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.status = status;
        this.notes = notes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public ChecklistItemStatus getStatus() { return status; }
    public void setStatus(ChecklistItemStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
