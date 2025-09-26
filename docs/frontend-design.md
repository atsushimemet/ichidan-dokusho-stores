# フロントエンド設計書

## 1. 概要

ichidan-dokusho-storesのフロントエンド設計書。Next.js 14 (App Router)とTailwind CSSを使用し、レスポンシブでアクセシブルなWebアプリケーションを構築する。

## 2. 技術スタック

### 2.1 主要技術
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v3
- **状態管理**: React Context API + useReducer
- **データフェッチ**: SWR
- **フォーム**: React Hook Form + Zod
- **UIコンポーネント**: Radix UI
- **アイコン**: Lucide React

### 2.2 開発ツール
- **リンター**: ESLint + Prettier
- **型チェック**: TypeScript
- **テスト**: Jest + React Testing Library
- **E2Eテスト**: Playwright

## 3. プロジェクト構造

```
app/
├── (public)/                 # 一般ユーザー向けページ
│   ├── page.tsx             # トップページ
│   ├── stores/              # 書店関連ページ
│   │   ├── page.tsx         # 書店一覧
│   │   └── [id]/           # 書店詳細
│   │       └── page.tsx
│   └── layout.tsx          # 一般ユーザー用レイアウト
├── (admin)/                 # 管理者向けページ
│   ├── login/              # ログインページ
│   │   └── page.tsx
│   ├── dashboard/          # ダッシュボード
│   │   ├── page.tsx
│   │   └── stores/         # 書店管理
│   │       ├── page.tsx    # 書店一覧
│   │       ├── new/        # 書店登録
│   │       │   └── page.tsx
│   │       └── [id]/       # 書店編集
│   │           └── edit/
│   │               └── page.tsx
│   └── layout.tsx          # 管理者用レイアウト
├── api/                    # API Routes
│   ├── stores/
│   ├── areas/
│   ├── categories/
│   └── admin/
├── globals.css             # グローバルスタイル
└── layout.tsx              # ルートレイアウト

components/
├── ui/                     # 基本UIコンポーネント
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── card.tsx
│   ├── modal.tsx
│   └── index.ts
├── layout/                 # レイアウトコンポーネント
│   ├── header.tsx
│   ├── footer.tsx
│   └── navigation.tsx
├── store/                  # 書店関連コンポーネント
│   ├── store-card.tsx
│   ├── store-detail.tsx
│   ├── store-form.tsx
│   ├── store-list.tsx
│   └── search-form.tsx
├── admin/                  # 管理画面コンポーネント
│   ├── admin-header.tsx
│   ├── admin-sidebar.tsx
│   └── admin-table.tsx
└── common/                 # 共通コンポーネント
    ├── loading.tsx
    ├── error.tsx
    └── pagination.tsx

lib/
├── supabase.ts            # Supabase設定
├── utils.ts               # ユーティリティ関数
├── types.ts               # TypeScript型定義
├── constants.ts           # 定数定義
└── validations.ts         # バリデーションスキーマ

hooks/
├── use-stores.ts          # 書店データ取得
├── use-auth.ts            # 認証状態管理
└── use-analytics.ts       # 分析データ送信

styles/
├── globals.css            # グローバルスタイル
└── components.css         # コンポーネント固有スタイル
```

## 4. ページ設計

### 4.1 一般ユーザー向けページ

#### トップページ (`/`)
```typescript
// app/(public)/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HeroSection />
      <SearchSection />
      <FeaturedStores />
      <CategoriesSection />
    </div>
  );
}
```

**主要コンポーネント:**
- `HeroSection`: メインメッセージ表示
- `SearchSection`: エリア・カテゴリ選択フォーム
- `FeaturedStores`: おすすめ書店表示
- `CategoriesSection`: カテゴリ一覧

#### 書店一覧ページ (`/stores`)
```typescript
// app/(public)/stores/page.tsx
export default function StoresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SearchForm />
      <StoreList />
      <Pagination />
    </div>
  );
}
```

