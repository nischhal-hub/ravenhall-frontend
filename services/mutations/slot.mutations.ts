// hooks/mutations/slot.mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/services/api/client"
import { toast } from "sonner"

export const useBlockSlots = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slotIds: string[]) =>
      apiClient.post("/slots/block", { slotIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] })
      toast.success("Selected slots blocked successfully")
    },
  })
}

export const useUnblockSlots = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slotIds: string[]) =>
      apiClient.post("/slots/unblock", { slotIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] })
      toast.success("Selected slots unblocked successfully")
    },
  })
}
