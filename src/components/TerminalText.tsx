
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TerminalTextProps {
  text: string
  className?: string
  delay?: number
  onComplete?: () => void
}

export function TerminalText({ text, className, delay = 0, onComplete }: TerminalTextProps) {
  const [displayText, setDisplayText] = React.useState("")
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    
    const startTyping = () => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i))
        i++
        if (i > text.length) {
          clearInterval(interval)
          setIsComplete(true)
          onComplete?.()
        }
      }, 50)
    }

    timeout = setTimeout(startTyping, delay)
    return () => {
      clearTimeout(timeout)
    }
  }, [text, delay, onComplete])

  return (
    <span className={cn("font-code", className)}>
      {displayText}
      {!isComplete && <span className="terminal-cursor" />}
    </span>
  )
}
