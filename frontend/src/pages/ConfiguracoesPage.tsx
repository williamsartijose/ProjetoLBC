import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PlaceholderPage from '../components/PlaceholderPage';

export default function ConfiguracoesPage() {
  return (
    <PlaceholderPage
      title="Configurações"
      description="Definições gerais da aplicação."
      icon={<SettingsOutlinedIcon fontSize="inherit" />}
    />
  );
}
