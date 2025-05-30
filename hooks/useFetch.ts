import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Toast } from 'antd-mobile';

interface FetchOptions extends RequestInit {
  showError?: boolean;
  showSuccess?: boolean;
  successMessage?: string;
  requireAuth?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (url: string, options?: FetchOptions) => Promise<T | null>;
}

export function useFetch<T>(): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async (url: string, options: FetchOptions = {}) => {
    const {
      showError = true,
      showSuccess = false,
      successMessage = '操作成功',
      requireAuth = false,
      ...fetchOptions
    } = options;

    try {
      setLoading(true);
      setError(null);

      // 构建请求头
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // 如果需要认证，添加 token
      if (requireAuth) {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/login');
          return null;
        }
        headers.Authorization = `Bearer ${token}`;
      }

      // 合并自定义请求头
      if (fetchOptions.headers) {
        Object.assign(headers, fetchOptions.headers);
      }

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          router.push('/login');
          throw new Error(errorData.message||'登录已过期，请重新登录');
        }

        throw new Error(errorData.message || '请求失败');
      }

      const result = await response.json();
      setData(result);

      if (showSuccess) {
        Toast.show({
          icon: 'success',
          content: successMessage,
        });
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '请求失败';
      setError(errorMessage);

      if (showError) {
        Toast.show({
          icon: 'fail',
          content: errorMessage,
        });
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { data, loading, error, fetchData };
} 