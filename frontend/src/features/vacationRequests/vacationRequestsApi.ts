import { apiClient } from '../../lib/apiClient';
import type {
  CreateVacationRequestPayload,
  UpdateVacationRequestPayload,
  VacationRequest,
} from './types';

const RESOURCE = '/api/vacation-requests';

export async function fetchVacationRequests(): Promise<VacationRequest[]> {
  const { data } = await apiClient.get<VacationRequest[]>(RESOURCE);
  return data;
}

export async function createVacationRequest(
  payload: CreateVacationRequestPayload,
): Promise<VacationRequest> {
  const { data } = await apiClient.post<VacationRequest>(RESOURCE, payload);
  return data;
}

export async function updateVacationRequest(
  id: string,
  payload: UpdateVacationRequestPayload,
): Promise<VacationRequest> {
  const { data } = await apiClient.put<VacationRequest>(`${RESOURCE}/${id}`, payload);
  return data;
}

export async function approveVacationRequest(id: string): Promise<VacationRequest> {
  const { data } = await apiClient.post<VacationRequest>(`${RESOURCE}/${id}/approve`);
  return data;
}

export async function rejectVacationRequest(
  id: string,
  rejectionReason: string,
): Promise<VacationRequest> {
  const { data } = await apiClient.post<VacationRequest>(`${RESOURCE}/${id}/reject`, {
    rejectionReason,
  });
  return data;
}

export async function cancelVacationRequest(id: string): Promise<VacationRequest> {
  const { data } = await apiClient.post<VacationRequest>(`${RESOURCE}/${id}/cancel`);
  return data;
}
