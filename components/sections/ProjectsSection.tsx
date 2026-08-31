'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { FaGithub, FaLock, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { useContactRequest } from '@/components/contexts/ContactRequestContext';
import { Project } from '@/lib/firebase/projects';
import { trackProjectView, trackExternalLink } from '@/lib/firebase/analytics';

interface ProjectsSectionProps {
  mainProjects: Project[];
  otherProjects: Project[];
}

const bg: Record<string, string> = {
 reddish: "#e54540AA",
 bluish: "#131A64AA",
 greenish: "#115725AA"
};

function RequestAccessButton({ projectTitle }: { projectTitle: string }) {
  const { setContactRequest } = useContactRequest();

  const handleRequestAccess = async () => {
    const confirmed = window.confirm(
      `Requesting access to ${projectTitle}?\n\n` +
      `Please fill out the contact form below.\n\n` +
      `Be sure to include your GitHub username so I can grant access.`
    );
  
    if (confirmed) {
      setContactRequest(
        `Access request: ${projectTitle}`,
        `Hi, I'd like to request access to "${projectTitle}".\n\nMy GitHub username: `
      );
      document.getElementById('message')?.focus();
    }
  };

  return (
    <button onClick={handleRequestAccess} className="text-white text-lg">
      <FaLock />
    </button>
  );
}

function ProjectCard({ project }: { project: Project; }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollVisibility(cardRef);

  const handleProjectClick = () => {
    trackProjectView(project.id, project.title);
  };

  const handleLinkClick = (url: string, type: string) => {
    trackExternalLink(url, `Project ${type}`);
  };

  return (
    <li className={"glass-card overflow-hidden group fade-in-up" + (isVisible ? " visible" : "")}>
      {/* Project Image */}
      <div ref={cardRef} className="relative h-64 md:h-72 overflow-hidden">
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
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent-gold transition-colors">
          {project.title}
        </h3>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs bg-accent-gold/20 text-accent-gold rounded-full border border-accent-gold/30">
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
        <div className="flex items-center gap-5 pt-4 border-t border-gray-700">
          {project.isPrivate ? (
            <RequestAccessButton projectTitle={project.title} />
          ) : (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(project.githubUrl!, 'GitHub')}
              className="text-white text-lg">
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
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm font-medium">
              <span>View</span>
              <FaExternalLinkAlt />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

function OtherProjectCard({ project }: { project: Project; }) {
 
  return (
    <li className="inline-block relative m-2 md:m-4">
	    <div className="h-64 md:h-72 overflow-hidden">
        <Image
          src={project.image || '/images/placeholder-project.jpg'}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-dark-300/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        <a className={`py-2 w-full font-bold block text-center text-white text-sm`} style={{ backgroundColor: bg[project.color || "greenish"] }} href={project.liveUrl} target = "_blank" rel = "noopener noreferrer">{project.title}</a>
      </div>
		</li>
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
      aria-labelledby="projects-heading">
      <div className="container-custom">
        {/* Section Heading */}
        <header className={"text-center mb-16 fade-in-up" + (isVisible ? " visible" : "")}>
          <h2 className="section-heading">Featured Projects</h2>
          <p className="text-gray-400 mt-4 text-lg">
            A selection of my best work showcasing diverse skills and technologies.
          </p>
        </header>

        {/* Main Projects */}
        {mainProjects.length > 0 && (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap:16 mb-16 max-w-4xl mx-auto">
            {mainProjects.map((project, index) => <ProjectCard key={project.id} project={project} />)}
          </ul>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="section-heading">
              Other Projects
            </h3>
            <ul className="scrollbar">
              {otherProjects.map((project, index) => <OtherProjectCard key={project.id} project={project} />
              )}
            </ul>
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
