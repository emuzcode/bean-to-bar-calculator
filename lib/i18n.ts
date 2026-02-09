export type Locale = 'ja' | 'en'

export const translations = {
  en: {
    // Header
    mainCopy: 'The Mathematics of Chocolate.',
    subCopy: 'Master the balance between nibs and added cacao butter with clear formulas.',
    oneLiner: 'Instantly compute ideal recipes from nib weight and target cacao %.',

    // Input labels
    parameters: 'PARAMETERS',
    nibWeight: 'Nib Weight',
    nibWeightUnit: 'g',
    nibWeightDesc: 'Enter the total weight of cacao nibs in grams.',
    targetCacao: 'Target Cacao %',
    targetCacaoDesc:
      'Set the final target percentage for total cacao content (nibs + added cacao butter).',
    recipeDetails: 'Recipe Details',
    otherIngredients: 'Other Ingredients',
    otherIngredientsDesc:
      'Percentage of milk powder or other ingredients that are neither cacao nor sugar.',
    cacaoButterInOther: 'Cacao Butter in "Other"',
    cacaoButterInOtherDesc: 'Percentage of cacao butter contained within the "Other Ingredients."',

    // Results sections
    cacaoProfile: 'Cacao Profile',
    totalCacao: 'Total Cacao',
    breakdown: 'Breakdown',
    fromNibs: 'from nibs',
    fromOtherButter: 'from "Other" cacao butter',

    composition: 'Composition',
    sugar: 'Sugar',
    other: 'Other Ingredients',

    measurement: 'Measurement',
    nibs: 'Nibs',
    cacaoButter: 'Cacao Butter',
    totalBatchWeight: 'Total Batch Weight',

    calculationDetails: 'Calculation Details',
    showCalcDetails: 'Show Calculation Details',
    hideCalcDetails: 'Hide Calculation Details',

    // Calculation detail labels
    calcCbFromOther: 'CB from Other',
    calcNibCacao: 'Nib-derived Cacao',
    calcBatchFactor: 'Batch Factor',
    calcSugarPct: 'Sugar %',
    calcWeights: 'Weights',

    // Warnings / Errors
    warning: 'Warning',
    error: 'Error',

    // Range errors
    errNibWeightRange: 'Nib weight must be between 100 g and 20,000 g.',
    errNibWeightTitle: 'Nib Weight out of range',
    errTargetCacaoRange: 'Target cacao must be between 40% and 90%.',
    errTargetCacaoTitle: 'Target Cacao % out of range',
    errOtherRange: 'Other ingredients must be between 0% and 40%.',
    errOtherTitle: 'Other Ingredients out of range',
    errButterRange: 'Cacao butter in "Other" must be between 0% and 100%.',
    errButterTitle: 'Cacao Butter in Other out of range',

    // Logic errors
    errNibsCacaoTitle: 'Cacao % setting is not feasible',
    errNibsCacaoMsg:
      'The cacao butter from "Other Ingredients" already exceeds or equals your Target Cacao %. Increase the Target Cacao %, decrease Other Ingredients %, or decrease the Cacao Butter ratio within "Other".',
    errNoSugarTitle: 'No room for sugar',
    errNoSugarMsg:
      'Cacao content and Other Ingredients already exceed 100%. Decrease Target Cacao %, decrease Other Ingredients %, or lower the Cacao Butter ratio in "Other".',

    // Warnings
    warnDarkCacaoRange:
      'Outside the typical dark chocolate range (60–85%). No issue if intentional.',
    warnMilkCacaoRange:
      'Outside the typical milk chocolate range (40–60%). Watch the mouthfeel and sweetness balance.',
    warnOtherHigh:
      'Other Ingredients exceed 25%. The chocolate character may be diluted by fillers.',
    warnButterHigh:
      'Cacao butter in "Other" exceeds 60%. Excess fat may affect tempering and mouthfeel.',
    warnSmallBatch:
      'Very small batch. Typically treated as a test batch; reproducibility may vary.',
    warnSugarUltraLow:
      'Sugar is below 5%. This produces an ultra-bitter formulation with almost no sweetness.',
    warnSugarLow:
      'Sugar is quite low. This creates a connoisseur-level recipe focused on cacao character.',
    warnSugarHigh:
      'Sugar exceeds 50%. This departs significantly from typical Bean to Bar formulations.',
  },
  ja: {
    mainCopy: 'チョコレートの数学。',
    subCopy: '豆由来成分と追加カカオバターの比率を、数式で完全にコントロール。',
    oneLiner: 'ニブの重さと目標カカオ％から、理想の配合を一瞬で計算します。',

    parameters: 'パラメータ',
    nibWeight: 'ニブ重量',
    nibWeightUnit: 'g',
    nibWeightDesc: '使用するカカオニブの総重量（g）を入力します。',
    targetCacao: '目標カカオ分',
    targetCacaoDesc:
      '完成品における合計カカオ成分（ニブ由来＋追加カカオバター）の目標値です。',
    recipeDetails: 'レシピ詳細',
    otherIngredients: 'その他成分',
    otherIngredientsDesc:
      'ミルクパウダーなど、カカオと砂糖以外の副材料が全体に占める割合です。',
    cacaoButterInOther: '（内訳）カカオバター比率',
    cacaoButterInOtherDesc: '「その他成分」のうち、カカオバターが占める割合を指定します。',

    cacaoProfile: 'カカオプロファイル',
    totalCacao: '合計カカオ分',
    breakdown: '内訳',
    fromNibs: 'ニブ由来',
    fromOtherButter: 'その他由来バター',

    composition: '配合構成',
    sugar: '砂糖',
    other: 'その他成分',

    measurement: '計量（g）',
    nibs: 'ニブ',
    cacaoButter: 'カカオバター',
    totalBatchWeight: '総重量',

    calculationDetails: '計算プロセス',
    showCalcDetails: '計算プロセスを表示',
    hideCalcDetails: '計算プロセスを非表示',

    // Calculation detail labels
    calcCbFromOther: 'その他由来カカオバター',
    calcNibCacao: 'ニブ由来カカオ',
    calcBatchFactor: 'バッチ係数',
    calcSugarPct: '砂糖％',
    calcWeights: '重量',

    warning: '注意',
    error: 'エラー',

    // Range errors
    errNibWeightRange: 'ニブ重量は100 g〜20,000 gの範囲で入力してください。',
    errNibWeightTitle: 'ニブ重量が範囲外です',
    errTargetCacaoRange: '目標カカオ分は40%〜90%の範囲で入力してください。',
    errTargetCacaoTitle: '目標カカオ分が範囲外です',
    errOtherRange: 'その他成分は0%〜40%の範囲で入力してください。',
    errOtherTitle: 'その他成分が範囲外です',
    errButterRange: 'カカオバター比率は0%〜100%の範囲で入力してください。',
    errButterTitle: 'カカオバター比率が範囲外です',

    // Logic errors
    errNibsCacaoTitle: 'カカオ分の設定に無理があります',
    errNibsCacaoMsg:
      'ミルクパウダー（その他）とその中のカカオバター量が、目標のカカオ％を超えています。目標カカオ％を上げる、その他％を下げる、その他中のカカオバター％を下げる、のいずれかを調整してください。',
    errNoSugarTitle: '砂糖を入れる余地がありません',
    errNoSugarMsg:
      '現在の設定では、カカオ分とその他成分だけで100％を超えています。目標カカオ％を下げる、その他％を下げる、その他中のカカオバター％を下げることで、砂糖のスペースを作ることができます。',

    // Warnings
    warnDarkCacaoRange:
      'ダークチョコとして一般的な範囲（60〜85％）から外れています。意図的な設計であれば問題ありません。',
    warnMilkCacaoRange:
      'ミルク入りレシピとして一般的なカカオ分（40〜60％）から外れています。口溶けや甘味バランスに注意してください。',
    warnOtherHigh:
      'その他成分が25％を超えています。チョコレートらしさより"フィラー感"が強くなる可能性があります。',
    warnButterHigh:
      'その他中のカカオバターが60％を超えています。脂肪分過多でテンパリングや口溶けに影響する可能性があります。',
    warnSmallBatch:
      '非常に小さいバッチです。テストバッチとして扱われることが多く、製造条件の再現性に注意が必要です。',
    warnSugarUltraLow:
      '砂糖が5％未満です。ほとんど甘味のない"超ビター"な配合になります。',
    warnSugarLow:
      '砂糖がかなり控えめです。カカオの個性を最重視する"マニア向け"レシピになります。',
    warnSugarHigh:
      '砂糖が50％を超えています。一般的なBean to Barから大きく外れた配合で、口溶けやテクスチャに注意が必要です。',
  },
} as const

export function t(locale: Locale, key: keyof (typeof translations)['en']): string {
  return translations[locale][key]
}
