import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { SIDEBAR_WIDTH } from './Sidebar';
import { useCurrentUser } from '../context/CurrentUserContext';
import NotificationsMenu from '../components/notifications/NotificationsMenu';

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
      <Toolbar sx={{ gap: { xs: 1, sm: 2 }, minHeight: 72 }}>
        <IconButton
          color="inherit"
          aria-label="abrir menu"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <TextField
          size="small"
          placeholder="Pesquisar..."
          aria-label="pesquisar"
          sx={{
            width: { xs: '100%', sm: 280 },
            maxWidth: 360,
            '& .MuiOutlinedInput-root': { bgcolor: 'background.default' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="disabled" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <NotificationsMenu />

        <TextField
          select
          size="small"
          label="Utilizador Ativo"
          value={currentUserId}
          onChange={(event) => setCurrentUserId(event.target.value)}
          sx={{ minWidth: { xs: 150, sm: 220 } }}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} ({user.role})
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {currentUser?.name ?? '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentUser?.role ?? ''}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          {currentUser?.initials ?? '?'}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
