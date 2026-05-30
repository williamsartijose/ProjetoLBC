import { useMemo } from 'react';
import { useEmployees } from '../employees/useEmployees';
import { useVacationRequests } from '../vacationRequests/useVacationRequests';
import {
  buildMonthlyCounts,
  buildStatusCounts,
  countByStatus,
  sortByMostRecent,
  type MonthlyCount,
  type StatusCount,
} from './dashboardMetrics';
import type { VacationRequest } from '../vacationRequests/types';

export interface DashboardData {
  isLoading: boolean;
  isError: boolean;
  errorMessage: unknown;
  totalEmployees: number;
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  statusCounts: StatusCount[];
  monthlyCounts: MonthlyCount[];
  recentRequests: VacationRequest[];
}

const RECENT_LIMIT = 5;

export function useDashboardData(): DashboardData {
  const employeesQuery = useEmployees();
  const requestsQuery = useVacationRequests();

  const employees = employeesQuery.data ?? [];
  const requests = requestsQuery.data ?? [];

  return useMemo<DashboardData>(
    () => ({
      isLoading: employeesQuery.isLoading || requestsQuery.isLoading,
      isError: employeesQuery.isError || requestsQuery.isError,
      errorMessage: employeesQuery.error ?? requestsQuery.error,
      totalEmployees: employees.length,
      totalRequests: requests.length,
      pending: countByStatus(requests, 'PENDING'),
      approved: countByStatus(requests, 'APPROVED'),
      rejected: countByStatus(requests, 'REJECTED'),
      cancelled: countByStatus(requests, 'CANCELLED'),
      statusCounts: buildStatusCounts(requests),
      monthlyCounts: buildMonthlyCounts(requests),
      recentRequests: sortByMostRecent(requests).slice(0, RECENT_LIMIT),
    }),
    [
      employees,
      requests,
      employeesQuery.isLoading,
      employeesQuery.isError,
      employeesQuery.error,
      requestsQuery.isLoading,
      requestsQuery.isError,
      requestsQuery.error,
    ],
  );
}
