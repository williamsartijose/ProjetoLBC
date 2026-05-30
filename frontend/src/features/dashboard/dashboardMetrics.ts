import type { VacationRequest, VacationStatus } from '../vacationRequests/types';

export interface StatusCount {
  status: VacationStatus;
  count: number;
}

export interface MonthlyCount {
  monthKey: string;
  label: string;
  count: number;
}

const MONTH_LABELS_PT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export function countByStatus(
  requests: VacationRequest[],
  status: VacationStatus,
): number {
  return requests.filter((request) => request.status === status).length;
}

export function buildStatusCounts(requests: VacationRequest[]): StatusCount[] {
  return (['APPROVED', 'PENDING', 'REJECTED', 'CANCELLED'] as VacationStatus[]).map((status) => ({
    status,
    count: countByStatus(requests, status),
  }));
}

/**
 * Agrupa os pedidos por mês de início, devolvendo os últimos `monthsToShow` meses
 * num intervalo contínuo (incluindo meses sem pedidos) terminando no mês mais recente.
 */
export function buildMonthlyCounts(
  requests: VacationRequest[],
  monthsToShow = 6,
): MonthlyCount[] {
  const counts = new Map<string, number>();

  requests.forEach((request) => {
    const date = parseIsoDate(request.startDate);
    if (!date) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  const reference = latestMonth(requests) ?? new Date();
  const result: MonthlyCount[] = [];

  for (let offset = monthsToShow - 1; offset >= 0; offset -= 1) {
    const date = new Date(reference.getFullYear(), reference.getMonth() - offset, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    result.push({
      monthKey: key,
      label: `${MONTH_LABELS_PT[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`,
      count: counts.get(key) ?? 0,
    });
  }

  return result;
}

export function sortByMostRecent(requests: VacationRequest[]): VacationRequest[] {
  return [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function parseIsoDate(isoDate: string): Date | null {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function latestMonth(requests: VacationRequest[]): Date | null {
  let latest: Date | null = null;
  requests.forEach((request) => {
    const date = parseIsoDate(request.startDate);
    if (date && (!latest || date.getTime() > latest.getTime())) {
      latest = date;
    }
  });
  return latest;
}
