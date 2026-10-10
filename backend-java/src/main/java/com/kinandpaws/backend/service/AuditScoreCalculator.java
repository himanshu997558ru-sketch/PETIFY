package com.kinandpaws.backend.service;

import com.kinandpaws.backend.model.CategoryScore;
import com.kinandpaws.backend.model.ChecklistItem;
import com.kinandpaws.backend.model.InspectionAuditScores;
import com.kinandpaws.backend.model.enums.ChecklistItemStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditScoreCalculator {

    public InspectionAuditScores calculateScores(List<ChecklistItem> items) {
        InspectionAuditScores scores = new InspectionAuditScores();

        scores.setFacility(calculateCategoryScore(items, "Facility", 20.0));
        scores.setHygiene(calculateCategoryScore(items, "Hygiene", 20.0));
        scores.setAnimalWelfare(calculateCategoryScore(items, "Animal Welfare", 25.0));
        scores.setVeterinaryCare(calculateCategoryScore(items, "Veterinary Care", 20.0));
        scores.setSafety(calculateCategoryScore(items, "Safety", 15.0));

        double totalEarned = scores.getFacility().getEarned()
                + scores.getHygiene().getEarned()
                + scores.getAnimalWelfare().getEarned()
                + scores.getVeterinaryCare().getEarned()
                + scores.getSafety().getEarned();

        double totalMax = scores.getFacility().getTotal()
                + scores.getHygiene().getTotal()
                + scores.getAnimalWelfare().getTotal()
                + scores.getVeterinaryCare().getTotal()
                + scores.getSafety().getTotal();

        scores.setTotalScore(Math.round(totalEarned * 10.0) / 10.0);
        scores.setMaxScore(totalMax);
        scores.setGrade(determineGrade(scores.getTotalScore(), scores.getMaxScore()));

        return scores;
    }

    private CategoryScore calculateCategoryScore(List<ChecklistItem> items, String category, double categoryMax) {
        if (items == null || items.isEmpty()) {
            return new CategoryScore(categoryMax, categoryMax, 100.0);
        }

        List<ChecklistItem> categoryItems = items.stream()
                .filter(item -> category.equalsIgnoreCase(item.getCategory()))
                .toList();

        if (categoryItems.isEmpty()) {
            return new CategoryScore(categoryMax, categoryMax, 100.0);
        }

        double pointsEarned = 0;
        double applicableItems = 0;

        for (ChecklistItem item : categoryItems) {
            ChecklistItemStatus status = item.getStatus();
            if (status == ChecklistItemStatus.NOT_APPLICABLE) {
                continue;
            }
            applicableItems += 1.0;
            if (status == ChecklistItemStatus.PASS) {
                pointsEarned += 1.0;
            } else if (status == ChecklistItemStatus.NEEDS_IMPROVEMENT) {
                pointsEarned += 0.5;
            }
        }

        double percentage = applicableItems > 0 ? (pointsEarned / applicableItems) * 100.0 : 100.0;
        double weightedEarned = Math.round((percentage / 100.0) * categoryMax * 10.0) / 10.0;

        return new CategoryScore(weightedEarned, categoryMax, Math.round(percentage * 10.0) / 10.0);
    }

    private String determineGrade(double earned, double max) {
        double percentage = max > 0 ? (earned / max) * 100.0 : 0.0;
        if (percentage >= 90.0) {
            return "Grade A (Exemplary)";
        } else if (percentage >= 75.0) {
            return "Grade B (Compliant)";
        } else if (percentage >= 60.0) {
            return "Grade C (Conditional)";
        } else {
            return "Fail (Non-Compliant)";
        }
    }
}
