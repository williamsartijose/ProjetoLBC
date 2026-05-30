import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type VacationRequest,
} from '../../features/vacationRequests/types';
import { formatIsoDate } from '../../lib/formatDate';

interface RecentRequestsTableProps {
  requests: VacationRequest[];
}

export default function RecentRequestsTable({ requests }: RecentRequestsTableProps) {
  return (
    <Paper variant="outlined">
      <Typography variant="h6" sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
        Últimos Pedidos
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Colaborador</TableCell>
              <TableCell>Data Início</TableCell>
              <TableCell>Data Fim</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">Nenhum pedido recente.</Typography>
                </TableCell>
              </TableRow>
            )}
            {requests.map((request) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
