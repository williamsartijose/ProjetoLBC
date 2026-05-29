import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 2,
          color: 'text.secondary',
          borderStyle: 'dashed',
        }}
      >
        <Box sx={{ fontSize: 56, lineHeight: 0, color: 'primary.main' }}>{icon}</Box>
        <Typography variant="h6">Em construção</Typography>
        <Typography variant="body2">
          Esta área será implementada numa fase seguinte, seguindo o design definido no Figma.
        </Typography>
      </Paper>
    </Box>
  );
}
