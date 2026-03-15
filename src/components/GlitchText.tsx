"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

const glyphs = "X#%&@<>[]{}01"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className }: GlitchTextProps) {
  const [displayText, setDisplayText] = React.useState(text)
  const [isGlitching, setIsGlitching] = React.useState(false)

  React.useEffect(() => {
    setIsGlitching(true)
    let iteration = 0
    const maxIterations = text.length
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, i) => {
            if (i < iteration) return text[i]
            if (char === " ") return " "
            return glyphs[Math.floor(Math.random() * glyphs.length)]
          })
          .join("")
      )

      if (iteration >= maxIterations) {
        clearInterval(interval)
        setIsGlitching(false)
        setDisplayText(text)
      }
      
      iteration += 1 // Faster reveal for sharper glitch effect
    }, 30) // Faster update interval

    return () => clearInterval(interval)
  }, [text])

  return (
    <span className={cn(
      "font-code transition-all duration-150 inline-block relative",
      isGlitching && "animate-glitch text-primary opacity-90",
      className
    )}>
      {displayText}
      {isGlitching && (
        <>
          <span className="absolute top-0 left-0 -translate-x-1 translate-y-1 text-secondary opacity-70 mix-blend-screen">{displayText}</span>
          <span className="absolute top-0 left-0 translate-x-1 -translate-y-1 text-destructive opacity-70 mix-blend-screen">{displayText}</span>
        </>
      )}
    </span>
  )
}
