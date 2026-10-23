"use client"

import { useParams } from "next/navigation"
import { useBookingById } from "@/services/queries/bookings.query"
import { BookingDetailPage, type Booking } from "@/components/booking/detail"
import {
  DetailError,
  DetailNotFound,
  DetailSkeleton,
  isNotFoundError,
} from "@/components/detail"

export default function BookingDetailRoute() {
  const params = useParams()
  const id = params?.id as string

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useBookingById(id)

  if (isLoading) return <DetailSkeleton />

  if (isNotFoundError(error) || (!isError && !data?.data)) {
    return (
      <DetailNotFound
        title="Booking not found"
        description="This booking doesn't exist or may have been deleted. Check the link, or find it in your bookings list."
        backHref="/panel/bookings"
        backLabel="Bookings"
      />
    )
  }

  if (isError || !data) {
    return (
      <DetailError
        title="We couldn't load this booking"
        error={error}
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        backHref="/panel/bookings"
        backLabel="Bookings"
      />
    )
  }

  return (
    <BookingDetailPage
      booking={data.data as unknown as Booking}
      isAdmin={false}
    />
  )
}
