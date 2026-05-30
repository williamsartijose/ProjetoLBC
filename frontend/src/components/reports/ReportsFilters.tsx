import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import type { Employee } from '../../features/employees/types';
import {
  EMPTY_FILTERS,
  STATUS_FILTER_OPTIONS,
  type ReportFilters,
} from '../../features/reports/reportTypes';

interface ReportsFiltersProps {
  employees: Employee[];
  onApply: (filters: ReportFilters) => void;
  onClear: () => void;
}

export default function ReportsFilters({ employees, onApply, onClear }: ReportsFiltersProps) {
  const [draft, setDraft] = useState<ReportFilters>(EMPTY_FILTERS);

  const updateField = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    onClear();
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        <TextField
          label="Data Início"
          type="date"
          size="small"
          value={draft.startDate}
          onChange={(event) => updateField('startDate', event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data Fim"
          type="date"
          size="small"
          value={draft.endDate}
          onChange={(event) => updateField('endDate', event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Colaborador"
          size="small"
          value={draft.employeeId}
          onChange={(event) => updateField('employeeId', event.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          {employees.map((employee) => (
            <MenuItem key={employee.id} value={employee.id}>
              {employee.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Estado"
          size="small"
          value={draft.status}
          onChange={(event) =>
            updateField('status', event.target.value as ReportFilters['status'])
          }
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
        <Button
          variant="contained"
          startIcon={<FilterAltOutlinedIcon />}
          onClick={() => onApply(draft)}
        >
          Filtrar
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ClearAllOutlinedIcon />}
          onClick={handleClear}
        >
          Limpar
        </Button>
      </Stack>
    </Paper>
  );
}
