import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import { SIDEBAR_WIDTH } from './Sidebar';
import { useCurrentUser } from '../context/CurrentUserContext';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { currentUserId, currentUser, users, setCurrentUserId } = useCurrentUser();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          color="inherit"
          aria-label="abrir menu"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <TextField
          select
          size="small"
          label="Utilizador Ativo"
          value={currentUserId}
          onChange={(event) => setCurrentUserId(event.target.value)}
          sx={{ minWidth: 220 }}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} ({user.role})
            </MenuItem>
          ))}
        </TextField>

        <Avatar sx={{ bgcolor: 'primary.main' }}>{currentUser?.initials ?? '?'}</Avatar>
      </Toolbar>
    </AppBar>
  );
}
