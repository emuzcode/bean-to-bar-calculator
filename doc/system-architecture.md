# Bean to Bar カカオ配合電卓 – システム設計書

## 1. 技術スタック概要

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Next.js | 16.1.6 |
| 言語 | TypeScript | 5.7.3 |
| UI ライブラリ | React | 19.2.3 |
| CSS フレームワーク | Tailwind CSS | 3.4.17 |
| UI コンポーネント | Radix UI + shadcn/ui | — |
| チャート | Recharts | 2.15.0 |
| アイコン | Lucide React | 0.544.0 |
| パッケージマネージャ | pnpm | — |
| ネイティブラッパー | Capacitor | 8.0.2 |
| ビルド出力 | 静的エクスポート（`output: "export"`） | — |

---

## 2. プロジェクト構造

```
bean-to-bar-calculator/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト（メタデータ, フォント, PWA設定）
│   ├── page.tsx                  # エントリーポイント → CacaoCalculator
│   └── globals.css               # グローバルCSS + カスタムプロパティ
│
├── components/                   # アプリケーションコンポーネント
│   ├── cacao-calculator.tsx      # メインオーケストレーター
│   ├── input-section.tsx         # 入力UI（スライダー + 数値入力）
│   ├── results-section.tsx       # 結果表示（チャート + 計量 + 計算プロセス）
│   ├── language-toggle.tsx       # JA/EN 言語切替
│   ├── intro-screen.tsx          # イントロアニメーション
│   ├── register-sw.tsx           # Service Worker 登録
│   ├── theme-provider.tsx        # テーマプロバイダ
│   └── ui/                       # shadcn/ui ベースコンポーネント
│       ├── slider.tsx
│       ├── chart.tsx
│       └── ... (50+ UIコンポーネント)
│
├── lib/                          # ビジネスロジック
│   ├── cacao-calculator.ts       # 計算エンジン + バリデーション + 警告
│   ├── i18n.ts                   # 国際化（翻訳定義 + t関数）
│   └── utils.ts                  # ユーティリティ（cn関数）
│
├── public/                       # 静的アセット
│   ├── manifest.json             # PWA マニフェスト
│   ├── sw.js                     # Service Worker
│   └── icons/                    # アプリアイコン（SVG）
│
├── ios/                          # Capacitor iOS プロジェクト
│   └── App/                      # Xcode プロジェクト
│
├── doc/                          # ドキュメント
│   ├── specification.md          # 仕様書
│   ├── design.md                 # デザイン設計書
│   └── system-architecture.md    # 本ファイル
│
├── capacitor.config.ts           # Capacitor 設定
├── next.config.mjs               # Next.js 設定
├── tailwind.config.ts            # Tailwind CSS 設定
├── tsconfig.json                 # TypeScript 設定
└── package.json                  # 依存関係 + スクリプト
```

---

## 3. アーキテクチャ概要

### 3.1 全体図

```
┌─────────────────────────────────────────────────┐
│                    Presentation                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Input   │  │ Results  │  │   Intro /     │  │
│  │ Section  │  │ Section  │  │  Lang Toggle  │  │
│  └────┬─────┘  └─────┬────┘  └───────────────┘  │
│       │              │                           │
│  ┌────┴──────────────┴────┐                      │
│  │    CacaoCalculator     │  State Orchestrator  │
│  │  (useState + useMemo)  │                      │
│  └────────────┬───────────┘                      │
├───────────────┼──────────────────────────────────┤
│               │         Business Logic           │
│  ┌────────────┴───────────┐                      │
│  │   cacao-calculator.ts  │                      │
│  │  ┌─────────────────┐   │  ┌───────────────┐  │
│  │  │ validateRanges() │   │  │   i18n.ts     │  │
│  │  │ validateLogic()  │◄──┼──│   t(locale,   │  │
│  │  │ calculate()      │   │  │     key)      │  │
│  │  │ getWarnings()    │   │  └───────────────┘  │
│  │  └─────────────────┘   │                      │
│  └────────────────────────┘                      │
├──────────────────────────────────────────────────┤
│                   Platform                       │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Next.js    │  │   PWA    │  │ Capacitor  │  │
│  │ Static      │  │ (SW +   │  │ (iOS       │  │
│  │ Export      │  │ manifest)│  │  wrapper)  │  │
│  └─────────────┘  └──────────┘  └────────────┘  │
└──────────────────────────────────────────────────┘
```

