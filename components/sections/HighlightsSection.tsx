'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { FaCode, FaRocket, FaShieldAlt, FaPaperPlane } from 'react-icons/fa';
import { MdDevices } from 'react-icons/md';

const features = [
  {
    icon: FaCode,
    title: 'Clean Code',
    description: "I write readable, maintainable code that's built to scale"
  },
  {
    icon: FaRocket,
    title: 'Fast and Reliable',
    description: 'Performance-focused applications that deliver great user experiences'
  },
  {
    icon: MdDevices,
    title: 'Responsive Design',
    description: 'Pixel perfect interfaces that work seamlessly on any device'
  },
  {
    icon: FaShieldAlt,
    title: 'Secure Solutions',
    description: 'I follow best practices for security, performance and reliability'
  }
];

export default function HighlightsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollVisibility(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="highlights"
      className="section-padding relative bg-dark-300 bg-pattern"
      aria-labelledby="highlights-heading">
      <div className="container-custom">
        {/* Feature Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-5 md:p-6">
              <div className="w-12 h-12 rounded-lg border border-accent-gold/40 bg-accent-gold/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-accent-gold" />
              </div>
              <h3 className="text-white font-bold text-base md:text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative overflow-hidden mt-6 md:mt-8 max-w-6xl mx-auto rounded-xl border border-accent-gold/30 bg-gradient-to-r from-primary-900/60 via-dark-300 to-dark-300 p-6 md:p-8">
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg border border-accent-gold/40 bg-accent-gold/10 flex items-center justify-center">
                <FaPaperPlane className="w-5 h-5 text-accent-gold" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg md:text-xl mb-1">
                  Let's build something great together
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  I'm open to freelance projects, collaboration and full-time opportunities.
                </p>
              </div>
            </div>
            <Link
              href="#contact"
              className="btn-primary inline-flex items-center gap-2 shrink-0 whitespace-nowrap"
              aria-label="Go to contact section to say hello">
              <span>Let's Talk</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
