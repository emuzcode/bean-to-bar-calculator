"use client"

import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface LanguageToggleProps {
  locale: Locale
  onToggle: (locale: Locale) => void
}

export function LanguageToggle({ locale, onToggle }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-px rounded-md border border-border bg-secondary/40 p-0.5">
      <button
        type="button"
        onClick={() => onToggle("ja")}
        className={cn(
          "rounded-sm px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider transition-all",
          locale === "ja"
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-label="Japanese"
      >
        JA
      </button>
      <button
        type="button"
        onClick={() => onToggle("en")}
        className={cn(
          "rounded-sm px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider transition-all",
          locale === "en"
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )
}
