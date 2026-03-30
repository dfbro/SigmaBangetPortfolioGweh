import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CTF",
}

export default function CtfLayout({ children }: { children: React.ReactNode }) {
  return children
}
