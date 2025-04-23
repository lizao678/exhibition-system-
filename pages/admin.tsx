import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLogin from '../components/AdminLogin';
import AdminTable from '../components/AdminTable';

export default function Admin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 检查认证状态
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    router.push('/admin');
  };

  return (
    <>
      <Head>
        <title>管理员后台</title>
        <meta name="description" content="展厅进出系统管理员后台" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : isAuthenticated ? (
          <div>
            {/* 顶部导航栏 */}
            <nav className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <h1 className="text-xl font-bold text-gray-900">
                        展厅进出系统管理后台
                      </h1>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleLogout}
                      className="btn btn-secondary"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            </nav>

            {/* 数据表格 */}
            <AdminTable />
          </div>
        ) : (
          <AdminLogin />
        )}
      </main>
    </>
  );
} 