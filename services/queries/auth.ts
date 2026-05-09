import { useQuery } from "@tanstack/react-query"

import { getMeRequest, type AuthUser } from "@/services/api/auth"
import { getAccessToken } from "@/services/auth/token-store"
import { queryKeys } from "@/services/queries/query-keys"

export function useMeQuery() {
  return useQuery<AuthUser>({
    queryKey: queryKeys.authMe,
    queryFn: getMeRequest,
    retry: false,
    staleTime: 60 * 1000,
    enabled: Boolean(getAccessToken()),
  })
}
