package com.lbc.vacation.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpdateVacationRequest(
        @NotNull(message = "startDate is required")
        LocalDate startDate,

        @NotNull(message = "endDate is required")
        LocalDate endDate,

        String reason
) {
}
