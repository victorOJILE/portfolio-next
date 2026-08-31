'use client';

import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      className="bg-pattern flex items-center justify-center relative overflow-hidden pt-20"
      style={{ height: "clamp(600px, 95dvh, 900px)" }}
      aria-label="Main Introduction">
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-beauty text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight text-white text-gradient text-shadow-glow mb-6">
            CODING WITH PASSION,
            <br />
            CRAFTING WITH PURPOSE
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl font-crimson text-white mb-12">
            <strong className="text-accent-gold">Full Stack Developer, </strong> Building Modern Web Experiences
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}>
            <Link
              href="#contact"
              className="btn-secondary inline-flex items-center gap-3 text-xl animate-bounce-in-left"
              aria-label="Contact Victor Ojile for opportunities">
              <FaEnvelope className="text-2xl" />
              <span>Let's Work Together</span>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-white rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
