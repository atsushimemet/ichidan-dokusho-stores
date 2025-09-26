# ichidan-dokusho-stores 設計書

## 概要

独立系書店の情報を提供するWebアプリケーション「ichidan-dokusho-stores」のプロトタイプ実装のための設計書集です。

## 設計書一覧

### 1. [システムアーキテクチャ設計書](./architecture-design.md)
- システム全体の構成
- 技術スタック
- ディレクトリ構造
- セキュリティ設計
- パフォーマンス設計

### 2. [データベース設計書](./database-design.md)
- テーブル設計
- インデックス設計
- 制約・ルール
- セキュリティポリシー
- バックアップ戦略

### 3. [API設計書](./api-design.md)
- RESTful API仕様
- エンドポイント一覧
- リクエスト・レスポンス形式
- エラーハンドリング
- 認証・認可

### 4. [フロントエンド設計書](./frontend-design.md)
- ページ設計
- コンポーネント設計
- 状態管理
- スタイリング
- アクセシビリティ

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v3
- **状態管理**: React Context API + useReducer
- **データフェッチ**: SWR
- **UIコンポーネント**: Radix UI

### バックエンド
- **フレームワーク**: Next.js API Routes
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **ストレージ**: Supabase Storage

### インフラ
- **ホスティング**: Vercel
- **CDN**: Vercel Edge Network
- **ドメイン**: カスタムドメイン
- **監視**: Vercel Analytics

## 主要機能

### 一般ユーザー向け機能
1. **トップページ**: エリア・カテゴリ選択
2. **書店一覧**: 検索・フィルタ機能
3. **書店詳細**: 基本情報・SNSリンク・Xポスト埋め込み

### 管理者向け機能
1. **ログイン**: 管理者認証
2. **書店登録**: 新規書店情報登録
3. **書店管理**: 一覧・編集・削除

## 開発・デプロイメント

### 開発環境セットアップ
```bash
# リポジトリクローン
git clone https://github.com/your-org/ichidan-dokusho-stores.git
cd ichidan-dokusho-stores

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local

# 開発サーバー起動
npm run dev
```
