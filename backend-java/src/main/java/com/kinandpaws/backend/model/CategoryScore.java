package com.kinandpaws.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryScore {
    private double earned;
    private double total;
    private double percentage;

    public CategoryScore() {}

    public CategoryScore(double earned, double total, double percentage) {
        this.earned = earned;
        this.total = total;
        this.percentage = percentage;
    }

    public double getEarned() { return earned; }
    public void setEarned(double earned) { this.earned = earned; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
}
