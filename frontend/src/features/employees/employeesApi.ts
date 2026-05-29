import { apiClient } from '../../lib/apiClient';
import type { Employee, EmployeePayload } from './types';

const RESOURCE = '/api/employees';

export async function fetchEmployees(): Promise<Employee[]> {
  const { data } = await apiClient.get<Employee[]>(RESOURCE);
  return data;
}

export async function createEmployee(payload: EmployeePayload): Promise<Employee> {
  const { data } = await apiClient.post<Employee>(RESOURCE, payload);
  return data;
}

export async function updateEmployee(id: string, payload: EmployeePayload): Promise<Employee> {
  const { data } = await apiClient.put<Employee>(`${RESOURCE}/${id}`, payload);
  return data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiClient.delete(`${RESOURCE}/${id}`);
}
