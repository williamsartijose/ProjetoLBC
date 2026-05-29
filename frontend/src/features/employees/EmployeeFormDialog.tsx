import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import type { Employee, EmployeePayload, Role } from './types';
import { ROLE_OPTIONS } from './types';

interface EmployeeFormDialogProps {
  open: boolean;
  employee: Employee | null;
  employees: Employee[];
  submitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (payload: EmployeePayload) => void;
}

const EMPTY_FORM: EmployeePayload = {
  name: '',
  email: '',
  role: 'COLLABORATOR',
  managerId: null,
};

const NO_MANAGER = 'none';

export default function EmployeeFormDialog({
  open,
  employee,
  employees,
  submitting,
  errorMessage,
  onClose,
  onSubmit,
}: EmployeeFormDialogProps) {
  const [form, setForm] = useState<EmployeePayload>(EMPTY_FORM);

  const isEditing = Boolean(employee);

  useEffect(() => {
    if (open) {
      setForm(
        employee
          ? {
              name: employee.name,
              email: employee.email,
              role: employee.role,
              managerId: employee.managerId,
            }
          : EMPTY_FORM,
      );
    }
  }, [open, employee]);

  const managerOptions = employees.filter((candidate) => candidate.id !== employee?.id);

  const handleSubmit = () => {
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      managerId: form.managerId,
    });
  };

  const isValid = form.name.trim().length > 0 && form.email.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? 'Editar Colaborador' : 'Novo Colaborador'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <TextField
            label="Nome"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Função"
            select
            value={form.role}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, role: event.target.value as Role }))
            }
            fullWidth
          >
            {ROLE_OPTIONS.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Manager"
            select
            value={form.managerId ?? NO_MANAGER}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                managerId: event.target.value === NO_MANAGER ? null : event.target.value,
              }))
            }
            fullWidth
            helperText="Opcional — colaborador responsável."
          >
            <MenuItem value={NO_MANAGER}>Sem manager</MenuItem>
            {managerOptions.map((candidate) => (
              <MenuItem key={candidate.id} value={candidate.id}>
                {candidate.name}
              </MenuItem>
            ))}
          </TextField>
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
