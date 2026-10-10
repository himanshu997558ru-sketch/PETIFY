package com.kinandpaws.backend.service;

import com.kinandpaws.backend.model.Pet;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class PetService {

    private final Map<String, Pet> petStore = new ConcurrentHashMap<>();

    public PetService() {
        seedSamplePets();
    }

    public List<Pet> getAllPets() {
        return new ArrayList<>(petStore.values());
    }

    public Optional<Pet> getPetById(String id) {
        return Optional.ofNullable(petStore.get(id));
    }

    public List<Pet> filterPets(String species, String status, String search) {
        return petStore.values().stream()
                .filter(p -> species == null || species.isBlank() || species.equalsIgnoreCase("All") || p.getSpecies().equalsIgnoreCase(species))
                .filter(p -> status == null || status.isBlank() || (p.getStatus() != null && p.getStatus().equalsIgnoreCase(status)))
                .filter(p -> search == null || search.isBlank() || matchesSearch(p, search.toLowerCase()))
                .collect(Collectors.toList());
    }

    public Pet createPet(Pet pet) {
        if (pet.getId() == null || pet.getId().isBlank()) {
            pet.setId("pet-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (pet.getStatus() == null) {
            pet.setStatus("Available");
        }
        if (pet.getVerificationStatus() == null) {
            pet.setVerificationStatus("Pending Verification");
        }
        if (pet.getAdminStatus() == null) {
            pet.setAdminStatus("Pending");
        }
        petStore.put(pet.getId(), pet);
        return pet;
    }

    public Optional<Pet> updatePet(String id, Pet updatedPet) {
        if (!petStore.containsKey(id)) {
            return Optional.empty();
        }
        updatedPet.setId(id);
        petStore.put(id, updatedPet);
        return Optional.of(updatedPet);
    }

    public Optional<Pet> updatePetVerification(String id, String verificationStatus, String adminStatus) {
        Pet pet = petStore.get(id);
        if (pet == null) return Optional.empty();

        if (verificationStatus != null) {
            pet.setVerificationStatus(verificationStatus);
        }
        if (adminStatus != null) {
            pet.setAdminStatus(adminStatus);
        }
        if ("Approved".equalsIgnoreCase(adminStatus) && "Verified".equalsIgnoreCase(verificationStatus)) {
            pet.setStatus("Available");
        }
        return Optional.of(pet);
    }

    public boolean deletePet(String id) {
        return petStore.remove(id) != null;
    }

    private boolean matchesSearch(Pet p, String query) {
        return (p.getName() != null && p.getName().toLowerCase().contains(query))
                || (p.getBreed() != null && p.getBreed().toLowerCase().contains(query))
                || (p.getShelterName() != null && p.getShelterName().toLowerCase().contains(query));
    }

    private void seedSamplePets() {
        Pet pet1 = new Pet();
        pet1.setId("p-1");
        pet1.setName("Barnaby");
        pet1.setSpecies("Dog");
        pet1.setBreed("Golden Retriever");
        pet1.setAge("2 years");
        pet1.setGender("Male");
        pet1.setDistance("3.2 miles");
        pet1.setDescription("Gentle soul who loves quiet walks and napping by warm windows.");
        pet1.setImageUrl("https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600");
        pet1.setTags(List.of("Trained", "Kid-Friendly", "Calm"));
        pet1.setMedicalBadge("Vaccinated & Neutered");
        pet1.setStatus("Available");
        pet1.setAdminStatus("Approved");
        pet1.setVerificationStatus("Verified");
        pet1.setShelterName("Haven Woods Sanctuary");
        petStore.put(pet1.getId(), pet1);

        Pet pet2 = new Pet();
        pet2.setId("p-2");
        pet2.setName("Mochi");
        pet2.setSpecies("Cat");
        pet2.setBreed("Calico Shorthair");
        pet2.setAge("1 year");
        pet2.setGender("Female");
        pet2.setDistance("5.8 miles");
        pet2.setDescription("Inquisitive lap warmer, fond of feather wands and high bookshelves.");
        pet2.setImageUrl("https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600");
        pet2.setTags(List.of("Playful", "Indoor", "Microchipped"));
        pet2.setMedicalBadge("Fully Vaccinated");
        pet2.setStatus("Available");
        pet2.setAdminStatus("Approved");
        pet2.setVerificationStatus("Verified");
        pet2.setShelterName("City Paws Rescue");
        petStore.put(pet2.getId(), pet2);
    }
}
