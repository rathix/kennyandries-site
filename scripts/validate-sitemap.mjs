import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const sitemapPath = path.join(rootDir, 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('sitemap.xml not found.');
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const locRegex = /<loc>([^<]+)<\/loc>/g;
const sitemapRoutes = new Set();

for (const match of sitemap.matchAll(locRegex)) {
  const loc = match[1].trim();
  try {
    const pathname = new URL(loc).pathname.replace(/\/+$/, '') || '/';
    sitemapRoutes.add(pathname);
  } catch {
    console.error(`Invalid sitemap URL: ${loc}`);
    process.exit(1);
  }
}

const expectedRoutes = new Set(['/']);
for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const name = entry.name;
  if (name.startsWith('.')) continue;
  if (['assets', 'components', 'css', 'js', 'scripts', 'node_modules'].includes(name)) continue;

  const indexPath = path.join(rootDir, name, 'index.html');
  if (fs.existsSync(indexPath)) {
    expectedRoutes.add(`/${name}`);
  }
}

const missingInSitemap = [...expectedRoutes].filter((route) => !sitemapRoutes.has(route));
const extraInSitemap = [...sitemapRoutes].filter((route) => !expectedRoutes.has(route));

if (missingInSitemap.length || extraInSitemap.length) {
  console.error('Sitemap consistency check failed.');
  if (missingInSitemap.length) {
    console.error('\nMissing routes in sitemap.xml:');
    for (const route of missingInSitemap) {
      console.error(`- ${route}`);
    }
  }
  if (extraInSitemap.length) {
    console.error('\nRoutes present in sitemap.xml without matching page directories:');
    for (const route of extraInSitemap) {
      console.error(`- ${route}`);
    }
  }
  process.exit(1);
}

console.log(`Sitemap consistency check passed for ${expectedRoutes.size} routes.`);
