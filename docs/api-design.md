# API設計書

## 1. 概要

ichidan-dokusho-storesのAPI設計書。Next.js API Routesを使用し、RESTful APIを提供する。

## 2. API仕様

### 2.1 基本情報
- **ベースURL**: `https://ichidan-dokusho-stores.vercel.app/api`
- **認証方式**: Bearer Token (JWT)
- **レスポンス形式**: JSON
- **文字エンコーディング**: UTF-8

### 2.2 共通レスポンス形式

#### 成功レスポンス
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}
```

#### エラーレスポンス
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## 3. 一般ユーザー向けAPI

### 3.1 書店一覧取得

#### エンドポイント
```
GET /api/stores
```

#### クエリパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|----|----|----|
| area | string | 任意 | エリア名 |
| category | string | 任意 | カテゴリ名 |
| page | number | 任意 | ページ番号（デフォルト: 1） |
| limit | number | 任意 | 1ページあたりの件数（デフォルト: 20） |
| search | string | 任意 | 書店名検索 |

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "サンプル書店",
        "area": "東京",
        "category": "book_cafe",
        "x_link": "https://twitter.com/sample_bookstore",
        "instagram_link": "https://instagram.com/sample_bookstore",
        "website_link": "https://sample-bookstore.com",
        "x_post_url": "https://twitter.com/sample_bookstore/status/1234567890",
        "description": "コーヒーと本を楽しめる書店です。"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### 3.2 書店詳細取得

#### エンドポイント
```
GET /api/stores/[id]
```

#### パスパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|----|----|----|
| id | string | 必須 | 書店ID |

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "store": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "サンプル書店",
      "area": "東京",
      "category": "book_cafe",
      "x_link": "https://twitter.com/sample_bookstore",
      "instagram_link": "https://instagram.com/sample_bookstore",
      "website_link": "https://sample-bookstore.com",
      "x_post_url": "https://twitter.com/sample_bookstore/status/1234567890",
      "description": "コーヒーと本を楽しめる書店です。",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 3.3 エリア一覧取得

#### エンドポイント
```
GET /api/areas
```

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "areas": [
      {
        "id": 1,
        "name": "東京",
        "prefecture": "東京都",
        "region": "関東"
      },
      {
        "id": 2,
        "name": "大阪",
        "prefecture": "大阪府",
        "region": "関西"
      }
    ]
  }
}
```

### 3.4 カテゴリ一覧取得

#### エンドポイント
```
GET /api/categories
```

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "book_cafe",
        "display_name": "ブックカフェ",
        "description": "コーヒーと本を楽しめる書店"
      },
      {
        "id": 2,
        "name": "used_book",
        "display_name": "古書",
        "description": "古本・古書を扱う書店"
      }
    ]
  }
}
```

## 4. 管理者向けAPI

### 4.1 管理者認証

#### ログイン
```
POST /api/admin/auth/login
```

#### リクエストボディ
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "admin@example.com",
      "name": "管理者",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4.2 書店管理

#### 書店登録
```
POST /api/admin/stores
```

#### リクエストボディ
```json
{
  "name": "新しい書店",
  "area": "東京",
  "category": "book_cafe",
  "x_link": "https://twitter.com/new_bookstore",
  "instagram_link": "https://instagram.com/new_bookstore",
  "website_link": "https://new-bookstore.com",
  "x_post_url": "https://twitter.com/new_bookstore/status/1234567890",
  "description": "新しい書店の説明"
}
```

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "store": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "新しい書店",
      "area": "東京",
      "category": "book_cafe",
      "x_link": "https://twitter.com/new_bookstore",
      "instagram_link": "https://instagram.com/new_bookstore",
      "website_link": "https://new-bookstore.com",
      "x_post_url": "https://twitter.com/new_bookstore/status/1234567890",
      "description": "新しい書店の説明",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "message": "書店が正常に登録されました"
}
```

#### 書店更新
```
PUT /api/admin/stores/[id]
```

#### 書店削除
```
DELETE /api/admin/stores/[id]
```

#### 管理者用書店一覧
```
GET /api/admin/stores
```

#### クエリパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|----|----|----|
| area | string | 任意 | エリア名 |
| category | string | 任意 | カテゴリ名 |
| is_active | boolean | 任意 | 公開状態 |
| page | number | 任意 | ページ番号 |
| limit | number | 任意 | 1ページあたりの件数 |
| search | string | 任意 | 書店名検索 |

## 5. エラーハンドリング

### 5.1 HTTPステータスコード

| コード | 説明 |
|-------|----|
| 200 | 成功 |
| 201 | 作成成功 |
| 400 | リクエストエラー |
| 401 | 認証エラー |
| 403 | 権限エラー |
| 404 | リソースが見つからない |
| 422 | バリデーションエラー |
| 500 | サーバーエラー |

### 5.2 エラーコード一覧

| コード | 説明 |
|-------|----|
| VALIDATION_ERROR | バリデーションエラー |
| STORE_NOT_FOUND | 書店が見つからない |
| UNAUTHORIZED | 認証が必要 |
| FORBIDDEN | 権限が不足 |
| DUPLICATE_ENTRY | 重複エラー |
| INTERNAL_ERROR | 内部サーバーエラー |

### 5.3 エラーレスポンス例

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "バリデーションエラーが発生しました",
    "details": {
      "name": ["書店名は必須です"],
      "area": ["エリアは必須です"]
    }
  }
}
```

## 6. レート制限

### 6.1 制限値
- **一般API**: 100リクエスト/分
- **管理者API**: 200リクエスト/分
- **認証API**: 10リクエスト/分

### 6.2 レート制限ヘッダー
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 7. 認証・認可

### 7.1 JWT Token
```typescript
interface JWTPayload {
  sub: string; // ユーザーID
  email: string;
  role: string;
  iat: number;
  exp: number;
}
```

### 7.2 認証ヘッダー
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 8. バリデーション

### 8.1 書店データバリデーション

```typescript
interface StoreValidation {
  name: {
    required: true;
    minLength: 1;
    maxLength: 255;
  };
  area: {
    required: true;
    maxLength: 100;
  };
  category: {
    required: true;
    enum: ['book_cafe', 'used_book', 'children_book', 'general', 'specialty'];
  };
  x_link: {
    required: false;
    format: 'url';
    maxLength: 500;
  };
  instagram_link: {
    required: false;
    format: 'url';
    maxLength: 500;
  };
  website_link: {
    required: false;
    format: 'url';
    maxLength: 500;
  };
  x_post_url: {
    required: false;
    format: 'url';
    maxLength: 500;
  };
  description: {
    required: false;
    maxLength: 1000;
  };
}
```
