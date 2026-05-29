import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  SEEDED_USERS,
  getStoredUserId,
  setStoredUserId,
  type SeededUser,
} from '../lib/currentUser';

interface CurrentUserContextValue {
  currentUserId: string;
  currentUser: SeededUser | undefined;
  users: SeededUser[];
  setCurrentUserId: (userId: string) => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserIdState] = useState<string>(getStoredUserId);

  const setCurrentUserId = useCallback(
    (userId: string) => {
      setStoredUserId(userId);
      setCurrentUserIdState(userId);
      // O header X-User-Id muda; revalida os dados dependentes do utilizador ativo.
      queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const value = useMemo<CurrentUserContextValue>(
    () => ({
      currentUserId,
      currentUser: SEEDED_USERS.find((user) => user.id === currentUserId),
      users: SEEDED_USERS,
      setCurrentUserId,
    }),
    [currentUserId, setCurrentUserId],
  );

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser(): CurrentUserContextValue {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error('useCurrentUser deve ser usado dentro de CurrentUserProvider');
  }
  return context;
}
