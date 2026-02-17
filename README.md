# 物品管理ダッシュボード

在庫数・保管場所・購入URLを誰でも確認できる、Next.js 製の物品管理アプリです。
閾値を下回ったアイテムは自動でハイライトされ、補充判断を即座に行えます。

## 特徴

- 📊 在庫数と閾値を一覧表示
- 🚨 閾値以下を自動で強調表示
- 🧭 保管場所と購入URLをカード内で確認
- 🧾 管理向けの投稿/カテゴリ管理（/admin）
- 🎨 タイポと配色にこだわったダッシュボード UI

## クイックスタート

### インストール

```bash
npm install
```

### 開発サーバの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、在庫ボードが表示されます。

## 開発用コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバを起動（Turbopack） |
| `npm run build` | 本番用にビルド生成 |
| `npm start` | ビルド済みアプリを起動 |
| `npm run lint` | ESLint を実行 |

## データの編集

- 在庫データは `data/inventory.json` を編集します。
- 画像は `public/images/inventory/` に配置します。
- 管理画面の投稿/カテゴリは `data/store.json` を保存先にしています。

## 主要ルート

- `/` 在庫ダッシュボード
- `/#inventory` 在庫一覧セクション
- `/#policy` 補充ルール
- `/#contact` 連絡先
- `/admin/posts` 投稿管理
- `/admin/categories` カテゴリ管理
- `/posts/[id]` 投稿の詳細
- `/blog` 旧ブログパス（/posts へのエイリアス）

## プロジェクト構成

```
src/
├── app/
│   ├── api/                    # API エンドポイント
│   ├── admin/                  # 管理画面
│   ├── blog/                   # 旧ブログパス（エイリアス）
│   ├── posts/                  # 投稿詳細
│   ├── components/             # UI コンポーネント
│   ├── layout.tsx              # ルートレイアウト
│   ├── page.tsx                # 在庫ボード
│   └── globals.css             # グローバルスタイル
├── lib/
│   ├── base-url.ts             # サーバーサイド fetch 用のURL解決
│   ├── storage.ts              # ファイルベースのデータ処理
│   └── types.ts                # 型定義
data/
├── inventory.json              # 在庫データ
└── store.json                  # 投稿/カテゴリデータ
```

## テクノロジースタック

- **フレームワーク**: Next.js 15
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4 + カスタム CSS
- **データ**: JSON ファイルベース
- **ルーター**: App Router

## デプロイ

Vercel へそのままデプロイ可能です。
詳細は [Next.js デプロイドキュメント](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。

## トラブルシューティング

### ポート競合エラー
```bash
npm run dev -- --port 3001
```

### 変更が反映されない
- 開発サーバを停止して再起動
- ブラウザのハードリロード（Ctrl+Shift+R）

---

**最終更新**: 2026-02-17

