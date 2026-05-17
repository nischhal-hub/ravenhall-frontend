"use client"

import { useState } from "react"
import { useProfilesQuery } from "@/services/queries/user.query"
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/services/mutations/user.mutations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const { data, isLoading } = useProfilesQuery()
  const updateProfileMutation = useUpdateProfileMutation()
  const changePasswordMutation = useChangePasswordMutation()

  const profile = data?.data
  console.log("Fetched profile data:", data)

  const [profileForm, setProfileForm] = useState({
    firstName: undefined as string | undefined,
    lastName: undefined as string | undefined,
    phone: undefined as string | undefined,
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phone: profileForm.phone || undefined,
      image: selectedImage,
    })
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    changePasswordMutation.mutate({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-28 w-28">
                <AvatarImage src={imagePreview ||  ""} />
                <AvatarFallback className="text-3xl">
                  {profile?.firstName?.charAt(0)}
                  {profile?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <label>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button type="button" variant="outline" size="sm">
                  Upload New Picture
                </Button>
              </label>
            </div>

            {/* Email with Verification Badge */}
            <div className="flex items-center gap-2">
              <Label className="text-base">Email Address</Label>
              {profile?.isEmailVerified && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-blue-100 text-blue-700"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Verified
                </Badge>
              )}
            </div>
            <Input value={profile?.email} disabled />

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={profileForm.firstName ?? profile?.firstName ?? ""}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={profileForm.lastName ?? profile?.lastName ?? ""}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  value={profileForm.phone ?? profile?.phone ?? ""}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  placeholder="+977 98XXXXXXXX"
                />
              </div>

              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full"
              >
                {updateProfileMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Profile Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Membership Card */}
        {profile?.membership && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Membership Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-lg font-semibold capitalize">
                    {profile.membership.plan.toLowerCase()} Plan
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.membership.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <Badge
                  variant={
                    profile.membership.isActive ? "default" : "secondary"
                  }
                >
                  {profile.membership.isActive ? "Active" : "Expired"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      oldPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>

              <Button
                type="submit"
                variant="destructive"
                disabled={changePasswordMutation.isPending}
                className="w-full"
              >
                {changePasswordMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
