package com.lbc.vacation.dto;

import com.lbc.vacation.domain.enums.VacationStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record VacationRequestResponse(
        UUID id,
        UUID employeeId,
        String employeeName,
        LocalDate startDate,
        LocalDate endDate,
        VacationStatus status,
        String reason,
        String rejectionReason,
        Instant createdAt,
        Instant updatedAt
) {
}
