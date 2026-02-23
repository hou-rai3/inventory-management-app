# 物品管理ダッシュボード

本番URL: https://inventory-management-app-rd89.vercel.app/

## 1. 問題提起（なぜ作ったか）

ロボット開発・制作チームでは、次の課題が起きやすくなります。

- 誰が見ても「今なにが何個あるか」が分からない
- 閾値を下回ってから気づくため、調達が後手に回る
- 保管場所・単価・購入先が散在していて、補充判断に時間がかかる
- 管理情報が属人化し、担当者が不在だと運用が止まる

このアプリは、在庫情報を可視化し、補充判断を早めることを目的とした **在庫ダッシュボード** です。

## 2. 何を解決したか（提供価値）

- 在庫数と閾値を1画面で確認できる
- 閾値未満のアイテムを自動ハイライトして、補充対象を即時把握できる
- 保管場所・単価・購入URLをカード内で統合表示できる
- 管理画面から投稿/カテゴリを編集できる（ローカル運用向け）

## 3. 就活で伝えられるポイント

このリポジトリは、次の観点を実例付きで説明できます。

### 3-1. フロントエンド実装力

- App Router 構成で画面責務を分割
- 在庫カード、統計表示、アンカー遷移などのUI設計
- `useMemo` / `useEffect` を使った状態同期（`localStorage` 連携）

### 3-2. バックエンド/データ設計の基礎

- API Route (`src/app/api/**/route.ts`) で CRUD を実装
- `src/lib/storage.ts` にデータアクセス責務を集約
- バリデーションとエラーハンドリング（不正ID・必須項目チェック）

### 3-3. 運用と制約の理解

- Vercel の読み取り専用ファイルシステム制約を把握
- 「閲覧専用運用」か「データストア移行」かの選択肢を提示
- セキュリティ対応として Next.js 脆弱性アップデートを実施

### 3-4. 面接での話し方（例）

- 課題: 在庫管理が属人化し、欠品検知が遅い
- 施策: 閾値ハイライト付きダッシュボードと管理APIを実装
- 結果: 状況把握・補充判断までの時間を短縮できる運用基盤を構築
- 学び: デプロイ先制約（Vercel）を前提に設計を見直す重要性

## 4. 技術スタック

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- UI/CSS: Tailwind CSS v4 + カスタムスタイル
- Data: JSONファイル + `localStorage`（在庫表示用）
- Lint/Build: ESLint, Turbopack

## 5. アプリ構成（詳細）

### 5-1. ルート構成

| ルート | 役割 |
|---|---|
| `/` | 在庫ダッシュボード本体 |
| `/#inventory` | 在庫カード一覧セクション |
| `/#policy` | 補充ルールセクション |
| `/#contact` | 連絡先セクション |
| `/items/new` | 在庫アイテム追加画面 |
| `/items/[id]/edit` | 在庫アイテム編集画面 |
| `/admin/posts` | 投稿一覧（管理） |
| `/admin/posts/new` | 投稿作成（管理） |
| `/admin/posts/[id]` | 投稿編集（管理） |
| `/admin/categories` | カテゴリ一覧（管理） |
| `/admin/categories/new` | カテゴリ作成（管理） |
| `/admin/categories/[id]` | カテゴリ編集（管理） |
| `/posts/[id]` | 投稿詳細 |
| `/blog` | 旧URLエイリアス |
| `/blog/[slug]` | 旧URLから新URLへの橋渡し |

### 5-2. API エンドポイント

| エンドポイント | メソッド | 役割 |
|---|---|---|
| `/api/posts` | GET | 投稿一覧取得 |
| `/api/posts/[id]` | GET | 投稿詳細取得 |
| `/api/categories` | GET | カテゴリ一覧取得 |
| `/api/admin/posts` | GET/POST | 投稿管理（一覧・追加） |
| `/api/admin/posts/[id]` | PUT/DELETE | 投稿管理（更新・削除） |
| `/api/admin/categories` | GET/POST | カテゴリ管理（一覧・追加） |
| `/api/admin/categories/[id]` | PUT/DELETE | カテゴリ管理（更新・削除） |

### 5-3. ディレクトリ詳細

