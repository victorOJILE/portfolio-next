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
          <div className="prose prose-lg max-w-none">
            <p className="text-dark-200 leading-relaxed mb-6 text-base md:text-lg">
              Hello! I'm <strong className="text-primary-600">Victor Ojile</strong>, a passionate 
              full-stack web developer with rich experience in creating beautiful, functional, and 
              interactive web applications for businesses.
            </p>

            <p className="text-dark-200 leading-relaxed mb-6 text-base md:text-lg">
              I specialize in modern web technologies including <strong>React</strong>, <strong>Next.js</strong>, 
              and <strong>TypeScript</strong> for building responsive and performant user interfaces. 
              On the backend, I work extensively with <strong>Node.js</strong>, <strong>Express</strong>, <strong>Firebase</strong>, and <strong>MongoDB</strong> to create scalable and secure server-side solutions.
            </p>

            <p className="text-dark-200 leading-relaxed mb-6 text-base md:text-lg">
              My expertise includes developing RESTful APIs, integrating third-party APIs, and implementing 
              real-time features using WebSockets and Firebase Realtime Database. I'm committed to writing 
              clean, maintainable code and following best practices for security and performance optimization.
            </p>

            <p className="text-dark-200 leading-relaxed mb-8 text-base md:text-lg">
              I am always eager to take on challenging projects that demand innovation and dedication. 
              I am currently available for <strong className="text-accent-green">freelance projects</strong> and 
              <strong className="text-accent-green"> full-time roles</strong> focused on modern web technologies.
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
