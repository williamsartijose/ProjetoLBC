import { useCallback, useEffect, useMemo, useState } from 'react';
import { useVacationRequests } from '../vacationRequests/useVacationRequests';
import { useCurrentUser } from '../../context/CurrentUserContext';
import {
  buildNotifications,
  loadReadIds,
  saveReadIds,
} from './notificationUtils';
import type { AppNotification } from './notificationTypes';

export interface NotificationsData {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

/**
 * Isola toda a lógica de notificações: derivação a partir dos pedidos,
 * estado lido/não lido por utilizador e persistência em localStorage.
 */
export function useNotifications(): NotificationsData {
  const { currentUserId } = useCurrentUser();
  const { data: requests = [] } = useVacationRequests();

  const [readIds, setReadIds] = useState<string[]>(() => loadReadIds(currentUserId));

  useEffect(() => {
    setReadIds(loadReadIds(currentUserId));
  }, [currentUserId]);

  const notifications = useMemo(
    () => buildNotifications(requests, new Set(readIds)),
    [requests, readIds],
  );

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const markAsRead = useCallback(
    (id: string) => {
      setReadIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        saveReadIds(currentUserId, next);
        return next;
      });
    },
    [currentUserId],
  );

  const markAllAsRead = useCallback(() => {
    setReadIds((prev) => {
      const merged = Array.from(new Set([...prev, ...notifications.map((n) => n.id)]));
      saveReadIds(currentUserId, merged);
      return merged;
    });
  }, [currentUserId, notifications]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
