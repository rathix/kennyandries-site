# Kenny Andries - Personal Website

![Validate](https://github.com/rathix/kennyandries-site/actions/workflows/deploy.yaml/badge.svg)

Personal portfolio website showcasing my experience as a System Engineer specializing in Microsoft technologies, device management, and infrastructure automation.

**Live site:** [kennyandries.com](https://kennyandries.com)

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with CSS variables (Catppuccin Mocha theme)
- **Server:** Apache with mod_rewrite
- **Hosting:** Hetzner
- **CI/CD:** GitHub Actions with HTML validation

## Project Structure

```
kennyandries-site/
├── index.html              # Home page
├── about.html              # About/experience page
├── projects.html           # Project showcase
├── homelab.html            # Homelab documentation
├── kubernetes.html         # Kubernetes setup details
├── contact.html            # Contact page
├── 404.html                # Custom error page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── components-loader.js # Dynamic component loading
├── components/
│   ├── navbar.html         # Reusable navigation with mobile menu
│   └── footer.html         # Reusable footer
├── assets/
│   └── images/
│       ├── logo.png        # Logo (fallback)
│       ├── logo.webp       # Logo (optimized)
│       ├── portrait.jpg    # Profile photo
│       └── homelab.jpg     # Homelab photo
├── robots.txt              # Crawler directives
├── sitemap.xml             # XML sitemap for SEO
├── .htaccess               # Apache configuration
└── .github/
    └── workflows/
        └── deploy.yaml     # CI/CD pipeline
```

## Features

- **Clean URLs:** `/about` instead of `/about.html`
- **SEO Optimized:** Open Graph, Twitter Cards, structured data (JSON-LD), sitemap
- **Performance:** WebP images, gzip compression, browser caching
- **Accessibility:** Skip links, ARIA labels, semantic HTML, keyboard navigation
- **Responsive:** Mobile-first design with hamburger menu
- **Security Headers:** X-Content-Type-Options, X-Frame-Options, etc.

## Pages

| Page | Description |
|------|-------------|
| **Home** | Introduction with links to GitHub/LinkedIn |
| **About** | Experience timeline, skills grid, FAQ section |
| **Projects** | Showcase of notable projects |
| **Homelab** | Documentation of home server setup |
| **Kubernetes** | Details on K8s cluster configuration |
| **Contact** | Contact information and email link |

## Development

### Local Development

1. Clone the repository
2. Serve with any static file server:
   ```bash
   # Python
   python -m http.server 8000

   # Node.js
   npx serve

   # PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000`

> **Note:** Clean URLs require Apache with mod_rewrite. For local development, use `.html` extensions or configure your server.

### HTML Validation

```bash
npx html-validate "*.html" --config .htmlvalidate.json
```

### Code Style

- HTML: Self-closing void elements (`<meta />`, `<link />`)
- CSS: BEM-like naming, CSS variables for theming
- JS: ES6+, no external dependencies

## Deployment

Deployment is automated via GitHub Actions:

1. Push to `main` branch triggers the workflow
2. HTML validation runs first
3. On success, files are deployed via FTPS to Hetzner

### Required Secrets

- `ftp_password`: FTP password for deployment

## License

All rights reserved.
