package com.kinandpaws.backend.controller;

import com.kinandpaws.backend.model.Pet;
import com.kinandpaws.backend.service.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public ResponseEntity<List<Pet>> listPets(
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(petService.filterPets(species, status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPet(@PathVariable String id) {
        return petService.getPetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pet> createPet(@RequestBody Pet pet) {
        return ResponseEntity.ok(petService.createPet(pet));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable String id, @RequestBody Pet pet) {
        return petService.updatePet(id, pet)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/verification")
    public ResponseEntity<Pet> updateVerification(
            @PathVariable String id,
            @RequestParam(required = false) String verificationStatus,
            @RequestParam(required = false) String adminStatus) {
        return petService.updatePetVerification(id, verificationStatus, adminStatus)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable String id) {
        if (petService.deletePet(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
