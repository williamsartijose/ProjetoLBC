import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface BulletListProps {
  items: string[];
}

export default function BulletList({ items }: BulletListProps) {
  return (
    <List disablePadding>
      {items.map((item) => (
        <ListItem key={item} disableGutters sx={{ alignItems: 'flex-start', py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 32, mt: 0.25 }}>
            <CheckCircleOutlineIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText
            primary={item}
            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
          />
        </ListItem>
      ))}
    </List>
  );
}
