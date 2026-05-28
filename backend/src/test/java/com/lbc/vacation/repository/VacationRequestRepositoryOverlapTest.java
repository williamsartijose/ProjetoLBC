package com.lbc.vacation.repository;

import com.lbc.vacation.domain.entity.Employee;
import com.lbc.vacation.domain.entity.VacationRequest;
import com.lbc.vacation.domain.enums.Role;
import com.lbc.vacation.domain.enums.VacationStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class VacationRequestRepositoryOverlapTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private VacationRequestRepository vacationRequestRepository;

    @Test
    void shouldDetectGlobalOverlapForPendingAndApprovedStatuses() {
        Employee employeeOne = employeeRepository.save(buildEmployee("Alice", "alice@lbc.com"));
        Employee employeeTwo = employeeRepository.save(buildEmployee("Bob", "bob@lbc.com"));

        vacationRequestRepository.save(buildRequest(
                employeeOne,
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 5),
                VacationStatus.PENDING));

        assertThat(vacationRequestRepository.existsActiveOverlap(
                LocalDate.of(2026, 6, 5),
                LocalDate.of(2026, 6, 10),
                null)).isTrue();

        assertThat(vacationRequestRepository.existsActiveOverlap(
                LocalDate.of(2026, 6, 6),
                LocalDate.of(2026, 6, 10),
                null)).isFalse();

        vacationRequestRepository.save(buildRequest(
                employeeTwo,
                LocalDate.of(2026, 7, 1),
                LocalDate.of(2026, 7, 5),
                VacationStatus.REJECTED));

        assertThat(vacationRequestRepository.existsActiveOverlap(
                LocalDate.of(2026, 7, 1),
                LocalDate.of(2026, 7, 5),
                null)).isFalse();
    }

    private Employee buildEmployee(String name, String email) {
        Employee employee = new Employee();
        employee.setName(name);
        employee.setEmail(email);
        employee.setRole(Role.COLLABORATOR);
        return employee;
    }

    private VacationRequest buildRequest(
            Employee employee,
            LocalDate startDate,
            LocalDate endDate,
            VacationStatus status) {
        VacationRequest request = new VacationRequest();
        request.setEmployee(employee);
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        request.setStatus(status);
        request.setReason("Annual leave");
        return request;
    }
}
