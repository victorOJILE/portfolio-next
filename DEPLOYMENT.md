# Deployment Guide

## Pre-Deployment Checklist

### 1. Content Preparation

- [ ] Add profile photo to `/public/images/victor-profile.jpg`
- [ ] Add CV/resume to `/public/documents/victor_ojile_cv.pdf`
- [ ] Add logo to `/public/images/website_logo.png`
- [ ] Add hero background images
- [ ] Upload project images to Firebase Storage or `/public/images/projects/`

### 2. Firebase Setup

- [ ] Create Firebase project
- [ ] Enable Firestore Database
- [ ] Create `main_projects` collection with sample data
- [ ] Enable Firebase Analytics
- [ ] Configure Firestore security rules for public read access

### 3. Email Configuration

- [ ] Enable 2FA on Gmail account
- [ ] Generate Gmail App Password
- [ ] Test email locally with `npm run dev`

### 4. Environment Variables

- [ ] Copy all Firebase config values
- [ ] Add Gmail credentials
- [ ] Test all environment variables locally

### 5. Code Review

- [ ] Update personal information in components
- [ ] Update social media links
- [ ] Update contact email address
- [ ] Test all navigation links
- [ ] Verify all images load correctly
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Test contact form functionality
- [ ] Verify project cards display correctly

## Vercel Deployment Steps

### Initial Setup

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Portfolio website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - Framework Preset: **Next.js**
   - Root Directory: `./` (or your project root)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables, add:

   **Firebase Variables:**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
   ```

   **Email Variables:**
   ```
   EMAIL_USER
   EMAIL_PASS
   EMAIL_TO
   ```

   **Important:** Add variables to both Production and Preview environments.

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your live site!

### Custom Domain Setup (Optional)

1. **Add Domain in Vercel**
   - Project Settings → Domains
   - Add your custom domain (e.g., victorojile.com)

2. **Configure DNS**
   
   Add these records to your domain registrar:

   **For root domain (victorojile.com):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS Propagation**
   - Usually takes 24-48 hours
   - Check status in Vercel dashboard

### Post-Deployment

1. **Test the Live Site**
   - [ ] All pages load correctly
   - [ ] Images display properly
   - [ ] Contact form sends emails
   - [ ] Projects load from Firestore
   - [ ] Analytics tracking works
   - [ ] Mobile responsiveness
   - [ ] All links work

2. **Performance Check**
   - Run Lighthouse audit
   - Target scores:
     - Performance: 90+
     - Accessibility: 95+
     - Best Practices: 95+
     - SEO: 95+

3. **SEO Setup**
   - Submit sitemap to Google Search Console
   - Verify site ownership
   - Request indexing

## Firestore Security Rules

Add these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to projects
    match /main_projects/{document=**} {
      allow read: if true;
      allow write: if false; // Only allow writes through Firebase Console
    }
    
    match /other_projects/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Firebase Storage CORS (if using Storage for images)

Create `cors.json`:
```json
[
  {
    "origin": ["https://victorojile.com", "https://www.victorojile.com"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

Apply CORS:
```bash
gsutil cors set cors.json gs://YOUR-BUCKET-NAME.appspot.com
```

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel will:
1. Detect the push
2. Build the project
3. Deploy to production
4. Update your live site

## Monitoring

### Vercel Analytics
- Enable in Project Settings → Analytics
- Track Core Web Vitals
- Monitor page performance

### Firebase Analytics
- View in Firebase Console → Analytics
- Track user behavior
- Monitor project clicks
- Analyze contact form submissions

## Rollback (if needed)

If deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

## Troubleshooting

### Build Fails

**Error: Module not found**
- Check all imports are correct
- Verify file names match case-sensitive paths
- Run `npm install` to ensure all dependencies are installed

**Error: Environment variables not defined**
- Verify all env vars are added in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding variables

**Error: Firebase connection failed**
- Check Firebase config values
- Ensure Firestore database is created
- Verify security rules allow public read

### Site Deployed but Contact Form Doesn't Work

- Check EMAIL_USER and EMAIL_PASS in Vercel env vars
- Verify Gmail App Password is correct (16 chars, no spaces)
- Check Vercel function logs for errors
- Test API route directly: `https://your-site.com/api/contact`

### Projects Not Loading

- Verify Firestore collections exist and have data
- Check Firestore security rules allow public read
- Check browser console for errors
- Verify Firebase config in environment variables

### Images Not Loading

- Check image paths in Firestore
- Verify Firebase Storage CORS configuration
- Ensure images are in `/public` directory
- Check Next.js Image component domains in `next.config.js`

## Support

For additional help:
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
