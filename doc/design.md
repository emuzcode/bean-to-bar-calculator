# Bean to Bar カカオ配合電卓 – デザイン設計書

## 1. デザインコンセプト

### 1.1 全体方針

- **ダークモード専用**: カカオ豆・チョコレートの世界観に合わせたダーク基調
- **ミニマル & プロフェッショナル**: 装飾を排し、データと計算結果にフォーカス
- **Glass Morphism**: 半透明ブラー背景のカード（glass-card）でモダンな質感を実現
- **シングルアクセントカラー**: ミントシアン (#00d4aa) をプライマリカラーとし、視認性と統一感を両立

### 1.2 デザイントーン

| 要素 | トーン |
|------|--------|
| 背景 | ほぼ黒（HSL 230 18% 3%） |
| カード | 暗いグレー + ブラー効果（glass-card） |
| テキスト | 白寄りグレー（HSL 210 10% 82%） |
| アクセント | ミントシアン（HSL 164 95% 50%） |
| 警告 | アンバー（HSL 42 90% 55%） |
| エラー | レッド（HSL 0 65% 52%） |

---

## 2. カラーシステム

### 2.1 CSS カスタムプロパティ

```css
:root {
  --background: 230 18% 3%;       /* ほぼ黒の背景 */
  --foreground: 210 10% 82%;      /* メインテキスト */
  --card: 230 14% 7%;             /* カード背景 */
  --primary: 164 95% 50%;         /* アクセント: ミントシアン */
  --secondary: 230 12% 11%;       /* セカンダリ背景 */
  --muted: 230 10% 14%;           /* ミュート背景 */
  --muted-foreground: 220 8% 42%; /* ミュートテキスト */
  --destructive: 0 65% 52%;       /* エラー: レッド */
  --warning: 42 90% 55%;          /* 警告: アンバー */
  --border: 230 10% 12%;          /* ボーダー */
}
```

### 2.2 チャートカラーパレット

| 成分 | カラー | HEX |
|------|--------|-----|
| ニブ（Nibs） | ミントシアン | `#00d4aa` |
| カカオバター（Cacao Butter） | スレートグレー | `#5a6575` |
| その他成分（Other） | ウォームアンバー | `#d4a44c` |
| 砂糖（Sugar） | ダークネイビー | `#1c2030` |

---

## 3. タイポグラフィ

### 3.1 フォントファミリー

| 用途 | フォント | CSS Variable |
|------|---------|-------------|
| 本文・UI | Inter | `--font-inter` |
| 数値・コード | JetBrains Mono | `--font-jetbrains` |

### 3.2 フォントサイズ規約

| 用途 | サイズ | 補足 |
|------|--------|------|
| セクションラベル | 10px | `font-mono`, `uppercase`, `tracking-[0.15em]` |
| 入力ラベル | 13px | `text-foreground/70` |
| 入力値 | 13px | `font-mono`, `font-semibold`, `tabular-nums` |
| 凡例テキスト | 12px | `text-muted-foreground` |
| 計量値 | 13px | `font-mono`, `tabular-nums` |
| チャート中央数値 | 30px (3xl) | `font-mono`, `font-semibold`, `text-primary` |
| 計算プロセス | 11px | `font-mono`, `text-foreground/45` |
| 警告メッセージ | 11px | `text-foreground/50` |
| メインコピー | 18px (lg) | `font-semibold` |
| サブコピー | 13px | `text-muted-foreground` |
| ワンライナー | 11px | `text-foreground/40` |

---

## 4. 画面構成

### 4.1 全体レイアウト

```
┌──────────────────────────────┐
│  [Header]  Cacao Calculator  │  sticky, backdrop-blur
│                    [JA] [EN] │
├──────────────────────────────┤
│                              │
│  メインコピー                  │
│  サブコピー                    │
│  ワンライナー                  │
│                              │
│  ── パラメータ ──────────────  │
│  ┌────────────────────────┐  │
│  │ ニブ重量        [1000]g│  │
│  │ ────slider────────     │  │
│  │ 目標カカオ分      [70]%│  │
│  │ ────slider────────     │  │
│  └────────────────────────┘  │
│                              │
│  ── レシピ詳細 ──────── ▼ ── │
│  (折りたたみ: その他 / CB)    │
│                              │
│  ⚠ 警告カード (amber)         │
│                              │
│  ── 配合構成 ────────────── │
│  ┌────────────────────────┐  │
│  │     ┌─────────┐        │  │
│  │     │  70     │        │  │
│  │     │% Total  │  Donut │  │
│  │     └─────────┘        │  │
│  │  ■ Nibs (from nibs) 70%│  │
│  │  ■ Sugar           30% │  │
│  └────────────────────────┘  │
│                              │
│  ── 計量（g）────────────── │
│  ┌────────────────────────┐  │
│  │  Nibs         1000.0 g │  │
│  │  Sugar         428.6 g │  │
│  │  Total        1428.6 g │  │
│  └────────────────────────┘  │
│                              │
│  ── 計算プロセス ──── ▼ ──── │
│  (折りたたみ: 計算式)          │
│                              │
└──────────────────────────────┘
```

### 4.2 セーフエリア対応

iOS の Safe Area（ノッチ・ホームインジケータ）に対応:

```css
.safe-top  { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
```

---

## 5. コンポーネント詳細

### 5.1 イントロスクリーン（IntroScreen）

| フェーズ | 表示内容 | 演出 |
|---------|---------|------|
| loading | `LOADING XX%` + プログレスバー | 0→100% のカウントアップ |
| title | `Cacao Calculator` | フェードイン + 上方向スライド |
| subtitle | `Bean to Bar Formula` | 水平ラインが伸びた後フェードイン |
| exit | — | 全体がフェードアウト → メイン画面表示 |

### 5.2 ヘッダー（Header）

- **構成**: 左にアプリ名（パルス点のドット + "Cacao Calculator"）、右に言語トグル
- **スタイル**: `sticky top-0`, `backdrop-blur-xl`, `bg-background/80`
- **高さ**: コンパクト（py-3）

### 5.3 言語トグル（LanguageToggle）

- JA / EN の 2 ボタン
- 選択中: `bg-primary/15 text-primary`
- 非選択: `text-muted-foreground`
- フォント: `font-mono text-[10px] tracking-wider`

### 5.4 入力セクション（InputSection）

#### セクションラベル

- `font-mono`, `10px`, `uppercase`, `tracking-[0.15em]`, `text-primary/70`
- 右側に `bg-primary/10` のライン

#### 入力行（InputRow）

- ラベル（左）+ 数値入力（右）の横並び
- 数値入力: `w-[72px]`, 右寄せ, `font-mono`, ボーダー付き
- スライダー: Radix UI ベースのカスタムスライダー

#### レシピ詳細トグル

- `ChevronDown` アイコン付きの折りたたみボタン
- 開閉で `rotate-180` のアニメーション

### 5.5 結果セクション（ResultsSection）

#### エラーバナー

- `border-destructive/20`, `bg-destructive/5`
- `AlertCircle` アイコン
- タイトル: 13px, `font-medium`, `text-destructive`
- メッセージ: 11px, `text-destructive/60`

#### 警告バナー

- `border-warning/20`, `bg-warning/5`
- `AlertTriangle` アイコン
- メッセージ: 11px, `text-foreground/50`

#### ドーナツチャート（CompositionChart）

- Recharts ベースの `PieChart` / `Pie`
- `innerRadius: 52`, `outerRadius: 76`, `paddingAngle: 2`
- チャートサイズ: `180px × 180px`
- **中央表示**: 目標カカオ % + "% Total Cacao" ラベル（`absolute inset-0 flex`）
- アニメーション: 700ms ease-out

#### 凡例（Legend）

- 色付きドット（`h-2 w-2 rounded-sm`）+ ラベル + % 値
- ニブ / カカオバター / その他 / 砂糖

#### 計量行（MeasurementRow）

- 色付きドット（`h-1.5 w-1.5 rounded-full`）+ ラベル + 重量
- 総重量行: `border-t`, `font-semibold`, `text-primary`

#### 計算プロセス（CalculationDetails）

- 折りたたみトリガー: `ChevronDown` + テキスト
- 展開カード: glass-card 内に数式ステップを表示
- 各ステップ: ラベル（9px, `text-primary/40`）+ 数式（11px）

---

## 6. アニメーション

| 名前 | キーフレーム | 用途 |
|------|------------|------|
| `fade-in` | opacity 0→1 | 汎用フェードイン |
| `fade-up` | opacity 0→1, translateY 12px→0 | コンテンツの段階的表示 |
| `line-expand` | scaleX 0→1 | イントロのライン演出 |
| `pulse` | opacity 0.4→1→0.4 | ヘッダードットのパルス |
| `accordion-down/up` | height 0↔auto | 折りたたみパネル |

### 段階的表示（Staggered Fade-up）

メイン画面の各セクションは `animationDelay` をずらして順次表示:

| セクション | delay |
|-----------|-------|
| トップコピー | 0.05s |
| 入力セクション | 0.10s |
| 結果セクション | 0.25s |

---

## 7. レスポンシブ設計

| ブレークポイント | 対応 |
|----------------|------|
| モバイル（~640px） | メインターゲット。`max-w-lg` で中央配置 |
| タブレット以上 | 同一レイアウトだがセンター寄せで見やすく |

- 最大幅: `max-w-lg`（512px）
- 水平パディング: `px-5`
- 垂直パディング: `pb-12 pt-5`

---

## 8. Glass Card スタイル

```css
.glass-card {
  background: hsl(230 14% 7% / 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid hsl(230 10% 14%);
}
```

- 半透明背景 + ブラーで奥行き感を演出
- ボーダーは `hsl(230 10% 14%)` で控えめ

---

## 9. アイコン・アセット

### 9.1 アプリアイコン

| サイズ | ファイル | 形式 |
|--------|---------|------|
| 192×192 | `/public/icons/icon-192.svg` | SVG |
| 512×512 | `/public/icons/icon-512.svg` | SVG |
| Apple Touch | `/public/icons/apple-touch-icon.svg` | SVG |

> **Note**: App Store 向けには SVG → PNG 変換が必要。

### 9.2 UI アイコン

Lucide React を使用:

| アイコン | 用途 |
|---------|------|
| `AlertCircle` | エラーバナー |
| `AlertTriangle` | 警告バナー |
| `ChevronDown` | 折りたたみトグル |

---

## 10. インタラクション仕様

### 10.1 入力操作

| 操作 | 動作 |
|------|------|
| スライダードラッグ | リアルタイムで値を更新、結果を即座に再計算 |
| 数値入力 | テキスト入力で直接値を指定、`onChange` で即時反映 |
| レシピ詳細トグル | クリックで折りたたみ開閉、`ChevronDown` が 180° 回転 |
| 言語切替 | JA / EN をクリックで即座にすべてのテキストが切り替わる |

### 10.2 結果表示

| 状態 | 表示 |
|------|------|
| 正常 | ドーナツチャート + 凡例 + 計量 + 計算プロセス |
| レンジエラー | エラーバナーのみ表示、結果非表示 |
| ロジックエラー | エラーバナーのみ表示、結果非表示 |
| 警告あり | 結果を表示しつつ、Amber 警告カードを追加表示 |

