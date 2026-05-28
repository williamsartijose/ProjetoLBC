package com.lbc.vacation.service;

import com.lbc.vacation.domain.entity.Employee;
import com.lbc.vacation.domain.entity.VacationRequest;
import com.lbc.vacation.domain.enums.Role;
import com.lbc.vacation.domain.enums.VacationStatus;
import com.lbc.vacation.dto.CreateVacationRequest;
import com.lbc.vacation.dto.RejectVacationRequest;
import com.lbc.vacation.dto.UpdateVacationRequest;
import com.lbc.vacation.dto.VacationRequestResponse;
import com.lbc.vacation.exception.BusinessException;
import com.lbc.vacation.exception.ForbiddenException;
import com.lbc.vacation.exception.OverlapConflictException;
import com.lbc.vacation.exception.ResourceNotFoundException;
import com.lbc.vacation.mapper.VacationRequestMapper;
import com.lbc.vacation.repository.EmployeeRepository;
import com.lbc.vacation.repository.VacationRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class VacationRequestService {

    private final VacationRequestRepository vacationRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final VacationRequestMapper vacationRequestMapper;
    private final CurrentUserService currentUserService;

    public VacationRequestService(
            VacationRequestRepository vacationRequestRepository,
            EmployeeRepository employeeRepository,
            VacationRequestMapper vacationRequestMapper,
            CurrentUserService currentUserService) {
        this.vacationRequestRepository = vacationRequestRepository;
        this.employeeRepository = employeeRepository;
        this.vacationRequestMapper = vacationRequestMapper;
        this.currentUserService = currentUserService;
    }

    public VacationRequestResponse createVacationRequest(CreateVacationRequest request) {
        Employee targetEmployee = resolveTargetEmployee(request);
        validateDateRange(request.startDate(), request.endDate());
        validateNoOverlap(request.startDate(), request.endDate(), null);

        VacationRequest vacationRequest = vacationRequestMapper.toEntity(request, targetEmployee);
        return vacationRequestMapper.toResponse(vacationRequestRepository.save(vacationRequest));
    }

    public VacationRequestResponse updateVacationRequest(UUID id, UpdateVacationRequest request) {
        VacationRequest vacationRequest = findVacationRequestOrThrow(id);
        ensureCanModifyPending(vacationRequest);
        validateDateRange(request.startDate(), request.endDate());
        validateNoOverlap(request.startDate(), request.endDate(), id);

        vacationRequestMapper.updateEntity(vacationRequest, request);
        return vacationRequestMapper.toResponse(vacationRequestRepository.save(vacationRequest));
    }

    public VacationRequestResponse approveVacationRequest(UUID id) {
        VacationRequest vacationRequest = findVacationRequestOrThrow(id);
        ensureCanApproveOrReject(vacationRequest);

        if (vacationRequest.getStatus() != VacationStatus.PENDING) {
            throw new BusinessException("Invalid status transition");
        }

        validateNoOverlap(vacationRequest.getStartDate(), vacationRequest.getEndDate(), id);
        vacationRequest.setStatus(VacationStatus.APPROVED);

        return vacationRequestMapper.toResponse(vacationRequestRepository.save(vacationRequest));
    }

    public VacationRequestResponse rejectVacationRequest(UUID id, RejectVacationRequest request) {
        VacationRequest vacationRequest = findVacationRequestOrThrow(id);
        ensureCanApproveOrReject(vacationRequest);

        if (vacationRequest.getStatus() != VacationStatus.PENDING) {
            throw new BusinessException("Invalid status transition");
        }

        vacationRequest.setStatus(VacationStatus.REJECTED);
        vacationRequest.setRejectionReason(request.rejectionReason());

        return vacationRequestMapper.toResponse(vacationRequestRepository.save(vacationRequest));
    }

    public VacationRequestResponse cancelVacationRequest(UUID id) {
        VacationRequest vacationRequest = findVacationRequestOrThrow(id);
        ensureCanCancel(vacationRequest);

        if (vacationRequest.getStatus() != VacationStatus.PENDING
                && vacationRequest.getStatus() != VacationStatus.APPROVED) {
            throw new BusinessException("Cannot cancel vacation request in current status");
        }

        vacationRequest.setStatus(VacationStatus.CANCELLED);
        return vacationRequestMapper.toResponse(vacationRequestRepository.save(vacationRequest));
    }

    @Transactional(readOnly = true)
    public VacationRequestResponse getVacationRequestById(UUID id) {
        VacationRequest vacationRequest = findVacationRequestOrThrow(id);
        ensureCanView(vacationRequest);
        return vacationRequestMapper.toResponse(vacationRequest);
    }

    @Transactional(readOnly = true)
    public List<VacationRequestResponse> getAllVacationRequests() {
        Employee currentEmployee = currentUserService.getCurrentEmployee();
        List<VacationRequest> vacationRequests = findVisibleRequests(currentEmployee);

        return vacationRequests.stream()
                .map(vacationRequestMapper::toResponse)
                .toList();
    }

    private List<VacationRequest> findVisibleRequests(Employee currentEmployee) {
        return switch (currentEmployee.getRole()) {
            case ADMIN -> vacationRequestRepository.findAll();
            case MANAGER -> {
                List<UUID> employeeIds = new ArrayList<>();
                employeeIds.add(currentEmployee.getId());
                employeeRepository.findByManager_Id(currentEmployee.getId()).stream()
                        .map(Employee::getId)
                        .forEach(employeeIds::add);
                yield vacationRequestRepository.findByEmployee_IdIn(employeeIds);
            }
            case COLLABORATOR -> vacationRequestRepository.findByEmployee_Id(currentEmployee.getId());
        };
    }

    private Employee resolveTargetEmployee(CreateVacationRequest request) {
        Employee currentEmployee = currentUserService.getCurrentEmployee();

        return switch (currentEmployee.getRole()) {
            case ADMIN -> {
                if (request.employeeId() == null) {
                    throw new BusinessException("employeeId is required");
                }
                yield employeeRepository.findById(request.employeeId())
                        .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
            }
            case MANAGER, COLLABORATOR -> {
                if (request.employeeId() != null && !request.employeeId().equals(currentEmployee.getId())) {
                    throw new ForbiddenException("Access denied");
                }
                yield currentEmployee;
            }
        };
    }

    private void ensureCanView(VacationRequest vacationRequest) {
        Employee currentEmployee = currentUserService.getCurrentEmployee();

        if (currentEmployee.getRole() == Role.ADMIN) {
            return;
        }
        if (vacationRequest.getEmployee().getId().equals(currentEmployee.getId())) {
            return;
        }
        if (currentEmployee.getRole() == Role.MANAGER
                && isDirectReport(vacationRequest.getEmployee(), currentEmployee)) {
            return;
        }

        throw new ForbiddenException("Access denied");
    }

    private void ensureCanModifyPending(VacationRequest vacationRequest) {
        if (vacationRequest.getStatus() != VacationStatus.PENDING) {
            throw new BusinessException("Cannot update vacation request in current status");
        }
        ensureCanModify(vacationRequest);
    }

    private void ensureCanModify(VacationRequest vacationRequest) {
        Employee currentEmployee = currentUserService.getCurrentEmployee();

        if (currentEmployee.getRole() == Role.ADMIN) {
            return;
        }
        if (vacationRequest.getEmployee().getId().equals(currentEmployee.getId())) {
            return;
        }

        throw new ForbiddenException("Access denied");
    }

    private void ensureCanApproveOrReject(VacationRequest vacationRequest) {
        Employee currentEmployee = currentUserService.getCurrentEmployee();

        if (currentEmployee.getRole() == Role.ADMIN) {
            return;
        }
        if (currentEmployee.getRole() == Role.MANAGER
                && isDirectReport(vacationRequest.getEmployee(), currentEmployee)) {
            return;
        }

        throw new ForbiddenException("Access denied");
    }

    private void ensureCanCancel(VacationRequest vacationRequest) {
        Employee currentEmployee = currentUserService.getCurrentEmployee();

        if (currentEmployee.getRole() == Role.ADMIN) {
            return;
        }
        if (vacationRequest.getEmployee().getId().equals(currentEmployee.getId())) {
            return;
        }
        if (currentEmployee.getRole() == Role.MANAGER
                && isDirectReport(vacationRequest.getEmployee(), currentEmployee)) {
            return;
        }

        throw new ForbiddenException("Access denied");
    }

    private boolean isDirectReport(Employee employee, Employee manager) {
        Employee employeeManager = employee.getManager();
        return employeeManager != null && employeeManager.getId().equals(manager.getId());
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new BusinessException("Invalid date range");
        }
    }

    private void validateNoOverlap(LocalDate startDate, LocalDate endDate, UUID excludeId) {
        if (vacationRequestRepository.existsActiveOverlap(startDate, endDate, excludeId)) {
            throw new OverlapConflictException("Vacation period overlaps with an existing request");
        }
    }

    private VacationRequest findVacationRequestOrThrow(UUID id) {
        return vacationRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vacation request not found"));
    }
}
