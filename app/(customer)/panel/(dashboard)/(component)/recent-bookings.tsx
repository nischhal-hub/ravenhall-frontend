import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentBookings({ bookings }: { bookings: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No upcoming bookings. Time to book a session!
          </p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{booking.bookingRef}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.items.map((i: any) => i.laneName).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <Badge>{booking.status}</Badge>
                  <p className="mt-1 font-semibold">${booking.finalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
