import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Result, DotLoading, SafeArea } from 'antd-mobile';
import { useFetch } from '../hooks/useFetch';
import InfoDisplay from '../components/InfoDisplay';

// 数据类型
interface InfoData {
  id: number;
  xingming: string;
  bumen: string;
  zhanting: string;
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
  const { data, loading, error, fetchData } = useFetch<InfoData>();

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      await fetchData(`/api/form/${id}`, {
        showError: true,
        requireAuth: false,
      });
    };

    loadData();
  }, [id, fetchData]);

  return (
    <>
      <Head>
        <title>展厅进出信息</title>
        <meta name="description" content="展厅进出信息详情" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <DotLoading color='primary' />
              <div className="mt-2 text-gray-500">加载中...</div>
            </div>
          </div>
        ) : error ? (
          <Result
            status='error'
            title='加载失败'
            description={error}
          />
        ) : !data ? (
          <Result
            status='info'
            title='记录不存在'
            description='未找到相关信息，请检查链接是否正确'
          />
        ) : (
          <InfoDisplay data={data} />
        )}
        <SafeArea position='bottom' />
      </main>
    </>
  );
} 