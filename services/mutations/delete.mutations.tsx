import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "../api/client"
import { useModalContext } from "@/components/context/modal-context"

export type TDeleteItem = {
  initiatorName: string
  type: string
  displayName?: string
}

const DELETE_CONFIG: Record<string, { endpoint: string; queryKey: string[] }> =
  {
    lanes: {
      endpoint: "/admin/lanes",
      queryKey: ["lanes"],
    },
    discounts: {
      endpoint: "/admin/discounts",
      queryKey: ["discounts"],
    },
    bookings: {
      endpoint: "/bookings",
      queryKey: ["bookings"],
    },
  }

export const useDeleteItem = () => {
  const queryClient = useQueryClient()
  const { closeModal } = useModalContext()

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      const config = DELETE_CONFIG[type]
      const url = config ? `${config.endpoint}/${id}` : `/${type}/${id}`

      return await apiClient.delete(url)
    },

    onSuccess: (_data, variables) => {
      const config = DELETE_CONFIG[variables.type]
      const queryKey = config?.queryKey || [variables.type]

      queryClient.invalidateQueries({ queryKey })
      toast.success(`${capitalize(variables.type)} deleted successfully`)
      closeModal("DELETE_ITEM")
    },

    onError: (error: any) => {
      const message = error?.response?.data?.message || "Deletion failed"
      toast.error(message)
    },
  })

  const deleteHandler = ({ initiatorName, type }: TDeleteItem) => {
    if (!type || !initiatorName) {
      toast.error("Missing required information")
      return
    }

    deleteMutation.mutate({ type, id: initiatorName })
  }

  return { deleteHandler, isPending: deleteMutation.isPending }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
