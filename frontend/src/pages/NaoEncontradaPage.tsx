import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

export default function NaoEncontradaPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Página não encontrada
      </Typography>
      <Button component={RouterLink} to={ROUTES.painel} variant="contained" sx={{ mt: 2 }}>
        Voltar ao Painel
      </Button>
    </Box>
  );
}
