# GitHub Pages Deployment Guide

## ✅ Changes Made for BrowserRouter

### 1. Switched Router
- Changed from `HashRouter` (URLs with #) to `BrowserRouter` (clean URLs)
- Old: `myanmarexchangerates.site/#/currency`
- New: `myanmarexchangerates.site/currency`

### 2. Added 404.html Workaround
- GitHub Pages redirects to 404.html for all non-root paths
- Our 404.html stores the path and redirects to root
- index.html restores the path using sessionStorage
- This makes client-side routing work on GitHub Pages

### 3. Updated Sitemap
- Removed # from all URLs
- Now uses clean paths: `/currency`, `/gold`, etc.

## 📦 How to Deploy

### Option 1: Using Vite Build + Manual Deploy

1. **Build the project:**
```bash
npm run build
```

2. **Copy 404.html to dist:**
```bash
cp public/404.html dist/404.html
```

3. **Deploy dist folder to GitHub Pages**

### Option 2: Using gh-pages Package (Recommended)

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json scripts:**
```json
{
  "scripts": {
    "predeploy": "npm run build && cp public/404.html dist/404.html",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Add base path in vite.config.js:**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // Or '/repository-name/' if not using custom domain
})
```

4. **Deploy:**
```bash
npm run deploy
```

### Option 3: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Copy 404.html
        run: cp public/404.html dist/404.html
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🔧 GitHub Pages Settings

1. Go to your repository Settings
2. Navigate to "Pages" section
3. Set Source to: `gh-pages` branch (root folder)
4. Add custom domain: `myanmarexchangerates.site`
5. Enable "Enforce HTTPS"

## 🌐 Custom Domain Setup

### A. Configure DNS (Your Domain Provider)

Add these records:

**For Apex Domain (myanmarexchangerates.site):**
```
Type: A
Name: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: YOUR-USERNAME.github.io
```

### B. In GitHub Repository

1. Go to Settings → Pages
2. Add custom domain: `myanmarexchangerates.site`
3. Wait for DNS check (can take 24-48 hours)
4. Enable "Enforce HTTPS" once verified

## ✅ Verification

After deployment, test these URLs:
- ✅ `https://myanmarexchangerates.site/`
- ✅ `https://myanmarexchangerates.site/currency`
- ✅ `https://myanmarexchangerates.site/gold`
- ✅ `https://myanmarexchangerates.site/about`

All should work without 404 errors!

## 🐛 Troubleshooting

### Issue: 404 on page refresh
**Solution:** Make sure 404.html is copied to dist folder

### Issue: Blank page after deployment
**Check:**
1. Base path in vite.config.js
2. Console for errors
3. Build succeeded without errors

### Issue: Routes not working
**Check:**
1. 404.html exists in deployed folder
2. index.html has redirect script
3. Using BrowserRouter (not HashRouter)

### Issue: Custom domain not working
**Wait:** DNS propagation can take 24-48 hours
**Check:** DNS records are correct
**Verify:** GitHub shows green checkmark on domain

## 📊 SEO Benefits of BrowserRouter

✅ **Clean URLs:** `/currency` instead of `/#/currency`
✅ **Better indexing:** Search engines prefer clean URLs
✅ **Shareable links:** More professional looking
✅ **Analytics:** Easier to track page views
✅ **User experience:** URLs match browser history

## 🎉 You're Done!

Your site now uses proper routing and is ready for production with better SEO!
