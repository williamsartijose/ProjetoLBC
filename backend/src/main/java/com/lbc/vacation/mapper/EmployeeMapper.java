package com.lbc.vacation.mapper;

import com.lbc.vacation.domain.entity.Employee;
import com.lbc.vacation.dto.CreateEmployeeRequest;
import com.lbc.vacation.dto.EmployeeResponse;
import com.lbc.vacation.dto.EmployeeSummaryResponse;
import com.lbc.vacation.dto.UpdateEmployeeRequest;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public Employee toEntity(CreateEmployeeRequest request) {
        Employee employee = new Employee();
        employee.setName(request.name());
        employee.setEmail(request.email());
        employee.setRole(request.role());
        return employee;
    }

    public void updateEntity(Employee employee, UpdateEmployeeRequest request) {
        employee.setName(request.name());
        employee.setEmail(request.email());
        employee.setRole(request.role());
    }

    public EmployeeResponse toResponse(Employee employee) {
        Employee manager = employee.getManager();
        return new EmployeeResponse(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                employee.getRole(),
                manager != null ? manager.getId() : null,
                manager != null ? manager.getName() : null,
                employee.getCreatedAt(),
                employee.getUpdatedAt());
    }

    public EmployeeSummaryResponse toSummaryResponse(Employee employee) {
        return new EmployeeSummaryResponse(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                employee.getRole());
    }
}
