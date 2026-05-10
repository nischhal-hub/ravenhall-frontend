import { useMutation } from "@tanstack/react-query"
import { apiClient } from "../api/client"

import { CreateDiscountCodePayload } from "@/schemas/discount"
import { DiscountApiResponse } from "@/types/discount-response.types"

function formatCode(code?: string) {
  return code?.toUpperCase()
}

function toDate(value?: string) {
  return value ? new Date(value) : undefined
}

export async function createDiscountCodeRequest(
  data: CreateDiscountCodePayload
) {
  const response = await apiClient.post<DiscountApiResponse>(
    "/admin/discounts",
    {
      ...data,
      code: formatCode(data.code),
      validFrom: new Date(data.validFrom),
      validTo: new Date(data.validTo),
    }
  )

  return response.data
}

export type UpdateDiscountCodePayload = {
  id: string
  code?: string
  description?: string
  discountPct?: number
  maxUses?: number
  validFrom?: string
  validTo?: string
}

export type UpdateDiscountCodeResponse = DiscountApiResponse

export async function updateDiscountCodeRequest({
  id,
  ...data
}: UpdateDiscountCodePayload) {
  const response = await apiClient.patch<UpdateDiscountCodeResponse>(
    `/admin/discounts/${id}`,
    {
      ...data,
      code: formatCode(data.code),
      validFrom: toDate(data.validFrom),
      validTo: toDate(data.validTo),
    }
  )

  return response.data
}

function useCreateMutation<TData, TVariables>(
  key: string[],
  fn: (vars: TVariables) => Promise<TData>
) {
  return useMutation<TData, Error, TVariables>({
    mutationKey: key,
    mutationFn: fn,
  })
}

export function useCreateDiscountCodeMutation() {
  return useCreateMutation<DiscountApiResponse, CreateDiscountCodePayload>(
    ["discount", "create"],
    createDiscountCodeRequest
  )
}

export function useUpdateDiscountCodeMutation() {
  return useCreateMutation<UpdateDiscountCodeResponse, UpdateDiscountCodePayload>(
    ["discount", "update"],
    updateDiscountCodeRequest
  )
}
