# Ravenhall Indoor Cricket Centre — Frontend

React.js + TypeScript + Vite + Tailwind CSS + shadcn/ui

---

## Module Progress Tracker

> Legend: ⬜ Not started · 🟡 In progress · ✅ Complete · 🔴 Blocked

---

## 🌐 Shared / Common

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Layout | `Navbar.tsx` | ✅ | Logo, nav links, login/register or user menu |
| Layout | `Footer.tsx` | ✅ | Address, links, social icons, copyright |
| Layout | `Sidebar.tsx` | ✅ | Admin sidebar, collapsible on mobile |
| Layout | `MobileMenu.tsx` | ✅ | Hamburger menu for mobile navbar |
| UI | `StatusBadge.tsx` | ⬜ | Confirmed / Cancelled / Pending / Completed |
| UI | `LaneTypeBadge.tsx` | ⬜ | BATTING / BOWLING / GENERAL colour chips |
| UI | `LoadingSkeleton.tsx` | ⬜ | Skeleton loaders for cards, tables, calendar |
| UI | `EmptyState.tsx` | ⬜ | Illustrated empty state for no bookings etc |
| UI | `Pagination.tsx` | ⬜ | Page controls for tables and lists |
| UI | `Modal.tsx` | ✅ | Reusable modal with overlay and close button |
| UI | `ConfirmDialog.tsx` | ⬜ | Cancel / delete confirmation modal |
| UI | `ErrorBoundary.tsx` | ⬜ | Catches and displays component errors |
| UI | `PageHeader.tsx` | ⬜ | Page title + breadcrumb bar |
| Route | `ProtectedRoute.tsx` | ⬜ | Redirects unauthenticated users to /login |
| Route | `AdminRoute.tsx` | ⬜ | Restricts to ADMIN or STAFF role |
| Route | `router/index.tsx` | ⬜ | All route definitions wired |
| State | `auth.store.ts` | ⬜ | Zustand — user, accessToken, isAuthenticated, role |
| State | `booking.store.ts` | ⬜ | Zustand — selectedLane, selectedSlot, bookingCart |
| API | `axios.instance.ts` | ⬜ | Base URL, JWT interceptor, auto-refresh on 401 |
| API | `auth.api.ts` | ⬜ | login, register, logout, refreshToken, getMe |
| API | `lanes.api.ts` | ⬜ | getLanes, getLaneById, getSlotsForLane |
| API | `bookings.api.ts` | ⬜ | createBooking, getMyBookings, cancelBooking |
| API | `payments.api.ts` | ⬜ | createPaymentIntent |
| API | `memberships.api.ts` | ⬜ | getMemberships, getMyMembership, subscribe |
| API | `discounts.api.ts` | ⬜ | validateDiscountCode |
| API | `admin/bookings.api.ts` | ⬜ | getAllBookings, updateBookingStatus |
| API | `admin/lanes.api.ts` | ⬜ | createLane, updateLane, deleteLane, blockSlots |
| API | `admin/reports.api.ts` | ⬜ | getRevenueReport |
| API | `admin/users.api.ts` | ⬜ | getAllUsers, updateUserRole |
| API | `admin/discounts.api.ts` | ⬜ | createCode, getAllCodes, updateCode |
| Hooks | `useAuth.ts` | ⬜ | Auth state and actions |
| Hooks | `useLanes.ts` | ⬜ | React Query hooks for lane data |
| Hooks | `useBookings.ts` | ⬜ | React Query hooks for booking data |
| Hooks | `useSlots.ts` | ⬜ | Slot availability with 30s polling |
| Hooks | `useAdmin.ts` | ⬜ | Admin data hooks |
| Hooks | `useDebounce.ts` | ⬜ | Debounce for search inputs |
| Types | `auth.types.ts` | ⬜ | User, Role, AuthResponse |
| Types | `lane.types.ts` | ⬜ | Lane, LaneType, TimeSlot |
| Types | `booking.types.ts` | ⬜ | Booking, BookingItem, BookingStatus |
| Types | `payment.types.ts` | ⬜ | Payment, PaymentStatus |
| Types | `admin.types.ts` | ⬜ | RevenueReport, AdminFilters |
| Utils | `formatDate.ts` | ⬜ | Date formatting helpers |
| Utils | `formatCurrency.ts` | ⬜ | AUD currency formatting |
| Utils | `calculatePrice.ts` | ⬜ | hourlyRate × duration × multiplier |
| Utils | `slotHelpers.ts` | ⬜ | Slot colour logic, grouping by date |
| Utils | `lib/utils.ts` | ⬜ | cn() Tailwind class merge helper |

