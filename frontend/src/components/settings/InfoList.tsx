import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface InfoItem {
  label: string;
  value: string;
}

interface InfoListProps {
  items: InfoItem[];
}

export default function InfoList({ items }: InfoListProps) {
  return (
    <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />} spacing={0}>
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 0.5,
            py: 1.25,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {item.label}
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
