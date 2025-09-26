-- =============================================
-- カテゴリタグ移行に伴うcategory_idカラムの削除
-- =============================================

-- 1. 外部キー制約の削除
ALTER TABLE stores DROP CONSTRAINT IF EXISTS fk_stores_category_id;

-- 2. インデックスの削除
DROP INDEX IF EXISTS idx_stores_category_id;

-- 3. category_idカラムの削除
ALTER TABLE stores DROP COLUMN IF EXISTS category_id;

-- 4. チェック制約の確認（必要に応じて調整）
-- category_idに関する制約は自動的に削除される

-- =============================================
-- 確認用クエリ
-- =============================================

-- storesテーブルの構造を確認
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'stores'
ORDER BY ordinal_position;

-- 外部キー制約の確認
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'stores';
