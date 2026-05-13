// types/slot.ts

export interface TimeSlot {
  id: string
  date: string // ISO date string (YYYY-MM-DD)
  startTime: string // e.g. "09:00"
  endTime: string // e.g. "10:00"
  isAvailable: boolean
  isBlocked: boolean
  laneId: string

  // Included relations
  lane?: {
    id: string
    name: string
    type: string
    capacity?: number
  }

  createdAt?: string
  updatedAt?: string
}

export interface SlotFilter {
  date?: string
  laneId?: string
  isBlocked?: boolean
  isAvailable?: boolean
}

// Query Response
export interface GetSlotsResponse {
  success: boolean
  message: string
  data: TimeSlot[]
}

// For blocking/unblocking
export interface BlockSlotsPayload {
  slotIds: string[]
}

// Optional: For better frontend state management
export interface SlotWithSelection extends TimeSlot {
  isSelected?: boolean
}