**主要コンポーネント:**
- `SearchForm`: 検索条件フォーム
- `StoreList`: 書店カード一覧
- `Pagination`: ページネーション

#### 書店詳細ページ (`/stores/[id]`)
```typescript
// app/(public)/stores/[id]/page.tsx
export default function StoreDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <StoreDetail storeId={params.id} />
    </div>
  );
}
```

**主要コンポーネント:**
- `StoreDetail`: 書店詳細情報
- `XPostEmbed`: Xポスト埋め込み
- `SocialLinks`: SNSリンク

### 4.2 管理者向けページ

#### ログインページ (`/admin/login`)
```typescript
// app/(admin)/login/page.tsx
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

#### ダッシュボード (`/admin/dashboard`)
```typescript
// app/(admin)/dashboard/page.tsx
export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardStats />
      <RecentStores />
      <QuickActions />
    </div>
  );
}
```

#### 書店管理 (`/admin/dashboard/stores`)
```typescript
// app/(admin)/dashboard/stores/page.tsx
export default function AdminStoresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader />
      <StoreSearchForm />
      <AdminStoreTable />
      <Pagination />
    </div>
  );
}
```

## 5. コンポーネント設計

### 5.1 基本UIコンポーネント

#### Button コンポーネント
```typescript
// components/ui/button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100'
  };
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {props.loading && <Spinner className="mr-2" />}
      {props.children}
    </button>
  );
}
```

#### Input コンポーネント
```typescript
// components/ui/input.tsx
interface InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function Input({ label, error, required, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
```

### 5.2 書店関連コンポーネント

#### StoreCard コンポーネント
```typescript
// components/store/store-card.tsx
interface StoreCardProps {
  store: Store;
  onClick?: () => void;
}

export function StoreCard({ store, onClick }: StoreCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {store.name}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {store.area}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <CategoryTag category={store.category} />
        </div>
        <div className="flex space-x-3">
          {store.x_link && (
            <SocialLink href={store.x_link} platform="twitter" />
          )}
          {store.instagram_link && (
            <SocialLink href={store.instagram_link} platform="instagram" />
          )}
          {store.website_link && (
            <SocialLink href={store.website_link} platform="website" />
          )}
        </div>
      </div>
    </div>
  );
}
```

#### StoreDetail コンポーネント
```typescript
// components/store/store-detail.tsx
interface StoreDetailProps {
  store: Store;
}

export function StoreDetail({ store }: StoreDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {store.name}
          </h1>
          <div className="flex items-center text-lg text-gray-600 mb-6">
            <MapPin className="w-5 h-5 mr-2" />
            {store.area}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <CategoryTag category={store.category} />
          </div>
          {store.description && (
            <p className="text-gray-700 mb-6">{store.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mb-8">
            {store.x_link && (
              <SocialLink href={store.x_link} platform="twitter" size="lg" />
            )}
            {store.instagram_link && (
              <SocialLink href={store.instagram_link} platform="instagram" size="lg" />
            )}
            {store.website_link && (
              <SocialLink href={store.website_link} platform="website" size="lg" />
            )}
          </div>
          {store.x_post_url && (
            <XPostEmbed url={store.x_post_url} />
          )}
        </div>
      </div>
    </div>
  );
}
```

### 5.3 管理画面コンポーネント

#### AdminStoreTable コンポーネント
```typescript
// components/admin/admin-store-table.tsx
interface AdminStoreTableProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
}

export function AdminStoreTable({ stores, onEdit, onDelete }: AdminStoreTableProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              書店名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              エリア
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              カテゴリ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              状態
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stores.map((store) => (
            <tr key={store.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {store.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {store.area}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <CategoryTag category={store.category} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <StatusBadge isActive={store.is_active} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(store)}
                  >
                    編集
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(store)}
                  >
                    削除
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## 6. 状態管理

### 6.1 グローバル状態

#### AuthContext
```typescript
// contexts/auth-context.tsx
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  const login = async (email: string, password: string) => {
    // ログイン処理
  };

  const logout = async () => {
    // ログアウト処理
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### StoreContext
```typescript
// contexts/store-context.tsx
interface StoreState {
  stores: Store[];
  isLoading: boolean;
  filters: StoreFilters;
  pagination: Pagination;
}

interface StoreContextType extends StoreState {
  setFilters: (filters: StoreFilters) => void;
  setPagination: (pagination: Pagination) => void;
  refreshStores: () => Promise<void>;
}

export const StoreContext = createContext<StoreContextType | null>(null);
```

### 6.2 カスタムフック

#### useStores
```typescript
// hooks/use-stores.ts
export function useStores(filters?: StoreFilters) {
  const { data, error, isLoading, mutate } = useSWR(
    ['stores', filters],
    () => fetchStores(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000
    }
  );

  return {
    stores: data?.stores || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refresh: mutate
  };
}
```

#### useAuth
```typescript
// hooks/use-auth.ts
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## 7. スタイリング

### 7.1 Tailwind CSS設定

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### 7.2 レスポンシブデザイン

```typescript
// ブレークポイント
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// レスポンシブクラス例
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {stores.map(store => (
    <StoreCard key={store.id} store={store} />
  ))}
</div>
```

## 8. パフォーマンス最適化

### 8.1 画像最適化
```typescript
import Image from 'next/image';

export function StoreImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      className="rounded-lg object-cover"
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

### 8.2 コード分割
```typescript
// 動的インポート
const AdminDashboard = dynamic(() => import('./admin-dashboard'), {
  loading: () => <Loading />,
  ssr: false
});
```

### 8.3 メモ化
```typescript
export const StoreCard = memo(({ store }: StoreCardProps) => {
  return (
    <div className="store-card">
      {/* コンポーネント内容 */}
    </div>
  );
});
```

## 9. アクセシビリティ

### 9.1 セマンティックHTML
```typescript
export function StoreCard({ store }: StoreCardProps) {
  return (
    <article className="store-card" role="article">
      <header>
        <h3 className="store-name">{store.name}</h3>
      </header>
      <div className="store-content">
        <p className="store-location">
          <span className="sr-only">所在地: </span>
          {store.area}
        </p>
      </div>
    </article>
  );
}
```

### 9.2 キーボードナビゲーション
```typescript
export function SearchForm() {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <form onKeyDown={handleKeyDown}>
      <input
        type="text"
        placeholder="書店名で検索"
        aria-label="書店名検索"
        className="search-input"
      />
    </form>
  );
}
```

## 10. テスト

### 10.1 単体テスト
```typescript
// __tests__/components/store-card.test.tsx
import { render, screen } from '@testing-library/react';
import { StoreCard } from '@/components/store/store-card';

describe('StoreCard', () => {
  it('renders store information correctly', () => {
    const mockStore = {
      id: '1',
      name: 'テスト書店',
      area: '東京',
      category: 'book_cafe'
    };

    render(<StoreCard store={mockStore} />);
    
    expect(screen.getByText('テスト書店')).toBeInTheDocument();
    expect(screen.getByText('東京')).toBeInTheDocument();
  });
});
```

### 10.2 E2Eテスト
```typescript
// tests/e2e/store-search.spec.ts
import { test, expect } from '@playwright/test';

test('書店検索機能', async ({ page }) => {
  await page.goto('/');
  
  // エリア選択
  await page.selectOption('[data-testid="area-select"]', '東京');
  
  // カテゴリ選択
  await page.selectOption('[data-testid="category-select"]', 'book_cafe');
  
  // 検索実行
  await page.click('[data-testid="search-button"]');
  
  // 結果確認
  await expect(page.locator('[data-testid="store-card"]')).toBeVisible();
});
```

## 11. デプロイメント

### 11.1 環境変数
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 11.2 Vercel設定
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```
