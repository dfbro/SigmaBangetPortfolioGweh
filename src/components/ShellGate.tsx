"use client"

import * as React from "react"
import { ShellIntro } from "./ShellIntro"
import { motion, AnimatePresence } from "motion/react"
import type { AchievementRecord, ProfileSettingsRecord, ProjectRecord } from "@/lib/portfolio-types"

type IdleCallbackHandle = number
type IdleCallback = (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void

const WARMUP_ENDPOINTS = [
  "/api/public/profile",
  "/api/public/summary",
  "/api/public/projects",
  "/api/public/achievements",
  "/api/public/writeups",
] as const

async function fetchJsonWarm<T>(url: string, signal: AbortSignal): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
      cache: "force-cache",
      signal,
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

async function warmImage(url: string, signal: AbortSignal): Promise<void> {
  try {
    await fetch(url, {
      method: "GET",
      credentials: "same-origin",
      cache: "force-cache",
      signal,
    })
  } catch {
    // Best-effort warmup only.
  }
}

function collectImageCandidates(input: {
  profile: ProfileSettingsRecord | null
  projects: ProjectRecord[] | null
  achievements: AchievementRecord[] | null
}): string[] {
  const urls = new Set<string>()

  if (input.profile?.profileImageUrl) {
    urls.add(input.profile.profileImageUrl)
  }

  for (const project of input.projects ?? []) {
    if (project.imageUrl) {
      urls.add(project.imageUrl)
    }
  }

  for (const achievement of input.achievements ?? []) {
    if (achievement.imageUrl) {
      urls.add(achievement.imageUrl)
    }
  }

  return Array.from(urls).slice(0, 12)
}

function scheduleIdleWork(callback: IdleCallback): { cancel: () => void } {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const idleWindow = window as Window & {
      requestIdleCallback: (cb: IdleCallback, options?: { timeout: number }) => IdleCallbackHandle
      cancelIdleCallback: (id: IdleCallbackHandle) => void
    }

    const id = idleWindow.requestIdleCallback(callback, { timeout: 1200 })
    return {
      cancel: () => idleWindow.cancelIdleCallback(id),
    }
  }

  const timeoutId = globalThis.setTimeout(() => {
    callback({ didTimeout: true, timeRemaining: () => 0 })
  }, 250)

  return {
    cancel: () => globalThis.clearTimeout(timeoutId),
  }
}

export function ShellGate({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const hasEntered = sessionStorage.getItem("terminal_authorized")
    if (hasEntered) {
      setShowIntro(false)
    } else {
      setShowIntro(true)
    }
  }, [])

  const handleComplete = () => {
    sessionStorage.setItem("terminal_authorized", "true")
    setShowIntro(false)
  }

  React.useEffect(() => {
    if (showIntro !== true) {
      return
    }

    const controller = new AbortController()
    const scheduled = scheduleIdleWork(async () => {
      await Promise.allSettled(
        WARMUP_ENDPOINTS.map((endpoint) =>
          fetch(endpoint, {
            method: "GET",
            credentials: "same-origin",
            cache: "force-cache",
            signal: controller.signal,
          })
        )
      )

      const [profile, projects, achievements] = await Promise.all([
        fetchJsonWarm<ProfileSettingsRecord>("/api/public/profile", controller.signal),
        fetchJsonWarm<ProjectRecord[]>("/api/public/projects", controller.signal),
        fetchJsonWarm<AchievementRecord[]>("/api/public/achievements", controller.signal),
      ])

      const imageCandidates = collectImageCandidates({ profile, projects, achievements })
      await Promise.allSettled(imageCandidates.map((url) => warmImage(url, controller.signal)))
    })

    return () => {
      scheduled.cancel()
      controller.abort()
    }
  }, [showIntro])

  // Prevent flash of content while checking session
  if (showIntro === null) return null

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <ShellIntro key="intro" onComplete={handleComplete} />
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
