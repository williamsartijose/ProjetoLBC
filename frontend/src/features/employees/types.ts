export type Role = 'ADMIN' | 'MANAGER' | 'COLLABORATOR';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  managerId: string | null;
  managerName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeePayload {
  name: string;
  email: string;
  role: Role;
  managerId: string | null;
}

export const ROLE_OPTIONS: Role[] = ['ADMIN', 'MANAGER', 'COLLABORATOR'];
