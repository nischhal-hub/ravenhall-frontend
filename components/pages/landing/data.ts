import {
  CalendarDays,
  Check,
  Clock3,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Repeat,
  ShieldCheck,
  Zap,
} from "lucide-react"

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/lanes", label: "Lanes" },
  { href: "/membership", label: "Memberships" },
  { href: "/about", label: "About" },
]

export const features = [
  {
    title: "Real-Time Availability",
    description:
      "View live lane status and book your slot in seconds without waiting on a callback.",
    icon: Zap,
  },
  {
    title: "Instant Confirmation",
    description:
      "Receive booking confirmation and access details immediately by email and SMS.",
    icon: ShieldCheck,
  },
  {
    title: "Flexible Rescheduling",
    description:
      "Need to move your session? Update bookings up to 24 hours ahead with one tap.",
    icon: Repeat,
  },
  {
    title: "Secure Checkout",
    description:
      "Encrypted payments with trusted card and wallet options for fast, safe bookings.",
    icon: LockKeyhole,
  },
]

export const bookingSteps = [
  {
    id: "01",
    title: "Choose Lane and Time",
    description:
      "Select your lane and timeslot from a live calendar built for quick decisions.",
  },
  {
    id: "02",
    title: "Create Account and Pay",
    description: "Finish sign-up and checkout in minutes with secure payments.",
  },
  {
    id: "03",
    title: "Receive Confirmation",
    description:
      "Get instant confirmation and be match-ready before you arrive.",
    complete: true,
  },
]

export const contactInfo = [
  {
    icon: MapPin,
    text: "2/56 Barretta Road, Ravenhall VIC 3023",
    href: "https://www.google.com/maps/search/?api=1&query=2%2F56+Barretta+Road%2C+Ravenhall+VIC+3023",
  },
  { icon: Phone, text: "(03) 9000 1234", href: "tel:+61390001234" },
  {
    icon: Mail,
    text: "hello@ravenhallcricket.com.au",
    href: "mailto:hello@ravenhallcricket.com.au",
  },
]

export const heroStatus = [
  {
    label: "Next Available",
    value: "14:30 PM",
    icon: Clock3,
  },
  {
    label: "Lanes Free",
    value: "4 / 8",
    icon: CalendarDays,
  },
]

export const planPointIcon = Check
