export const CURRENT_USER_STORAGE_KEY = 'currentUserId';

export interface SeededUser {
  id: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'COLLABORATOR';
  initials: string;
}

/**
 * Utilizadores de teste inseridos pela migration Flyway `V2__seed_test_users.sql`.
 * Permitem simular o utilizador autenticado via header `X-User-Id`.
 */
export const SEEDED_USERS: SeededUser[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Admin User',
    role: 'ADMIN',
    initials: 'AU',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Manager User',
    role: 'MANAGER',
    initials: 'MU',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Collaborator User',
    role: 'COLLABORATOR',
    initials: 'CU',
  },
];

export function getStoredUserId(): string {
  const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  if (stored) {
    return stored;
  }
  // Persiste o utilizador padrão para que o interceptor inclua X-User-Id desde a primeira requisição.
  const defaultUserId = SEEDED_USERS[0].id;
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, defaultUserId);
  return defaultUserId;
}

export function setStoredUserId(userId: string): void {
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, userId);
}
