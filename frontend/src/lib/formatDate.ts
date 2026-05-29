/**
 * Converte uma data ISO (yyyy-MM-dd) para o formato dd/MM/yyyy usado na interface.
 */
export function formatIsoDate(isoDate: string): string {
  if (!isoDate) {
    return '—';
  }
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) {
    return isoDate;
  }
  return `${day}/${month}/${year}`;
}
