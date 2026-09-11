'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaDownload } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { trackDownloadCV } from '@/lib/firebase/analytics';
import { useBackToTop } from '@/hooks/useBackToTop';

const navLinks = [
 { href: '/', label: 'HOME' },
 { href: '#projects', label: 'PROJECTS' },
 { href: '#about', label: 'ABOUT ME' },
 { href: '#skills', label: 'SKILLS' },
 { href: '#contact', label: 'CONTACT' },
];

export default function Header() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const { isVisible: isScrolled } = useBackToTop(50);
 
 return (
  <header
   className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
   isScrolled ? 'bg-dark-300/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
   }`}>
   <nav className="container-custom">
    <div className="flex items-center justify-between py-4 border-b border-gray-700">
     {/* Logo */}
     <Link href="/" className="relative w-48 h-12 transition-transform hover:scale-110">
      <Image
       src="/images/website_logo.png"
       alt="Victor Ojile Logo"
       fill priority 
       className="object-contain"
      />
     </Link>

     {/* Desktop Navigation */}
     <div className="flex items-center justify-between">
      <ul className="hidden md:flex items-center space-x-6 lg:space-x-8">
       {navLinks.map((link) => (
       <li key={link.href}>
        <Link
         href={link.href}
         className="text-sm lg:text-base font-bold text-gray-300 hover:text-white transition-colors duration-200 link-hover">
         {link.label}
        </Link>
       </li>
       ))}
      </ul>
      
      <a
       href="/victor_ojile_cv.pdf"
       download="victor_ojile_resume"
       onClick={trackDownloadCV}
       className="rounded-xl btn-primary hidden md:inline-flex items-center gap-3 mx-6 py-2"
       aria-label="Download Victor Ojile's full CV">
       <FaDownload className="text-xl" />
       <strong>Download CV</strong>
      </a>
     </div>
     {/* Mobile Menu Button */}
     <button
       onClick={() => setIsMenuOpen(menuOpen => !menuOpen)}
       className="md:hidden p-2 border border-gray-600 rounded"
       aria-label="Toggle menu"
       aria-expanded={isMenuOpen}
       aria-controls="mobile-menu">
       <div className="w-6 h-4 relative">
         <span
           className={`absolute left-0 top-0 w-6 h-0.5 bg-gray-300 rounded transition-all duration-300 origin-center ${
             isMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45 bg-red-500' : ''
           }`}
         />
         <span
           className={`absolute left-0 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-gray-300 rounded transition-all duration-300 ${
             isMenuOpen ? 'opacity-0' : ''
           }`}
         />
         <span
           className={`absolute left-0 bottom-0 w-6 h-0.5 bg-gray-300 rounded transition-all duration-300 origin-center ${
             isMenuOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45 bg-red-500' : ''
           }`}
         />
       </div>
     </button>
    </div>

    {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-dark-300/95 backdrop-blur-md">
              <ul className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <motion.li
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
 );
}