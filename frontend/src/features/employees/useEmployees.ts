import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from './employeesApi';
import type { EmployeePayload } from './types';
import { useCurrentUser } from '../../context/CurrentUserContext';

const EMPLOYEES_KEY = 'employees';

export function useEmployees() {
  const { currentUserId } = useCurrentUser();
  return useQuery({
    // Inclui o utilizador ativo na chave para que a troca de utilizador
    // force uma query distinta e a busca de dados com o novo X-User-Id.
    queryKey: [EMPLOYEES_KEY, currentUserId],
    queryFn: fetchEmployees,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeePayload) => createEmployee(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: EmployeePayload }) =>
      updateEmployee(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  });
}