```
inventory-management-app/
├─ data/
│  ├─ inventory.json                # 在庫ダッシュボードの初期データ
│  └─ store.json                    # 投稿/カテゴリの保存データ
├─ public/
│  ├─ images/
│  │  ├─ inventory/                 # 在庫アイテム画像
│  │  └─ marbling-title.png         # 見出し画像
│  └─ *.svg                         # Next.js テンプレート由来アイコン
├─ src/
│  ├─ app/
│  │  ├─ about/page.tsx             # アバウトページ
│  │  ├─ admin/
│  │  │  ├─ posts/                  # 投稿管理画面群（一覧/新規/編集）
│  │  │  └─ categories/             # カテゴリ管理画面群（一覧/新規/編集）
│  │  ├─ api/                       # Route Handler (BFF層)
│  │  │  ├─ posts/route.ts
│  │  │  ├─ posts/[id]/route.ts
│  │  │  ├─ categories/route.ts
│  │  │  └─ admin/**/route.ts
│  │  ├─ blog/
│  │  │  ├─ page.tsx                # 旧 /blog 一覧
│  │  │  └─ [slug]/page.tsx         # 旧URL互換
│  │  ├─ components/
│  │  │  ├─ InventoryBoard.tsx      # 在庫UIの主要コンポーネント
│  │  │  └─ RobotBuddy.tsx          # 補助UIコンポーネント
│  │  ├─ items/
│  │  │  ├─ new/page.tsx            # 在庫アイテム追加
│  │  │  └─ [id]/edit/page.tsx      # 在庫アイテム編集
│  │  ├─ posts/[id]/page.tsx        # 投稿詳細ページ
│  │  ├─ globals.css                # 全体スタイル
│  │  ├─ layout.tsx                 # 共通レイアウト
│  │  └─ page.tsx                   # ホーム（在庫ボード起点）
│  └─ lib/
│     ├─ base-url.ts                # SSR fetch 時のベースURL解決
│     ├─ inventory-client.ts        # localStorage I/O
│     ├─ inventory-types.ts         # 在庫型定義
│     ├─ posts.ts                   # サンプル投稿定義（実運用外の補助）
│     ├─ storage.ts                 # 投稿/カテゴリのファイル永続化ロジック
│     └─ types.ts                   # 投稿/カテゴリ型定義
├─ package.json                     # スクリプト・依存関係
├─ next.config.ts                   # Next.js 設定
├─ tsconfig.json                    # TypeScript 設定
└─ eslint.config.mjs                # ESLint 設定
```

### 5-4. データフロー

1. `src/app/page.tsx` が `data/inventory.json` を初期値として読み込む
2. `InventoryBoard.tsx` がクライアントで `localStorage` を優先読み込み
3. 編集操作後は `localStorage` に保存して再表示時に復元
4. 投稿/カテゴリは API 経由で `storage.ts` を呼び、`data/store.json` を更新

## 6. 開発環境セットアップ

### クイックスタート

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### 開発用コマンド

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバ起動（Turbopack） |
| `npm run build` | 本番ビルド生成 |
| `npm start` | ビルド済みアプリ起動 |
| `npm run lint` | 静的解析 |

## 7. デプロイと運用上の注意

### 7-1. Vercel デプロイ

- このアプリは Vercel へ通常手順でデプロイ可能
- 環境変数は原則不要（現実装で必須キーなし）

### 7-2. 重要な制約（必読）

- `storage.ts` は `data/store.json` へ書き込む実装
- Vercel は実行環境のファイル書き込みが永続化されないため、`/admin` での追加・更新・削除は本番で保持されない

### 7-3. 運用方針

- **方針A（推奨）**: 閲覧専用として運用し、データ更新はGit管理で行う
- **方針B**: Vercel KV / Supabase などへ移行し、管理画面を本番運用可能にする

## 8. トラブルシューティング

### ポート競合

```bash
npm run dev -- --port 3001
```

### 変更が反映されない

- 開発サーバを再起動
- ブラウザをハードリロード（Ctrl+Shift+R）

### ビルド失敗

- `npm run lint`
- `npm run build`

をローカルで通してから再デプロイする。

## 9. 今後の改善案（就活で語りやすい）

- `storage.ts` の永続化先を DB に切り替え（Vercel運用対応）
- 認証・認可を導入し、`/admin` を保護
- 在庫操作の監査ログ（誰がいつ何を更新したか）
- テスト（API / UI / E2E）の整備
- CI で `lint/build` を自動化

---

**最終更新**: 2026-02-23

