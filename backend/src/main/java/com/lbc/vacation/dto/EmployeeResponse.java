package com.lbc.vacation.dto;

import com.lbc.vacation.domain.enums.Role;

import java.time.Instant;
import java.util.UUID;

public record EmployeeResponse(
        UUID id,
        String name,
        String email,
        Role role,
        UUID managerId,
        String managerName,
        Instant createdAt,
        Instant updatedAt
) {
}
