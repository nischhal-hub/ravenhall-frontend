"use client"

import { useState, useEffect } from "react"
import { Search, UserCheck, UserPlus, Users, X, Crown, Check, Loader2, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { usePosCustomersQuery } from "@/services/queries/pos.query"
import { useCreateWalkInCustomerMutation } from "@/services/mutations/pos.mutations"
import type { PosCustomer } from "@/types/pos-response.types"
import { cn } from "@/lib/utils"

export interface CustomerSelection {
  type: "EXISTING" | "WALKIN_FORM" | "GUEST"
  customer?: PosCustomer | null
  walkInData?: {
    firstName: string
    lastName: string
    phone?: string
    email?: string
  }
}

interface PosCustomerSelectorProps {
  value: CustomerSelection
  onChange: (selection: CustomerSelection) => void
}

export function PosCustomerSelector({ value, onChange }: PosCustomerSelectorProps) {
  const [activeTab, setActiveTab] = useState<"search" | "new" | "guest">(
    value.type === "GUEST" ? "guest" : value.type === "WALKIN_FORM" ? "new" : "search"
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Quick Walk-in form states
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 250)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Customer search query
  const { data: customerList, isLoading: isSearching } = usePosCustomersQuery({
    search: debouncedSearch,
    limit: 8,
    enabled: activeTab === "search" && debouncedSearch.trim().length > 0,
  })

  // Walk-in register mutation
  const { mutate: registerWalkIn, isPending: isRegistering } = useCreateWalkInCustomerMutation()

  const handleSelectCustomer = (customer: PosCustomer) => {
    onChange({
      type: "EXISTING",
      customer,
    })
    setSearchTerm("")
  }

  const handleClearSelection = () => {
    onChange({
      type: "GUEST",
      customer: null,
      walkInData: undefined,
    })
    setActiveTab("search")
    setSearchTerm("")
  }

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) return

    registerWalkIn(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      },
      {
        onSuccess: (newCust) => {
          onChange({
            type: "EXISTING",
            customer: newCust,
          })
          setFirstName("")
          setLastName("")
          setPhone("")
          setEmail("")
          setActiveTab("search")
        },
      }
    )
  }

  const handleSelectGuest = () => {
    setActiveTab("guest")
    onChange({
      type: "GUEST",
      customer: null,
    })
  }

  return (
    <div className="space-y-3">
      {/* Selected Customer Card */}
      {value.type === "EXISTING" && value.customer ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-xs uppercase">
              {value.customer.firstName[0]}
              {value.customer.lastName[0]}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  {value.customer.firstName} {value.customer.lastName}
                </span>
                {value.customer.membership?.isActive && (
                  <Badge variant="default" className="text-[10px] gap-1 py-0 px-1.5 bg-accent text-accent-foreground font-semibold">
                    <Crown className="size-3" />
                    {value.customer.membership.plan} ({value.customer.membership.discountPct}% OFF)
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {value.customer.phone && <span>{value.customer.phone}</span>}
                {value.customer.email && !value.customer.email.includes("@guest.") && (
                  <span>{value.customer.email}</span>
                )}
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="text-muted-foreground hover:text-destructive h-8 px-2"
          >
            <X className="size-4" />
            <span className="sr-only">Clear customer</span>
          </Button>
        </div>
      ) : value.type === "GUEST" ? (
        <div className="rounded-lg border border-border bg-muted/40 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Walk-in Guest</p>
              <p className="text-[11px] text-muted-foreground">Standard booking without customer account</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("search")}
            className="h-7 text-xs"
          >
            Attach Customer
          </Button>
        </div>
      ) : null}

      {/* Selector Tabs (shown when no customer is locked in or switching) */}
      {value.type !== "EXISTING" && (
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            const tab = val as "search" | "new" | "guest"
            setActiveTab(tab)
            if (tab === "guest") handleSelectGuest()
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 h-8 text-xs">
            <TabsTrigger value="search" className="gap-1.5 text-xs">
              <Search className="size-3" />
              Lookup
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-1.5 text-xs">
              <UserPlus className="size-3" />
              Quick Walk-in
            </TabsTrigger>
            <TabsTrigger value="guest" className="gap-1.5 text-xs">
              <Users className="size-3" />
              Guest
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: SEARCH CUSTOMER */}
          <TabsContent value="search" className="space-y-2 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-2.5 size-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Results dropdown list */}
            {debouncedSearch.trim().length > 0 && (
              <div className="rounded-lg border border-border bg-card shadow-sm max-h-56 overflow-y-auto divide-y divide-border">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    Searching registered members...
                  </div>
                ) : customerList && customerList.length > 0 ? (
                  customerList.map((cust) => {
                    const hasDiscount = cust.membership?.isActive && cust.membership.discountPct > 0
                    return (
                      <button
                        key={cust.id}
                        type="button"
                        onClick={() => handleSelectCustomer(cust)}
                        className="w-full text-left p-2.5 hover:bg-muted/50 transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-foreground truncate">
                              {cust.firstName} {cust.lastName}
                            </span>
                            {hasDiscount && (
                              <Badge variant="default" className="text-[9px] py-0 px-1 bg-accent text-accent-foreground font-semibold">
                                {cust.membership?.plan} - {cust.membership?.discountPct}% OFF
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {cust.phone || cust.email}
                          </div>
                        </div>
                        <Check className="size-4 text-muted-foreground/40 shrink-0" />
                      </button>
                    )
                  })
                ) : (
                  <div className="p-4 text-center space-y-2 text-xs text-muted-foreground">
                    <p>No customer found for &quot;{debouncedSearch}&quot;</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveTab("new")
                        setFirstName(debouncedSearch.split(" ")[0] || "")
                        setLastName(debouncedSearch.split(" ").slice(1).join(" ") || "")
                      }}
                      className="text-xs h-7 gap-1"
                    >
                      <UserPlus className="size-3" />
                      Register as New Customer
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: QUICK WALK-IN REGISTRATION */}
          <TabsContent value="new" className="space-y-2.5 pt-1">
            <form onSubmit={handleQuickRegister} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="pos-first-name" className="text-[11px]">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pos-first-name"
                    required
                    placeholder="e.g. Liam"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pos-last-name" className="text-[11px]">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pos-last-name"
                    required
                    placeholder="e.g. Smith"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="pos-phone" className="text-[11px]">Phone (optional)</Label>
                  <Input
                    id="pos-phone"
                    placeholder="04XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pos-email" className="text-[11px]">Email (optional)</Label>
                  <Input
                    id="pos-email"
                    type="email"
                    placeholder="customer@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={!firstName.trim() || !lastName.trim() || isRegistering}
                className="w-full h-8 text-xs gap-1.5"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    Registering Customer...
                  </>
                ) : (
                  <>
                    <UserCheck className="size-3" />
                    Register & Select Customer
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          {/* TAB 3: GUEST MODE */}
          <TabsContent value="guest" className="pt-2">
            <div className="rounded-lg border border-dashed border-border p-3 text-center space-y-1">
              <p className="text-xs font-medium text-foreground">Guest Mode Active</p>
              <p className="text-[11px] text-muted-foreground">
                Session will be recorded as a Walk-in Guest. Receipt will still be generated and printed.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
