package com.lbc.vacation.mapper;

import com.lbc.vacation.domain.entity.Employee;
import com.lbc.vacation.domain.entity.VacationRequest;
import com.lbc.vacation.domain.enums.VacationStatus;
import com.lbc.vacation.dto.CreateVacationRequest;
import com.lbc.vacation.dto.UpdateVacationRequest;
import com.lbc.vacation.dto.VacationRequestResponse;
import org.springframework.stereotype.Component;

@Component
public class VacationRequestMapper {

    public VacationRequest toEntity(CreateVacationRequest request, Employee employee) {
        VacationRequest vacationRequest = new VacationRequest();
        vacationRequest.setEmployee(employee);
        vacationRequest.setStartDate(request.startDate());
        vacationRequest.setEndDate(request.endDate());
        vacationRequest.setReason(request.reason());
        vacationRequest.setStatus(VacationStatus.PENDING);
        return vacationRequest;
    }

    public void updateEntity(VacationRequest vacationRequest, UpdateVacationRequest request) {
        vacationRequest.setStartDate(request.startDate());
        vacationRequest.setEndDate(request.endDate());
        if (request.reason() != null) {
            vacationRequest.setReason(request.reason());
        }
    }

    public VacationRequestResponse toResponse(VacationRequest vacationRequest) {
        Employee employee = vacationRequest.getEmployee();
        return new VacationRequestResponse(
                vacationRequest.getId(),
                employee.getId(),
                employee.getName(),
                vacationRequest.getStartDate(),
                vacationRequest.getEndDate(),
                vacationRequest.getStatus(),
                vacationRequest.getReason(),
                vacationRequest.getRejectionReason(),
                vacationRequest.getCreatedAt(),
                vacationRequest.getUpdatedAt());
    }
}
