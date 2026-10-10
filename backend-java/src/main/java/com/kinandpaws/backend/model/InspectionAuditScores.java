package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class InspectionAuditScores {
    private CategoryScore facility;
    private CategoryScore hygiene;
    private CategoryScore animalWelfare;
    private CategoryScore veterinaryCare;
    private CategoryScore safety;
    private double totalScore;
    private double maxScore;
    private String grade;

    public InspectionAuditScores() {}

    public CategoryScore getFacility() { return facility; }
    public void setFacility(CategoryScore facility) { this.facility = facility; }

    public CategoryScore getHygiene() { return hygiene; }
    public void setHygiene(CategoryScore hygiene) { this.hygiene = hygiene; }

    public CategoryScore getAnimalWelfare() { return animalWelfare; }
    public void setAnimalWelfare(CategoryScore animalWelfare) { this.animalWelfare = animalWelfare; }

    public CategoryScore getVeterinaryCare() { return veterinaryCare; }
    public void setVeterinaryCare(CategoryScore veterinaryCare) { this.veterinaryCare = veterinaryCare; }

    public CategoryScore getSafety() { return safety; }
    public void setSafety(CategoryScore safety) { this.safety = safety; }

    public double getTotalScore() { return totalScore; }
    public void setTotalScore(double totalScore) { this.totalScore = totalScore; }

    public double getMaxScore() { return maxScore; }
    public void setMaxScore(double maxScore) { this.maxScore = maxScore; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}
