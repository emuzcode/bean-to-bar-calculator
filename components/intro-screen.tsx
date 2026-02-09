"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface IntroScreenProps {
  onComplete: () => void
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<
    "loading" | "title" | "subtitle" | "exit"
  >("loading")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const increment = prev < 60 ? 4 : prev < 85 ? 2 : 1
        return Math.min(prev + increment, 100)
      })
    }, 25)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100 && phase === "loading") {
      const t = setTimeout(() => setPhase("title"), 150)
      return () => clearTimeout(t)
    }
  }, [progress, phase])

  useEffect(() => {
    if (phase === "title") {
      const t = setTimeout(() => setPhase("subtitle"), 500)
      return () => clearTimeout(t)
    }
    if (phase === "subtitle") {
      const t = setTimeout(() => setPhase("exit"), 800)
      return () => clearTimeout(t)
    }
    if (phase === "exit") {
      const t = setTimeout(() => onComplete(), 500)
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        phase === "exit" && "pointer-events-none opacity-0",
      )}
    >
      {/* Loading phase */}
      <div
        className={cn(
          "flex flex-col items-center gap-6 transition-all duration-400",
          phase !== "loading"
            ? "pointer-events-none opacity-0"
            : "opacity-100",
        )}
      >
        <p className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
          LOADING
          <span className="ml-1.5 inline-block font-mono tabular-nums text-primary">
            {progress}%
          </span>
        </p>
        <div className="h-px w-48 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Title reveal */}
      <div
        className={cn(
          "absolute flex flex-col items-center gap-3 transition-all duration-500",
          phase === "loading"
            ? "translate-y-2 opacity-0"
            : "translate-y-0 opacity-100",
        )}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Cacao
          <span className="ml-1.5 text-primary">Calculator</span>
        </h1>
        <div
          className={cn(
            "h-px origin-center bg-primary/40 transition-all duration-500",
            phase === "subtitle" || phase === "exit" ? "w-32" : "w-0",
          )}
        />
        <p
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-all duration-400",
            phase === "subtitle" || phase === "exit"
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0",
          )}
        >
          Bean to Bar Formula
        </p>
      </div>
    </div>
  )
}
