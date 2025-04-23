import Form from '../components/Form';
import Head from 'next/head';
import { SafeArea } from 'antd-mobile';

export default function Home() {
  return (
    <>
      <Head>
        <title>展厅进出登记</title>
        <meta name="description" content="展厅进出登记系统" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white min-h-screen">
        <Form />
        <SafeArea position='bottom' />
      </main>
    </>
  );
} 