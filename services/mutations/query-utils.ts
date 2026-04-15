import { useQueryClient } from "@tanstack/react-query"

export function useInvalidateQuery() {
	const queryClient = useQueryClient()

	return async (queryKey: readonly unknown[]) => {
		await queryClient.invalidateQueries({ queryKey })
	}
}
