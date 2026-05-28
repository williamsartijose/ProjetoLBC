package com.lbc.vacation.mapper;

import com.lbc.vacation.domain.entity.Employee;
import com.lbc.vacation.domain.enums.Role;
import com.lbc.vacation.dto.EmployeeResponse;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class EmployeeMapperTest {

    private final EmployeeMapper employeeMapper = new EmployeeMapper();

    @Test
    void shouldMapEmployeeToResponse() {
        Employee manager = new Employee();
        manager.setId(UUID.randomUUID());
        manager.setName("Manager");
        manager.setEmail("manager@lbc.com");
        manager.setRole(Role.MANAGER);

        Employee employee = new Employee();
        employee.setId(UUID.randomUUID());
        employee.setName("Alice");
        employee.setEmail("alice@lbc.com");
        employee.setRole(Role.COLLABORATOR);
        employee.setManager(manager);
        employee.setCreatedAt(Instant.parse("2026-01-01T10:00:00Z"));
        employee.setUpdatedAt(Instant.parse("2026-01-02T10:00:00Z"));

        EmployeeResponse response = employeeMapper.toResponse(employee);

        assertThat(response.name()).isEqualTo("Alice");
        assertThat(response.managerId()).isEqualTo(manager.getId());
        assertThat(response.managerName()).isEqualTo("Manager");
    }
}
