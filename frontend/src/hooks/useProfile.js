/**
 * src/hooks/useProfile.js
 * TanStack Query hooks for profile read and update.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../services/crm.js";

/** Fetch the current user's profile data. */
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}

/** Update profile fields. Invalidates the profile query on success. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ full_name, phone, company }) =>
      updateProfile(full_name, phone, company),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
