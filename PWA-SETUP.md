# PWA Setup Guide

## Phase 1: PWA - Complete ✅

### Files Created:
1. **manifest.json** - Web app manifest for PWA
2. **sw.js** - Service worker for offline caching
3. **icons/favicon.svg** - Scalable vector icon

### Files Updated:
1. **index.html** - Added PWA meta tags and service worker registration
2. **chapters.html** - Added PWA meta tags and service worker registration

### Icons Needed:
For full PWA compatibility, you need to generate PNG icons from the SVG. You can use online tools like:

- **RealFaviconGenerator.net** - Upload icons/favicon.svg
- **Favicon.io** - Convert SVG to PNG
- **PNG to ICO** - Generate multiple sizes

Recommended icon sizes:
- 72x72 (small Android)
- 96x96 
- 128x128
- 144x144 (Android)
- 152x152 (iPad)
- 192x192 (Android)
- 384x384
- 512x512 (Android/iOS)

### To Test the PWA:
1. Serve the website over HTTPS (required for PWA)
2. Open in Chrome/Edge browser
3. Open DevTools (F12) → Application tab → Service Workers
4. You should see the service worker registered
5. Look for "Install" icon in the browser address bar

### For Local Testing:
Use a local server like:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# VS Code Live Server
```

### Next Steps (Phase 2: Mobile Prep):
1. Add touch controls to game
2. Apply responsive CSS
3. Update viewport settings

### Next Steps (Phase 3: Capacitor):
1. Run npm init
2. Install Capacitor
3. Add platforms (Android/iOS)
4. Migrate localStorage to capacitor storage
