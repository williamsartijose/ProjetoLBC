import Box from '@mui/material/Box';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import StatCard from '../dashboard/StatCard';
import type { ReportSummary } from '../../features/reports/reportTypes';

interface ReportsSummaryCardsProps {
  summary: ReportSummary;
  loading?: boolean;
}

export default function ReportsSummaryCards({ summary, loading }: ReportsSummaryCardsProps) {
  const cards = [
    {
      label: 'Total de Pedidos',
      value: summary.total,
      icon: <EventNoteOutlinedIcon />,
      color: '#2563EB',
    },
    {
      label: 'Total Aprovados',
      value: summary.approved,
      icon: <CheckCircleOutlineIcon />,
      color: '#16A34A',
    },
    {
      label: 'Total Pendentes',
      value: summary.pending,
      icon: <HourglassEmptyOutlinedIcon />,
      color: '#D97706',
    },
    {
      label: 'Total Rejeitados',
      value: summary.rejected,
      icon: <CancelOutlinedIcon />,
      color: '#DC2626',
    },
    {
      label: 'Total Cancelados',
      value: summary.cancelled,
      icon: <BlockOutlinedIcon />,
      color: '#64748B',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
        gap: 2.5,
        mb: 3,
      }}
    >
      {cards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          color={card.color}
          loading={loading}
        />
      ))}
    </Box>
  );
}
