import type { VacationRequest } from '../vacationRequests/types';
import { STATUS_LABELS } from '../vacationRequests/types';
import { formatIsoDate } from '../../lib/formatDate';
import type {
  ReportFilters,
  ReportSummary,
  SortDirection,
  SortField,
} from './reportTypes';

/**
 * Filtra os pedidos com base nos filtros aplicados.
 * As datas (formato ISO yyyy-MM-dd) podem ser comparadas lexicograficamente.
 * O intervalo de datas considera sobreposição com o período do pedido.
 */
export function filterRequests(
  requests: VacationRequest[],
  filters: ReportFilters,
): VacationRequest[] {
  return requests.filter((request) => {
    if (filters.employeeId && request.employeeId !== filters.employeeId) {
      return false;
    }
    if (filters.status !== 'ALL' && request.status !== filters.status) {
      return false;
    }
    if (filters.startDate && request.endDate < filters.startDate) {
      return false;
    }
    if (filters.endDate && request.startDate > filters.endDate) {
      return false;
    }
    return true;
  });
}

export function summarizeRequests(requests: VacationRequest[]): ReportSummary {
  return {
    total: requests.length,
    approved: requests.filter((request) => request.status === 'APPROVED').length,
    pending: requests.filter((request) => request.status === 'PENDING').length,
    rejected: requests.filter((request) => request.status === 'REJECTED').length,
    cancelled: requests.filter((request) => request.status === 'CANCELLED').length,
  };
}

export function sortRequests(
  requests: VacationRequest[],
  field: SortField,
  direction: SortDirection,
): VacationRequest[] {
  const sorted = [...requests].sort((a, b) => a[field].localeCompare(b[field]));
  return direction === 'asc' ? sorted : sorted.reverse();
}

const CSV_HEADER = ['Colaborador', 'Data Início', 'Data Fim', 'Estado', 'Motivo'];

function escapeCsvValue(value: string): string {
  const needsQuotes = /[",;\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function buildReportCsv(requests: VacationRequest[]): string {
  const rows = requests.map((request) => [
    request.employeeName,
    formatIsoDate(request.startDate),
    formatIsoDate(request.endDate),
    STATUS_LABELS[request.status],
    request.reason ?? '',
  ]);

  return [CSV_HEADER, ...rows]
    .map((row) => row.map(escapeCsvValue).join(';'))
    .join('\r\n');
}

export function buildReportFileName(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `relatorio-ferias-${year}-${month}-${day}.csv`;
}

export function downloadCsv(fileName: string, content: string): void {
  // Prefixo BOM garante acentuação correta no Excel.
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
