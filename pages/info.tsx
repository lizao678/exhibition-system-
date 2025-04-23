import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import InfoDisplay from '../components/InfoDisplay';

// 数据类型
interface InfoData {
  id: number;
  xingming: string;
  bumen: string;
  jinruRiqi: string;
  shiyou: string;
  jieyongYangyi: boolean;
  yangyiBianhao?: string;
  yujiGuihuanRiqi?: string;
  tijiaoRiqi: string;
  shijiGuihuanRiqi?: string;
}

export default function Info() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<InfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(`/api/form/${id}`);
        if (!response.ok) {
          throw new Error('获取数据失败');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError('加载数据失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  return (
    <>
      <Head>
        <title>展厅进出信息</title>
        <meta name="description" content="展厅进出信息详情" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-8">
        {isLoading ? (
          <div className="text-center text-gray-500">加载中...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : !data ? (
          <div className="text-center text-gray-500">记录不存在</div>
        ) : (
          <InfoDisplay data={data} />
        )}
      </main>
    </>
  );
} 