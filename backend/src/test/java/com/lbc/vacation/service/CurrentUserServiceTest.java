package com.lbc.vacation.service;

import com.lbc.vacation.domain.entity.Employee;
import com.lbc.vacation.domain.enums.Role;
import com.lbc.vacation.exception.ResourceNotFoundException;
import com.lbc.vacation.exception.ValidationException;
import com.lbc.vacation.repository.EmployeeRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CurrentUserServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private CurrentUserService currentUserService;

    @AfterEach
    void tearDown() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    void shouldReturnCurrentEmployeeWhenHeaderIsValid() {
        UUID userId = UUID.randomUUID();
        Employee employee = buildEmployee(userId);
        mockRequestHeader(userId.toString());
        when(employeeRepository.findById(userId)).thenReturn(Optional.of(employee));

        Employee result = currentUserService.getCurrentEmployee();

        assertThat(result).isEqualTo(employee);
        assertThat(currentUserService.getCurrentRole()).isEqualTo(Role.ADMIN);
    }

    @Test
    void shouldRejectMissingHeader() {
        mockRequestHeader(null);

        assertThatThrownBy(() -> currentUserService.getCurrentEmployee())
                .isInstanceOf(ValidationException.class)
                .hasMessage("X-User-Id header is required");
    }

    @Test
    void shouldRejectInvalidUuidHeader() {
        mockRequestHeader("not-a-uuid");

        assertThatThrownBy(() -> currentUserService.getCurrentEmployee())
                .isInstanceOf(ValidationException.class)
                .hasMessage("X-User-Id header must be a valid UUID");
    }

    @Test
    void shouldRejectUnknownEmployee() {
        UUID userId = UUID.randomUUID();
        mockRequestHeader(userId.toString());
        when(employeeRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> currentUserService.getCurrentEmployee())
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Employee not found");
    }

    private Employee buildEmployee(UUID userId) {
        Employee employee = new Employee();
        employee.setId(userId);
        employee.setName("Admin User");
        employee.setEmail("admin@lbc.com");
        employee.setRole(Role.ADMIN);
        return employee;
    }

    private void mockRequestHeader(String headerValue) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        if (headerValue != null) {
            request.addHeader(CurrentUserService.USER_ID_HEADER, headerValue);
        }
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }
}
