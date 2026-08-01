'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { FaDownload } from 'react-icons/fa';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { trackDownloadCV } from '@/lib/firebase/analytics';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollVisibility(sectionRef);
  
  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding bg-gray-50 relative"
      aria-labelledby="about-heading">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto pt-20 md:pt-24">
          {/* Section Heading */}
          <header className={"text-center mb-12 fade-in-up transition-delay-200" + (isVisible ? " visible" : "")}>
            <h2 className="section-heading text-dark-200">About Me</h2>
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
          {/* About Content */}
          <div className="prose prose-lg">
            <p className="text-dark-200 leading-relaxed mb-6 text-base md:text-lg">
              Hello! This is <strong>Victor Ojile</strong>, a full-stack web developer, with 4+ years of practical experience,
              who turns complex problems into clean, fast web applications that businesses actually enjoy using.
            </p>

            <p className="text-dark-200 leading-relaxed mb-6 text-base md:text-lg">
              I specialize in modern web technologies including <strong>React</strong>, <strong>Next.js</strong>, 
              and <strong>TypeScript</strong> so your users get fast, reliable interfaces that work on any device.
            </p>
            <p className="text-dark-200 leading-relaxed mb-6 text-base md:text-lg">
              My expertise includes developing  systems that handle real-time updates (using WebSockets and Firebase Realtime Database), third-party integrations, high traffic and security.
            </p>

            <p className="text-dark-200 leading-relaxed mb-6 text-base md:text-lg">
              I'm committed to writing 
              clean, maintainable code and following best practices for security and performance optimization.
            </p>

            <p className="text-dark-200 leading-relaxed mb-8 text-base md:text-lg">
              Let's build something great — I'm open to freelance projects and full-time roles in modern web development.
            </p>
          </div>

          {/* Download CV Button */}
          <div className="text-center">
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
