import Form from '../components/Form';
import Head from 'next/head';
import { SafeArea, NavBar } from 'antd-mobile';
import { SetOutline } from 'antd-mobile-icons';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  // 跳转到管理后台
  const goToAdmin = () => {
    router.push('/login');
  };

  return (
    <>
      <Head>
        <title>展厅进出登记</title>
        <meta name="description" content="展厅进出登记系统" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white min-h-screen">
        <NavBar 
          right={
            <div onClick={goToAdmin}>
              <SetOutline className="text-primary text-xl" />
            </div>
          }
          backArrow={false}
        >
          展厅进出登记
        </NavBar>
        <Form />
        <SafeArea position='bottom' />
      </main>
    </>
  );
} 