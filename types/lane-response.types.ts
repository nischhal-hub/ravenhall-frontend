import { PaginationMeta } from "@/services/queries/meta"

export interface Lane {
  nextSlot: import("react/jsx-runtime").JSX.Element
  image: string | StaticImport
  imageAlt: string
  badge: string
  price: string
  period: string
  stats: boolean
  id: string
  name: string
  type: "BATTING" | "BOWLING" | "GENERAL"
  description: string | null
  capacity: number
  hourlyRate: number
  imageUrl: string | null
  slots: Slot[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LaneApiResponse {
  status: string
  message: string
  data: {
    lanes: Lane[]
    meta: PaginationMeta
  }
}

// types/lane-by-id.types.ts

export interface Slot {
  id: string
  laneId: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  isBlocked: boolean
  createdAt: string
}

export interface LaneByIdResponse {
  status: string
  message: string
  data: Lane
}
