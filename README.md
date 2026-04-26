# Victor Ojile - Portfolio Website

A modern, performant portfolio website built with Next.js, featuring dynamic project loading from Firestore, email contact functionality, and beautiful animations.

## 🚀 Features

- **Incremental Static Regeneration (ISR)** - Projects loaded from Firestore with 1-hour revalidation
- **Server-Side Email** - Contact form using Nodemailer with rate limiting
- **Optimized Performance** - Image optimization, code splitting, lazy loading
- **SEO Optimized** - Comprehensive metadata, semantic HTML, structured data
- **Accessible** - WCAG 2.1 AA compliant, keyboard navigation, screen reader friendly
- **Animations** - Smooth transitions using Framer Motion
- **Analytics** - Firebase Analytics integration
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Bold & Colorful Aesthetic** - Eye-catching design with gradient effects

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase project set up
- Gmail account for email functionality (or SMTP credentials)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd nextjs-portfolio
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Firestore Database
4. Enable Analytics (optional)
5. Get your configuration from Project Settings

#### Create Firestore Collections

Create two collections in Firestore:

**Collection: `main_projects`**
```javascript
{
  title: "Project Title",
  description: "Project description explaining what it does",
  image: "https://your-image-url.com/image.jpg", // or Firebase Storage URL
  technologies: ["React", "Node.js", "MongoDB"],
  features: [
    "Feature 1 description",
    "Feature 2 description",
    "Feature 3 description"
  ],
  liveUrl: "https://project-demo.com",
  githubUrl: "https://github.com/username/repo",
  category: "Web Application",
  order: 1  // Used for sorting
}
```

**Collection: `other_projects`**
Same structure as main_projects, use `order` field to control display order.

### 3. Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
   - Copy the 16-character password

### 4. Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Email Configuration
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_TO=victor@example.com  # Where contact form emails go
```

### 5. Add Your Content

#### Profile Image
- Add your profile photo to `/public/images/victor-profile.jpg`

#### CV/Resume
- Add your CV to `/public/documents/victor_ojile_cv.pdf`

#### Logo
- Add your logo to `/public/images/website_logo.png`

#### Project Images
- Upload project screenshots to Firebase Storage or `/public/images/projects/`

#### Background Images
- Add hero background: `/public/images/nature-2608274_12835.jpg`
- Add section background: `/public/images/nature-2608274_1283.jpg`

### 6. Customize Content

Edit the following files to match your information:

**`components/sections/HeroSection.tsx`**
- Update hero text and tagline
- Modify social links

**`components/sections/AboutSection.tsx`**
- Update bio and experience
- Modify quick facts

**`components/sections/SkillsSection.tsx`**
- Add/remove skills
- Update competencies

**`components/common/Footer.tsx`**
- Update copyright year and name
- Add/remove social links

**`components/common/SocialSidebar.tsx`**
- Update social media URLs

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Visit `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📱 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel Configuration:
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Environment Variables in Vercel

Add all variables from `.env.local` to Vercel:
1. Project Settings → Environment Variables
2. Add each variable (both Development and Production)

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize colors:

```javascript
colors: {
  primary: { ... },    // Red tones
  secondary: { ... },  // Blue tones
  accent: { ... },     // Yellow, Gold, Green
  dark: { ... },       // Dark backgrounds
}
```

### Fonts

Fonts are in `/public/fonts/`:
- `OpenSans-Regular.ttf` - Body text
- `BBeauty-v5.02-*.ttf` - Headings
- `Crimson-Italic.ttf` - Decorative text

Replace these files to use custom fonts.

### Animations

Adjust animations in:
- `tailwind.config.js` - Keyframes and timing
- Component files - Framer Motion variants

## 📊 Analytics

Track user interactions with Firebase Analytics:
- Page views
- Project clicks
- Social media clicks
- CV downloads
- Form submissions

Analytics automatically track when deployed. View in Firebase Console → Analytics.

## 🔒 Security Features

- Rate limiting on contact form (3 emails/hour per IP)
- Email validation
- Input sanitization
- CORS headers
- Content Security Policy headers
- XSS protection

## ⚡ Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- ISR for dynamic content
- Font optimization
- Asset preloading
- Minification and compression

## 📝 Project Structure

```
nextjs-portfolio/
├── components/
│   ├── common/          # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SocialSidebar.tsx
│   │   └── BackToTop.tsx
│   └── sections/        # Page sections
│       ├── HeroSection.tsx
│       ├── ProjectsSection.tsx
│       ├── AboutSection.tsx
│       ├── SkillsSection.tsx
│       └── ContactSection.tsx
├── hooks/               # Custom React hooks
│   ├── useScrollVisibility.ts
│   └── useBackToTop.ts
├── lib/
│   └── firebase/        # Firebase configuration
│       ├── config.ts
│       ├── projects.ts
│       └── analytics.ts
├── pages/
│   ├── api/
│   │   └── contact.ts   # Email API endpoint
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx        # Main page
├── public/
│   ├── images/          # Static images
│   ├── fonts/           # Custom fonts
│   └── documents/       # CV and documents
├── styles/
│   └── globals.css      # Global styles
└── utils/               # Utility functions
```

## 🐛 Troubleshooting

### Firebase Connection Issues
- Check if Firebase config is correct in `.env.local`
- Ensure Firestore rules allow public read access
- Verify collections `main_projects` and `other_projects` exist

### Email Not Sending
- Verify Gmail app password is correct (16 characters, no spaces)
- Check EMAIL_USER and EMAIL_PASS in environment variables
- Ensure 2FA is enabled on Gmail account
- Check Vercel logs for specific errors

### Images Not Loading
- Check image paths in Firestore match actual files
- Verify Firebase Storage CORS configuration
- Ensure images are in `/public` directory or accessible URLs

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install`
- Rebuild: `npm run build`

## 📄 License

This project is private and proprietary. All rights reserved.

## 👤 Author

**Victor Ojile**
- Website: [victorojile.com](https://victorojile.com)
- LinkedIn: [victor-ojile](https://linkedin.com/in/victor-ojile-aa4896208)
- GitHub: [@victorOJILE](https://github.com/victorOJILE)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Firebase and Vercel documentation
3. Contact via the portfolio contact form

---

Built with ❤️ using Next.js, Firebase, and Tailwind CSS
