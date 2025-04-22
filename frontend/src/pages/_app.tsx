// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';
import ToastManager from '../components/ToastManager';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastManager />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
