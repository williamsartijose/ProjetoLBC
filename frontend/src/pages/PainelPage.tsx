import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatCard from '../components/dashboard/StatCard';
import StatusSummary from '../components/dashboard/StatusSummary';
import MonthlyRequestsChart from '../components/dashboard/MonthlyRequestsChart';
import RecentRequestsTable from '../components/dashboard/RecentRequestsTable';
import { useDashboardData } from '../features/dashboard/useDashboardData';
import { getApiErrorMessage } from '../lib/apiError';

export default function PainelPage() {
  const data = useDashboardData();

  const cards = [
    {
      label: 'Total de Colaboradores',
      value: data.totalEmployees,
      icon: <PeopleOutlineIcon />,
      color: '#2563EB',
    },
    {
      label: 'Pedidos de Férias',
      value: data.totalRequests,
      icon: <EventNoteOutlinedIcon />,
      color: '#0EA5E9',
    },
    {
      label: 'Pedidos Pendentes',
      value: data.pending,
      icon: <HourglassEmptyOutlinedIcon />,
      color: '#D97706',
    },
    {
      label: 'Pedidos Aprovados',
      value: data.approved,
      icon: <CheckCircleOutlineIcon />,
      color: '#16A34A',
    },
    {
      label: 'Pedidos Rejeitados',
      value: data.rejected,
      icon: <CancelOutlinedIcon />,
      color: '#DC2626',
    },
    {
      label: 'Pedidos Cancelados',
      value: data.cancelled,
      icon: <BlockOutlinedIcon />,
      color: '#64748B',
    },
  ];

  return (
    <Box>
      <DashboardHeader title="Painel" subtitle="Visão geral da gestão de férias." />

      {data.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getApiErrorMessage(data.errorMessage, 'Não foi possível carregar os dados do painel.')}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
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
            loading={data.isLoading}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2.5,
          mb: 3,
        }}
      >
        <StatusSummary statusCounts={data.statusCounts} total={data.totalRequests} />
        <MonthlyRequestsChart monthlyCounts={data.monthlyCounts} />
      </Box>

      <RecentRequestsTable requests={data.recentRequests} />
    </Box>
  );
}
