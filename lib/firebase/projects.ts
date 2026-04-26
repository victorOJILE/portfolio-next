import { db } from './config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  image: string;
  techStack: string[];
  features?: string[];
  liveUrl?: string;
  githubUrl?: string;
  order: number;
}

export interface ProjectsData {
  mainProjects: Project[];
  otherProjects: Project[];
}

/**
 * Fetches all projects from Firestore
 * Used for ISR (Incremental Static Regeneration)
 */
export async function getProjectsFromFirestore(): Promise<ProjectsData> {
  try {
    const mainProjectsRef = collection(db, 'main_projects');
    const otherProjectsRef = collection(db, 'other_projects');

    // Fetch both collections
    const [mainSnapshot, otherSnapshot] = await Promise.all([
      getDocs(query(mainProjectsRef)),
      getDocs(query(otherProjectsRef)),
    ]);

    const mainProjects = mainSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];

    const otherProjects = otherSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];

    // Sort by order field
    mainProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
    otherProjects.sort((a, b) => (a.order || 0) - (b.order || 0));

    return {
      mainProjects,
      otherProjects,
    };
  } catch (error) {
    console.error('Error fetching projects from Firestore:', error);
    return {
      mainProjects: [],
      otherProjects: [],
    };
  }
}
