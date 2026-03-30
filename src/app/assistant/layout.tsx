import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Assistant",
}

export default function AssistantLayout({ children }: { children: React.ReactNode }) {
  return children
}
