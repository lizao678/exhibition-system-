import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminTable from '../components/AdminTable';
import { NavBar, DotLoading, SafeArea } from 'antd-mobile';

export default function Admin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 检查认证状态
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        // 未登录，跳转到登录页
        router.replace('/login');
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.replace('/login');
  };

  // 如果正在加载或未认证，不显示内容
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <DotLoading color='primary' />
          <div className="mt-2 text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>管理员后台</title>
        <meta name="description" content="展厅进出系统管理员后台" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white min-h-screen">
        <div className="flex flex-col h-screen">
          {/* 顶部导航栏 */}
          <NavBar 
            right={<span onClick={handleLogout} className="text-primary">退出登录</span>}
            backArrow={false}
          >
            管理员后台
          </NavBar>

          {/* 数据表格 */}
          <div className="flex-1 overflow-auto">
            <AdminTable />
          </div>
        </div>
        <SafeArea position='bottom' />
      </main>
    </>
  );
} 