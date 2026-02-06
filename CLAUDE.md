# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal portfolio website for Kenny Andries (kennyandries.be). Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no package.json.

## Commands

**Run locally** (clean URLs won't work without Apache; use `.html` extensions):
```bash
python -m http.server 8000
# or: npx serve
```

**Validate HTML:**
```bash
npx html-validate "*.html" --config .htmlvalidate.json
```

There are no test suites, linters, or build steps beyond HTML validation.

## Architecture

**Component loading:** `js/components-loader.js` dynamically fetches `components/navbar.html` and `components/footer.html` via the Fetch API and injects them into each page. It re-executes any `<script>` tags within loaded components and handles Apache clean URL path normalization.

**Page pattern:** Every HTML page follows the same structure — SEO metadata in `<head>` (Open Graph, Twitter Cards, JSON-LD structured data), a navbar placeholder div, main content, a footer placeholder div, and a deferred script tag loading `components-loader.js`.

**Styling:** Single stylesheet `css/styles.css` using CSS custom properties based on the Catppuccin Mocha color palette. Terminal/CLI-inspired aesthetic with JetBrains Mono font. Mobile-first responsive design with breakpoints at 480px and 768px.

**Clean URLs:** `.htaccess` rewrites `/about` to `/about.html` with 301 redirects. The navbar component handles path normalization for active link detection across both clean and extension-based URLs.

## Code Conventions

- HTML: self-closing void elements (`<meta />`, `<link />`, `<img />`)
- HTML: double-quoted attributes
- CSS: BEM-like class naming (`.navbar-menu`, `.navbar-toggle`)
- CSS: all theme values via CSS custom properties
- JS: ES6+, no external dependencies
- Images: provide both WebP and fallback (PNG/JPG) formats

## Deployment

Automated via GitHub Actions on push to `main`: HTML validation runs first, then FTPS deployment to Hetzner (`public_html/`). The `ftp_password` GitHub secret is required.
