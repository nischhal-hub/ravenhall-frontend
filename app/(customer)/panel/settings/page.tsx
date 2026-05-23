"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProfilesQuery } from "@/services/queries/user.query"
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
  UpdateProfilePayload,
} from "@/services/mutations/user.mutations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Loader2,
  User,
  Lock,
  Shield,
  Camera,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

function formatDate(iso?: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getInitials(first?: string, last?: string) {
  return `${first?.charAt(0) ?? ""}${last?.charAt(0) ?? ""}`.toUpperCase()
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <Icon className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const { data, isLoading } = useProfilesQuery()

  const updateProfileMutation = useUpdateProfileMutation()
  const changePasswordMutation = useChangePasswordMutation()

  const profile = data?.data ?? data

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: UpdateProfilePayload = {}

    if (profileForm.firstName && profileForm.firstName !== profile?.firstName)
      payload.firstName = profileForm.firstName
    if (profileForm.lastName && profileForm.lastName !== profile?.lastName)
      payload.lastName = profileForm.lastName
    if (profileForm.phone && profileForm.phone !== profile?.phone)
      payload.phone = profileForm.phone

    if (Object.keys(payload).length === 0) {
      toast.info("No changes detected.")
      return
    }

    updateProfileMutation.mutate(payload)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.")
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    changePasswordMutation.mutate({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const initials = getInitials(profile?.firstName, profile?.lastName)
  const membership =
    profile && "membership" in profile ? profile.membership : undefined

  return (
    <div className="min-h-screen max-w-7xl bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold tracking-widest text-primary-foreground/70 uppercase">
            ACCOUNT
          </p>
          <h1 className="text-4xl font-black tracking-tight text-primary-foreground">
            Settings
          </h1>
          <p className="mt-1 text-primary-foreground/60">
            Manage your profile and security settings
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl space-y-6 px-4 pt-8 sm:px-8">
        {/* Profile Section */}
        <Section
          icon={User}
          title="Profile Information"
          subtitle="Update your personal details"
        >
          <div className="mb-8 flex items-center gap-5">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-primary text-4xl font-black text-primary-foreground">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials || "👤"
                )}
              </div>
              <label className="absolute -right-2 -bottom-2 cursor-pointer rounded-full border-2 border-card bg-primary p-2 shadow-lg transition hover:bg-primary/90">
                <Camera className="h-4 w-4 text-primary-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div>
              <p className="text-xl font-bold">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-muted-foreground">{profile?.email}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>First Name</Label>
                <Input
                  value={profileForm.firstName || profile?.firstName || ""}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Last Name</Label>
                <Input
                  value={profileForm.lastName || profile?.lastName || ""}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <Input
                value={profileForm.phone || profile?.phone || ""}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+61 400 000 000"
                className="rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Profile Changes"
              )}
            </Button>
          </form>
        </Section>

        {/* Membership Section */}
        {membership && (
          <Section
            icon={Shield}
            title="Membership Plan"
            subtitle="Current subscription status"
          >
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-5">
              <div>
                <p className="text-lg font-bold capitalize">
                  {membership.plan.toLowerCase()} Plan
                </p>
                <p className="text-sm text-muted-foreground">
                  {membership.isActive ? "Active until" : "Expired on"}{" "}
                  {formatDate(membership.endDate)}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/membership")}
                className="rounded-xl"
              >
                Manage Plan <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Section>
        )}

        {/* Change Password Section */}
        <Section
          icon={Lock}
          title="Change Password"
          subtitle="Update your password regularly"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Current Password</Label>
              <PasswordInput
                value={passwordForm.oldPassword}
                onChange={(v) =>
                  setPasswordForm((prev) => ({ ...prev, oldPassword: v }))
                }
                placeholder="Enter current password"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <PasswordInput
                  value={passwordForm.newPassword}
                  onChange={(v) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: v }))
                  }
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <PasswordInput
                  value={passwordForm.confirmPassword}
                  onChange={(v) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: v }))
                  }
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="h-12 w-full rounded-xl bg-destructive text-base font-semibold hover:bg-destructive/90"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </Section>
      </div>
    </div>
  )
}
