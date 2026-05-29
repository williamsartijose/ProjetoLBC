export type VacationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: VacationStatus;
  reason: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVacationRequestPayload {
  employeeId: string | null;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateVacationRequestPayload {
  startDate: string;
  endDate: string;
  reason: string;
}

export const STATUS_LABELS: Record<VacationStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  CANCELLED: 'Cancelado',
};

export const STATUS_COLORS: Record<VacationStatus, 'warning' | 'success' | 'error' | 'default'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};
