import { useState } from 'react';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NotificationItem from './NotificationItem';
import { useNotifications } from '../../features/notifications/useNotifications';

export default function NotificationsMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton
          aria-label="notificações"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{ color: 'text.secondary' }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 360, maxWidth: '100%', mt: 1 } } }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            gap: 1,
          }}
        >
          <Typography variant="h6">Notificações</Typography>
          <Button size="small" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Marcar todas como lidas
          </Button>
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Sem notificações.
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ maxHeight: 380, overflowY: 'auto' }}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={markAsRead}
              />
            ))}
          </List>
        )}
      </Menu>
    </>
  );
}
