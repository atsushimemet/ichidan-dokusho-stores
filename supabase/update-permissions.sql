-- 既存のデータベースに権限とRLSポリシーを追加するスクリプト
-- 既存のテーブルに対してのみ実行

-- =============================================
-- 1. RLSポリシーの追加
-- =============================================

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Enable update for authenticated users" ON areas;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON areas;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON areas;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON categories;

-- 新しいRLSポリシーを作成
CREATE POLICY "Enable update for authenticated users" ON areas
FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON areas
FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON areas
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON categories
FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON categories
FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users" ON categories
FOR INSERT WITH CHECK (true);

-- storesテーブルのRLSポリシー
CREATE POLICY "Enable insert for authenticated users" ON stores
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON stores
FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON stores
FOR DELETE USING (true);

-- =============================================
-- 2. 権限の追加
-- =============================================

-- 認証済みユーザーに更新・削除権限を付与
GRANT UPDATE ON areas TO authenticated;
GRANT DELETE ON areas TO authenticated;
GRANT INSERT ON areas TO authenticated;
GRANT UPDATE ON categories TO authenticated;
GRANT DELETE ON categories TO authenticated;
GRANT INSERT ON categories TO authenticated;
GRANT INSERT ON stores TO authenticated;
GRANT UPDATE ON stores TO authenticated;
GRANT DELETE ON stores TO authenticated;

-- =============================================
-- 3. 確認用クエリ
-- =============================================

-- テーブルの権限を確認
SELECT 
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_name IN ('areas', 'categories', 'stores')
AND grantee = 'authenticated'
ORDER BY table_name, privilege_type;

-- RLSポリシーを確認
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('areas', 'categories', 'stores')
ORDER BY tablename, policyname;