### 3.2 データフロー

```
User Input (slider / number)
       │
       ▼
 CacaoCalculator (state: CacaoInputs)
       │
       ├─► validateRanges(inputs, locale)
       │         │
       │         ├─ errors? → ErrorBanner（計算中止）
       │         │
       │         └─ OK ──► validateLogic(inputs, locale)
       │                        │
       │                        ├─ errors? → ErrorBanner（計算中止）
       │                        │
       │                        └─ OK ──► calculate(inputs)
       │                                       │
       │                                       ▼
       │                                  CacaoResults
       │                                       │
       │                                       ├─► getWarnings(inputs, results, locale)
       │                                       │
       │                                       ▼
       └─────────────────────► ResultsSection に渡す
                                    │
                                    ├─ WarningBanner
                                    ├─ CompositionChart (Donut)
                                    ├─ Legend
                                    ├─ MeasurementRow ×N
                                    └─ CalculationDetails
```

---

## 4. モジュール詳細設計

### 4.1 `lib/cacao-calculator.ts` — 計算エンジン

#### 型定義

```typescript
interface CacaoInputs {
  nibWeight: number          // N (g)    — 100〜20000
  targetCacao: number        // P (%)    — 40〜90
  otherIngredients: number   // M (%)    — 0〜40
  cacaoButterInOther: number // B (%)    — 0〜100
}

interface CacaoResults {
  nibsCacao: number          // P_nibs (%)  — round2
  otherCacaoButter: number   // C (%)       — round2
  otherIngredients: number   // M (%)       — round2
  sugar: number              // S (%)       — round2
  nibsWeight: number         // W_nibs (g)  — round1
  sugarWeight: number        // W_sugar (g) — round1
  cacaoButterWeight: number  // W_cb (g)    — round1
  otherWeight: number        // W_other (g) — round1
  totalWeight: number        // W_total (g) — round1
  k: number                  // batch factor — round4
}

interface ValidationError {
  field: string
  title: string
  message: string
}

interface Warning {
  field: string
  message: string
}
```

#### 関数一覧

| 関数 | 引数 | 戻り値 | 責務 |
|------|------|--------|------|
| `validateRanges` | `(inputs, locale)` | `ValidationError[]` | 入力値の絶対範囲チェック |
| `validateLogic` | `(inputs, locale)` | `ValidationError[]` | 計算上の致命的エラー検出 |
| `calculate` | `(inputs)` | `CacaoResults` | コア計算ロジック |
| `getWarnings` | `(inputs, results, locale)` | `Warning[]` | 警告条件の判定 |

#### 丸め処理

| 関数 | 精度 | 用途 |
|------|------|------|
| `round1(n)` | 小数第1位 | 重量 (g) |
| `round2(n)` | 小数第2位 | 構成比率 (%) |
| `round4(n)` | 小数第4位 | バッチ係数 (k) |

### 4.2 `lib/i18n.ts` — 国際化モジュール

#### 構造

```typescript
type Locale = 'ja' | 'en'

const translations = {
  en: { /* 90+ キー */ },
  ja: { /* 90+ キー */ },
} as const

function t(locale: Locale, key: keyof typeof translations['en']): string
```

#### 翻訳キーカテゴリ

| カテゴリ | プレフィックス | 例 |
|---------|-------------|-----|
| トップコピー | `mainCopy`, `subCopy`, `oneLiner` | — |
| 入力ラベル | `nibWeight`, `targetCacao` 等 | — |
| セクションラベル | `parameters`, `composition`, `measurement` | — |
| 結果ラベル | `totalCacao`, `breakdown`, `fromNibs` 等 | — |
| 計算詳細 | `calcCbFromOther`, `calcNibCacao` 等 | — |
| エラー（タイトル） | `err*Title` | `errNibWeightTitle` |
| エラー（メッセージ） | `err*Range`, `err*Msg` | `errNibWeightRange` |
| 警告 | `warn*` | `warnDarkCacaoRange` |

### 4.3 `components/cacao-calculator.tsx` — メインオーケストレーター

#### State 管理

| State | 型 | 初期値 | 用途 |
|-------|------|--------|------|
| `showIntro` | `boolean` | `true` | イントロ画面表示制御 |
| `appReady` | `boolean` | `false` | フェードインアニメーション制御 |
| `locale` | `Locale` | `"ja"` | 現在の表示言語 |
| `inputs` | `CacaoInputs` | N=1000, P=70, M=0, B=0 | ユーザー入力値 |

