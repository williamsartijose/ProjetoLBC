package com.lbc.vacation.controller;

import com.lbc.vacation.dto.CreateVacationRequest;
import com.lbc.vacation.dto.RejectVacationRequest;
import com.lbc.vacation.dto.UpdateVacationRequest;
import com.lbc.vacation.dto.VacationRequestResponse;
import com.lbc.vacation.service.VacationRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vacation-requests")
public class VacationRequestController {

    private final VacationRequestService vacationRequestService;

    public VacationRequestController(VacationRequestService vacationRequestService) {
        this.vacationRequestService = vacationRequestService;
    }

    @PostMapping
    public ResponseEntity<VacationRequestResponse> createVacationRequest(
            @Valid @RequestBody CreateVacationRequest request) {
        VacationRequestResponse response = vacationRequestService.createVacationRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<VacationRequestResponse>> getAllVacationRequests() {
        return ResponseEntity.ok(vacationRequestService.getAllVacationRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VacationRequestResponse> getVacationRequestById(@PathVariable UUID id) {
        return ResponseEntity.ok(vacationRequestService.getVacationRequestById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VacationRequestResponse> updateVacationRequest(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVacationRequest request) {
        return ResponseEntity.ok(vacationRequestService.updateVacationRequest(id, request));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<VacationRequestResponse> approveVacationRequest(@PathVariable UUID id) {
        return ResponseEntity.ok(vacationRequestService.approveVacationRequest(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<VacationRequestResponse> rejectVacationRequest(
            @PathVariable UUID id,
            @Valid @RequestBody RejectVacationRequest request) {
        return ResponseEntity.ok(vacationRequestService.rejectVacationRequest(id, request));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<VacationRequestResponse> cancelVacationRequest(@PathVariable UUID id) {
        return ResponseEntity.ok(vacationRequestService.cancelVacationRequest(id));
    }
}
