// 書店情報の型定義
export interface Store {
  id: string;
  name: string;
  area_id: number;
  category_id: number;
  x_link?: string;
  instagram_link?: string;
  website_link?: string;
  x_post_url?: string;
  google_map_link?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_tags?: CategoryTag[]; // カテゴリタグを追加
}

// カテゴリ情報の型定義
export interface Category {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// エリア情報の型定義
export interface Area {
  id: number;
  name: string;
  prefecture: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// カテゴリタグ情報の型定義
export interface CategoryTag {
  id: number;
  name: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
}

// 管理者情報の型定義
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API レスポンスの型定義
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// 書店一覧レスポンスの型定義
export interface StoresResponse {
  stores: Store[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 検索フィルターの型定義
export interface StoreFilters {
  area_id?: number;
  category_id?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// ページネーションの型定義
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 認証状態の型定義
export interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// 認証コンテキストの型定義
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
