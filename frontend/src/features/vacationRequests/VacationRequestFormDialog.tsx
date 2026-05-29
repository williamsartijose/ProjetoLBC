import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { Employee } from '../employees/types';
import type { VacationRequest } from './types';

export interface VacationRequestFormValues {
  employeeId: string | null;
  startDate: string;
  endDate: string;
  reason: string;
}

interface VacationRequestFormDialogProps {
  open: boolean;
  request: VacationRequest | null;
  isAdmin: boolean;
  employees: Employee[];
  submitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (values: VacationRequestFormValues) => void;
}

const EMPTY_FORM: VacationRequestFormValues = {
  employeeId: null,
  startDate: '',
  endDate: '',
  reason: '',
};

const NO_EMPLOYEE = '';

export default function VacationRequestFormDialog({
  open,
  request,
  isAdmin,
  employees,
  submitting,
  errorMessage,
  onClose,
  onSubmit,
}: VacationRequestFormDialogProps) {
  const [form, setForm] = useState<VacationRequestFormValues>(EMPTY_FORM);

  const isEditing = Boolean(request);
  // O dropdown de colaborador só é relevante ao criar como ADMIN; na edição o backend não altera o colaborador.
  const showEmployeeSelect = isAdmin && !isEditing;

  useEffect(() => {
    if (open) {
      setForm(
        request
          ? {
              employeeId: request.employeeId,
              startDate: request.startDate,
              endDate: request.endDate,
              reason: request.reason,
            }
          : EMPTY_FORM,
      );
    }
  }, [open, request]);

  const isValid =
    form.startDate.length > 0 &&
    form.endDate.length > 0 &&
    form.reason.trim().length > 0 &&
    (!showEmployeeSelect || Boolean(form.employeeId));

  const handleSubmit = () => {
    onSubmit({
      employeeId: form.employeeId,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? 'Editar Pedido' : 'Novo Pedido'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {showEmployeeSelect && (
            <TextField
              label="Colaborador"
              select
              value={form.employeeId ?? NO_EMPLOYEE}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, employeeId: event.target.value || null }))
              }
              fullWidth
              required
            >
              <MenuItem value={NO_EMPLOYEE} disabled>
                Selecione um colaborador
              </MenuItem>
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label="Data de Início"
            type="date"
            value={form.startDate}
            onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Data de Fim"
            type="date"
            value={form.endDate}
            onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Motivo"
            value={form.reason}
            onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
            fullWidth
            required
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid || submitting}>
          {isEditing ? 'Guardar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
