import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface RoleDescription {
  role: string;
  description: string;
}

const ROLES: RoleDescription[] = [
  { role: 'ADMIN', description: 'Gere colaboradores e todos os pedidos de férias.' },
  { role: 'MANAGER', description: 'Gere pedidos próprios e dos subordinados diretos.' },
  { role: 'COLLABORATOR', description: 'Gere apenas os próprios pedidos.' },
];

export default function RoleList() {
  return (
    <Stack spacing={2}>
      {ROLES.map((entry) => (
        <Box key={entry.role} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Chip label={entry.role} color="primary" variant="outlined" size="small" sx={{ minWidth: 124 }} />
          <Typography variant="body2" color="text.secondary">
            {entry.description}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
