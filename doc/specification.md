# Bean to Bar カカオ配合電卓 – 仕様書

## 0. 概要（Overview）

| 項目 | 内容 |
|------|------|
| アプリ名（仮） | Cacao Calculator |
| プラットフォーム | iOS（iPhone）／ Web（ブラウザ） |
| カテゴリ候補 | フード & ドリンク／仕事効率化 |
| サブタイトル（JA） | カカオ配合を設計する Bean to Bar 電卓 |
| サブタイトル（EN） | Bean to Bar cacao ratio calculator |

### コンセプト

Bean to Bar チョコレートの配合を「勘」ではなく「数式」で設計するための、**カカオ比率専用フォーミュラツール**。
ユーザーは「ニブの重さ (g)」と「目標カカオ分 (%)」を軸に、ミルクパウダーや追加カカオバターを含む配合を一貫したルールで設計できる。

### コア価値

- ダーク／ミルク問わず、「ニブ由来カカオ」「その他由来カカオバター」「砂糖」「その他成分」の関係を、物理的に成立する範囲で自動計算。
- 計算結果は **%** と **g** の両方で表示し、現場の計量作業にそのまま使える。
- 計算プロセス（式）も表示できるため、プロ職人にも納得感を与える **「透明性のある電卓」** として機能する。

---

## 1. ターゲットユーザーと市場

### 1.1 地域ターゲット

| 地域 | 対象 |
|------|------|
| 日本 | 国内の Bean to Bar 工房、クラフトチョコレートショップ、チョコレート教室、ホームロースター |
| 英語圏 | 北米・欧州・オセアニアなど、英語で情報収集・レシピ共有を行う Bean to Bar コミュニティ |

### 1.2 ユーザー像

- **プロ〜セミプロの Bean to Bar 職人** — 小規模工房のオーナー／製造責任者
- **上級ホームロースター** — 自宅でカカオ豆からチョコレートを作り、配合にこだわるユーザー
- **将来的な拡張ターゲット** — クラフトチョコレート教室の講師、レシピ本やオンライン講座の著者

### 1.3 代表的ユースケース

1. ニブ在庫（例: 1500 g）から、目標カカオ分 60% のミルクチョコレートを設計したい。
2. ミルクパウダーを全体の 14%、その中のカカオバターを 50% にしたときの、砂糖量と総バッチ重量を一発で知りたい。
3. 極端な配合（砂糖が少なすぎる／多すぎる、その他が多すぎる）に対して、専門ツールとして合理的な警告を出したい。

---

## 2. コア概念・用語定義

| 用語 | 記号 | 説明 |
|------|------|------|
| ニブ（Nibs） | N | 焙煎・粉砕済みカカオ豆。入力は重量 (g) |
| 目標カカオ分（Target Cacao %） | P | 完成品における総カカオ分の目標 % |
| その他成分（Other Ingredients） | M | カカオ・砂糖以外の固形成分の % |
| その他中のカカオバター（Cacao Butter in "Other"） | B | その他成分内のカカオバター占有 % |

---

## 3. 入力仕様

### 3.1 入力項目とラベル

| # | パラメータ | JA ラベル | EN Label | JA 説明 | EN Description |
|---|-----------|----------|----------|---------|----------------|
| 1 | ニブ重量 (N) | ニブ重量 | Nib Weight | 使用するカカオニブの総重量 (g) を入力します。 | Enter the total weight of cacao nibs in grams. |
| 2 | 目標カカオ分 (P) | 目標カカオ分 | Target Cacao % | 完成品における合計カカオ成分（ニブ由来＋追加カカオバター）の目標値です。 | Set the final target percentage for total cacao content (nibs + added cacao butter). |
| 3 | その他成分 % (M) | その他成分 | Other Ingredients | ミルクパウダーなど、カカオと砂糖以外の副材料が全体に占める割合です。 | Percentage of milk powder or other ingredients that are neither cacao nor sugar in the batch. |
| 4 | その他中のカカオバター % (B) | （内訳）カカオバター比率 | Cacao Butter in "Other" | 「その他成分」のうち、カカオバターが占める割合を指定します。 | Percentage of cacao butter contained within the "Other Ingredients." |

### 3.2 入力 UI 構成

