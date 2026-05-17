import { Card, CardContent } from "@/components/ui/card"

export function UserStatsCards({ stats }: { stats: any }) {
  const cards = [
    { label: "Total Bookings", value: stats.totalBookings },
    { label: "Total Spent", value: `$${stats.totalSpent.toLocaleString()}` },
    { label: "Upcoming", value: stats.upcomingBookings },
    { label: "Cancelled", value: stats.cancelledBookings },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
