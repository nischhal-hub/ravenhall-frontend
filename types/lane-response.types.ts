export interface Lane {
  id: string
  name: string
  type: "BATTING" | "BOWLING" | "GENERAL"
  description: string | null
  capacity: number
  hourlyRate: number
  imageUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LaneApiResponse {
  status: string
  message: string
  data: Lane[]
}
