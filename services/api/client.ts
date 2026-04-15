import axios, { AxiosError } from "axios"
import {
  type MutationKey,
  type UseMutationOptions,
  type UseQueryOptions,
  type UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { ApiError, type ApiErrorResponse } from "@/services/api/types"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api"

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status
    const message =
      error.response?.data?.message ?? error.message ?? "Request failed"

    return Promise.reject(new ApiError(message, status, error.response?.data))
  }
)

type ApiGetQueryArgs<TData, TParams extends object | undefined = undefined> = {
  queryKey: readonly unknown[]
  url: string
  params?: TParams
  enabled?: boolean
  options?: Omit<
    UseQueryOptions<TData, ApiError, TData, readonly unknown[]>,
    "queryKey" | "queryFn" | "enabled"
  >
}

export function useApiGetQuery<
  TData,
  TParams extends object | undefined = undefined,
>({
  queryKey,
  url,
  params,
  enabled = true,
  options,
}: ApiGetQueryArgs<TData, TParams>): UseQueryResult<TData, ApiError> {
  return useQuery({
    queryKey,
    enabled,
    queryFn: async () => {
      const response = await apiClient.get<TData>(url, { params })
      return response.data
    },
    ...options,
  })
}

type ApiMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, ApiError, TVariables>,
  "mutationFn"
> & {
  mutationKey?: MutationKey
}

export function useApiPostMutation<TData, TBody = unknown>(
  url: string,
  options?: ApiMutationOptions<TData, TBody>
) {
  return useMutation<TData, ApiError, TBody>({
    mutationKey: options?.mutationKey,
    mutationFn: async (body) => {
      const response = await apiClient.post<TData>(url, body)
      return response.data
    },
    ...options,
  })
}

export function useApiPutMutation<TData, TBody = unknown>(
  url: string,
  options?: ApiMutationOptions<TData, TBody>
) {
  return useMutation<TData, ApiError, TBody>({
    mutationKey: options?.mutationKey,
    mutationFn: async (body) => {
      const response = await apiClient.put<TData>(url, body)
      return response.data
    },
    ...options,
  })
}

export function useApiPatchMutation<TData, TBody = unknown>(
  url: string,
  options?: ApiMutationOptions<TData, TBody>
) {
  return useMutation<TData, ApiError, TBody>({
    mutationKey: options?.mutationKey,
    mutationFn: async (body) => {
      const response = await apiClient.patch<TData>(url, body)
      return response.data
    },
    ...options,
  })
}

export function useApiDeleteMutation<TData, TVariables = void>(
  url: string,
  options?: ApiMutationOptions<TData, TVariables>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationKey: options?.mutationKey,
    mutationFn: async () => {
      const response = await apiClient.delete<TData>(url)
      return response.data
    },
    ...options,
  })
}
