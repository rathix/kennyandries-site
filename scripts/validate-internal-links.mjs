import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const ignoredDirs = new Set(['.git', '.github', '.claude', '.vscode', 'node_modules']);
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      walk(path.join(dir, entry.name));
      continue;
    }

    if (entry.name.endsWith('.html')) {
      htmlFiles.push(path.relative(rootDir, path.join(dir, entry.name)).replaceAll(path.sep, '/'));
    }
  }
}

function toAbsolutePath(fromHtmlFile, reference) {
  const [withoutHash] = reference.split('#');
  const [cleanRef] = withoutHash.split('?');

  if (cleanRef.startsWith('/')) {
    return cleanRef;
  }

  const fromDir = '/' + path.posix.dirname(fromHtmlFile);
  return path.posix.normalize(path.posix.join(fromDir, cleanRef));
}

function existsForRoute(routePath) {
  const normalized = routePath === '' ? '/' : routePath;
  const clean = normalized.replace(/\/+$/, '') || '/';

  const candidates = [];
  if (clean === '/') {
    candidates.push('index.html');
  } else if (clean.endsWith('.html')) {
    candidates.push(clean.slice(1));
  } else if (path.posix.extname(clean)) {
    candidates.push(clean.slice(1));
  } else {
    candidates.push(clean.slice(1));
    candidates.push(path.posix.join(clean.slice(1), 'index.html'));
    candidates.push(`${clean.slice(1)}.html`);
  }

  return candidates.some((candidate) => fs.existsSync(path.join(rootDir, candidate)));
}

walk(rootDir);

const attrRegex = /(?:href|src)="([^"]+)"/g;
const problems = [];

for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(path.join(rootDir, htmlFile), 'utf8');

  for (const match of content.matchAll(attrRegex)) {
    const rawRef = match[1];
    if (!rawRef) continue;

    if (
      rawRef.startsWith('#') ||
      rawRef.startsWith('mailto:') ||
      rawRef.startsWith('tel:') ||
      rawRef.startsWith('data:') ||
      rawRef.startsWith('javascript:') ||
      rawRef.startsWith('http://') ||
      rawRef.startsWith('https://') ||
      rawRef.startsWith('//')
    ) {
      continue;
    }

    const resolved = toAbsolutePath(htmlFile, rawRef);
    if (!existsForRoute(resolved)) {
      problems.push(`${htmlFile}: unresolved local reference \"${rawRef}\" -> \"${resolved}\"`);
    }
  }
}

if (problems.length > 0) {
  console.error('Internal link check failed:\n');
  for (const issue of problems) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Internal link check passed for ${htmlFiles.length} HTML files.`);