- **メイン入力セクション** — ニブ重量 (N) ／ 目標カカオ分 (P)
- **「レシピ詳細（Recipe Details）」セクション**（折りたたみ） — その他成分 % (M) ／ その他中のカカオバター % (B)

> ダークチョコを作りたいユーザーは、M=0 / B=0 のままでそのまま使用可能。

### 3.3 絶対入力範囲（超えたらエラー）

| パラメータ | 最小 | 最大 |
|-----------|------|------|
| N | 100 g | 20,000 g |
| P | 40% | 90% |
| M | 0% | 40% |
| B | 0% | 100% |

---

## 4. 計算ロジック仕様

### 4.1 中間変数

- **その他由来カカオバター %**

$$C = M \times \frac{B}{100}$$

- **ニブ由来カカオ %**

$$P_{\text{nibs}} = P - C$$

- **1% あたりのバッチ重量（バッチ係数）**

$$k = \frac{N}{P_{\text{nibs}}}$$

### 4.2 最終構成 %

| 項目 | 式 |
|------|-----|
| ニブ由来カカオ % | $P_{\text{nibs}}$ |
| その他由来カカオバター % | $C$ |
| その他成分 % | $M$ |
| 砂糖 % | $S = 100 - (P_{\text{nibs}} + C + M)$ |

### 4.3 重量 (g) の計算

| 項目 | 式 |
|------|-----|
| その他成分重量 | $W_{\text{other}} = k \times M$ |
| その他中カカオバター重量 | $W_{\text{cb}} = k \times C$ |
| 砂糖重量 | $W_{\text{sugar}} = k \times S$ |
| ニブ重量 | $W_{\text{nibs}} = N$ |
| 総重量 | $W_{\text{total}} = W_{\text{nibs}} + W_{\text{cb}} + W_{\text{other}} + W_{\text{sugar}}$ |

---

## 5. バリデーション仕様

### 5.1 入力レンジエラー

N, P, M, B が絶対範囲を外れた場合、計算を行わず結果エリアをクリアしエラーメッセージを表示。

| パラメータ | JA タイトル | EN Title |
|-----------|------------|----------|
| N | ニブ重量が範囲外です | Nib Weight out of range |
| P | 目標カカオ分が範囲外です | Target Cacao % out of range |
| M | その他成分が範囲外です | Other Ingredients out of range |
| B | カカオバター比率が範囲外です | Cacao Butter in Other out of range |

### 5.2 計算ロジック上の致命的エラー

#### 1. ニブ由来カカオがゼロ以下（$P_{\text{nibs}} \le 0$）

| 言語 | タイトル | メッセージ |
|------|---------|----------|
| JA | カカオ分の設定に無理があります | ミルクパウダー（その他）とその中のカカオバター量が、目標のカカオ％を超えています。目標カカオ％を上げる、その他％を下げる、その他中のカカオバター％を下げる、のいずれかを調整してください。 |
| EN | Cacao % setting is not feasible | The cacao butter from "Other Ingredients" already exceeds or equals your Target Cacao %. Increase the Target Cacao %, decrease Other Ingredients %, or decrease the Cacao Butter ratio within "Other". |

#### 2. 砂糖 % がマイナス（$S < 0$）

| 言語 | タイトル | メッセージ |
|------|---------|----------|
| JA | 砂糖を入れる余地がありません | 現在の設定では、カカオ分とその他成分だけで100％を超えています。目標カカオ％を下げる、その他％を下げる、その他中のカカオバター％を下げることで、砂糖のスペースを作ることができます。 |
| EN | No room for sugar | Cacao content and Other Ingredients already exceed 100%. Decrease Target Cacao %, decrease Other Ingredients %, or lower the Cacao Butter ratio in "Other". |

---

## 6. 警告（Warning）仕様

計算は実行し結果も表示するが、Amber 色の警告カードとして表示。

