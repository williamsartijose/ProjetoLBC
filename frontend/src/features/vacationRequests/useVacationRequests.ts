import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveVacationRequest,
  cancelVacationRequest,
  createVacationRequest,
  fetchVacationRequests,
  rejectVacationRequest,
  updateVacationRequest,
} from './vacationRequestsApi';
import type { CreateVacationRequestPayload, UpdateVacationRequestPayload } from './types';
import { useCurrentUser } from '../../context/CurrentUserContext';

const VACATION_REQUESTS_KEY = 'vacation-requests';

export function useVacationRequests() {
  const { currentUserId } = useCurrentUser();
  return useQuery({
    // Inclui o utilizador ativo na chave para isolar e refazer a busca por utilizador.
    queryKey: [VACATION_REQUESTS_KEY, currentUserId],
    queryFn: fetchVacationRequests,
  });
}

export function useCreateVacationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVacationRequestPayload) => createVacationRequest(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [VACATION_REQUESTS_KEY] }),
  });
}

export function useUpdateVacationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVacationRequestPayload }) =>
      updateVacationRequest(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [VACATION_REQUESTS_KEY] }),
  });
}

export function useApproveVacationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveVacationRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [VACATION_REQUESTS_KEY] }),
  });
}

export function useRejectVacationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
      rejectVacationRequest(id, rejectionReason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [VACATION_REQUESTS_KEY] }),
  });
}

export function useCancelVacationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelVacationRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [VACATION_REQUESTS_KEY] }),
  });
}
