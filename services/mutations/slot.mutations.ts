"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../api/client"

export const useBlockSlots = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (slotIds: string[]) => {
      const response = await apiClient.post("/admin/slots/block", {
        slotIds,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] })
    },
  })
}

export const useUnblockSlots = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (slotIds: string[]) => {
      const response = await apiClient.post("/admin/slots/unblock", {
        slotIds,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] })
    },
  })
}
