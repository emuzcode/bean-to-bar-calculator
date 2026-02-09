"use client"

import { useState, useMemo, useCallback } from "react"
import { type Locale, t } from "@/lib/i18n"
import {
  type CacaoInputs,
  validateRanges,
  validateLogic,
  calculate,
  getWarnings,
} from "@/lib/cacao-calculator"
import { InputSection } from "@/components/input-section"
import { ResultsSection } from "@/components/results-section"
import { LanguageToggle } from "@/components/language-toggle"
import { IntroScreen } from "@/components/intro-screen"
import { cn } from "@/lib/utils"

export function CacaoCalculator() {
  const [showIntro, setShowIntro] = useState(true)
  const [appReady, setAppReady] = useState(false)
  const [locale, setLocale] = useState<Locale>("ja")
  const [inputs, setInputs] = useState<CacaoInputs>({
    nibWeight: 1000,
    targetCacao: 70,
    otherIngredients: 0,
    cacaoButterInOther: 0,
  })

  const handleInputChange = useCallback(
    (field: keyof CacaoInputs, value: number) => {
      setInputs((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false)
    setTimeout(() => setAppReady(true), 100)
  }, [])

  const { rangeErrors, logicErrors, results, warnings } = useMemo(() => {
    const rangeErrs = validateRanges(inputs, locale)
    if (rangeErrs.length > 0) {
      return {
        rangeErrors: rangeErrs,
        logicErrors: [],
        results: null,
        warnings: [],
      }
    }
    const logicErrs = validateLogic(inputs, locale)
    if (logicErrs.length > 0) {
      return {
        rangeErrors: [],
        logicErrors: logicErrs,
        results: null,
        warnings: [],
      }
    }
    const res = calculate(inputs)
    const warns = getWarnings(inputs, res, locale)
    return {
      rangeErrors: [],
      logicErrors: [],
      results: res,
      warnings: warns,
    }
  }, [inputs, locale])

  const allErrors = [...rangeErrors, ...logicErrors]

  return (
    <>
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}

      <div
        className={cn(
          "relative min-h-screen bg-background safe-top safe-bottom transition-opacity duration-700",
          appReady ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-xl safe-top">
          <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <h1 className="text-sm font-semibold tracking-tight text-foreground">
                Cacao
                <span className="ml-1 text-primary">Calculator</span>
              </h1>
            </div>
            <LanguageToggle locale={locale} onToggle={setLocale} />
          </div>
        </header>

        {/* Main content */}
        <main className="relative mx-auto max-w-lg px-5 pb-12 pt-5">
          {/* Top copy (§8 & §9) */}
          <div
            className={cn("opacity-0 mb-6", appReady && "animate-fade-up")}
            style={{ animationDelay: "0.05s" }}
          >
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {t(locale, "mainCopy")}
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              {t(locale, "subCopy")}
            </p>
            <p className="mt-2 text-[11px] text-foreground/40">
              {t(locale, "oneLiner")}
            </p>
          </div>

          <div
            className={cn("opacity-0", appReady && "animate-fade-up")}
            style={{ animationDelay: "0.1s" }}
          >
            <InputSection
              locale={locale}
              inputs={inputs}
              onChange={handleInputChange}
            />
          </div>

          <div
            className={cn("opacity-0", appReady && "animate-fade-up")}
            style={{ animationDelay: "0.25s" }}
          >
            <ResultsSection
              locale={locale}
              results={results}
              inputs={inputs}
              warnings={warnings}
              errors={allErrors}
            />
          </div>
        </main>
      </div>
    </>
  )
}
