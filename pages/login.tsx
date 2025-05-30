import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Form,
  Input,
  Button,
  Toast,
  Space,
  Card,
  SafeArea,
} from 'antd-mobile';
import {
  UserOutline,
  LockOutline,
} from 'antd-mobile-icons';
import { useFetch } from '../hooks/useFetch';

interface LoginResponse {
  token: string;
}

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { fetchData: login,loading } = useFetch<LoginResponse>();

  // 检查是否已登录
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.replace('/admin');
    }
  }, [router]);

  // 提交处理
  const handleSubmit = async () => {
    if (!username || !password) {
      Toast.show({
        icon: 'fail',
        content: '请输入用户名和密码',
      });
      return;
    }

    const result = await login('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        yonghuming: username,
        mima: password,
      }),
      showError: true,
      showSuccess: true,
      successMessage: '登录成功',
      requireAuth: false,
    });

    if (result) {
      localStorage.setItem('adminToken', result.token);
      setTimeout(() => {
        router.replace('/admin');
      }, 1000);
    }
  };

  return (
    <>
      <Head>
        <title>管理员登录</title>
        <meta name="description" content="展厅进出系统管理员登录" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white min-h-screen p-4">
        <Card className="">
          <Space block direction="vertical" style={{ width: '100%' }}>
            <h2 className="text-center text-2xl font-bold mb-8">管理员登录</h2>
            
            <Form
              layout="vertical"
              footer={
                <Button
                  block
                  loading
                  color="primary"
                  size="large"
                  onClick={handleSubmit}
                >
                  登录
                </Button>
              }
            >
              {/* 用户名 */}
              <Form.Item label="用户名" required>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                  <UserOutline className="mr-2 text-gray-400" />
                  <Input
                    placeholder="请输入用户名"
                    clearable
                    value={username}
                    onChange={setUsername}
                    className="border-0 p-0 w-full"
                  />
                </div>
              </Form.Item>

              {/* 密码 */}
              <Form.Item label="密码" required>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                  <LockOutline className="mr-2 text-gray-400" />
                  <Input
                    placeholder="请输入密码"
                    clearable
                    type="password"
                    value={password}
                    onChange={setPassword}
                    className="border-0 p-0 w-full"
                  />
                </div>
              </Form.Item>
            </Form>
          </Space>
        </Card>
        <SafeArea position='bottom' />
      </main>
    </>
  );
} 