import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ReportsFilters from '../components/reports/ReportsFilters';
import ReportsSummaryCards from '../components/reports/ReportsSummaryCards';
import ReportsTable from '../components/reports/ReportsTable';
import { useReports } from '../features/reports/useReports';
import { EMPTY_FILTERS, type ReportFilters } from '../features/reports/reportTypes';
import {
  buildReportCsv,
  buildReportFileName,
  downloadCsv,
} from '../features/reports/reportUtils';
import { getApiErrorMessage } from '../lib/apiError';

export default function RelatoriosPage() {
  const [filters, setFilters] = useState<ReportFilters>(EMPTY_FILTERS);
  const { isLoading, isError, error, employees, filteredRequests, summary } = useReports(filters);

  const handleExport = () => {
    const csv = buildReportCsv(filteredRequests);
    downloadCsv(buildReportFileName(), csv);
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
            Relatórios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análise e exportação dos pedidos de férias.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FileDownloadOutlinedIcon />}
          onClick={handleExport}
          disabled={filteredRequests.length === 0}
        >
          Exportar CSV
        </Button>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getApiErrorMessage(error, 'Não foi possível carregar os relatórios.')}
        </Alert>
      )}

      <ReportsFilters
        employees={employees}
        onApply={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      <ReportsSummaryCards summary={summary} loading={isLoading} />

      <ReportsTable requests={filteredRequests} loading={isLoading} />
    </Box>
  );
}
