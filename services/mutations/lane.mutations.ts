import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { toast } from "sonner"

import { CreateLanePayload, UpdateLanePayload } from "@/schemas/lane"

// ================== REQUEST FUNCTIONS ==================

export async function createLaneRequest(data: CreateLanePayload) {
  const response = await apiClient.post("/admin/lanes", data)
  return response.data
}

export async function updateLaneRequest({ id, ...data }: UpdateLanePayload) {
  const response = await apiClient.patch(`/admin/lanes/${id}`, data)
  return response.data
}

export async function deleteLaneRequest(id: string) {
  const response = await apiClient.delete(`/admin/lanes/${id}`)
  return response.data
}

// ================== REUSABLE MUTATION HOOK ==================

function useLaneMutation<TData, TVariables>(
  mutationKey: string[],
  mutationFn: (vars: TVariables) => Promise<TData>,
  successMessage: string
) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    mutationKey,
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lanes"] })

      toast.success(successMessage)
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong"
      toast.error(message)
    },
  })
}

// ================== EXPORTED HOOKS ==================

export function useCreateLaneMutation() {
  return useLaneMutation(
    ["lanes", "create"],
    createLaneRequest,
    "Lane created successfully"
  )
}

export function useUpdateLaneMutation() {
  return useLaneMutation(
    ["lanes", "update"],
    updateLaneRequest,
    "Lane updated successfully"
  )
}

export function useDeleteLaneMutation() {
  return useLaneMutation(
    ["lanes", "delete"],
    deleteLaneRequest,
    "Lane deleted successfully"
  )
}
