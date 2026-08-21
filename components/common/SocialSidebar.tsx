'use client';

import { FaPhone, FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiUpwork, SiFiverr } from 'react-icons/si';
import { trackExternalLink } from '@/lib/firebase/analytics';

const socialPlatforms = [
{
 href: 'tel:+2347049505501',
 icon: FaPhone,
 label: 'Call me',
 bgColor: 'bg-green-600',
 platform: 'Phone'
},
{
 href: 'https://www.facebook.com/victor.ojile.79',
 icon: FaFacebook,
 label: 'Facebook',
 bgColor: 'bg-blue-600',
 platform: 'Facebook'
},
{
 href: 'https://www.linkedin.com/in/victor-ojile-aa4896208',
 icon: FaLinkedin,
 label: 'LinkedIn',
 bgColor: 'bg-blue-700',
 platform: 'LinkedIn'
},
{
 href: 'https://github.com/victorOJILE',
 icon: FaGithub,
 label: 'GitHub',
 bgColor: 'bg-gray-700',
 platform: 'GitHub'
},
{
 href: 'https://www.fiverr.com/victordmn',
 icon: SiFiverr,
 label: 'Fiverr',
 bgColor: 'bg-green-500',
 platform: 'Fiverr'
},
{
 href: 'https://www.upwork.com/freelancers/~0149421a8117f8e35e',
 icon: SiUpwork,
 label: 'Upwork',
 bgColor: 'bg-green-600',
 platform: 'Upwork'
}
];

export default function SocialSidebar() {
 const handleClick = (platform: string, url: string) => {
  trackExternalLink(url, platform);
 };
 
 return (
  <aside
   className="fixed right-0 bottom-[15%] z-40 no-print"
   aria-label="Social media contact links">
   <div
    className="flex flex-col space-y-2 bg-dark-300/80 backdrop-blur-sm rounded-l-lg p-2 shadow-lg">
    {socialPlatforms.map((platform, index) => (
    <a
     key={platform.platform}
     href={platform.href}
     target={platform.href.startsWith('tel:') ? undefined : '_blank'}
     rel={platform.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
     onClick={() => handleClick(platform.platform, platform.href)}
     className={`${platform.bgColor} w-8 h-8 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-md hover:shadow-lg`}
     aria-label={platform.label}
     title={platform.label}>
     <platform.icon className="w-4 h-4" />
    </a>
    ))}
   </div>
  </aside>
 );
}