#### 派生データ（useMemo）

```
inputs + locale → {
  rangeErrors: ValidationError[]
  logicErrors: ValidationError[]
  results: CacaoResults | null
  warnings: Warning[]
}
```

処理順序: `validateRanges` → `validateLogic` → `calculate` → `getWarnings`

エラーがある段階で後続の処理はスキップし、`results = null` を返す。

### 4.4 `components/results-section.tsx` — 結果表示

#### 内部コンポーネント構成

```
ResultsSection
  ├── ErrorBanner          — バリデーションエラー表示
  ├── WarningBanner        — 警告カード（amber）
  ├── SectionLabel         — セクション見出し
  ├── CompositionChart     — Recharts ドーナツチャート
  │   └── (center overlay) — 目標カカオ % 表示
  ├── LegendRow            — チャート凡例行
  ├── MeasurementRow       — 計量結果行
  └── CalculationDetails   — 計算プロセス（折りたたみ）
      ├── FormulaStep      — 数式ステップ
      ├── Var              — 変数ハイライト
      └── Val              — 値ハイライト
```

### 4.5 `components/input-section.tsx` — 入力セクション

#### 内部コンポーネント構成

```
InputSection
  ├── SectionLabel          — "パラメータ" / "PARAMETERS"
  ├── InputRow (×2)         — ニブ重量 / 目標カカオ分
  │   ├── <input type="number">
  │   └── <Slider>          — Radix UI スライダー
  └── Details Toggle        — "レシピ詳細" 折りたたみ
      └── InputRow (×2)     — その他成分 / カカオバター比率
```

---

## 5. ビルド・デプロイ設計

### 5.1 ビルドパイプライン

```
Next.js Source
     │
     ▼
 next build (output: "export")
     │
     ▼
  /out/ (静的 HTML/CSS/JS)
     │
     ├──► Web デプロイ（Vercel / Netlify / S3 等）
     │
     └──► Capacitor sync
              │
              ▼
         ios/ プロジェクト更新
              │
              ▼
         Xcode ビルド → .ipa → App Store
```

### 5.2 npm スクリプト

| スクリプト | コマンド | 説明 |
|-----------|---------|------|
| `dev` | `next dev --turbo` | 開発サーバー（Turbopack） |
| `build` | `next build` | 静的ビルド |
| `start` | `next start` | プロダクションサーバー |
| `lint` | `next lint` | ESLint |
| `cap:sync` | `next build && npx cap sync` | ビルド + Capacitor 同期 |
| `cap:ios` | `next build && npx cap sync ios && npx cap open ios` | iOS ビルド + Xcode 起動 |
| `cap:dev` | `npx cap run ios --livereload --external` | iOS ライブリロード開発 |

### 5.3 Next.js 設定

```javascript
// next.config.mjs
const nextConfig = {
  output: "export",          // 静的エクスポート（Capacitor 必須）
  typescript: {
    ignoreBuildErrors: true,  // ビルド時の型チェックをスキップ
  },
  images: {
    unoptimized: true,        // 静的エクスポートでは Image Optimization 不可
  },
}
```

---

## 6. PWA 設計

### 6.1 マニフェスト

```json
{
  "name": "Cacao Calculator - Bean to Bar Formula",
  "short_name": "Cacao Calc",
  "display": "standalone",
  "background_color": "#08090e",
  "theme_color": "#08090e",
  "orientation": "portrait"
}
```

### 6.2 Service Worker

| イベント | 戦略 |
|---------|------|
| `install` | 静的アセットをプリキャッシュ (`/`, `/manifest.json`, アイコン) |
| `activate` | 古いキャッシュを削除 |
| `fetch` | **Network First + Cache Fallback** — ネットワーク優先、失敗時にキャッシュ返却 |

### 6.3 登録

`RegisterSW` コンポーネントが `useEffect` で `/sw.js` を登録:

```typescript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
}
```

---

## 7. Capacitor (iOS) 設計

