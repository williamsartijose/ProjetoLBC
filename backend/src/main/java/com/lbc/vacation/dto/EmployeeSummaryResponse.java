package com.lbc.vacation.dto;

import com.lbc.vacation.domain.enums.Role;

import java.util.UUID;

public record EmployeeSummaryResponse(
        UUID id,
        String name,
        String email,
        Role role
) {
}
