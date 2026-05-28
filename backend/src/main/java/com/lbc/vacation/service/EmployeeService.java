package com.lbc.vacation.service;

import com.lbc.vacation.domain.entity.Employee;
import com.lbc.vacation.domain.enums.Role;
import com.lbc.vacation.dto.CreateEmployeeRequest;
import com.lbc.vacation.dto.EmployeeResponse;
import com.lbc.vacation.dto.UpdateEmployeeRequest;
import com.lbc.vacation.exception.BusinessException;
import com.lbc.vacation.exception.ForbiddenException;
import com.lbc.vacation.exception.ResourceNotFoundException;
import com.lbc.vacation.mapper.EmployeeMapper;
import com.lbc.vacation.repository.EmployeeRepository;
import com.lbc.vacation.repository.VacationRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final VacationRequestRepository vacationRequestRepository;
    private final EmployeeMapper employeeMapper;
    private final CurrentUserService currentUserService;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            VacationRequestRepository vacationRequestRepository,
            EmployeeMapper employeeMapper,
            CurrentUserService currentUserService) {
        this.employeeRepository = employeeRepository;
        this.vacationRequestRepository = vacationRequestRepository;
        this.employeeMapper = employeeMapper;
        this.currentUserService = currentUserService;
    }

    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {
        requireAdmin();
        validateEmailUnique(request.email(), null);

        Employee employee = employeeMapper.toEntity(request);
        employee.setManager(resolveManager(request.managerId(), null));

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    public EmployeeResponse updateEmployee(UUID id, UpdateEmployeeRequest request) {
        requireAdmin();
        Employee employee = findEmployeeOrThrow(id);
        validateEmailUnique(request.email(), id);

        employeeMapper.updateEntity(employee, request);
        employee.setManager(resolveManager(request.managerId(), id));

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    public void deleteEmployee(UUID id) {
        requireAdmin();
        Employee employee = findEmployeeOrThrow(id);

        if (vacationRequestRepository.existsByEmployee_Id(id)) {
            throw new BusinessException("Cannot delete employee with existing vacation requests");
        }

        employeeRepository.delete(employee);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(UUID id) {
        currentUserService.getCurrentEmployee();
        return employeeMapper.toResponse(findEmployeeOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees() {
        currentUserService.getCurrentEmployee();
        return employeeRepository.findAll().stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    private void requireAdmin() {
        if (currentUserService.getCurrentRole() != Role.ADMIN) {
            throw new ForbiddenException("Access denied");
        }
    }

    private void validateEmailUnique(String email, UUID excludeId) {
        employeeRepository.findByEmail(email).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new BusinessException("Email already in use");
            }
        });
    }

    private Employee resolveManager(UUID managerId, UUID employeeId) {
        if (managerId == null) {
            return null;
        }
        if (employeeId != null && managerId.equals(employeeId)) {
            throw new BusinessException("Employee cannot be their own manager");
        }
        return employeeRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
    }

    private Employee findEmployeeOrThrow(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }
}
