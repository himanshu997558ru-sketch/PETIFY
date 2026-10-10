package com.kinandpaws.backend.service;

import com.kinandpaws.backend.model.UserProfile;
import com.kinandpaws.backend.model.enums.RoleType;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final Map<String, UserProfile> userProfiles = new ConcurrentHashMap<>();

    public AuthService() {
        seedDefaultProfiles();
    }

    public UserProfile getUserProfile(String email) {
        if (email == null) return getDefaultProfile("adopter");
        return userProfiles.getOrDefault(email.toLowerCase(), getDefaultProfile("adopter"));
    }

    public UserProfile createOrUpdateProfile(String email, UserProfile profile) {
        if (email != null) {
            userProfiles.put(email.toLowerCase(), profile);
        }
        return profile;
    }

    public UserProfile switchDemoRole(RoleType role) {
        String roleStr = role != null ? role.getValue() : "adopter";
        return getDefaultProfile(roleStr);
    }

    private UserProfile getDefaultProfile(String role) {
        UserProfile p = new UserProfile();
        p.setEmail("demo@" + role + ".kinandpaws.org");
        p.setRole(role);
        p.setLocation("Seattle, WA");
        p.setStatus("Active Member");
        p.setLivingSpace("Townhouse with fenced yard");
        p.setActivityLevel("Moderate (Daily walks & play)");
        p.setCurrentPets("1 Senior Golden (Socialized)");
        p.setIdVerification("Government ID Verified");
        p.setVerified(true);

        switch (role.toLowerCase()) {
            case "admin" -> {
                p.setName("Audit Director Sullivan");
                p.setAvatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200");
            }
            case "shelter" -> {
                p.setName("Haven Woods Welfare Officer");
                p.setAvatarUrl("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200");
            }
            default -> {
                p.setName("Elena Rostova");
                p.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200");
            }
        }
        return p;
    }

    private void seedDefaultProfiles() {
        userProfiles.put("elena@example.com", getDefaultProfile("adopter"));
        userProfiles.put("haven@shelter.org", getDefaultProfile("shelter"));
        userProfiles.put("admin@kinandpaws.org", getDefaultProfile("admin"));
    }
}
