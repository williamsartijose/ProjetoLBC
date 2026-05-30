import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import type { ReactNode } from 'react';
import type { VacationStatus } from '../../features/vacationRequests/types';
import type { AppNotification } from '../../features/notifications/notificationTypes';
import { formatNotificationDate } from '../../features/notifications/notificationUtils';

interface NotificationItemProps {
  notification: AppNotification;
  onClick: (id: string) => void;
}

const STATUS_ICON: Record<VacationStatus, { icon: ReactNode; color: string }> = {
  PENDING: { icon: <HourglassEmptyOutlinedIcon fontSize="small" />, color: '#D97706' },
  APPROVED: { icon: <CheckCircleOutlineIcon fontSize="small" />, color: '#16A34A' },
  REJECTED: { icon: <CancelOutlinedIcon fontSize="small" />, color: '#DC2626' },
  CANCELLED: { icon: <BlockOutlinedIcon fontSize="small" />, color: '#64748B' },
};

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const visual = STATUS_ICON[notification.status];

  return (
    <ListItemButton
      onClick={() => onClick(notification.id)}
      sx={{
        alignItems: 'flex-start',
        gap: 1,
        bgcolor: notification.read ? 'transparent' : 'action.hover',
      }}
    >
      <ListItemIcon sx={{ minWidth: 36, mt: 0.5, color: visual.color }}>
        {visual.icon}
      </ListItemIcon>
      <ListItemText
        primary={notification.message}
        secondary={formatNotificationDate(notification.createdAt)}
        primaryTypographyProps={{
          variant: 'body2',
          fontWeight: notification.read ? 400 : 600,
          whiteSpace: 'normal',
        }}
        secondaryTypographyProps={{ variant: 'caption' }}
      />
      {!notification.read && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'error.main',
            mt: 1,
            flexShrink: 0,
          }}
        />
      )}
    </ListItemButton>
  );
}
