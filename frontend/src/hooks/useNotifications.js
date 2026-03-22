/**
 * src/hooks/useNotifications.js
 * TanStack Query hooks for the notification bell in TopBar.jsx.
 * Polls the backend every 30 seconds to keep the unread count fresh.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationsRead } from "../services/crm.js";

/** Fetch notifications with a 30-second polling interval. */
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 30_000, // poll every 30 s
    select: (data) => data ?? { notifications: [], unread_count: 0 },
  });
}

/** Mark all notifications as read. Invalidates the notifications query. */
export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
