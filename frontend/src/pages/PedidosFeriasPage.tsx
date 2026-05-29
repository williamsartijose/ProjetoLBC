import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import VacationRequestFormDialog, {
  type VacationRequestFormValues,
} from '../features/vacationRequests/VacationRequestFormDialog';
import RejectDialog from '../features/vacationRequests/RejectDialog';
import {
  useApproveVacationRequest,
  useCancelVacationRequest,
  useCreateVacationRequest,
  useRejectVacationRequest,
  useUpdateVacationRequest,
  useVacationRequests,
} from '../features/vacationRequests/useVacationRequests';
import { STATUS_COLORS, STATUS_LABELS, type VacationRequest } from '../features/vacationRequests/types';
import { useEmployees } from '../features/employees/useEmployees';
import { useCurrentUser } from '../context/CurrentUserContext';
import { getApiErrorMessage } from '../lib/apiError';
import { formatIsoDate } from '../lib/formatDate';

export default function PedidosFeriasPage() {
  const { currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  const { data: requests = [], isLoading, isError, error } = useVacationRequests();
  const { data: employees = [] } = useEmployees();

  const createMutation = useCreateVacationRequest();
  const updateMutation = useUpdateVacationRequest();
  const approveMutation = useApproveVacationRequest();
  const rejectMutation = useRejectVacationRequest();
  const cancelMutation = useCancelVacationRequest();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<VacationRequest | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [rejectTarget, setRejectTarget] = useState<VacationRequest | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCreateClick = () => {
    setEditing(null);
    setFormError(null);
    setFormOpen(true);
  };

  const handleEditClick = (request: VacationRequest) => {
    setEditing(request);
    setFormError(null);
    setFormOpen(true);
  };

  const handleFormSubmit = (values: VacationRequestFormValues) => {
    setFormError(null);
    if (editing) {
      updateMutation.mutate(
        {
          id: editing.id,
          payload: {
            startDate: values.startDate,
            endDate: values.endDate,
            reason: values.reason,
          },
        },
        {
          onSuccess: () => {
            setFormOpen(false);
            setFeedback('Pedido atualizado com sucesso.');
          },
          onError: (err) =>
            setFormError(getApiErrorMessage(err, 'Não foi possível atualizar o pedido.')),
        },
      );
    } else {
      createMutation.mutate(
        {
          employeeId: isAdmin ? values.employeeId : null,
          startDate: values.startDate,
          endDate: values.endDate,
          reason: values.reason,
        },
        {
          onSuccess: () => {
            setFormOpen(false);
            setFeedback('Pedido criado com sucesso.');
          },
          onError: (err) =>
            setFormError(getApiErrorMessage(err, 'Não foi possível criar o pedido.')),
        },
      );
    }
  };

  const handleApprove = (request: VacationRequest) => {
    setActionError(null);
    approveMutation.mutate(request.id, {
      onSuccess: () => setFeedback('Pedido aprovado com sucesso.'),
      onError: (err) =>
        setActionError(getApiErrorMessage(err, 'Não foi possível aprovar o pedido.')),
    });
  };

  const handleCancel = (request: VacationRequest) => {
    setActionError(null);
    cancelMutation.mutate(request.id, {
      onSuccess: () => setFeedback('Pedido cancelado com sucesso.'),
      onError: (err) =>
        setActionError(getApiErrorMessage(err, 'Não foi possível cancelar o pedido.')),
    });
  };

  const handleRejectConfirm = (rejectionReason: string) => {
    if (!rejectTarget) return;
    setRejectError(null);
    rejectMutation.mutate(
      { id: rejectTarget.id, rejectionReason },
      {
        onSuccess: () => {
          setRejectTarget(null);
          setFeedback('Pedido rejeitado com sucesso.');
        },
        onError: (err) =>
          setRejectError(getApiErrorMessage(err, 'Não foi possível rejeitar o pedido.')),
      },
    );
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Pedidos de Férias
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Criação, aprovação, rejeição e cancelamento de pedidos de férias.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
          Novo Pedido
        </Button>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getApiErrorMessage(error, 'Não foi possível carregar os pedidos de férias.')}
        </Alert>
      )}

      {actionError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Colaborador</TableCell>
                <TableCell>Data de Início</TableCell>
                <TableCell>Data de Fim</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      Nenhum pedido de férias encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {requests.map((request) => {
                const isPending = request.status === 'PENDING';
                const canCancel = request.status === 'PENDING' || request.status === 'APPROVED';
                return (
                  <TableRow key={request.id} hover>
                    <TableCell>{request.employeeName}</TableCell>
                    <TableCell>{formatIsoDate(request.startDate)}</TableCell>
                    <TableCell>{formatIsoDate(request.endDate)}</TableCell>
                    <TableCell>
                      <Tooltip title={request.rejectionReason ?? ''} disableHoverListener={!request.rejectionReason}>
                        <Chip
                          label={STATUS_LABELS[request.status]}
                          color={STATUS_COLORS[request.status]}
                          size="small"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>{request.reason}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(request)}
                            disabled={!isPending}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Aprovar">
                        <span>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprove(request)}
                            disabled={!isPending}
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Rejeitar">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setRejectTarget(request);
                              setRejectError(null);
                            }}
                            disabled={!isPending}
                          >
                            <CancelOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Cancelar">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleCancel(request)}
                            disabled={!canCancel}
                          >
                            <EventBusyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <VacationRequestFormDialog
        open={formOpen}
        request={editing}
        isAdmin={isAdmin}
        employees={employees}
        submitting={createMutation.isPending || updateMutation.isPending}
        errorMessage={formError}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <RejectDialog
        open={Boolean(rejectTarget)}
        submitting={rejectMutation.isPending}
        errorMessage={rejectError}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
      />

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setFeedback(null)} variant="filled">
          {feedback}
        </Alert>
      </Snackbar>
    </Box>
  );
}
