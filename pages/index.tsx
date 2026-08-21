import { GetStaticProps } from 'next';
import Head from 'next/head';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import ContactRequestProvider from '@/components/contexts/ContactRequestContext'
import { getProjectsFromFirestore, Project } from '@/lib/firebase/projects';

interface HomePageProps {
 mainProjects: Project[];
 otherProjects: Project[];
}

export default function HomePage({ mainProjects, otherProjects }: HomePageProps) {
 return (
  <>
   <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="canonical" href="https://victorojile.com" />
      
    <title>Victor Ojile - Full-Stack Web Developer Portfolio</title>
    <meta name="description" content="Full Stack Web Developer building fast, reliable web products. Expert in React, Next.js, Node.js, and Firebase. Available for freelance and full-time opportunities." />
    <meta name="keywords" content="Victor Ojile, Web Developer, Full-Stack Developer, React Developer, Next.js Developer, Node.js, Firebase, JavaScript, TypeScript, Portfolio, Freelance Developer" />
    <meta name="publisher" content="Victor Ojile" />
      
    {/* Format Detection */}
    <meta name="format-detection" content="telephone=no, address=no, email=no" />
      
    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="https://victorojile.com" />
    <meta property="og:site_name" content="Victor Ojile Portfolio" />
    <meta property="og:title" content="Victor Ojile - Full-Stack Web Developer" />
    <meta property="og:description" content="Full Stack Web Developer building fast, reliable web products, Specialized in the JavaScript Ecosystem and Modern Web Technologies." />
    <meta property="og:image" content="https://victorojile.com/images/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Victor Ojile - Web Developer" />
      
    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Victor Ojile - Full-Stack Web Developer" />
    <meta name="twitter:description" content="Full Stack Web Developer building fast, reliable web products, Specialized in the JavaScript Ecosystem and Modern Web Technologies." />
    <meta name="twitter:image" content="https://victorojile.com/images/og-image.jpg" />
   </Head>

   <HeroSection />
   <ContactRequestProvider>
    <ProjectsSection mainProjects={mainProjects} otherProjects={otherProjects} />
    <AboutSection />
    <SkillsSection />
    <ContactSection />
   </ContactRequestProvider>
  </>
 );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
 try {
  const { mainProjects, otherProjects } = await getProjectsFromFirestore();
  
  return {
   props: {
    mainProjects,
    otherProjects
   },
   // Revalidate every week (604800 seconds)
   // This enables Incremental Static Regeneration
   revalidate: 604800
  };
 } catch (error) {
  console.error('Error in getStaticProps:', error);
  
  // Return empty arrays if fetch fails
  return {
   props: {
    mainProjects: [],
    otherProjects: []
   },
   revalidate: 60 // Try again sooner if there was an error
  };
 }
};