import { Html, Head, Main, NextScript } from 'next/document';
import type { Metadata } from 'next';

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

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0F1622" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
