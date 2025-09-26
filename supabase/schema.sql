-- 一段読書-stores データベーススキーマ
-- Supabase PostgreSQL用の初期化スクリプト

-- =============================================
-- 1. テーブル作成
-- =============================================

-- カテゴリテーブル
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- エリアテーブル
CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  prefecture VARCHAR(50) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 書店テーブル
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  area_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  x_link VARCHAR(500),
  instagram_link VARCHAR(500),
  website_link VARCHAR(500),
  x_post_url VARCHAR(500),
  google_map_link VARCHAR(500),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. インデックス作成
-- =============================================

-- storesテーブルのインデックス
CREATE INDEX idx_stores_area_id ON stores(area_id);
CREATE INDEX idx_stores_category_id ON stores(category_id);
CREATE INDEX idx_stores_is_active ON stores(is_active);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_stores_created_at ON stores(created_at);

-- categoriesテーブルのインデックス
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- areasテーブルのインデックス
CREATE INDEX idx_areas_is_active ON areas(is_active);
CREATE INDEX idx_areas_sort_order ON areas(sort_order);

-- =============================================
-- 3. 外部キー制約
-- =============================================

-- storesテーブルの外部キー制約
ALTER TABLE stores 
ADD CONSTRAINT fk_stores_category_id 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

ALTER TABLE stores 
ADD CONSTRAINT fk_stores_area_id 
FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE RESTRICT;

-- =============================================
-- 4. チェック制約
-- =============================================

-- storesテーブルのチェック制約
ALTER TABLE stores 
ADD CONSTRAINT chk_stores_name_length 
CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 200);

ALTER TABLE stores 
ADD CONSTRAINT chk_stores_links_format 
CHECK (
  (x_link IS NULL OR x_link ~ '^https?://.*') AND
  (instagram_link IS NULL OR instagram_link ~ '^https?://.*') AND
  (website_link IS NULL OR website_link ~ '^https?://.*') AND
  (x_post_url IS NULL OR x_post_url ~ '^https?://.*')
);

-- categoriesテーブルのチェック制約
ALTER TABLE categories 
ADD CONSTRAINT chk_categories_name_length 
CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 50);

ALTER TABLE categories 
ADD CONSTRAINT chk_categories_display_name_length 
CHECK (LENGTH(display_name) >= 1 AND LENGTH(display_name) <= 100);

-- areasテーブルのチェック制約
ALTER TABLE areas 
ADD CONSTRAINT chk_areas_name_length 
CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 100);

ALTER TABLE areas 
ADD CONSTRAINT chk_areas_prefecture_length 
CHECK (LENGTH(prefecture) >= 1 AND LENGTH(prefecture) <= 50);

-- =============================================
-- 5. トリガー関数
-- =============================================

-- updated_at自動更新のトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- storesテーブルのupdated_atトリガー
CREATE TRIGGER update_stores_updated_at 
BEFORE UPDATE ON stores 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 6. Row Level Security (RLS)
-- =============================================

-- RLSを有効化
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;

-- storesテーブルのRLSポリシー（全ユーザーが読み取り可能）
CREATE POLICY "Enable read access for all users" ON stores
FOR SELECT USING (true);

-- categoriesテーブルのRLSポリシー（全ユーザーが読み取り可能）
CREATE POLICY "Enable read access for all users" ON categories
FOR SELECT USING (true);

-- areasテーブルのRLSポリシー（全ユーザーが読み取り可能）
CREATE POLICY "Enable read access for all users" ON areas
FOR SELECT USING (true);

-- =============================================
-- 7. 初期データ投入
-- =============================================

-- カテゴリの初期データ
INSERT INTO categories (name, display_name, description, sort_order) VALUES
('book_cafe', 'ブックカフェ', '本とコーヒーが楽しめる書店', 1),
('used_book', '古書店', '古本・古書を扱う書店', 2),
('children_book', '児童書専門', '子ども向けの本を専門に扱う書店', 3),
('general', '一般書店', '幅広いジャンルの本を扱う書店', 4),
('specialty', '専門書店', '特定の分野に特化した書店', 5);

-- エリアの初期データ
INSERT INTO areas (name, prefecture, sort_order) VALUES
('東京', '東京都', 1),
('大阪', '大阪府', 2),
('京都', '京都府', 3),
('横浜', '神奈川県', 4),
('名古屋', '愛知県', 5),
('福岡', '福岡県', 6),
('札幌', '北海道', 7),
('仙台', '宮城県', 8);

-- サンプル書店データ
INSERT INTO stores (name, area_id, category_id, description, website_link, google_map_link) VALUES
('サンプル書店1', 1, 1, '本とコーヒーが楽しめる書店です。', 'https://example.com', 'https://maps.google.com/?q=東京+書店'),
('サンプル書店2', 2, 2, '古本を中心に扱う書店です。', 'https://example.com', 'https://maps.google.com/?q=大阪+古書店'),
('サンプル書店3', 3, 3, '子ども向けの本を専門に扱います。', 'https://example.com', 'https://maps.google.com/?q=京都+児童書店');

-- =============================================
-- 8. 権限設定
-- =============================================

-- 匿名ユーザーに読み取り権限を付与
GRANT SELECT ON stores TO anon;
GRANT SELECT ON categories TO anon;
GRANT SELECT ON areas TO anon;

-- 認証済みユーザーに読み取り権限を付与
GRANT SELECT ON stores TO authenticated;
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON areas TO authenticated;

-- =============================================
-- 9. コメント追加
-- =============================================

COMMENT ON TABLE stores IS '書店情報を管理するテーブル';
COMMENT ON TABLE categories IS '書店カテゴリを管理するテーブル';
COMMENT ON TABLE areas IS 'エリア情報を管理するテーブル';

COMMENT ON COLUMN stores.name IS '書店名';
COMMENT ON COLUMN stores.area_id IS 'エリアID';
COMMENT ON COLUMN stores.category_id IS 'カテゴリID';
COMMENT ON COLUMN stores.x_link IS 'X（Twitter）のリンク';
COMMENT ON COLUMN stores.instagram_link IS 'Instagramのリンク';
COMMENT ON COLUMN stores.website_link IS '公式ウェブサイトのリンク';
COMMENT ON COLUMN stores.x_post_url IS 'XポストのURL';
COMMENT ON COLUMN stores.google_map_link IS 'Google Mapのリンク';
COMMENT ON COLUMN stores.description IS '書店の説明';
COMMENT ON COLUMN stores.is_active IS 'アクティブフラグ';
