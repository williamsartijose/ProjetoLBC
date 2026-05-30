import type { VacationRequest } from '../vacationRequests/types';
import type { AppNotification } from './notificationTypes';

const READ_STORAGE_PREFIX = 'notifications:read:';

function messageFor(request: VacationRequest): string {
  switch (request.status) {
    case 'PENDING':
      return `Novo pedido de férias criado por ${request.employeeName}`;
    case 'APPROVED':
      return 'Pedido de férias aprovado';
    case 'REJECTED':
      return 'Pedido de férias rejeitado';
    case 'CANCELLED':
      return 'Pedido de férias cancelado';
    default:
      return 'Pedido de férias atualizado';
  }
}

/**
 * Gera notificações a partir dos pedidos existentes (já filtrados por perfil
 * no backend através do header `X-User-Id`). O `id` combina pedido + estado,
 * pelo que uma mudança de estado gera uma nova notificação não lida.
 */
export function buildNotifications(
  requests: VacationRequest[],
  readIds: Set<string>,
): AppNotification[] {
  return requests
    .map((request) => {
      const id = `${request.id}:${request.status}`;
      return {
        id,
        status: request.status,
        message: messageFor(request),
        createdAt: request.updatedAt || request.createdAt,
        read: readIds.has(id),
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function storageKey(userId: string): string {
  return `${READ_STORAGE_PREFIX}${userId}`;
}

export function loadReadIds(userId: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function saveReadIds(userId: string, ids: string[]): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(ids));
}

export function formatNotificationDate(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
