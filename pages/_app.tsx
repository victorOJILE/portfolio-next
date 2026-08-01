import type { AppProps } from 'next/app';
import '../styles/globals.css';
import localFont from 'next/font/local';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SocialSidebar from '../components/common/SocialSidebar';
import BackToTop from '../components/common/BackToTop';

const openSans = localFont({
  src: '../public/fonts/OpenSans-Regular.ttf',
  variable: '--font-open-sans',
  display: 'swap'
});

const beauty = localFont({
  src: '../public/fonts/BBeauty-v5.02-648B6363D402E00678B7AAF1D252A5DC.ttf',
  variable: '--font-beauty',
  display: 'swap',
  preload: false
});

const crimson = localFont({
  src: '../public/fonts/Crimson-Italic.ttf',
  variable: '--font-crimson',
  display: 'swap',
  preload: false
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${openSans.variable} ${beauty.variable} ${crimson.variable}`}>
      <Header />
      <SocialSidebar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
