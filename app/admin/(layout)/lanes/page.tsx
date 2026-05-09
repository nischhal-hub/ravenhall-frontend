// app/lanes/page.tsx
import { Metadata } from "next"
import LaneTable from "./table"

export const metadata: Metadata = {
  title: "Lanes | Dashboard",
  description: "Manage your lanes",
}

export default function LanesPage() {
  return <LaneTable />
}
