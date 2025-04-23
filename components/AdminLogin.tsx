import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import {
  Form,
  Input,
  Button,
  Toast,
  Space,
  Card,
} from 'antd-mobile';
import {
  UserOutline,
  LockOutline,
} from 'antd-mobile-icons';

// 登录表单数据类型
interface LoginData {
  yonghuming: string;
  mima: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表单处理
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginData>();

  // 提交处理
  const onSubmit = async (data: LoginData) => {
    try {
      setIsSubmitting(true);

      // 检查必填项
      if (!data.yonghuming || !data.mima) {
        Toast.show({
          icon: 'fail',
          content: '请输入用户名和密码',
        });
        setIsSubmitting(false);
        return;
      }

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

      Toast.show({
        icon: 'success',
        content: '登录成功',
      });

      // 跳转到管理页面
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '登录失败，请检查用户名和密码',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <Space block direction="vertical" style={{ width: '100%' }}>
          <h2 className="text-center text-2xl font-bold mb-8">管理员登录</h2>
          
          <Form
            layout="vertical"
            footer={
              <Button
                block
                color="primary"
                size="large"
                loading={isSubmitting}
                onClick={() => handleSubmit(onSubmit)()}
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
                  onChange={(val) => setValue('yonghuming', val)}
                  className="border-0 p-0 w-full"
                />
              </div>
              {errors.yonghuming && (
                <div className="error-text">请输入用户名</div>
              )}
            </Form.Item>

            {/* 密码 */}
            <Form.Item label="密码" required>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <LockOutline className="mr-2 text-gray-400" />
                <Input
                  placeholder="请输入密码"
                  clearable
                  type="password"
                  onChange={(val) => setValue('mima', val)}
                  className="border-0 p-0 w-full"
                />
              </div>
              {errors.mima && <div className="error-text">请输入密码</div>}
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
} 