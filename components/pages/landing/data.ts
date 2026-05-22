import {
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Gauge,
  Globe,
  Camera,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Repeat,
  Ruler,
  ShieldCheck,
  Users,
  Video,
  Zap,
} from "lucide-react"

export const navLinks = [
  { href: "#", label: "Home" },
  { href: "/lanes", label: "Lanes" },
  { href: "#memberships", label: "Memberships" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
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

export const lanes = [
  {
    name: "Lane 01 - The Opener",
    badge: "Batting Specialized",
    price: "$45",
    period: "/hr",
    image: "/images/landing/lane-opener.jpg",
    imageAlt:
      "Professional cricket batting lane with synthetic turf and bowling machine.",
    stats: [
      { label: "Machine Included", icon: Bot },
      { label: "LED Max", icon: Zap },
    ],
  },
  {
    name: "Lane 04 - Speed Star",
    badge: "Bowling Optimized",
    price: "$40",
    period: "/hr",
    image: "/images/landing/lane-speed.jpg",
    imageAlt:
      "Indoor bowling lane with marked crease and performance lighting.",
    stats: [
      { label: "Run-up Tracking", icon: Gauge },
      { label: "HD Replay", icon: Video },
    ],
  },
  {
    name: "Lane 07 - The Clubman",
    badge: "General Practice",
    price: "$35",
    period: "/hr",
    image: "/images/landing/lane-club.jpg",
    imageAlt: "Wide indoor cricket lane with full pitch and safety nets.",
    stats: [
      { label: "Up to 6 Players", icon: Users },
      { label: "22 Yards", icon: Ruler },
    ],
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

export const plans = [
  {
    name: "Casual",
    price: "$0",
    period: "/month",
    cta: "Get Started",
    featured: false,
    points: ["Standard lane rates", "Book 7 days ahead", "No lane discounts"],
  },
  {
    name: "Monthly Pro",
    price: "$49",
    period: "/month",
    cta: "Subscribe Now",
    featured: true,
    highlight: "Save 15% on all bookings",
    points: [
      "15% off all lanes",
      "Priority lane access",
      "Free coaching session (1/mo)",
      "Member-only events",
    ],
  },
  {
    name: "Annual Master",
    price: "$450",
    period: "/year",
    cta: "Get Started",
    featured: false,
    highlight: "Best value: 2 months free",
    points: [
      "25% off all lanes",
      "Unlimited guest passes",
      "Complimentary kit storage locker",
    ],
  },
]

export const footerLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "FAQ" },
  { href: "#", label: "Venue Hire" },
]

export const socials = [
  { href: "#", icon: Globe, label: "Website" },
  { href: "#", icon: Camera, label: "Instagram" },
]

export const contactInfo = [
  { icon: MapPin, text: "2/56 Barretta Road, Ravenhall VIC 3023" },
  { icon: Phone, text: "(03) 9000 1234" },
  { icon: Mail, text: "hello@ravenhallcricket.com.au" },
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
export const completeStepIcon = CheckCircle2
