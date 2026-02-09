"use client"

import React from "react"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type {
  CacaoInputs,
  CacaoResults,
  ValidationError,
  Warning,
} from "@/lib/cacao-calculator"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { ChartContainer } from "@/components/ui/chart"
import { AlertTriangle, AlertCircle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResultsSectionProps {
  locale: Locale
  results: CacaoResults | null
  inputs: CacaoInputs
  warnings: Warning[]
  errors: ValidationError[]
}

/* Minimal color palette: primary mint, neutral grays, warm amber */
const COLORS = {
  nibs: "#00d4aa",
  cacaoButter: "#5a6575",
  other: "#d4a44c",
  sugar: "#1c2030",
}

/* -- Error / Warning banners -- */

function ErrorBanner({ errors }: { errors: ValidationError[] }) {
  return (
    <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3.5">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
      <div className="space-y-1">
        {errors.map((err, i) => (
          <div key={i}>
            <p className="text-[13px] font-medium text-destructive">
              {err.title}
            </p>
            <p className="text-[11px] leading-relaxed text-destructive/60">
              {err.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function WarningBanner({ warnings }: { warnings: Warning[] }) {
  if (warnings.length === 0) return null
  return (
    <div className="flex gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3.5">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
      <div className="space-y-1">
        {warnings.map((w, i) => (
          <p key={i} className="text-[11px] leading-relaxed text-foreground/50">
            {w.message}
          </p>
        ))}
      </div>
    </div>
  )
}

/* -- Donut Chart -- */

function CompositionChart({ results }: { results: CacaoResults }) {
  const data = [
    { name: "Nibs", value: results.nibsCacao, color: COLORS.nibs },
    ...(results.otherCacaoButter > 0
      ? [
          {
            name: "CB",
            value: results.otherCacaoButter,
            color: COLORS.cacaoButter,
          },
        ]
      : []),
    ...(results.otherIngredients > 0
      ? [
          {
            name: "Other",
            value: results.otherIngredients,
            color: COLORS.other,
          },
        ]
      : []),
    { name: "Sugar", value: results.sugar, color: COLORS.sugar },
  ].filter((d) => d.value > 0)

  return (
    <ChartContainer
      config={{
        nibs: { label: "Nibs", color: COLORS.nibs },
        cacaoButter: { label: "Cacao Butter", color: COLORS.cacaoButter },
        other: { label: "Other", color: COLORS.other },
        sugar: { label: "Sugar", color: COLORS.sugar },
      }}
      className="mx-auto aspect-square h-[180px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={76}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
            animationDuration={700}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

/* -- Section Label -- */

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

/* -- Legend Row -- */

function LegendRow({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="text-[12px] text-muted-foreground">{label}</span>
      </div>
      <span className="font-mono text-[12px] font-medium tabular-nums text-foreground">
        {value}
      </span>
    </div>
  )
}

/* -- Measurement Row -- */

function MeasurementRow({
  label,
  value,
  bold,
  color,
}: {
  label: string
  value: string
  bold?: boolean
  color?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2.5",
        bold && "border-t border-primary/10",
      )}
    >
      <div className="flex items-center gap-2">
        {color && (
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        <span
          className={cn(
            "text-[13px]",
            bold ? "font-medium text-primary" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>
      <span
        className={cn(
          "font-mono text-[13px] tabular-nums",
          bold ? "font-semibold text-primary" : "font-medium text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  )
}

/* -- Calculation Details -- */

function CalculationDetails({
  locale,
  inputs,
  results,
}: {
  locale: Locale
  inputs: CacaoInputs
  results: CacaoResults
}) {
  const [open, setOpen] = useState(false)

  const {
    nibWeight: N,
    targetCacao: P,
    otherIngredients: M,
    cacaoButterInOther: B,
  } = inputs
  const C = results.otherCacaoButter
  const P_nibs = results.nibsCacao
  const k = results.k

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-1 py-1"
        aria-expanded={open}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {t(locale, "calculationDetails")}
        </span>
        <div className="h-px flex-1 bg-border/30" />
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="glass-card mt-2 overflow-hidden rounded-lg p-4">
          <div className="space-y-2.5 font-mono text-[11px] leading-relaxed text-foreground/45">
            <FormulaStep
              label={t(locale, "calcCbFromOther")}
              formula={
                <>
                  <Var>C</Var>
                  {` = ${M} × (${B} / 100) = `}
                  <Val>{C}</Val>%
                </>
              }
            />
            <FormulaStep
              label={t(locale, "calcNibCacao")}
              formula={
                <>
                  <Var>P_nibs</Var>
                  {` = ${P} - ${C} = `}
                  <Val>{P_nibs}</Val>%
                </>
              }
            />
            <FormulaStep
              label={t(locale, "calcBatchFactor")}
              formula={
                <>
                  <Var>k</Var>
                  {` = ${N} / ${P_nibs} = `}
                  <Val>{k}</Val>
                </>
              }
            />
            <FormulaStep
              label={t(locale, "calcSugarPct")}
              formula={
                <>
                  <Var>S</Var>
                  {` = 100 - (${P_nibs} + ${C} + ${M}) = `}
                  <Val>{results.sugar}</Val>%
                </>
              }
            />
            <div className="border-t border-border/30 pt-2">
              <p className="mb-1 text-[9px] font-medium uppercase tracking-wider text-primary/40">
                {t(locale, "calcWeights")}
              </p>
              <p>
                {"Sugar = "}
                {k}
                {` x ${results.sugar} = `}
                <span className="text-foreground">{results.sugarWeight}g</span>
              </p>
              {results.cacaoButterWeight > 0 && (
                <p>
                  {"CB = "}
                  {k}
                  {` x ${C} = `}
                  <span className="text-foreground">
                    {results.cacaoButterWeight}g
                  </span>
                </p>
              )}
              {results.otherWeight > 0 && (
                <p>
                  {"Other = "}
                  {k}
                  {` x ${M} = `}
                  <span className="text-foreground">
                    {results.otherWeight}g
                  </span>
                </p>
              )}
              <p className="mt-1 text-primary">
                {"Total = "}
                {results.totalWeight}g
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FormulaStep({
  label,
  formula,
}: {
  label: string
  formula: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-0.5 text-[9px] font-medium uppercase tracking-wider text-primary/40">
        {label}
      </p>
      <p>{formula}</p>
    </div>
  )
}

function Var({ children }: { children: React.ReactNode }) {
  return <span className="text-primary/70">{children}</span>
}

function Val({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground">{children}</span>
}

/* -- Main Results Section -- */

export function ResultsSection({
  locale,
  results,
  inputs,
  warnings,
  errors,
}: ResultsSectionProps) {
  return (
    <div className="mt-6 space-y-4">
      {/* Errors */}
      {errors.length > 0 && <ErrorBanner errors={errors} />}

      {results && (
        <>
          {/* Warnings */}
          <WarningBanner warnings={warnings} />

          {/* Donut chart + legend */}
          <SectionLabel label={t(locale, "composition")} />
          <div className="glass-card overflow-hidden rounded-lg p-4">
            <div className="relative">
              <CompositionChart results={results} />
              {/* Center readout */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-3xl font-semibold tabular-nums text-primary">
                  {inputs.targetCacao}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  {"% "}
                  {t(locale, "totalCacao")}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-2 space-y-0 px-1">
              <LegendRow
                color={COLORS.nibs}
                label={`${t(locale, "nibs")} (${t(locale, "fromNibs")})`}
                value={`${results.nibsCacao}%`}
              />
              {results.otherCacaoButter > 0 && (
                <LegendRow
                  color={COLORS.cacaoButter}
                  label={t(locale, "cacaoButter")}
                  value={`${results.otherCacaoButter}%`}
                />
              )}
              {results.otherIngredients > 0 && (
                <LegendRow
                  color={COLORS.other}
                  label={t(locale, "other")}
                  value={`${results.otherIngredients}%`}
                />
              )}
              <LegendRow
                color={COLORS.sugar}
                label={t(locale, "sugar")}
                value={`${results.sugar}%`}
              />
            </div>
          </div>

          {/* Section 3: Measurement (g) */}
          <SectionLabel label={t(locale, "measurement")} />
          <div className="glass-card overflow-hidden rounded-lg">
            <MeasurementRow
              label={t(locale, "nibs")}
              value={`${results.nibsWeight} g`}
              color={COLORS.nibs}
            />
            <div className="mx-4 h-px bg-border/30" />
            <MeasurementRow
              label={t(locale, "sugar")}
              value={`${results.sugarWeight} g`}
              color={COLORS.sugar}
            />
            {results.cacaoButterWeight > 0 && (
              <>
                <div className="mx-4 h-px bg-border/30" />
                <MeasurementRow
                  label={t(locale, "cacaoButter")}
                  value={`${results.cacaoButterWeight} g`}
                  color={COLORS.cacaoButter}
                />
              </>
            )}
            {results.otherWeight > 0 && (
              <>
                <div className="mx-4 h-px bg-border/30" />
                <MeasurementRow
                  label={t(locale, "other")}
                  value={`${results.otherWeight} g`}
                  color={COLORS.other}
                />
              </>
            )}
            <MeasurementRow
              label={t(locale, "totalBatchWeight")}
              value={`${results.totalWeight} g`}
              bold
            />
          </div>

          {/* Calculation Details */}
          <CalculationDetails
            locale={locale}
            inputs={inputs}
            results={results}
          />
        </>
      )}
    </div>
  )
}