| 条件 | JA メッセージ | EN メッセージ |
|------|-------------|-------------|
| ダーク（M=0）かつ P<60 または P>85 | ダークチョコとして一般的な範囲（60〜85％）から外れています。意図的な設計であれば問題ありません。 | Outside the typical dark chocolate range (60–85%). No issue if intentional. |
| ミルクあり（M>0）かつ P<40 または P>60 | ミルク入りレシピとして一般的なカカオ分（40〜60％）から外れています。口溶けや甘味バランスに注意してください。 | Outside the typical milk chocolate range (40–60%). Watch the mouthfeel and sweetness balance. |
| M > 25 | その他成分が25％を超えています。チョコレートらしさより"フィラー感"が強くなる可能性があります。 | Other Ingredients exceed 25%. The chocolate character may be diluted by fillers. |
| B > 60 | その他中のカカオバターが60％を超えています。脂肪分過多でテンパリングや口溶けに影響する可能性があります。 | Cacao butter in "Other" exceeds 60%. Excess fat may affect tempering and mouthfeel. |
| N < 500 | 非常に小さいバッチです。テストバッチとして扱われることが多く、製造条件の再現性に注意が必要です。 | Very small batch. Typically treated as a test batch; reproducibility may vary. |
| S < 5 | 砂糖が5％未満です。ほとんど甘味のない"超ビター"な配合になります。 | Sugar is below 5%. This produces an ultra-bitter formulation with almost no sweetness. |
| 5 ≤ S < 15 | 砂糖がかなり控えめです。カカオの個性を最重視する"マニア向け"レシピになります。 | Sugar is quite low. This creates a connoisseur-level recipe focused on cacao character. |
| S > 50 | 砂糖が50％を超えています。一般的なBean to Barから大きく外れた配合で、口溶けやテクスチャに注意が必要です。 | Sugar exceeds 50%. This departs significantly from typical Bean to Bar formulations. |

---

## 7. 結果画面 UI 構成

### 配合構成（Composition）セクション

- ドーナツチャートで視覚的に構成比率を表示
- チャート中央に **合計カカオ分 (Total Cacao %)** を大きなフォントで表示
- 凡例（Legend）に各成分の % を表示:
  - ニブ（from nibs）: $P_{\text{nibs}}$ %
  - カカオバター（Cacao Butter）: $C$ % （$C > 0$ のみ表示）
  - その他成分（Other Ingredients）: $M$ % （$M > 0$ のみ表示）
  - 砂糖（Sugar）: $S$ %
- 必要に応じて Amber 警告カードを表示

### 計量（Measurement）セクション

| 項目 | 表示 |
|------|------|
| ニブ（Nibs） | $W_{\text{nibs}}$ g |
| 砂糖（Sugar） | $W_{\text{sugar}}$ g |
| カカオバター（Cacao Butter） | $W_{\text{cb}}$ g（$C > 0$ のみ） |
| その他成分（Other Ingredients） | $W_{\text{other}}$ g（$M > 0$ のみ） |
| 総重量（Total Batch Weight） | $W_{\text{total}}$ g（強調表示） |

### 計算プロセス（Calculation Details）セクション

- 折りたたみトリガー:
  - JA：「計算プロセスを表示」
  - EN：「Show Calculation Details」
- 展開内容:
  - 使用した式（$k = N / P_{\text{nibs}}$ など）
  - 実際の数値を差し込んだ計算プロセス

---

## 8. トップ画面コピー

### 日本語

- **メインコピー:** チョコレートの数学。
- **サブコピー:** 豆由来成分と追加カカオバターの比率を、数式で完全にコントロール。

### English

- **Main Copy:** The Mathematics of Chocolate.
- **Sub Copy:** Master the balance between nibs and added cacao butter with clear formulas.

---

## 9. アプリ内「初回1行説明」

| 言語 | テキスト |
|------|---------|
| JA | ニブの重さと目標カカオ％から、理想の配合を一瞬で計算します。 |
| EN | Instantly compute ideal recipes from nib weight and target cacao %. |

---

## 10. 国際化（i18n）

- 対応言語: **日本語 (ja)** ／ **英語 (en)**
- デフォルト言語: 日本語
- 切り替え方法: ヘッダー右上の JA / EN トグルボタン
- 対象範囲: UI ラベル、入力説明、エラーメッセージ、警告メッセージ、計算プロセスラベル、トップ画面コピー

---

## 11. プラットフォーム対応

| 配信先 | 方式 |
|--------|------|
| Web ブラウザ | Next.js による静的エクスポート + PWA（Service Worker） |
| iOS App Store | Capacitor によるネイティブラッパー |

