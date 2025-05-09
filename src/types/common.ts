// 基本的な型ユーティリティ
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 基本的なAPIレスポンスの型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  status: number;
  timestamp: string;
}

// ページネーションの型
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ユーザー関連の型
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// エラーの型
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  path: string;
}

// フォーム関連の型
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  isValid: boolean;
}

export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// 認証関連の型
export interface AuthState {
  user: Nullable<User>;
  token: Nullable<string>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// 通知関連の型
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  createdAt: Date;
} 