# ichidan-dokusho-stores システム設計書

## 1. システム概要

### 1.1 プロジェクト概要
独立系書店の情報を提供するWebアプリケーション。書店の基本情報、SNSリンク、Xポストの埋め込み表示を通じて、ユーザーが書店を発見・訪問することを支援する。

### 1.2 技術スタック
- **フロントエンド**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS v3
- **バックエンド**: Next.js API Routes
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **デプロイ**: Vercel
- **外部API**: X (Twitter) API (埋め込み表示)

## 2. システムアーキテクチャ

### 2.1 全体構成図
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ユーザー      │    │   管理者        │    │   外部API       │
│   (一般利用者)  │    │   (書店登録者)  │    │   (X API)       │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │                      │                      │
┌─────────▼───────┐    ┌─────────▼───────┐    ┌─────────▼───────┐
│   Next.js App   │    │   Next.js App   │    │   X Embed API    │
│   (フロント)    │    │   (管理画面)    │    │   (埋め込み)     │
└─────────┬───────┘    └─────────┬───────┘    └─────────────────┘
          │                      │
          │                      │
┌─────────▼───────┐    ┌─────────▼───────┐
│   Next.js API   │    │   Supabase      │
│   (バックエンド)│    │   (データベース) │
└─────────────────┘    └─────────────────┘
```

### 2.2 ディレクトリ構造
```
ichidan-dokusho-stores/
├── app/                          # Next.js App Router
│   ├── (public)/                 # 一般ユーザー向けページ
│   │   ├── page.tsx              # トップページ
│   │   ├── stores/               # 書店一覧・詳細ページ
│   │   └── layout.tsx
│   ├── (admin)/                  # 管理者向けページ
│   │   ├── login/                # 管理者ログイン
│   │   ├── dashboard/            # 管理ダッシュボード
│   │   └── layout.tsx
│   ├── api/                      # API Routes
│   │   ├── stores/               # 書店関連API
│   │   └── auth/                 # 認証API
│   └── layout.tsx                # ルートレイアウト
├── components/                   # 再利用可能コンポーネント
│   ├── ui/                       # 基本UIコンポーネント
│   ├── store/                    # 書店関連コンポーネント
│   └── admin/                    # 管理画面コンポーネント
├── lib/                          # ユーティリティ・設定
│   ├── supabase.ts              # Supabase設定
│   ├── utils.ts                 # 共通ユーティリティ
│   └── types.ts                 # TypeScript型定義
├── styles/                       # スタイルファイル
└── docs/                        # 設計書・ドキュメント
```

## 3. データベース設計

### 3.1 テーブル構成

#### stores テーブル
```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  area VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  x_link VARCHAR(500),
  instagram_link VARCHAR(500),
  website_link VARCHAR(500),
  x_post_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### categories テーブル（マスタ）
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 初期データ
INSERT INTO categories (name, display_name) VALUES
('book_cafe', 'ブックカフェ'),
('used_book', '古書'),
('children_book', '児童書'),
('general', '一般書店');
```

#### areas テーブル（マスタ）
```sql
CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  prefecture VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 リレーション
- stores.category → categories.name
- stores.area → areas.name

## 4. API設計

### 4.1 エンドポイント一覧

#### 一般ユーザー向けAPI
```
GET /api/stores
  - 書店一覧取得
  - クエリパラメータ: area, category, page, limit

GET /api/stores/[id]
  - 書店詳細取得

GET /api/areas
  - エリア一覧取得

GET /api/categories
  - カテゴリ一覧取得
```

#### 管理者向けAPI
```
POST /api/admin/stores
  - 書店登録

PUT /api/admin/stores/[id]
  - 書店情報更新

DELETE /api/admin/stores/[id]
  - 書店削除

GET /api/admin/stores
  - 管理者用書店一覧（検索・フィルタ機能付き）
```

### 4.2 レスポンス形式
```typescript
// 書店一覧レスポンス
interface StoresResponse {
  stores: Store[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 書店詳細レスポンス
interface StoreDetailResponse {
  store: Store;
}
```

## 5. フロントエンド設計

### 5.1 ページ構成

#### 一般ユーザー向けページ
1. **トップページ** (`/`)
   - メッセージ表示
   - エリア・カテゴリ選択フォーム
   - 検索ボタン

2. **書店一覧ページ** (`/stores`)
   - 検索条件表示
   - 書店カード一覧
   - ページネーション

3. **書店詳細ページ** (`/stores/[id]`)
   - 書店基本情報
   - SNSリンク
   - Xポスト埋め込み

#### 管理者向けページ
1. **ログインページ** (`/admin/login`)
2. **ダッシュボード** (`/admin/dashboard`)
3. **書店登録** (`/admin/stores/new`)
4. **書店編集** (`/admin/stores/[id]/edit`)

### 5.2 コンポーネント設計

#### 共通コンポーネント
- `Header`: ナビゲーションヘッダー
- `Footer`: フッター
- `SearchForm`: 検索フォーム
- `Pagination`: ページネーション

#### 書店関連コンポーネント
- `StoreCard`: 書店カード
- `StoreDetail`: 書店詳細表示
- `StoreForm`: 書店登録・編集フォーム
- `XPostEmbed`: Xポスト埋め込み

## 6. 認証・セキュリティ設計

### 6.1 認証方式
- **一般ユーザー**: 認証不要
- **管理者**: Supabase Auth (Email/Password)

### 6.2 セキュリティ対策
- CSRF対策
- XSS対策
- SQLインジェクション対策
- レート制限（API）

## 7. パフォーマンス設計

### 7.1 最適化戦略
- **画像最適化**: Next.js Image コンポーネント
- **キャッシュ**: Vercel Edge Cache
- **データベース**: インデックス設定
- **API**: レスポンスキャッシュ

### 7.2 監視・ログ
- Vercel Analytics
- Supabase Dashboard
- エラーログ収集

## 8. デプロイメント設計

### 8.1 環境構成
- **本番環境**: Vercel
- **データベース**: Supabase (本番)
- **ドメイン**: カスタムドメイン設定
