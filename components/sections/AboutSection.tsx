'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaDownload, FaBolt, FaDatabase, FaLock, FaUserAlt } from 'react-icons/fa';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { trackDownloadCV } from '@/lib/firebase/analytics';
import { FaPaperPlane } from 'react-icons/fa';

const highlights = [
  {
    icon: FaBolt,
    title: 'Modern Technologies',
    description: (
      <>
        I specialize in <strong className="text-accent-gold">React</strong>,{' '}
        <strong className="text-accent-gold">Next.js</strong>, and{' '}
        <strong className="text-accent-gold">TypeScript</strong> to build modern,
        scalable and maintainable web applications with excellent developer and
        user experience.
      </>
    )
  },
  {
    icon: FaDatabase,
    title: 'Real-time & Integrations',
    description: (
      <>
        I build systems that handle real-time updates using{' '}
        <strong className="text-accent-gold">WebSockets</strong> and{' '}
        <strong className="text-accent-gold">Firebase Realtime Database</strong>,
        along with third-party integrations that add real value.
      </>
    )
  },
  {
    icon: FaLock,
    title: 'Security & Performance',
    description: 'I follow industry best practices for secure development, performance optimization and building applications that can handle real traffic.'
  },
  {
    icon: FaUserAlt,
    title: 'Problem Solving',
    description: 'I love solving real problems with code and turning ideas into products that people actually use and rely on.'
  }
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollVisibility(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding relative bg-dark-300 bg-pattern"
      aria-labelledby="about-heading">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto pt-20 md:pt-24">
          <header className={"text-center mb-8 md:mb-16 fade-in-up transition-delay-200" + (isVisible ? " visible" : "")}>
            <h2 className="section-heading">About Me</h2>
          </header>

          {/* Profile Image - Positioned absolutely at top */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[25%_5%] overflow-hidden border-4 border-gray-300 shadow-xl bg-white">
              <Image
                src="/images/victor-ojile.jpg"
                alt="Victor Ojile - Web Developer"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Icon Highlights Grid */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            {highlights.map((item, index) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-lg border border-accent-gold/40 bg-dark-300 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-accent-gold" />
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-bold text-lg md:text-xl mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          {/* CTA Banner */}
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-6 mt-14 mx-auto rounded-xl border border-accent-gold/30 bg-dark-300 p-6 md:p-8">
            <div className="flex md:items-center gap-4">
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
            <a
              href="/victor_ojile_cv.pdf"
              download="victor_ojile_resume"
              onClick={trackDownloadCV}
              className="btn-primary inline-flex items-center gap-3"
              aria-label="Download Victor Ojile's full CV">
              <FaDownload className="text-2xl" />
              <strong>Download CV</strong>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
