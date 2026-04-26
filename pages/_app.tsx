import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SocialSidebar from '../components/common/SocialSidebar';
import BackToTop from '../components/common/BackToTop';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <SocialSidebar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
