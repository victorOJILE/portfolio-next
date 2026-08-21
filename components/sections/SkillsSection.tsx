'use client';

import { useRef } from 'react';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import {
 SiReact,
 SiNextdotjs,
 SiTypescript,
 SiJavascript,
 SiNodedotjs,
 SiExpress,
 SiFirebase,
 SiMongodb,
 SiTailwindcss,
 SiGit
} from 'react-icons/si';

const skills = [
{
 name: 'React',
 icon: SiReact,
 color: 'text-cyan-400',
 description: 'Building interactive UIs'
},
{
 name: 'Next.js',
 icon: SiNextdotjs,
 color: 'text-white',
 description: 'Full-stack React framework'
},
{
 name: 'TypeScript',
 icon: SiTypescript,
 color: 'text-blue-500',
 description: 'Type-safe development'
},
{
 name: 'JavaScript',
 icon: SiJavascript,
 color: 'text-yellow-400',
 description: 'Core web language'
},
{
 name: 'Node.js',
 icon: SiNodedotjs,
 color: 'text-green-500',
 description: 'Backend runtime'
},
{
 name: 'Express',
 icon: SiExpress,
 color: 'text-gray-300',
 description: 'Web framework'
},
{
 name: 'Firebase',
 icon: SiFirebase,
 color: 'text-orange-500',
 description: 'Backend as a Service'
},
{
 name: 'MongoDB',
 icon: SiMongodb,
 color: 'text-green-600',
 description: 'NoSQL database'
},
{
 name: 'Tailwind CSS',
 icon: SiTailwindcss,
 color: 'text-cyan-400',
 description: 'Utility-first CSS'
},
{
 name: 'Git',
 icon: SiGit,
 color: 'text-orange-600',
 description: 'Version control'
}];

export default function SkillsSection() {
 const sectionRef = useRef<HTMLElement>(null);
 const isVisible = useScrollVisibility(sectionRef);
 
 return (
  <section
   ref={sectionRef}
   id="skills"
   className="section-padding bg-dark-300"
   aria-labelledby="skills-heading">
   <div className="container-custom">
    {/* Section Heading */}
    <header className={"text-center mb-16 fade-in-up" + (isVisible ? " visible" : "")}>
     <h2 className="section-heading">Technical Skills</h2>
    </header>

    {/* Skills Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
     {skills.map((skill, index) => (
     <div
      key={skill.name}
      className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer hover:scale-110 duration-500">
      {/* Icon */}
      <div className="mb-4">
       <skill.icon className={`w-16 h-16 ${skill.color} group-hover:drop-shadow-glow transition-all duration-300`} />
      </div>

      {/* Skill Name */}
      <h3 className="text-white font-bold text-lg mb-2">{skill.name}</h3>

      {/* Description */}
      <p className="text-gray-400 text-sm">{skill.description}</p>
     </div>
     ))}
    </div>

    {/* Additional Skills Text */}
    <div className="mt-12 text-center max-w-3xl mx-auto">
     <p className="text-gray-300 text-lg">
      Proficient in building responsive web applications, RESTful APIs, real-time features.
     </p>
    </div>
   </div>
  </section>
 );
}