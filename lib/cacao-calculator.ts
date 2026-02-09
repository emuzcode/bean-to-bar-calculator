import { type Locale, t } from './i18n'

// ─── Types ────────────────────────────────────────────────────────
export interface CacaoInputs {
  nibWeight: number // N (g)
  targetCacao: number // P (%)
  otherIngredients: number // M (%)
  cacaoButterInOther: number // B (%)
}

export interface CacaoResults {
  nibsCacao: number // P_nibs (%)
  otherCacaoButter: number // C (%)
  otherIngredients: number // M (%)
  sugar: number // S (%)
  nibsWeight: number // W_nibs (g)
  sugarWeight: number // W_sugar (g)
  cacaoButterWeight: number // W_cb (g)
  otherWeight: number // W_other (g)
  totalWeight: number // W_total (g)
  k: number // batch factor
}

export interface ValidationError {
  field: string
  title: string
  message: string
}

export interface Warning {
  field: string
  message: string
}

// ─── Validation ranges ───────────────────────────────────────────
const RANGES = {
  nibWeight: { min: 100, max: 20000 },
  targetCacao: { min: 40, max: 90 },
  otherIngredients: { min: 0, max: 40 },
  cacaoButterInOther: { min: 0, max: 100 },
} as const

// ─── Range validation ────────────────────────────────────────────
export function validateRanges(inputs: CacaoInputs, locale: Locale): ValidationError[] {
  const errors: ValidationError[] = []

  if (inputs.nibWeight < RANGES.nibWeight.min || inputs.nibWeight > RANGES.nibWeight.max) {
    errors.push({
      field: 'nibWeight',
      title: t(locale, 'errNibWeightTitle'),
      message: t(locale, 'errNibWeightRange'),
    })
  }
  if (inputs.targetCacao < RANGES.targetCacao.min || inputs.targetCacao > RANGES.targetCacao.max) {
    errors.push({
      field: 'targetCacao',
      title: t(locale, 'errTargetCacaoTitle'),
      message: t(locale, 'errTargetCacaoRange'),
    })
  }
  if (
    inputs.otherIngredients < RANGES.otherIngredients.min ||
    inputs.otherIngredients > RANGES.otherIngredients.max
  ) {
    errors.push({
      field: 'otherIngredients',
      title: t(locale, 'errOtherTitle'),
      message: t(locale, 'errOtherRange'),
    })
  }
  if (
    inputs.cacaoButterInOther < RANGES.cacaoButterInOther.min ||
    inputs.cacaoButterInOther > RANGES.cacaoButterInOther.max
  ) {
    errors.push({
      field: 'cacaoButterInOther',
      title: t(locale, 'errButterTitle'),
      message: t(locale, 'errButterRange'),
    })
  }

  return errors
}

// ─── Logic-level fatal errors ────────────────────────────────────
export function validateLogic(inputs: CacaoInputs, locale: Locale): ValidationError[] {
  const errors: ValidationError[] = []
  const { targetCacao: P, otherIngredients: M, cacaoButterInOther: B } = inputs

  const C = M * (B / 100)
  const P_nibs = P - C

  if (P_nibs <= 0) {
    errors.push({
      field: 'logic',
      title: t(locale, 'errNibsCacaoTitle'),
      message: t(locale, 'errNibsCacaoMsg'),
    })
  }

  const S = 100 - (P_nibs + C + M)
  if (S < 0) {
    errors.push({
      field: 'logic',
      title: t(locale, 'errNoSugarTitle'),
      message: t(locale, 'errNoSugarMsg'),
    })
  }

  return errors
}

// ─── Calculate ───────────────────────────────────────────────────
export function calculate(inputs: CacaoInputs): CacaoResults {
  const { nibWeight: N, targetCacao: P, otherIngredients: M, cacaoButterInOther: B } = inputs

  const C = M * (B / 100)
  const P_nibs = P - C
  const k = N / P_nibs

  const S = 100 - (P_nibs + C + M)

  const W_other = k * M
  const W_cb = k * C
  const W_sugar = k * S
  const W_total = N + W_cb + W_other + W_sugar

  return {
    nibsCacao: round2(P_nibs),
    otherCacaoButter: round2(C),
    otherIngredients: round2(M),
    sugar: round2(S),
    nibsWeight: round1(N),
    sugarWeight: round1(W_sugar),
    cacaoButterWeight: round1(W_cb),
    otherWeight: round1(W_other),
    totalWeight: round1(W_total),
    k: round4(k),
  }
}

// ─── Warnings ────────────────────────────────────────────────────
export function getWarnings(inputs: CacaoInputs, results: CacaoResults, locale: Locale): Warning[] {
  const warnings: Warning[] = []
  const { targetCacao: P, otherIngredients: M, cacaoButterInOther: B, nibWeight: N } = inputs
  const { sugar: S } = results

  // Cacao % warnings
  if (M === 0) {
    if (P < 60 || P > 85) {
      warnings.push({
        field: 'targetCacao',
        message: t(locale, 'warnDarkCacaoRange'),
      })
    }
  } else {
    if (P < 40 || P > 60) {
      warnings.push({
        field: 'targetCacao',
        message: t(locale, 'warnMilkCacaoRange'),
      })
    }
  }

  // Other ingredients > 25%
  if (M > 25) {
    warnings.push({
      field: 'otherIngredients',
      message: t(locale, 'warnOtherHigh'),
    })
  }

  // Cacao butter in other > 60%
  if (B > 60) {
    warnings.push({
      field: 'cacaoButterInOther',
      message: t(locale, 'warnButterHigh'),
    })
  }

  // Small batch
  if (N < 500) {
    warnings.push({
      field: 'nibWeight',
      message: t(locale, 'warnSmallBatch'),
    })
  }

  // Sugar warnings
  if (S < 5) {
    warnings.push({
      field: 'sugar',
      message: t(locale, 'warnSugarUltraLow'),
    })
  } else if (S >= 5 && S < 15) {
    warnings.push({
      field: 'sugar',
      message: t(locale, 'warnSugarLow'),
    })
  } else if (S > 50) {
    warnings.push({
      field: 'sugar',
      message: t(locale, 'warnSugarHigh'),
    })
  }

  return warnings
}

// ─── Helpers ─────────────────────────────────────────────────────
function round1(n: number): number {
  return Math.round(n * 10) / 10
}
function round2(n: number): number {
  return Math.round(n * 100) / 100
}
function round4(n: number): number {
  return Math.round(n * 10000) / 10000
}
