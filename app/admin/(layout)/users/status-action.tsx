"use client"

import { useState } from "react"
import { UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUpdateUserStatusMutation } from "@/services/mutations/user.mutations"
import type { User } from "@/types/user-response.types"

export function UserStatusAction({ user }: { user: User }) {
  const [reason, setReason] = useState("")
  const statusMutation = useUpdateUserStatusMutation()
  const isInactive = user.status === "INACTIVE"
  const name = `${user.firstName} ${user.lastName}`

  const handleConfirm = () => {
    statusMutation.mutate(
      {
        id: user.id,
        status: isInactive ? "ACTIVE" : "INACTIVE",
        reason: isInactive ? undefined : reason.trim() || undefined,
      },
      { onSuccess: () => setReason("") }
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={statusMutation.isPending}
          className={
            isInactive
              ? undefined
              : "border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          }
        >
          {isInactive ? <UserCheck /> : <UserX />}
          {isInactive ? "Reactivate" : "Deactivate"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isInactive ? "Reactivate this account?" : "Deactivate this account?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isInactive ? (
              <>
                <strong>{name}</strong> will be able to log in and book again.
                Bookings cancelled at deactivation stay cancelled.
              </>
            ) : (
              <>
                <strong>{name}</strong> will be logged out and can&apos;t log
                in. Their upcoming bookings will be cancelled, online payments
                refunded, and they&apos;ll be emailed. You can reactivate the
                account later.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!isInactive && (
          <div className="space-y-1.5">
            <label
              htmlFor={`deactivate-reason-${user.id}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Reason (optional, shared with the customer on cancelled bookings)
            </label>
            <Textarea
              id={`deactivate-reason-${user.id}`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder="e.g. Account closed at the customer's request"
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Keep as is</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={statusMutation.isPending}
            className={isInactive ? undefined : "bg-destructive hover:bg-destructive/90"}
          >
            {statusMutation.isPending
              ? "Saving…"
              : isInactive
                ? "Yes, reactivate"
                : "Yes, deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
