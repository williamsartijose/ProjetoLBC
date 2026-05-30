import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  color: string;
  loading?: boolean;
}

export default function StatCard({ label, value, icon, color, loading }: StatCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          height: 52,
          borderRadius: 2,
          bgcolor: `${color}1A`,
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
        {loading ? (
          <Skeleton width={48} height={36} />
        ) : (
          <Typography variant="h4" sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
