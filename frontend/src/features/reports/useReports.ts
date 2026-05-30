import { useMemo } from 'react';
import { useEmployees } from '../employees/useEmployees';
import { useVacationRequests } from '../vacationRequests/useVacationRequests';
import { filterRequests, summarizeRequests } from './reportUtils';
import type { ReportFilters, ReportSummary } from './reportTypes';
import type { Employee } from '../employees/types';
import type { VacationRequest } from '../vacationRequests/types';

export interface ReportsData {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  employees: Employee[];
  filteredRequests: VacationRequest[];
  summary: ReportSummary;
}

/**
 * Compõe os dados de relatórios reutilizando os hooks de query existentes
 * (mesma cache e scoping por utilizador) e aplicando os filtros de forma
 * memoizada com funções puras.
 */
export function useReports(filters: ReportFilters): ReportsData {
  const requestsQuery = useVacationRequests();
  const employeesQuery = useEmployees();

  const allRequests = requestsQuery.data ?? [];
  const employees = employeesQuery.data ?? [];

  const filteredRequests = useMemo(
    () => filterRequests(allRequests, filters),
    [allRequests, filters],
  );

  const summary = useMemo(() => summarizeRequests(filteredRequests), [filteredRequests]);

  return {
    isLoading: requestsQuery.isLoading || employeesQuery.isLoading,
    isError: requestsQuery.isError || employeesQuery.isError,
    error: requestsQuery.error ?? employeesQuery.error,
    employees,
    filteredRequests,
    summary,
  };
}
