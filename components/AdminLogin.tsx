import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

// 登录表单数据类型
interface LoginData {
  yonghuming: string;
  mima: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 表单处理
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  // 提交处理
  const onSubmit = async (data: LoginData) => {
    try {
      setIsSubmitting(true);
      setError('');

      // 发送登录请求
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('用户名或密码错误');
      }

      const result = await response.json();

      // 保存 token
      localStorage.setItem('adminToken', result.token);

      // 跳转到管理页面
      router.push('/admin');
    } catch (error) {
      setError('登录失败，请检查用户名和密码');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            管理员登录
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* 用户名 */}
            <div>
              <label htmlFor="yonghuming" className="sr-only">
                用户名
              </label>
              <input
                id="yonghuming"
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="用户名"
                {...register('yonghuming', { required: '请输入用户名' })}
              />
              {errors.yonghuming && (
                <p className="error">{errors.yonghuming.message}</p>
              )}
            </div>
            {/* 密码 */}
            <div>
              <label htmlFor="mima" className="sr-only">
                密码
              </label>
              <input
                id="mima"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="密码"
                {...register('mima', { required: '请输入密码' })}
              />
              {errors.mima && <p className="error">{errors.mima.message}</p>}
            </div>
          </div>

          {/* 错误提示 */}
          {error && <p className="error text-center">{error}</p>}

          {/* 登录按钮 */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 