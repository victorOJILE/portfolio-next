import { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
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
});

const crimson = localFont({
  src: '../public/fonts/Crimson-Italic.ttf',
  variable: '--font-crimson',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://victorojile.com'),
  title: 'Victor Ojile - Full-Stack Web Developer Portfolio',
  description: 'Experienced full-stack web developer specializing in modern web technologies. Expert in React, Next.js, Node.js, and Firebase. Available for freelance and full-time opportunities.',
  keywords: [
    'Victor Ojile',
    'Web Developer',
    'Full-Stack Developer',
    'React Developer',
    'Next.js Developer',
    'Node.js',
    'Firebase',
    'JavaScript',
    'TypeScript',
    'Portfolio',
    'Freelance Developer'
  ],
  authors: [{ name: 'Victor Ojile' }],
  creator: 'Victor Ojile',
  publisher: 'Victor Ojile',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://victorojile.com',
    title: 'Victor Ojile - Full-Stack Web Developer',
    description: 'Experienced Full-Stack Web Developer specializing in the JavaScript Ecosystem and Modern Web Technologies.',
    siteName: 'Victor Ojile Portfolio',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Victor Ojile - Web Developer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Victor Ojile - Full-Stack Web Developer',
    description: 'Experienced Full-Stack Web Developer specializing in the JavaScript Ecosystem and Modern Web Technologies.',
    images: ['/images/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${openSans.variable} ${beauty.variable} ${crimson.variable} scroll-smooth`}
    >
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        <Header />
        <SocialSidebar />
        <main>{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
