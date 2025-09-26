-- カテゴリタグ機能の追加
-- 書店とカテゴリタグの多対多関係を実装

-- =============================================
-- 1. カテゴリタグテーブル作成
-- =============================================

-- カテゴリタグテーブル
CREATE TABLE category_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 書店とカテゴリタグの中間テーブル
CREATE TABLE store_category_tags (
  id SERIAL PRIMARY KEY,
  store_id UUID NOT NULL,
  category_tag_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, category_tag_id)
);

-- =============================================
-- 2. インデックス作成
-- =============================================

-- カテゴリタグテーブルのインデックス
CREATE INDEX idx_category_tags_name ON category_tags(name);
CREATE INDEX idx_category_tags_is_active ON category_tags(is_active);

-- 中間テーブルのインデックス
CREATE INDEX idx_store_category_tags_store_id ON store_category_tags(store_id);
CREATE INDEX idx_store_category_tags_category_tag_id ON store_category_tags(category_tag_id);

-- =============================================
-- 3. 外部キー制約
-- =============================================

-- 中間テーブルの外部キー制約
ALTER TABLE store_category_tags 
ADD CONSTRAINT fk_store_category_tags_store_id 
FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;

ALTER TABLE store_category_tags 
ADD CONSTRAINT fk_store_category_tags_category_tag_id 
FOREIGN KEY (category_tag_id) REFERENCES category_tags(id) ON DELETE CASCADE;

-- =============================================
-- 4. RLSポリシー
-- =============================================

-- カテゴリタグテーブルのRLSを有効化
ALTER TABLE category_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_category_tags ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーに読み取り権限を付与
CREATE POLICY "Enable read access for all users" ON category_tags
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON store_category_tags
FOR SELECT USING (true);

-- 認証済みユーザーに操作権限を付与
CREATE POLICY "Enable insert for authenticated users" ON category_tags
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON category_tags
FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON category_tags
FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON store_category_tags
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON store_category_tags
FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON store_category_tags
FOR DELETE USING (true);

-- =============================================
-- 5. 権限設定
-- =============================================

-- 匿名ユーザーに読み取り権限を付与
GRANT SELECT ON category_tags TO anon;
GRANT SELECT ON store_category_tags TO anon;

-- 認証済みユーザーに操作権限を付与
GRANT INSERT ON category_tags TO authenticated;
GRANT UPDATE ON category_tags TO authenticated;
GRANT DELETE ON category_tags TO authenticated;
GRANT INSERT ON store_category_tags TO authenticated;
GRANT UPDATE ON store_category_tags TO authenticated;
GRANT DELETE ON store_category_tags TO authenticated;

-- =============================================
-- 6. 初期データ
-- =============================================

-- カテゴリタグの初期データ
INSERT INTO category_tags (name, display_name) VALUES
('coffee', 'コーヒー'),
('wine', 'ワイン'),
('art', 'アート'),
('music', '音楽'),
('vintage', 'ヴィンテージ'),
('kids', 'キッズ'),
('manga', '漫画'),
('foreign', '洋書'),
('local', '地域密着'),
('event', 'イベント開催');

-- =============================================
-- 7. コメント
-- =============================================

COMMENT ON TABLE category_tags IS 'カテゴリタグテーブル';
COMMENT ON TABLE store_category_tags IS '書店とカテゴリタグの中間テーブル';
COMMENT ON COLUMN category_tags.name IS 'カテゴリタグの識別子';
COMMENT ON COLUMN category_tags.display_name IS 'カテゴリタグの表示名';
COMMENT ON COLUMN store_category_tags.store_id IS '書店ID';
COMMENT ON COLUMN store_category_tags.category_tag_id IS 'カテゴリタグID';
