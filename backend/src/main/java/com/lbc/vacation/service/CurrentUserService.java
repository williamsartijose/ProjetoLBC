package com.lbc.vacation.service;

import com.lbc.vacation.domain.entity.Employee;
import com.lbc.vacation.domain.enums.Role;
import com.lbc.vacation.exception.ResourceNotFoundException;
import com.lbc.vacation.exception.ValidationException;
import com.lbc.vacation.repository.EmployeeRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.UUID;

@Service
public class CurrentUserService {

    public static final String USER_ID_HEADER = "X-User-Id";

    private final EmployeeRepository employeeRepository;

    public CurrentUserService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee getCurrentEmployee() {
        UUID userId = resolveCurrentUserId();
        return employeeRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }

    public Role getCurrentRole() {
        return getCurrentEmployee().getRole();
    }

    private UUID resolveCurrentUserId() {
        String headerValue = getHeaderValue();
        if (headerValue == null || headerValue.isBlank()) {
            throw new ValidationException("X-User-Id header is required");
        }

        try {
            return UUID.fromString(headerValue.trim());
        } catch (IllegalArgumentException ex) {
            throw new ValidationException("X-User-Id header must be a valid UUID");
        }
    }

    private String getHeaderValue() {
        ServletRequestAttributes attributes = getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        return request.getHeader(USER_ID_HEADER);
    }

    private ServletRequestAttributes getRequestAttributes() {
        var requestAttributes = RequestContextHolder.getRequestAttributes();
        if (!(requestAttributes instanceof ServletRequestAttributes servletRequestAttributes)) {
            throw new ValidationException("Unable to resolve current HTTP request");
        }
        return servletRequestAttributes;
    }
}