---

## 🔐 Authentication

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `LoginPage.tsx` | 🟡 | Email + password, remember me, forgot password link |
| Page | `RegisterPage.tsx` |  🟡 | First name, last name, email, phone, password |
| Page | `ForgotPasswordPage.tsx` |  🟡 | Email input, send reset link |
| Page | `ResetPasswordPage.tsx` |  🟡 | New password + confirm, token from URL |
| Page | `VerifyEmailPage.tsx` |  🟡 | Token from URL, success/error state |

---

## 🏠 Public Pages (Customer-Facing)

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `HomePage.tsx` | ✅ | Hero, features, lane preview grid, how it works, membership plans, CTA |
| Page | `LanesPage.tsx` | 🟡 | Lane grid with filter by type (All/Batting/Bowling/General) |
| Page | `LaneDetailPage.tsx` | ⬜ | Lane info, gallery, pricing, book now CTA |
| Page | `AboutPage.tsx` |  🟡 | Facility info, location, contact |
| Component | `LaneCard.tsx` | ⬜ | Photo, name, type badge, capacity, hourly rate, next available chip, CTA |
| Component | `HeroSection.tsx` | ✅ | Full-width background, headline, two CTAs |
| Component | `HowItWorksSection.tsx` | ⬜ | 3-step horizontal stepper |
| Component | `MembershipPlansSection.tsx` | ✅ | 3 pricing cards: Casual, Monthly, Annual |
| Component | `FeaturesSection.tsx` | ⬜ | 4 feature cards with icons |

---

## 📅 Booking Flow (Customer)

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `SelectSlotPage.tsx` | ⬜ | Step 1 — date picker + availability calendar + booking summary |
| Page | `ReviewPage.tsx` | ⬜ | Step 2 — order summary, discount code input, membership discount |
| Page | `PaymentPage.tsx` | ⬜ | Step 3 — Stripe CardElement, pay button, security badges |
| Page | `ConfirmationPage.tsx` | ⬜ | Success banner, booking reference, QR placeholder, action buttons |
| Component | `BookingSteps.tsx` | ⬜ | 3-step progress indicator (Select → Review → Payment) |
| Component | `AvailabilityCalendar.tsx` | ⬜ | Date selector + time slot grid, colour coded, 30s polling |
| Component | `DurationSelector.tsx` | ⬜ | 1hr / 2hr / 3hr toggle buttons |
| Component | `BookingSummaryCard.tsx` | ⬜ | Sticky side card — lane, date, time, price breakdown |
| Component | `DiscountCodeInput.tsx` | ⬜ | Code field + Apply button, success/error feedback |
| Component | `PriceBreakdown.tsx` | ⬜ | Base price, discount, membership discount, final total |
| Component | `PaymentForm.tsx` | ⬜ | Stripe CardElement wrapper, error handling |
| Component | `SecurityBadges.tsx` | ⬜ | SSL, Stripe, PCI-DSS icons |

---

## 👤 Customer Dashboard

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `MyBookingsPage.tsx` | ⬜ | Upcoming / Past tabs, booking cards list |
| Page | `MembershipPage.tsx` | ⬜ | Current plan card, upgrade options |
| Page | `ProfilePage.tsx` | ⬜ | Edit name, phone, password change section |
| Component | `BookingCard.tsx` | ⬜ | Lane, date, time, amount, status badge, cancel button |
| Component | `MembershipCard.tsx` | ⬜ | Plan name, discount %, expiry, Active badge |
| Component | `UpgradePlanCard.tsx` | ⬜ | Plan comparison, subscribe CTA |
| Component | `CancelBookingButton.tsx` | ⬜ | Shows only on upcoming, triggers confirm dialog |

---

## 🛠️ Admin — Dashboard Overview

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `AdminDashboardPage.tsx` | ⬜ | KPI cards, revenue chart, recent bookings, lane utilisation |
| Component | `KpiCard.tsx` | ⬜ | Today's bookings, revenue, members, utilisation % |
| Component | `RevenueChart.tsx` | ⬜ | Line chart — revenue over last 30 days (Recharts) |
| Component | `RecentBookingsTable.tsx` | ⬜ | Last 10 bookings mini table |
| Component | `LaneUtilisationChart.tsx` | ⬜ | Donut chart — % used per lane today |