### 7.1 設定

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: "com.cacaocalc.app",
  appName: "Cacao Calculator",
  webDir: "out",               // Next.js 静的エクスポート先
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "Cacao Calculator",
  },
}
```

### 7.2 iOS プロジェクト構造

```
ios/App/
  ├── App/
  │   ├── AppDelegate.swift      # アプリデリゲート
  │   ├── Info.plist              # iOS メタデータ
  │   ├── Assets.xcassets/        # アプリアイコン・スプラッシュ
  │   └── public/                 # Web アセット（cap sync でコピー）
  │       ├── index.html
  │       ├── _next/static/       # JS/CSS バンドル
  │       ├── sw.js
  │       └── manifest.json
  ├── App.xcodeproj/              # Xcode プロジェクト
  └── CapApp-SPM/                 # Swift Package Manager 依存
```

### 7.3 開発ワークフロー

```
1. ソースコード編集
       │
2. pnpm build          → /out/ に静的ファイル生成
       │
3. npx cap sync ios    → /out/ を ios/App/App/public/ にコピー
       │
4. npx cap open ios    → Xcode 起動
       │
5. Xcode → Build & Run → iPhone シミュレータ or 実機
```

---

## 8. 状態管理設計

### 8.1 方針

- **外部状態管理ライブラリなし**: React の `useState` + `useMemo` のみで完結
- 理由: 単一画面のツールアプリであり、グローバル状態やサーバー状態が不要

### 8.2 状態の流れ

```
CacaoCalculator (親)
  │
  ├─ locale: Locale          ──► 全子コンポーネントに props で伝播
  ├─ inputs: CacaoInputs     ──► InputSection (双方向) / ResultsSection (読み取り)
  ├─ showIntro: boolean       ──► IntroScreen
  └─ appReady: boolean        ──► アニメーション制御
```

### 8.3 パフォーマンス最適化

| 手法 | 適用箇所 |
|------|---------|
| `useMemo` | 計算結果の導出（inputs / locale が変わった時のみ再計算） |
| `useCallback` | `handleInputChange` — 子コンポーネントの不要な再レンダリングを防止 |

---

## 9. 国際化アーキテクチャ

### 9.1 設計方針

- **クライアントサイド i18n**: サーバー不要の完全クライアント処理
- **型安全**: `keyof typeof translations['en']` でキーの typo を防止
- **即時切替**: `locale` state の変更で全 UI が即座に切り替わる

### 9.2 翻訳の利用パターン

```typescript
// コンポーネント内での使用例
t(locale, "nibWeight")     // → "ニブ重量" or "Nib Weight"
t(locale, "warnSmallBatch") // → 警告メッセージ（JA or EN）
```

---

## 10. セキュリティ・プライバシー

| 項目 | 対応 |
|------|------|
| サーバー通信 | **なし** — 完全クライアントサイドアプリケーション |
| データ保存 | **なし** — ローカルストレージ・Cookie 不使用 |
| ユーザーデータ収集 | **なし** — 個人情報の取得・送信は一切行わない |
| Service Worker | キャッシュのみ使用（オフライン対応目的） |

---

## 11. 依存関係

### 11.1 本番依存 (dependencies)

| パッケージ | 用途 |
|-----------|------|
| `next` | フレームワーク |
| `react` / `react-dom` | UI ライブラリ |
| `recharts` | ドーナツチャート |
| `lucide-react` | アイコン |
| `@radix-ui/*` | アクセシブル UI プリミティブ |
| `tailwind-merge` / `clsx` | クラス名結合ユーティリティ |
| `class-variance-authority` | コンポーネントバリアント |
| `@capacitor/core` | Capacitor ランタイム |

### 11.2 開発依存 (devDependencies)

| パッケージ | 用途 |
|-----------|------|
| `typescript` | 型チェック |
| `tailwindcss` | CSSフレームワーク |
| `@capacitor/cli` | Capacitor CLI |
| `@capacitor/ios` | iOS プラットフォーム |
| `postcss` | CSS トランスフォーム |

---

## 12. 今後の拡張ポイント

| 項目 | 概要 |
|------|------|
| レシピ保存 | `localStorage` / IndexedDB でレシピの永続化 |
| レシピ共有 | URL パラメータ or QR コードでレシピを共有 |
| Android 対応 | `@capacitor/android` の追加で対応可能 |
| テスト | Vitest + React Testing Library での単体・統合テスト |
| CI/CD | GitHub Actions でビルド・Lint・テストの自動化 |
| アナリティクス | プライバシーに配慮した匿名使用統計 |

