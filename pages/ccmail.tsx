import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, Toast, List, Space, Card } from 'antd-mobile';
import Head from 'next/head';

export default function CCEmail() {
  const [emails, setEmails] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 获取已保存的邮箱
    fetch('/api/ccmail')
      .then(res => res.json())
      .then(data => setEmails(data.emails || []));
  }, []);

  const addEmail = () => {
    if (!input || !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(input)) {
      Toast.show({ icon: 'fail', content: '请输入有效邮箱' });
      return;
    }
    if (emails.length >= 3) {
      Toast.show({ icon: 'fail', content: '最多添加3个邮箱' });
      return;
    }
    if (emails.includes(input)) {
      Toast.show({ icon: 'fail', content: '邮箱已存在' });
      return;
    }
    setEmails([...emails, input]);
    setInput('');
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const saveEmails = async () => {
    setLoading(true);
    const res = await fetch('/api/ccmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails }),
    });
    setLoading(false);
    if (res.ok) {
      Toast.show({ icon: 'success', content: '保存成功' });
      setTimeout(() => router.back(), 1000);
    } else {
      Toast.show({ icon: 'fail', content: '保存失败' });
    }
  };

  return (
    <>
      <Head>
        <title>抄送邮箱管理</title>
      </Head>
      <main className="bg-white min-h-screen p-4">
        <Card>
          <h2 className="text-lg font-bold mb-4">抄送邮箱（最多3个）</h2>
          <Space direction="vertical" block>
            <Input
              placeholder="输入邮箱后回车或点添加"
              value={input}
              onChange={setInput}
              onEnterPress={addEmail}
              clearable
            />
            <Button onClick={addEmail} block disabled={!input}>添加</Button>
            <List>
              {emails.map(email => (
                <List.Item key={email} extra={<Button color="danger" size="mini" onClick={() => removeEmail(email)}>删除</Button>}>
                  {email}
                </List.Item>
              ))}
            </List>
            <Button color="primary" block loading={loading} onClick={saveEmails} disabled={emails.length === 0}>保存</Button>
            <Button block onClick={() => router.back()}>返回</Button>
          </Space>
        </Card>
      </main>
    </>
  );
} 