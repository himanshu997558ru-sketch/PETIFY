package com.kinandpaws.backend.model.enums;

public enum VerificationStage {
    SHELTER_REGISTRATION,
    VERIFICATION_REQUESTED,
    WORKER_ASSIGNED,
    WORKER_VISITING,
    PHYSICAL_VERIFICATION,
    REPORT_UPLOADED,
    ADMIN_REVIEW,
    VERIFIED,
    REJECTED;

    public boolean isTerminal() {
        return this == VERIFIED || this == REJECTED;
    }

    public boolean isApproved() {
        return this == VERIFIED;
    }
}
