'use client';

import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';
import { trackExternalLink } from '@/lib/firebase/analytics';

const socialLinks = [
  {
    href: 'https://www.facebook.com/victor.ojile.79',
    icon: FaFacebook,
    label: 'Facebook'
  },
  {
    href: 'https://www.linkedin.com/in/victor-ojile-aa4896208',
    icon: FaLinkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/victorOJILE',
    icon: FaGithub,
    label: 'GitHub'
  }
];

export default function Footer() {
  
  return (
    <footer className="bg-dark-300 border-t border-gray-700">
      <div className="container-custom py-8">
        {/* Activity Indicator */}
        <div className="fixed bottom-2 left-2 text-gray-400 text-2xl animate-pulse-slow no-print" title="I'm Active">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 640 512"
            aria-label="Active status"
          >
            <path d="M216 288h-48c-8.84 0-16 7.16-16 16v192c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V304c0-8.84-7.16-16-16-16zM88 384H40c-8.84 0-16 7.16-16 16v96c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16v-96c0-8.84-7.16-16-16-16zm256-192h-48c-8.84 0-16 7.16-16 16v288c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V208c0-8.84-7.16-16-16-16zm128-96h-48c-8.84 0-16 7.16-16 16v384c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V112c0-8.84-7.16-16-16-16zM600 0h-48c-8.84 0-16 7.16-16 16v480c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V16c0-8.84-7.16-16-16-16z" />
          </svg>
        </div>

        {/* Social Links */}
        <nav className="flex justify-center space-x-6 mb-6" aria-label="Social media links">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackExternalLink(link.href, link.label)}
              className="text-white hover:text-accent-gold transition-colors duration-200 transform hover:scale-110"
              aria-label={link.label}
              title={link.label}>
              <link.icon className="w-6 h-6" />
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <div className="text-center space-y-2">
          <p className="text-sm md:text-base text-gray-300">
            Designed & Developed by <span className="text-accent-gold font-semibold">Victor Ojile</span>
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
