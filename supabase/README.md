# Supabase セットアップ手順

## 1. Supabaseプロジェクトの作成

### 1.1 新規プロジェクト作成
1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. 「New Project」をクリック
3. プロジェクト情報を入力：
   - **Name**: `一段読書-stores`
   - **Database Password**: 強力なパスワードを設定
   - **Region**: `Asia Northeast (Tokyo)` を選択
4. 「Create new project」をクリック

### 1.2 プロジェクト設定の確認
- プロジェクトが作成されるまで数分待機
- プロジェクトダッシュボードで以下を確認：
  - Project URL
  - API Keys (anon public, service_role)

## 2. 環境変数の設定

### 2.1 ローカル環境変数ファイルの作成
```bash
cp env.example .env.local
```

### 2.2 環境変数の設定
`.env.local` ファイルに以下を設定：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 管理者認証
ADMIN_PASSWORD=admin123
```

**取得方法：**
1. Supabase Dashboard → Settings → API
2. Project URL を `NEXT_PUBLIC_SUPABASE_URL` に設定
3. anon public key を `NEXT_PUBLIC_SUPABASE_ANON_KEY` に設定

## 3. データベーススキーマの作成

### 3.1 新規プロジェクトの場合
1. Supabase Dashboard → SQL Editor
2. `supabase/schema.sql` の内容をコピー
3. SQL Editorに貼り付け
4. 「Run」ボタンをクリックして実行

### 3.2 既存プロジェクトの場合
1. Supabase Dashboard → SQL Editor
2. `supabase/update-permissions.sql` の内容をコピー
3. SQL Editorに貼り付け
4. 「Run」ボタンをクリックして実行

## 4. 権限とRLSポリシーの確認

### 4.1 権限の確認
```sql
-- テーブルの権限を確認
SELECT 
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_name IN ('areas', 'categories')
AND grantee = 'authenticated'
ORDER BY table_name, privilege_type;
```

### 4.2 RLSポリシーの確認
```sql
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
WHERE tablename IN ('areas', 'categories')
ORDER BY tablename, policyname;
```

## 5. 接続テスト

### 5.1 ローカル開発サーバーの起動
```bash
npm run dev
```

### 5.2 動作確認
1. ブラウザで `http://localhost:3000` にアクセス
2. 書店一覧ページでデータが表示されることを確認
3. 管理者ログイン機能をテスト
4. エリア・カテゴリの編集機能をテスト

## 6. 本番環境へのデプロイ

### 6.1 Vercelでの環境変数設定
1. Vercel Dashboard → Project Settings → Environment Variables
2. 以下を追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`

### 6.2 デプロイ
```bash
vercel --prod
```

## 7. トラブルシューティング

### 7.1 よくある問題

**問題**: `supabaseUrl is required` エラー
**解決**: 環境変数が正しく設定されているか確認

**問題**: データが表示されない
**解決**: 
- RLSポリシーが正しく設定されているか確認
- データベースにデータが存在するか確認

**問題**: エリア・カテゴリの更新ができない
**解決**: 
- `update-permissions.sql` を実行して権限を追加
- 認証済みユーザーの権限を確認

**問題**: CORSエラー
**解決**: Supabase Dashboard → Settings → API → CORS設定を確認

### 7.2 ログの確認
- Supabase Dashboard → Logs でエラーログを確認
- ブラウザの開発者ツールでネットワークエラーを確認

## 8. セキュリティ設定

### 8.1 API Keyの管理
- 本番環境では適切な権限設定を行う
- 不要な権限は削除する

### 8.2 データベースアクセス制御
- 本番環境では必要最小限の権限のみ付与
- 定期的な権限見直しを実施

## 9. 監視・メンテナンス

### 9.1 パフォーマンス監視
- Supabase Dashboard → Database → Performance で監視
- スロークエリの特定と最適化

### 9.2 バックアップ
- Supabaseの自動バックアップ機能を活用
- 重要なデータは定期的にエクスポート

## 10. 次のステップ

1. **管理者機能の実装**
   - 書店情報の追加・編集・削除
   - カテゴリ・エリアの管理

2. **機能拡張**
   - 書店レビュー機能
   - お気に入り機能
   - イベント情報掲載

3. **パフォーマンス最適化**
   - インデックスの最適化
   - キャッシュ戦略の実装
   - CDNの導入
