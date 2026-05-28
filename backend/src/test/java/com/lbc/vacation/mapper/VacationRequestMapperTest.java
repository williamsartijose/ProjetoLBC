package com.lbc.vacation.mapper;

import com.lbc.vacation.domain.entity.Employee;
import com.lbc.vacation.domain.entity.VacationRequest;
import com.lbc.vacation.domain.enums.Role;
import com.lbc.vacation.domain.enums.VacationStatus;
import com.lbc.vacation.dto.CreateVacationRequest;
import com.lbc.vacation.dto.VacationRequestResponse;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class VacationRequestMapperTest {

    private final VacationRequestMapper vacationRequestMapper = new VacationRequestMapper();

    @Test
    void shouldMapCreateRequestToEntity() {
        Employee employee = new Employee();
        employee.setId(UUID.randomUUID());
        employee.setName("Alice");
        employee.setEmail("alice@lbc.com");
        employee.setRole(Role.COLLABORATOR);

        CreateVacationRequest request = new CreateVacationRequest(
                employee.getId(),
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 10),
                "Annual leave");

        VacationRequest entity = vacationRequestMapper.toEntity(request, employee);

        assertThat(entity.getEmployee()).isEqualTo(employee);
        assertThat(entity.getStatus()).isEqualTo(VacationStatus.PENDING);
        assertThat(entity.getReason()).isEqualTo("Annual leave");
    }

    @Test
    void shouldMapEntityToResponse() {
        Employee employee = new Employee();
        employee.setId(UUID.randomUUID());
        employee.setName("Alice");
        employee.setEmail("alice@lbc.com");
        employee.setRole(Role.COLLABORATOR);

        VacationRequest vacationRequest = new VacationRequest();
        vacationRequest.setId(UUID.randomUUID());
        vacationRequest.setEmployee(employee);
        vacationRequest.setStartDate(LocalDate.of(2026, 6, 1));
        vacationRequest.setEndDate(LocalDate.of(2026, 6, 10));
        vacationRequest.setStatus(VacationStatus.PENDING);
        vacationRequest.setReason("Annual leave");
        vacationRequest.setCreatedAt(Instant.parse("2026-01-01T10:00:00Z"));
        vacationRequest.setUpdatedAt(Instant.parse("2026-01-02T10:00:00Z"));

        VacationRequestResponse response = vacationRequestMapper.toResponse(vacationRequest);

        assertThat(response.employeeName()).isEqualTo("Alice");
        assertThat(response.status()).isEqualTo(VacationStatus.PENDING);
    }
}
