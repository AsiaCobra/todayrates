# GitHub Pages SPA SEO Fix

## Problem
Google Search Console returned 404 for routes like `/gold`, `/currency`, etc. because GitHub Pages couldn't find files at those paths. The 404.html redirect workaround works in browsers but Google sees the 404 status code.

## Solution
Added `scripts/generate-routes.js` that runs during build to create `{route}/index.html` for each route. This makes GitHub Pages return 200 status code instead of 404.

## Routes Covered
- `/gold`
- `/currency`
- `/petrol`
- `/gold-history`
- `/privacy-policy`
- `/terms-of-service`
- `/contact`
- `/about`

## How It Works
1. `npm run predeploy` builds the production app
2. `generate-routes.js` copies `dist/index.html` to each route folder
3. GitHub Pages serves `gold/index.html` when `/gold` is requested (HTTP 200)
4. React Router handles the actual routing client-side

## Adding New Routes
To add a new SEO-friendly route, update the `routes` array in `scripts/generate-routes.js`.
