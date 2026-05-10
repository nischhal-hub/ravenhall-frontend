import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "../api/client"
import { useModalContext } from "@/components/context/modal-context"

export type TDeleteItem = {
  initiatorName: string // usually id
  type: "user" | "product" | "category" | "courses" // extendable
}

export const useDeleteItem = () => {
  const queryClient = useQueryClient()
  const { closeModal } = useModalContext()

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      return await apiClient.delete(`${type}/${id}`)
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.type] })
      closeModal("DELETE_ITEM")
      toast.success(`${capitalize(variables.type)} deleted successfully`)
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Deletion failed`)
    },
  })

  const deleteHandler = ({ initiatorName, type }: TDeleteItem) => {
    if (!type || !initiatorName) return
    deleteMutation.mutate({ type, id: initiatorName })
  }

  return deleteHandler
}

// Utility to capitalize first letterp
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
