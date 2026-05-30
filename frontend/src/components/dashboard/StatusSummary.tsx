import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { STATUS_LABELS, type VacationStatus } from '../../features/vacationRequests/types';
import type { StatusCount } from '../../features/dashboard/dashboardMetrics';

interface StatusSummaryProps {
  statusCounts: StatusCount[];
  total: number;
}

const STATUS_HEX: Record<VacationStatus, string> = {
  APPROVED: '#16A34A',
  PENDING: '#D97706',
  REJECTED: '#DC2626',
  CANCELLED: '#94A3B8',
};

function buildConicGradient(statusCounts: StatusCount[], total: number): string {
  if (total === 0) {
    return '#E2E8F0';
  }
  let current = 0;
  const segments = statusCounts
    .filter((entry) => entry.count > 0)
    .map((entry) => {
      const start = (current / total) * 360;
      current += entry.count;
      const end = (current / total) * 360;
      return `${STATUS_HEX[entry.status]} ${start}deg ${end}deg`;
    });
  return `conic-gradient(${segments.join(', ')})`;
}

export default function StatusSummary({ statusCounts, total }: StatusSummaryProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Pedidos por Estado
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 3,
          mt: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 160,
            height: 160,
            flexShrink: 0,
            borderRadius: '50%',
            background: buildConicGradient(statusCounts, total),
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 22,
              borderRadius: '50%',
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5">{total}</Typography>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.25} sx={{ flexGrow: 1, width: '100%' }}>
          {statusCounts.map((entry) => {
            const percentage = total === 0 ? 0 : Math.round((entry.count / total) * 100);
            return (
              <Box
                key={entry.status}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '3px',
                    bgcolor: STATUS_HEX[entry.status],
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {STATUS_LABELS[entry.status]}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {entry.count}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ width: 40, textAlign: 'right' }}>
                  {percentage}%
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Paper>
  );
}
