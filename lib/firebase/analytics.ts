import { analytics } from './config';
import { logEvent } from 'firebase/analytics';

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics && typeof window !== 'undefined') {
    logEvent(analytics, eventName, eventParams);
  }
};

// Common tracking events
export const trackClick = (elementName: string, extraData?: Record<string, any>) => {
  trackEvent('click', {
    element: elementName,
    timestamp: new Date().toISOString(),
    ...extraData,
  });
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_name: pageName,
    timestamp: new Date().toISOString(),
  });
};

export const trackProjectView = (projectId: string, projectTitle: string) => {
  trackEvent('view_project', {
    project_id: projectId,
    project_title: projectTitle,
  });
};

export const trackContactFormSubmit = () => {
  trackEvent('contact_form_submit', {
    timestamp: new Date().toISOString(),
  });
};

export const trackDownloadCV = () => {
  trackEvent('download_cv', {
    timestamp: new Date().toISOString(),
  });
};

export const trackExternalLink = (url: string, platform: string) => {
  trackEvent('external_link_click', {
    url,
    platform,
    timestamp: new Date().toISOString(),
  });
};
