import type { VacationStatus } from '../vacationRequests/types';

export type StatusFilter = 'ALL' | VacationStatus;

export interface ReportFilters {
  startDate: string;
  endDate: string;
  employeeId: string;
  status: StatusFilter;
}

export const EMPTY_FILTERS: ReportFilters = {
  startDate: '',
  endDate: '',
  employeeId: '',
  status: 'ALL',
};

export const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'APPROVED', label: 'Aprovado' },
  { value: 'REJECTED', label: 'Rejeitado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

export interface ReportSummary {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  cancelled: number;
}

export type SortField = 'startDate' | 'endDate';
export type SortDirection = 'asc' | 'desc';
