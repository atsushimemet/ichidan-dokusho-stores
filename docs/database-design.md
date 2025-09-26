# データベース設計書

## 1. 概要

一段読書-storesのデータベース設計書。Supabase（PostgreSQL）を使用し、独立系書店の情報管理を行う。

## 2. データベース構成

### 2.1 使用技術
- **データベース**: PostgreSQL (Supabase)
- **ORM**: Supabase Client
- **認証**: Supabase Auth
- **リアルタイム**: Supabase Realtime

## 3. テーブル設計

### 3.1 stores テーブル（書店情報）

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
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### カラム詳細
| カラム名 | 型 | 制約 | 説明 |
|---------|----|----|----|
| id | UUID | PRIMARY KEY | 書店の一意識別子 |
| name | VARCHAR(255) | NOT NULL | 書店名 |
| area | VARCHAR(100) | NOT NULL | エリア名 |
| category | VARCHAR(50) | NOT NULL | カテゴリ名 |
| x_link | VARCHAR(500) | NULL | X（Twitter）のリンク |
| instagram_link | VARCHAR(500) | NULL | Instagramのリンク |
| website_link | VARCHAR(500) | NULL | 公式HPのリンク |
| x_post_url | VARCHAR(500) | NULL | 紹介用XポストのURL |
| description | TEXT | NULL | 書店の説明文 |
| is_active | BOOLEAN | DEFAULT true | 公開状態 |
| created_at | TIMESTAMP | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新日時 |

### 3.2 categories テーブル（カテゴリマスタ）

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 初期データ
```sql
INSERT INTO categories (name, display_name, description, sort_order) VALUES
('book_cafe', 'ブックカフェ', 'コーヒーと本を楽しめる書店', 1),
('used_book', '古書', '古本・古書を扱う書店', 2),
('children_book', '児童書', '子ども向け書籍を専門とする書店', 3),
('general', '一般書店', '一般的な書籍を扱う書店', 4),
('specialty', '専門書店', '特定分野に特化した書店', 5);
```

### 3.3 areas テーブル（エリアマスタ）

```sql
CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  prefecture VARCHAR(50) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 初期データ（主要都市）
```sql
INSERT INTO areas (name, prefecture, sort_order) VALUES
('東京', '東京都', 1),
('大阪', '大阪府', 2),
('京都', '京都府', 3),
('横浜', '神奈川県', 4),
('名古屋', '愛知県', 5),
('福岡', '福岡県', 6),
('札幌', '北海道', 7),
('仙台', '宮城県', 8);
```

### 3.4 admin_users テーブル（管理者）

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```


## 4. インデックス設計

### 4.1 パフォーマンス向上のためのインデックス

```sql
-- stores テーブルのインデックス
CREATE INDEX idx_stores_area ON stores(area);
CREATE INDEX idx_stores_category ON stores(category);
CREATE INDEX idx_stores_is_active ON stores(is_active);
CREATE INDEX idx_stores_created_at ON stores(created_at);

-- 複合インデックス
CREATE INDEX idx_stores_area_category ON stores(area, category);
CREATE INDEX idx_stores_area_category_active ON stores(area, category, is_active);

```

## 5. 制約・ルール

### 5.1 外部キー制約

```sql
-- stores テーブル
ALTER TABLE stores 
ADD CONSTRAINT fk_stores_category 
FOREIGN KEY (category) REFERENCES categories(name);

ALTER TABLE stores 
ADD CONSTRAINT fk_stores_area 
FOREIGN KEY (area) REFERENCES areas(name);

```

### 5.2 チェック制約

```sql
-- stores テーブル
ALTER TABLE stores 
ADD CONSTRAINT chk_stores_name_length 
CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 255);

ALTER TABLE stores 
ADD CONSTRAINT chk_stores_urls 
CHECK (
  (x_link IS NULL OR x_link ~ '^https?://.*') AND
  (instagram_link IS NULL OR instagram_link ~ '^https?://.*') AND
  (website_link IS NULL OR website_link ~ '^https?://.*') AND
  (x_post_url IS NULL OR x_post_url ~ '^https?://.*')
);
```

## 6. トリガー

### 6.1 更新日時自動更新

```sql
-- stores テーブルの updated_at 自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stores_updated_at 
BEFORE UPDATE ON stores 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- admin_users テーブルの updated_at 自動更新
CREATE TRIGGER update_admin_users_updated_at 
BEFORE UPDATE ON admin_users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 7. Row Level Security (RLS)

### 7.1 セキュリティポリシー

```sql
-- stores テーブル（一般ユーザーは公開データのみ閲覧可能）
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- 一般ユーザーは公開中の書店のみ閲覧可能
CREATE POLICY "Public stores are viewable by everyone" 
ON stores FOR SELECT 
USING (is_active = true);

-- 管理者は全データにアクセス可能
CREATE POLICY "Admins can manage all stores" 
ON stores FOR ALL 
USING (auth.role() = 'authenticated');

```

## 8. データ移行・初期化

### 8.1 初期データ投入スクリプト

```sql
-- カテゴリデータ
INSERT INTO categories (name, display_name, description, sort_order) VALUES
('book_cafe', 'ブックカフェ', 'コーヒーと本を楽しめる書店', 1),
('used_book', '古書', '古本・古書を扱う書店', 2),
('children_book', '児童書', '子ども向け書籍を専門とする書店', 3),
('general', '一般書店', '一般的な書籍を扱う書店', 4),
('specialty', '専門書店', '特定分野に特化した書店', 5);

-- エリアデータ
INSERT INTO areas (name, prefecture, sort_order) VALUES
('東京', '東京都', 1),
('大阪', '大阪府', 2),
('京都', '京都府', 3),
('横浜', '神奈川県', 4),
('名古屋', '愛知県', 5),
('福岡', '福岡県', 6),
('札幌', '北海道', 7),
('仙台', '宮城県', 8);
```
