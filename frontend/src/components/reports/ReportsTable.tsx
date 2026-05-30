import { useEffect, useMemo, useState } from 'react';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type VacationRequest,
} from '../../features/vacationRequests/types';
import { sortRequests } from '../../features/reports/reportUtils';
import type { SortDirection, SortField } from '../../features/reports/reportTypes';
import { formatIsoDate } from '../../lib/formatDate';

interface ReportsTableProps {
  requests: VacationRequest[];
  loading?: boolean;
}

const ROWS_PER_PAGE = 10;

export default function ReportsTable({ requests, loading }: ReportsTableProps) {
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    setPage(0);
  }, [requests, sortField, sortDirection]);

  const sorted = useMemo(
    () => sortRequests(requests, sortField, sortDirection),
    [requests, sortField, sortDirection],
  );

  const paginated = useMemo(
    () => sorted.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE),
    [sorted, page],
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Colaborador</TableCell>
              <TableCell sortDirection={sortField === 'startDate' ? sortDirection : false}>
                <TableSortLabel
                  active={sortField === 'startDate'}
                  direction={sortField === 'startDate' ? sortDirection : 'asc'}
                  onClick={() => handleSort('startDate')}
                >
                  Data Início
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortField === 'endDate' ? sortDirection : false}>
                <TableSortLabel
                  active={sortField === 'endDate'}
                  direction={sortField === 'endDate' ? sortDirection : 'asc'}
                  onClick={() => handleSort('endDate')}
                >
                  Data Fim
                </TableSortLabel>
              </TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Motivo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            )}

            {!loading && sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    Nenhum pedido encontrado para os filtros selecionados.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paginated.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>{request.employeeName}</TableCell>
                  <TableCell>{formatIsoDate(request.startDate)}</TableCell>
                  <TableCell>{formatIsoDate(request.endDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[request.status]}
                      color={STATUS_COLORS[request.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280 }}>{request.reason}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sorted.length}
        page={page}
        onPageChange={(_event, newPage) => setPage(newPage)}
        rowsPerPage={ROWS_PER_PAGE}
        rowsPerPageOptions={[ROWS_PER_PAGE]}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        labelRowsPerPage="Por página:"
      />
    </Paper>
  );
}
