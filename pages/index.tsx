import Form from '../components/Form';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>展厅进出登记</title>
        <meta name="description" content="展厅进出登记系统" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <Form />
      </main>
    </>
  );
} 