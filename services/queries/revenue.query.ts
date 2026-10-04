import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import type {
  ReportGroupByInterval,
  RevenueReportApiResponse,
  RevenueReportQueryParams,
  RevenueSummaryApiResponse,
  RevenueTrendsApiResponse,
  RevenueTrendsQueryParams,
} from "@/types/revenue-response.types"

/**
 * Fetch comprehensive financial report (revenue, expenses, net profit, breakdown, timeline, transactions)
 */
export const useRevenueReport = (params: RevenueReportQueryParams = {}) => {
  const { groupBy = "month", from, to } = params

  return useQuery<RevenueReportApiResponse, Error>({
    queryKey: ["revenue-report", groupBy, from, to],
    queryFn: async () => {
      const queryParams: Record<string, string> = { groupBy }
      if (from) queryParams.from = from
      if (to) queryParams.to = to

      const res = await apiClient.get<RevenueReportApiResponse>("/reports", {
        params: queryParams,
      })
      return res.data
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
    retry: 2,
  })
}

/**
 * Fetch executive financial KPI summary
 */
export const useRevenueSummary = (params: { from?: string; to?: string } = {}) => {
  const { from, to } = params

  return useQuery<RevenueSummaryApiResponse, Error>({
    queryKey: ["revenue-summary", from, to],
    queryFn: async () => {
      const queryParams: Record<string, string> = {}
      if (from) queryParams.from = from
      if (to) queryParams.to = to

      const res = await apiClient.get<RevenueSummaryApiResponse>("/reports/summary", {
        params: queryParams,
      })
      return res.data
    },
    staleTime: 1000 * 60 * 3,
  })
}

/**
 * Fetch financial time-series trends with growth rates
 */
export const useRevenueTrends = (params: RevenueTrendsQueryParams = {}) => {
  const { interval = "month", from, to } = params

  return useQuery<RevenueTrendsApiResponse, Error>({
    queryKey: ["revenue-trends", interval, from, to],
    queryFn: async () => {
      const queryParams: Record<string, string> = { interval }
      if (from) queryParams.from = from
      if (to) queryParams.to = to

      const res = await apiClient.get<RevenueTrendsApiResponse>("/reports/trends", {
        params: queryParams,
      })
      return res.data
    },
    staleTime: 1000 * 60 * 5,
  })
}
