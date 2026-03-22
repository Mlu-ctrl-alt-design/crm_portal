/**
 * src/hooks/useTickets.js
 * TanStack Query hooks for ticket CRUD operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTickets,
  getTicket,
  createTicket,
  replyToTicket,
} from "../services/crm.js";

/** Fetch paginated ticket list with optional status filter. */
export function useTickets(filters = {}) {
  const { status = null, page = 1, page_size = 20 } = filters;
  return useQuery({
    queryKey: ["tickets", { status, page, page_size }],
    queryFn: () => getTickets(status, page, page_size),
  });
}

/** Fetch a single ticket and its communication thread. */
export function useTicket(id) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicket(id),
    enabled: Boolean(id),
  });
}

/** Create a new ticket. Invalidates the tickets list on success. */
export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subject, description, priority }) =>
      createTicket(subject, description, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

/** Post a reply to a ticket. Invalidates that ticket's detail query. */
export function useReplyToTicket(ticketId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ message }) => replyToTicket(ticketId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
    },
  });
}
