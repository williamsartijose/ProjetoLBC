package com.lbc.vacation.dto;

import jakarta.validation.constraints.NotBlank;

public record RejectVacationRequest(
        @NotBlank(message = "rejectionReason is required")
        String rejectionReason
) {
}
