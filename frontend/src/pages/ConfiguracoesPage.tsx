import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SettingsSection from '../components/settings/SettingsSection';
import InfoList from '../components/settings/InfoList';
import RoleList from '../components/settings/RoleList';
import BulletList from '../components/settings/BulletList';
import { useCurrentUser } from '../context/CurrentUserContext';

const SYSTEM_INFO = [
  { label: 'Nome da aplicação', value: 'Gestão de Férias' },
  { label: 'Projeto', value: 'Projeto LBC' },
  { label: 'Versão', value: '1.0.0' },
  { label: 'Backend API', value: 'http://localhost:8080/api' },
  { label: 'Frontend', value: 'http://localhost:5173' },
];

const BUSINESS_RULES = [
  'Não são permitidos pedidos de férias sobrepostos.',
  'Pedidos pendentes podem ser editados.',
  'Pedidos pendentes podem ser aprovados ou rejeitados.',
  'Pedidos pendentes ou aprovados podem ser cancelados.',
  'Apenas o Admin pode gerir colaboradores.',
];

const APP_STATUS = [
  'Backend integrado',
  'PostgreSQL via Docker',
  'API REST',
  'Frontend React',
  'Relatórios CSV',
  'Dashboard ativo',
];

export default function ConfiguracoesPage() {
  const { currentUser } = useCurrentUser();

  const activeUserInfo = [
    { label: 'Nome', value: currentUser?.name ?? '—' },
    { label: 'Email', value: currentUser?.email ?? '—' },
    { label: 'Perfil', value: currentUser?.role ?? '—' },
    { label: 'ID', value: currentUser?.id ?? '—' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Configurações
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestão das preferências e informações do sistema.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2.5,
        }}
      >
        <SettingsSection title="Informações do Sistema" icon={<InfoOutlinedIcon fontSize="small" />}>
          <InfoList items={SYSTEM_INFO} />
        </SettingsSection>

        <SettingsSection title="Utilizador Ativo" icon={<PersonOutlineIcon fontSize="small" />}>
          <InfoList items={activeUserInfo} />
        </SettingsSection>

        <SettingsSection title="Perfis do Sistema" icon={<GroupOutlinedIcon fontSize="small" />}>
          <RoleList />
        </SettingsSection>

        <SettingsSection title="Regras de Negócio" icon={<RuleOutlinedIcon fontSize="small" />}>
          <BulletList items={BUSINESS_RULES} />
        </SettingsSection>

        <SettingsSection title="Estado da Aplicação" icon={<CheckCircleOutlineIcon fontSize="small" />}>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {APP_STATUS.map((item) => (
              <Chip key={item} label={item} color="success" variant="outlined" />
            ))}
          </Stack>
        </SettingsSection>
      </Box>
    </Box>
  );
}