---

## 🛠️ Admin — Bookings Management

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `AdminBookingsPage.tsx` | ⬜ | Search + filters + paginated bookings table |
| Component | `BookingsTable.tsx` | ⬜ | Columns: Ref, Customer, Lane, Date/Time, Amount, Status, Actions |
| Component | `BookingFilters.tsx` | ⬜ | Status filter, lane filter, date range picker, search bar |
| Component | `BookingDetailModal.tsx` | ⬜ | Full booking details in modal |
| Component | `UpdateStatusButton.tsx` | ⬜ | Dropdown to change booking status (Admin/Staff) |

---

## 🛠️ Admin — Lane Management

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `LaneManagementPage.tsx` | ⬜ | Grid of lane cards with edit + active toggle |
| Component | `AdminLaneCard.tsx` | ⬜ | Photo, name, type, status toggle, hourly rate, Edit button |
| Component | `LaneFormModal.tsx` | ⬜ | Create / Edit lane form — name, type, capacity, rate, photo, active |

---

## 🛠️ Admin — Slot Management

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `SlotManagementPage.tsx` | ⬜ | Select lane + date, view slots grid, block/unblock slots |
| Component | `SlotGrid.tsx` | ⬜ | All slots for selected lane + date with block toggle |
| Component | `BlockSlotsForm.tsx` | ⬜ | Select lane, date range, time range — block for maintenance |

---

## 🛠️ Admin — Reports

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `ReportsPage.tsx` | ⬜ | Revenue report with date range filter, group by day/week/month |
| Component | `RevenueReportChart.tsx` | ⬜ | Bar or line chart of revenue over selected period |
| Component | `ReportFilters.tsx` | ⬜ | Date from, date to, group by selector, export CSV button |
| Component | `RevenueSummaryCards.tsx` | ⬜ | Total revenue, total bookings, average booking value |

---

## 🛠️ Admin — User Management

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `UsersPage.tsx` | ⬜ | Searchable user table with role management (Admin only) |
| Component | `UsersTable.tsx` | ⬜ | Columns: Name, Email, Role, Bookings count, Joined, Actions |
| Component | `UpdateRoleModal.tsx` | ⬜ | Dropdown to change user role |

---

## 🛠️ Admin — Discount Codes

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `DiscountCodesPage.tsx` | ⬜ | Table of all codes + create new |
| Component | `DiscountCodesTable.tsx` | ⬜ | Code, %, uses/max, valid dates, active toggle |
| Component | `DiscountCodeFormModal.tsx` | ⬜ | Create / edit discount code form |

---

## 🛠️ Admin — Membership Management

| Module | Component / File | Status | Notes |
|--------|-----------------|--------|-------|
| Page | `MembershipsAdminPage.tsx` | ⬜ | All active memberships table (Admin/Staff) |
| Component | `MembershipsTable.tsx` | ⬜ | User, plan, discount %, start, end, status |

---

## 📊 Progress Summary

| Area | Total Modules | ✅ Done | 🟡 In Progress | ⬜ Not Started |
|------|--------------|---------|---------------|---------------|
| Shared / Common | 47 | 0 | 0 | 47 |
| Authentication | 5 | 0 | 0 | 5 |
| Public Pages | 9 | 0 | 0 | 9 |
| Booking Flow | 12 | 0 | 0 | 12 |
| Customer Dashboard | 7 | 0 | 0 | 7 |
| Admin — Overview | 5 | 0 | 0 | 5 |
| Admin — Bookings | 5 | 0 | 0 | 5 |
| Admin — Lanes | 3 | 0 | 0 | 3 |
| Admin — Slots | 3 | 0 | 0 | 3 |
| Admin — Reports | 4 | 0 | 0 | 4 |
| Admin — Users | 3 | 0 | 0 | 3 |
| Admin — Discounts | 3 | 0 | 0 | 3 |
| Admin — Memberships | 2 | 0 | 0 | 2 |
| **TOTAL** | **108** | **0** | **0** | **108** |

---

## How to Update This Tracker

Change the status emoji as you build each module:

- ⬜ → 🟡 when you start working on it
- 🟡 → ✅ when it is complete and working
- 🟡 → 🔴 if blocked by something (add a note in the Notes column)

Update the Progress Summary table counts manually after each session.
