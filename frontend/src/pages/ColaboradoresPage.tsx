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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EmployeeFormDialog from '../features/employees/EmployeeFormDialog';
import ConfirmDeleteDialog from '../features/employees/ConfirmDeleteDialog';
import {
  useCreateEmployee,
  useDeleteEmployee,
  useEmployees,
  useUpdateEmployee,
} from '../features/employees/useEmployees';
import type { Employee, EmployeePayload, Role } from '../features/employees/types';
import { getApiErrorMessage } from '../lib/apiError';

const ROLE_COLOR: Record<Role, 'error' | 'warning' | 'info'> = {
  ADMIN: 'error',
  MANAGER: 'warning',
  COLLABORATOR: 'info',
};

export default function ColaboradoresPage() {
  const { data: employees = [], isLoading, isError, error } = useEmployees();
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreateClick = () => {
    setEditing(null);
    setFormError(null);
    setFormOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEditing(employee);
    setFormError(null);
    setFormOpen(true);
  };

  const handleFormSubmit = (payload: EmployeePayload) => {
    setFormError(null);
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, payload },
        {
          onSuccess: () => {
            setFormOpen(false);
            setFeedback('Colaborador atualizado com sucesso.');
          },
          onError: (err) =>
            setFormError(getApiErrorMessage(err, 'Não foi possível atualizar o colaborador.')),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setFormOpen(false);
          setFeedback('Colaborador criado com sucesso.');
        },
        onError: (err) =>
          setFormError(getApiErrorMessage(err, 'Não foi possível criar o colaborador.')),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        setFeedback('Colaborador removido com sucesso.');
      },
      onError: (err) =>
        setDeleteError(getApiErrorMessage(err, 'Não foi possível remover o colaborador.')),
    });
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
            Colaboradores
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestão dos colaboradores e respetivos managers.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
          Novo Colaborador
        </Button>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getApiErrorMessage(error, 'Não foi possível carregar os colaboradores.')}
        </Alert>
      )}

      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Função</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      Nenhum colaborador encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {employees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Chip label={employee.role} color={ROLE_COLOR[employee.role]} size="small" />
                  </TableCell>
                  <TableCell>{employee.managerName ?? '—'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEditClick(employee)} size="small">
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remover">
                      <IconButton
                        onClick={() => {
                          setDeleteTarget(employee);
                          setDeleteError(null);
                        }}
                        size="small"
                        color="error"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <EmployeeFormDialog
        open={formOpen}
        employee={editing}
        employees={employees}
        submitting={createMutation.isPending || updateMutation.isPending}
        errorMessage={formError}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        employeeName={deleteTarget?.name}
        submitting={deleteMutation.isPending}
        errorMessage={deleteError}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
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
