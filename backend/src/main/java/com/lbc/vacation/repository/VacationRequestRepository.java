package com.lbc.vacation.repository;

import com.lbc.vacation.domain.entity.VacationRequest;
import com.lbc.vacation.domain.enums.VacationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface VacationRequestRepository extends JpaRepository<VacationRequest, UUID> {

    List<VacationRequest> findByEmployee_Id(UUID employeeId);

    List<VacationRequest> findByEmployee_IdIn(List<UUID> employeeIds);

    boolean existsByEmployee_Id(UUID employeeId);

    @Query("""
            SELECT COUNT(vr) > 0
            FROM VacationRequest vr
            WHERE vr.status IN :activeStatuses
              AND vr.startDate <= :endDate
              AND vr.endDate >= :startDate
              AND (:excludeId IS NULL OR vr.id <> :excludeId)
            """)
    boolean existsOverlapping(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("excludeId") UUID excludeId,
            @Param("activeStatuses") List<VacationStatus> activeStatuses);

    default boolean existsActiveOverlap(LocalDate startDate, LocalDate endDate, UUID excludeId) {
        return existsOverlapping(
                startDate,
                endDate,
                excludeId,
                List.of(VacationStatus.PENDING, VacationStatus.APPROVED));
    }
}
