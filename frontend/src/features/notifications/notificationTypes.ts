import type { VacationStatus } from '../vacationRequests/types';

export interface AppNotification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  status: VacationStatus;
}
