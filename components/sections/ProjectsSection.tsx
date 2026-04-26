'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { Project } from '@/lib/firebase/projects';
import { trackProjectView, trackExternalLink } from '@/lib/firebase/analytics';

interface ProjectsSectionProps {
  mainProjects: Project[];
  otherProjects: Project[];
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollVisibility(cardRef);

  const handleProjectClick = () => {
    trackProjectView(project.id, project.title);
  };

  const handleLinkClick = (url: string, type: string) => {
    trackExternalLink(url, `Project ${type}`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass-card overflow-hidden group"
    >
      {/* Project Image */}
      <div className="relative h-64 md:h-72 overflow-hidden">
        <Image
          src={project.image || '/images/placeholder-project.jpg'}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-dark-300/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm bg-primary-600/20 text-primary-300 rounded-full border border-primary-500/30"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <ul className="space-y-2 mb-4">
            {project.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-400">
                <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Links */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(project.githubUrl!, 'GitHub')}
              className="px-2 text-white"
            >
              <FaGithub />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                handleProjectClick();
                handleLinkClick(project.liveUrl!, 'Live Demo');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm font-medium"
            >
              <span>View</span>
              <FaExternalLinkAlt />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection({ mainProjects, otherProjects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollVisibility(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section-padding bg-dark-300"
      aria-labelledby="projects-heading"
    >
      <div className="container-custom">
        {/* Section Heading */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Featured Projects</h2>
          <p className="text-gray-400 mt-4 text-lg">
            A selection of my best work showcasing diverse skills and technologies
          </p>
        </motion.header>

        {/* Main Projects */}
        {mainProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-beauty text-primary-400 mb-8 text-center md:text-left">
              Main Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="text-3xl font-beauty text-secondary-400 mb-8 text-center md:text-left">
              Other Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {mainProjects.length === 0 && otherProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No projects available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
