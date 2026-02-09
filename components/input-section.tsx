"use client"

import { useState, useEffect, useRef } from "react"
import type { CacaoInputs } from "@/lib/cacao-calculator"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { Slider } from "@/components/ui/slider"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputSectionProps {
  locale: Locale
  inputs: CacaoInputs
  onChange: (field: keyof CacaoInputs, value: number) => void
}

function InputRow({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  sliderStep,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  sliderStep?: number
}) {
  const [localValue, setLocalValue] = useState(String(value))
  const isFocused = useRef(false)

  // Sync local value when parent value changes (e.g. from slider),
  // but only when the input is not focused
  useEffect(() => {
    if (!isFocused.current) {
      setLocalValue(String(value))
    }
  }, [value])

  return (
    <div className="space-y-2.5 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-foreground/70">{label}</span>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={localValue}
            onChange={(e) => {
              const raw = e.target.value
              setLocalValue(raw)
              const v = Number.parseFloat(raw)
              if (!Number.isNaN(v)) onChange(v)
            }}
            onFocus={() => {
              isFocused.current = true
            }}
            onBlur={() => {
              isFocused.current = false
              const v = Number.parseFloat(localValue)
              if (Number.isNaN(v) || localValue.trim() === "") {
                // Reset to min if empty or invalid on blur
                setLocalValue(String(min))
                onChange(min)
              } else {
                // Clamp to valid range
                const clamped = Math.min(Math.max(v, min), max)
                setLocalValue(String(clamped))
                onChange(clamped)
              }
            }}
            min={min}
            max={max}
            step={step}
            className="h-7 w-[72px] rounded-md border border-border bg-secondary/50 px-2 text-right font-mono text-[13px] font-semibold tabular-nums text-foreground outline-none transition-colors focus:border-primary/40"
          />
          {unit && (
            <span className="font-mono text-[10px] text-muted-foreground">
              {unit}
            </span>
          )}
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={sliderStep ?? step}
        className="w-full"
      />
    </div>
  )
}

export function InputSection({ locale, inputs, onChange }: InputSectionProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* Section label */}
      <SectionLabel label={t(locale, "parameters")} />

      {/* Primary inputs card */}
      <div className="glass-card overflow-hidden rounded-lg">
        <InputRow
          label={t(locale, "nibWeight")}
          value={inputs.nibWeight}
          onChange={(v) => onChange("nibWeight", v)}
          min={100}
          max={20000}
          step={10}
          sliderStep={50}
          unit="g"
        />
        <div className="mx-4 h-px bg-border/40" />
        <InputRow
          label={t(locale, "targetCacao")}
          value={inputs.targetCacao}
          onChange={(v) => onChange("targetCacao", v)}
          min={40}
          max={90}
          step={1}
          unit="%"
        />
      </div>

      {/* Optional details toggle */}
      <button
        type="button"
        onClick={() => setDetailsOpen(!detailsOpen)}
        className="flex w-full items-center gap-2 px-1 py-1"
        aria-expanded={detailsOpen}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {t(locale, "recipeDetails")}
        </span>
        <div className="h-px flex-1 bg-border/30" />
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform duration-200",
            detailsOpen && "rotate-180",
          )}
        />
      </button>
      {detailsOpen && (
        <div className="glass-card overflow-hidden rounded-lg">
          <InputRow
            label={t(locale, "otherIngredients")}
            value={inputs.otherIngredients}
            onChange={(v) => onChange("otherIngredients", v)}
            min={0}
            max={40}
            step={1}
            unit="%"
          />
          <div className="mx-4 h-px bg-border/40" />
          <InputRow
            label={t(locale, "cacaoButterInOther")}
            value={inputs.cacaoButterInOther}
            onChange={(v) => onChange("cacaoButterInOther", v)}
            min={0}
            max={100}
            step={1}
            unit="%"
          />
        </div>
      )}
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-primary/70">
        {label}
      </span>
      <div className="h-px flex-1 bg-primary/10" />
    </div>
  )
}
