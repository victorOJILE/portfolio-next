import { GetStaticProps } from 'next';
import Head from 'next/head';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ContactSection from '../components/sections/ContactSection';
import { getProjectsFromFirestore, Project } from '../lib/firebase/projects';

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
      </Head>

      <HeroSection />
      <ProjectsSection mainProjects={mainProjects} otherProjects={otherProjects} />
      <AboutSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    const { mainProjects, otherProjects } = await getProjectsFromFirestore();

    return {
      props: {
        mainProjects,
        otherProjects,
      },
      // Revalidate every day (86400 seconds)
      // This enables Incremental Static Regeneration
      revalidate: 86400
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    
    // Return empty arrays if fetch fails
    return {
      props: {
        mainProjects: [],
        otherProjects: [],
      },
      revalidate: 60, // Try again sooner if there was an error
    };
  }
};
