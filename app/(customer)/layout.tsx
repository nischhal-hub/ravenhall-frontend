import { Chatbot } from "@/components/chatbot/chatbot"

// Shared by the landing pages and the customer panel, so the assistant (and
// the conversation) stays mounted while a customer moves between them.
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Chatbot />
    </>
  )
}
