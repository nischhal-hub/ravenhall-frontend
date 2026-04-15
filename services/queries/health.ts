import { useApiGetQuery } from "@/services/api/client"
import { queryKeys } from "@/services/queries/query-keys"

export type HealthResponse = {
  status: string
}

export function useHealthQuery() {
  return useApiGetQuery<HealthResponse>({
    queryKey: queryKeys.health,
    url: "/health",
  })
}
