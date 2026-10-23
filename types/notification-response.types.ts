export interface AppNotification {
  id: string
  userId: string
  type: "IN_APP"
  subject: string
  body: string
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export interface MyNotificationsResponse {
  status: string
  message: string
  data: {
    notifications: AppNotification[]
    unreadCount: number
  }
}
