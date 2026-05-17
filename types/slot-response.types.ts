// types/slot.ts

export interface Slot {
  id: string

  // ISO string from backend
  date: string

  startTime: string
  endTime: string

  isAvailable: boolean
  isBlocked: boolean

  laneId: string

  lane?: {
    id: string
    name: string
    type: string
    capacity?: number
  }

  createdAt?: string
  updatedAt?: string
}

// ✅ FIXED FILTER TYPE
export interface SlotFilter {
  date?: string
  laneId?: string
  isBlocked?: boolean
  isAvailable?: boolean

  // ✅ ADD THESE (IMPORTANT)
  page?: number
  limit?: number
  search?: string
}

// ✅ RESPONSE TYPE (SAFE)
export type GetSlotsResponse = {
  data: Slot[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// ✅ BULK ACTION PAYLOAD
export interface BlockSlotsPayload {
  slotIds: string[]
}

// ✅ OPTIONAL UI STATE TYPE
export interface SlotWithSelection extends Slot {
  isSelected?: boolean
}
