package com.kinandpaws.backend.controller;

import com.kinandpaws.backend.model.UserProfile;
import com.kinandpaws.backend.model.enums.RoleType;
import com.kinandpaws.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getProfile(@RequestParam(required = false) String email) {
        return ResponseEntity.ok(authService.getUserProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfile> updateProfile(
            @RequestParam String email,
            @RequestBody UserProfile profile) {
        return ResponseEntity.ok(authService.createOrUpdateProfile(email, profile));
    }

    @PostMapping("/switch-demo-role")
    public ResponseEntity<UserProfile> switchDemoRole(@RequestBody Map<String, String> payload) {
        String roleStr = payload.getOrDefault("role", "adopter");
        RoleType role = RoleType.fromValue(roleStr);
        return ResponseEntity.ok(authService.switchDemoRole(role));
    }
}
