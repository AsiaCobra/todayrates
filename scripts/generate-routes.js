import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

// Routes that need individual HTML files for GitHub Pages SEO
const routes = [
  'gold',
  'currency',
  // 'petrol',
  // 'gold-history',
  'privacy-policy',
  'terms-of-service',
  'contact',
  'about'
];

// Copy 404.html to dist
const publicDir = path.join(__dirname, '..', 'public');
fs.copyFileSync(
  path.join(publicDir, '404.html'),
  path.join(distDir, '404.html')
);
console.log('Copied 404.html');

// Read the built index.html
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Create HTML file for each route
routes.forEach(route => {
  const routePath = path.join(distDir, route);

  // Create directory if it doesn't exist
  if (!fs.existsSync(routePath)) {
    fs.mkdirSync(routePath, { recursive: true });
  }

  // Copy index.html to route/index.html
  fs.writeFileSync(path.join(routePath, 'index.html'), indexHtml);
  console.log(`Created ${route}/index.html`);
});

console.log('\nAll route HTML files generated successfully!');
console.log('GitHub Pages will now return 200 for these routes instead of 404.');
