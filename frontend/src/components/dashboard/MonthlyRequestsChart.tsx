import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { MonthlyCount } from '../../features/dashboard/dashboardMetrics';

interface MonthlyRequestsChartProps {
  monthlyCounts: MonthlyCount[];
}

export default function MonthlyRequestsChart({ monthlyCounts }: MonthlyRequestsChartProps) {
  const maxCount = Math.max(1, ...monthlyCounts.map((entry) => entry.count));

  return (
    <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Pedidos por Mês
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          gap: 1.5,
          height: 200,
          mt: 2,
        }}
      >
        {monthlyCounts.map((entry) => {
          const heightPercent = (entry.count / maxCount) * 100;
          return (
            <Box
              key={entry.monthKey}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                flex: 1,
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                {entry.count}
              </Typography>
              <Box
                sx={{
                  width: '70%',
                  maxWidth: 40,
                  height: `${heightPercent}%`,
                  minHeight: entry.count > 0 ? 6 : 2,
                  borderRadius: 1.5,
                  bgcolor: entry.count > 0 ? 'primary.main' : 'divider',
                  transition: 'height 0.3s ease',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {entry.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
