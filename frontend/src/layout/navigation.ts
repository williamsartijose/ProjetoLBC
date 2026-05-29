import type { SvgIconComponent } from '@mui/icons-material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { ROUTES } from '../routes/paths';

export interface NavItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Painel', path: ROUTES.painel, icon: DashboardOutlinedIcon },
  { label: 'Colaboradores', path: ROUTES.colaboradores, icon: PeopleOutlineIcon },
  { label: 'Pedidos de Férias', path: ROUTES.pedidosFerias, icon: EventNoteOutlinedIcon },
  { label: 'Relatórios', path: ROUTES.relatorios, icon: AssessmentOutlinedIcon },
  { label: 'Configurações', path: ROUTES.configuracoes, icon: SettingsOutlinedIcon },
];
