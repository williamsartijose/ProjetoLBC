package com.lbc.vacation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lbc.vacation.domain.entity.Employee;
import com.lbc.vacation.domain.entity.VacationRequest;
import com.lbc.vacation.domain.enums.Role;
import com.lbc.vacation.domain.enums.VacationStatus;
import com.lbc.vacation.dto.CreateEmployeeRequest;
import com.lbc.vacation.dto.CreateVacationRequest;
import com.lbc.vacation.dto.RejectVacationRequest;
import com.lbc.vacation.dto.UpdateVacationRequest;
import com.lbc.vacation.repository.EmployeeRepository;
import com.lbc.vacation.repository.VacationRequestRepository;
import com.lbc.vacation.service.CurrentUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BusinessRulesIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private VacationRequestRepository vacationRequestRepository;

    private Employee admin;
    private Employee manager;
    private Employee collaborator;
    private Employee otherCollaborator;

    @BeforeEach
    void setUp() {
        admin = saveEmployee("Admin User", "admin@lbc.com", Role.ADMIN, null);
        manager = saveEmployee("Manager User", "manager@lbc.com", Role.MANAGER, null);
        collaborator = saveEmployee("Alice Collaborator", "alice@lbc.com", Role.COLLABORATOR, manager);
        otherCollaborator = saveEmployee("Bob Collaborator", "bob@lbc.com", Role.COLLABORATOR, manager);
    }

    @Test
    void adminShouldCreateEmployee() throws Exception {
        CreateEmployeeRequest request = new CreateEmployeeRequest(
                "New Employee",
                "new@lbc.com",
                Role.COLLABORATOR,
                manager.getId());

        mockMvc.perform(post("/api/employees")
                        .header(CurrentUserService.USER_ID_HEADER, admin.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("new@lbc.com"));
    }

    @Test
    void collaboratorShouldNotCreateEmployee() throws Exception {
        CreateEmployeeRequest request = new CreateEmployeeRequest(
                "Blocked Employee",
                "blocked@lbc.com",
                Role.COLLABORATOR,
                null);

        mockMvc.perform(post("/api/employees")
                        .header(CurrentUserService.USER_ID_HEADER, collaborator.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    void duplicateEmailShouldReturnError() throws Exception {
        CreateEmployeeRequest request = new CreateEmployeeRequest(
                "Duplicate Email",
                "alice@lbc.com",
                Role.COLLABORATOR,
                null);

        mockMvc.perform(post("/api/employees")
                        .header(CurrentUserService.USER_ID_HEADER, admin.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email already in use"));
    }

    @Test
    void vacationRequestWithOverlapShouldReturnConflict() throws Exception {
        saveVacationRequest(collaborator, LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 5), VacationStatus.PENDING);

        CreateVacationRequest request = new CreateVacationRequest(
                null,
                LocalDate.of(2026, 6, 5),
                LocalDate.of(2026, 6, 10),
                "Family trip");

        mockMvc.perform(post("/api/vacation-requests")
                        .header(CurrentUserService.USER_ID_HEADER, otherCollaborator.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Vacation period overlaps with an existing request"));
    }

    @Test
    void managerShouldApproveDirectReportRequest() throws Exception {
        VacationRequest vacationRequest = saveVacationRequest(
                collaborator,
                LocalDate.of(2026, 7, 1),
                LocalDate.of(2026, 7, 5),
                VacationStatus.PENDING);

        mockMvc.perform(post("/api/vacation-requests/{id}/approve", vacationRequest.getId())
                        .header(CurrentUserService.USER_ID_HEADER, manager.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    void collaboratorShouldNotApproveRequest() throws Exception {
        VacationRequest vacationRequest = saveVacationRequest(
                otherCollaborator,
                LocalDate.of(2026, 8, 1),
                LocalDate.of(2026, 8, 5),
                VacationStatus.PENDING);

        mockMvc.perform(post("/api/vacation-requests/{id}/approve", vacationRequest.getId())
                        .header(CurrentUserService.USER_ID_HEADER, collaborator.getId()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    void approvedRequestCanBeCancelled() throws Exception {
        VacationRequest vacationRequest = saveVacationRequest(
                collaborator,
                LocalDate.of(2026, 9, 1),
                LocalDate.of(2026, 9, 5),
                VacationStatus.APPROVED);

        mockMvc.perform(post("/api/vacation-requests/{id}/cancel", vacationRequest.getId())
                        .header(CurrentUserService.USER_ID_HEADER, collaborator.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    void approvedRequestShouldNotBeUpdated() throws Exception {
        VacationRequest vacationRequest = saveVacationRequest(
                collaborator,
                LocalDate.of(2026, 10, 1),
                LocalDate.of(2026, 10, 5),
                VacationStatus.APPROVED);

        UpdateVacationRequest request = new UpdateVacationRequest(
                LocalDate.of(2026, 10, 2),
                LocalDate.of(2026, 10, 6),
                "Updated reason");

        mockMvc.perform(put("/api/vacation-requests/{id}", vacationRequest.getId())
                        .header(CurrentUserService.USER_ID_HEADER, collaborator.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cannot update vacation request in current status"));
    }

    private Employee saveEmployee(String name, String email, Role role, Employee manager) {
        Employee employee = new Employee();
        employee.setName(name);
        employee.setEmail(email);
        employee.setRole(role);
        employee.setManager(manager);
        return employeeRepository.save(employee);
    }

    private VacationRequest saveVacationRequest(
            Employee employee,
            LocalDate startDate,
            LocalDate endDate,
            VacationStatus status) {
        VacationRequest vacationRequest = new VacationRequest();
        vacationRequest.setEmployee(employee);
        vacationRequest.setStartDate(startDate);
        vacationRequest.setEndDate(endDate);
        vacationRequest.setStatus(status);
        vacationRequest.setReason("Annual leave");
        return vacationRequestRepository.save(vacationRequest);
    }
}
