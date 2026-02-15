# Terminal Desktop Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform kennyandries.com into an immersive terminal desktop environment with interactive CLI homepage, neofetch hero, terminal window chrome on all pages, and tmux-style tab navigation.

**Architecture:** Vanilla HTML/CSS/JS. The terminal window is a pure CSS/HTML component (`.terminal-window` wrapper with `.terminal-titlebar` and `.terminal-body`). The interactive CLI on the homepage is a standalone JS module. The existing `components-loader.js` pattern is preserved for navbar/footer. All SEO metadata stays intact. Each page wraps its `<main>` content inside the terminal window markup.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), vanilla ES6+ JavaScript. No frameworks, no build tools, no dependencies.

**Design doc:** `docs/plans/2026-02-15-terminal-redesign-design.md`

**Validation command:** `npx html-validate "**/*.html" --config .htmlvalidate.json`

**Local preview:** `python -m http.server 8000` then open `http://localhost:8000`

**XSS Note:** The interactive terminal in `js/terminal.js` accepts text input from users. All user input MUST be escaped via `textContent` or a dedicated `escapeHtml()` function before rendering. The neofetch output uses only hardcoded strings. DOM construction should use `document.createElement()` + `textContent` for any user-derived content.

---

### Task 1: CSS Foundation — Desktop Background & Terminal Window Component

**Files:**
- Modify: `css/styles.css`

**Context:** This task replaces the base styles and adds the terminal window component CSS. All subsequent tasks depend on this. The existing CSS has sections marked with `/* ===== Section ===== */` comments. We rewrite the Base/Theme, Layout, and add a new Terminal Window section. We keep all existing component styles (about, projects, homelab, etc.) and modify them to work inside terminal windows.

**Step 1: Update root variables and body styles**

Add new variables to `:root` and change `body` to use `--bg-alt` as the desktop background:

```css
:root {
    /* ... existing variables stay ... */

    /* NEW: Terminal window */
    --terminal-radius: 8px;
    --terminal-titlebar-h: 36px;
    --terminal-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
    --terminal-border: 1px solid var(--surface);

    /* NEW: Glow effect for headings/prompts */
    --glow-accent: 0 0 10px rgba(137, 180, 250, 0.15);
    --glow-green: 0 0 10px rgba(166, 227, 161, 0.15);
}
```

Change `body` background from `--bg` to `--bg-alt`:
```css
body {
    /* ... keep existing properties ... */
    background: var(--bg-alt);
}
```

**Step 2: Add terminal window component CSS**

Add after the Layout section:

```css
/* ===== Terminal Window ===== */
.terminal-window {
    background: var(--bg);
    border: var(--terminal-border);
    border-radius: var(--terminal-radius);
    box-shadow: var(--terminal-shadow);
    overflow: hidden;
    max-width: var(--max-w);
    margin: 0 auto;
}

.terminal-titlebar {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: 0 var(--space-md);
    height: var(--terminal-titlebar-h);
    background: var(--surface);
    border-bottom: 1px solid var(--overlay);
    user-select: none;
}

.terminal-dots {
    display: flex;
    gap: 6px;
}

.terminal-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.terminal-dot--close { background: var(--red); }
.terminal-dot--minimize { background: var(--yellow); }
.terminal-dot--maximize { background: var(--green); }

.terminal-title {
    flex: 1;
    text-align: center;
    color: var(--muted);
    font-size: var(--fs-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* Offset to visually center despite dots on left */
    margin-right: 54px;
}

.terminal-body {
    padding: var(--space-xl) var(--space-lg);
}
```

**Step 3: Update heading styles for command-prompt look**

Replace the existing `h2::before` style:

```css
/* Command prompt style for headings */
h2::before {
    content: '$ ';
    color: var(--green);
    margin-right: 0;
    font-weight: 400;
}
```

Add glow to h1:
```css
h1 {
    /* ... existing ... */
    text-shadow: var(--glow-accent);
}
```

**Step 4: Update `.content-container` to remove its own max-width**

Since the terminal window now handles max-width and centering:
```css
.content-container {
    max-width: none;
    margin: 0;
    padding: var(--space-xl) 0;
}
```

**Step 5: Add section divider style using box-drawing characters**

```css
/* Terminal section divider */
.terminal-divider {
    border: none;
    color: var(--surface);
    font-size: var(--fs-sm);
    text-align: left;
    margin: var(--space-xl) 0;
    overflow: hidden;
}

.terminal-divider::before {
    content: '────────────────────────────────────────────────────';
    color: var(--overlay);
}
```

**Step 6: Validate**

Run: `npx html-validate "**/*.html" --config .htmlvalidate.json`
Expected: All files pass (we only changed CSS, no HTML yet).

**Step 7: Commit**

```bash
git add css/styles.css
git commit -m "feat: add terminal window CSS foundation and desktop background"
```

---

### Task 2: Navbar Component — Tmux-style Tab Bar

**Files:**
- Modify: `components/navbar.html`
- Modify: `css/styles.css` (Navigation section)

**Context:** Replace the current navbar with a tmux-style tab bar that sits at the top of the viewport. The tab bar uses `--bg-alt` background (blending with the desktop) and has bracket-style tab indicators.

**Step 1: Rewrite `components/navbar.html`**

```html
<nav class="tab-bar" aria-label="Main">
    <div class="tab-bar-inner">
        <ul class="tab-bar-tabs" id="navbarItems">
            <li><a href="/" id="navbarHome"><span class="tab-bracket">[</span> ~ home <span class="tab-bracket">]</span></a></li>
            <li><a href="/about" id="navbarAbout"><span class="tab-bracket">[</span> about <span class="tab-bracket">]</span></a></li>
            <li><a href="/projects" id="navbarProjects"><span class="tab-bracket">[</span> projects <span class="tab-bracket">]</span></a></li>
            <li><a href="/contact" id="navbarContact"><span class="tab-bracket">[</span> contact <span class="tab-bracket">]</span></a></li>
            <li><a href="/assets/blobs/kenny_andries_cv.pdf" download id="navbarCv"><span class="tab-bracket">[</span> cv &darr; <span class="tab-bracket">]</span></a></li>
        </ul>

        <button type="button" class="tab-bar-toggle" id="navbarToggle" aria-label="Toggle menu" aria-controls="navbarItems" aria-expanded="false">
            <span class="burger" aria-hidden="true">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </span>
            <span class="sr-only">Menu</span>
        </button>
    </div>
</nav>
```

**Step 2: Replace the Navigation CSS section in `css/styles.css`**

Remove all existing `.navbar*` styles and replace with:

```css
/* ===== Tab Bar (tmux-style navigation) ===== */
.tab-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg-alt);
    border-bottom: 1px solid var(--surface);
    padding: 0 var(--space-lg);
}

.tab-bar-inner {
    max-width: var(--max-w);
    margin: 0 auto;
    display: flex;
    align-items: center;
    height: 40px;
}

.tab-bar-tabs {
    list-style: none;
    display: flex;
    gap: 0;
    margin: 0;
    padding: 0;
}

.tab-bar-tabs a {
    display: inline-block;
    padding: var(--space-sm) var(--space-md);
    color: var(--muted);
    font-size: var(--fs-sm);
    transition: color 0.15s ease, background 0.15s ease;
    white-space: nowrap;
}

.tab-bracket {
    color: var(--overlay);
    transition: color 0.15s ease;
}

.tab-bar-tabs a:hover {
    color: var(--text);
}

.tab-bar-tabs a:hover .tab-bracket {
    color: var(--muted);
}

.tab-bar-tabs a.active {
    color: var(--accent);
}

.tab-bar-tabs a.active .tab-bracket {
    color: var(--accent);
}

/* Hamburger toggle (mobile) */
.tab-bar-toggle {
    display: none;
    border: 1px solid var(--surface);
    background: transparent;
    padding: var(--space-sm);
    border-radius: var(--radius);
    margin-left: auto;
    cursor: pointer;
    color: var(--text);
    transition: border-color 0.15s ease, background 0.15s ease;
}

.tab-bar-toggle:hover {
    border-color: var(--muted);
    background: var(--surface);
}

.tab-bar-toggle:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: 2px;
}

.tab-bar-toggle .burger {
    position: relative;
    display: inline-block;
    width: 18px;
    height: 12px;
}

.tab-bar-toggle .bar {
    position: absolute;
    left: 0;
    width: 100%;
    height: 1.5px;
    background: currentColor;
    transition: transform 0.2s ease, opacity 0.15s ease, top 0.2s ease;
}

.tab-bar-toggle .bar:nth-child(1) { top: 0; }
.tab-bar-toggle .bar:nth-child(2) { top: 5px; }
.tab-bar-toggle .bar:nth-child(3) { top: 10px; }

.tab-bar-toggle[aria-expanded="true"] {
    border-color: var(--accent);
    background: var(--surface);
}

.tab-bar-toggle[aria-expanded="true"] .bar:nth-child(1) {
    top: 5px;
    transform: rotate(45deg);
}

.tab-bar-toggle[aria-expanded="true"] .bar:nth-child(2) {
    opacity: 0;
}

.tab-bar-toggle[aria-expanded="true"] .bar:nth-child(3) {
    top: 5px;
    transform: rotate(-45deg);
}
```

**Step 3: Verify `js/components-loader.js` compatibility**

The existing `initNavbar()` uses `document.getElementById('navbarToggle')` and `document.getElementById('navbarItems')` — both IDs are preserved in the new HTML. The `is-open` class toggle and active link detection both reference IDs, not CSS classes. The JS should work without changes.

**Step 4: Run HTML validation**

Run: `npx html-validate "**/*.html" --config .htmlvalidate.json`

**Step 5: Commit**

```bash
git add components/navbar.html css/styles.css
git commit -m "feat: replace navbar with tmux-style tab bar"
```

---

### Task 3: Footer Component — Terminal Status Line

**Files:**
- Modify: `components/footer.html`
- Modify: `css/styles.css` (Footer section)
- Modify: `js/components-loader.js` (update `initFooter()`)

**Step 1: Rewrite `components/footer.html`**

```html
<footer class="status-bar">
    <div class="status-bar-inner">
        <span class="status-bar-segment">kenny@homelab</span>
        <span class="status-bar-sep">|</span>
        <span class="status-bar-segment" id="status-bar-path"></span>
        <span class="status-bar-right">&copy; <span id="copyright-year"></span></span>
    </div>
</footer>
```

**Step 2: Replace Footer CSS section**

```css
/* ===== Status Bar (Footer) ===== */
.status-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--surface);
    border-top: 1px solid var(--overlay);
    padding: 0 var(--space-lg);
}

.status-bar-inner {
    max-width: var(--max-w);
    margin: 0 auto;
    display: flex;
    align-items: center;
    height: 28px;
    gap: var(--space-sm);
}

.status-bar-segment {
    color: var(--muted);
    font-size: var(--fs-xs);
}

.status-bar-sep {
    color: var(--overlay);
    font-size: var(--fs-xs);
}

.status-bar-right {
    margin-left: auto;
    color: var(--muted);
    font-size: var(--fs-xs);
}
```

**Step 3: Update `initFooter()` in `js/components-loader.js`**

Add path detection to the footer init. Use `textContent` (not innerHTML) for safe DOM updates:

```javascript
function initFooter() {
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const pathEl = document.getElementById('status-bar-path');
    if (pathEl) {
        const path = window.location.pathname.replace(/\/$/, '') || '~';
        pathEl.textContent = path === '~' ? '~' : '~' + path;
    }
}
```

**Step 4: Adjust body padding for fixed status bar**

Add to body:
```css
body {
    /* ... existing ... */
    padding-bottom: calc(var(--space-xl) + 28px); /* account for fixed status bar */
}
```

**Step 5: Commit**

```bash
git add components/footer.html css/styles.css js/components-loader.js
git commit -m "feat: replace footer with terminal status bar"
```

---

### Task 4: Homepage — Neofetch Hero & Interactive CLI

**Files:**
- Modify: `index.html`
- Create: `js/terminal.js` (interactive CLI logic)
- Modify: `css/styles.css` (Home Page section)

**Context:** This is the biggest task. The homepage becomes a single terminal window with a neofetch-style hero that types out on load, followed by an interactive command prompt.

**Step 1: Create `js/terminal.js`**

This module handles the typing animation and interactive CLI. All user input is escaped through `textContent` assignment to prevent XSS. Only hardcoded static content uses element creation with pre-built strings.

Key implementation details:
- The neofetch output is built entirely from hardcoded string arrays (no user input)
- User command input is always set via `textContent` on a created text node or element
- An `escapeHtml()` utility creates a temporary element and reads `textContent` for any dynamic text
- The `prefers-reduced-motion` check skips the typing animation and shows content immediately
- Clicking the terminal body focuses the input field
- Supported commands: `help`, `about`, `projects`, `contact`, `clear`, `whoami`, `sudo rm -rf /`, plus `ls projects/`, `cd about`, `cd projects`, `cd contact`, `cat about.txt`
- Navigation commands (`about`, `projects`, `contact`, `cd *`, `cat about.txt`, `ls projects/`) use `window.location.href` to navigate
- Unknown commands show: `bash: <escaped-input>: command not found` in `--red`

The PROMPT constant is `'kenny@homelab:~$ '`.

The ASCII art for neofetch is the initials "KA" in Unicode block characters, colored with `--accent`.

The SYSINFO key-value pairs use padded keys (9 chars) in `--accent` and values in `--text`.

**Step 2: Rewrite `index.html` body**

Keep all `<head>` metadata (title, description, OG tags, Twitter cards, JSON-LD, stylesheets) intact. Replace `<body>` content:

- Skip link stays
- Navbar placeholder stays
- Main content becomes a `.terminal-window.terminal-window--home` with:
  - `.terminal-titlebar` (title: `kenny@homelab:~`)
  - `.terminal-body` containing:
    - `#terminal-output` div with `role="log"` and `aria-live="polite"` for accessibility
    - `#terminal-input-line` div (initially `hidden`) with:
      - `.terminal-prompt` span (aria-hidden)
      - `<label for="terminal-input" class="sr-only">Enter a command</label>`
      - `<input type="text" id="terminal-input">` with `autocomplete="off"`, `autocapitalize="off"`, `spellcheck="false"`
- Below the terminal: `.home-social` div with muted links to GitHub, LinkedIn, contact
- Footer placeholder stays
- Both `components-loader.js` and `terminal.js` loaded with `defer`
- `<noscript>` block with plain HTML fallback (name, role, nav links)

**Step 3: Add homepage & terminal CLI CSS to `css/styles.css`**

Replace the existing Home Page section:

```css
/* ===== Home Page ===== */
.terminal-window--home {
    margin-top: var(--space-xl);
}

.terminal-window--home .terminal-body {
    min-height: 400px;
    max-height: 70vh;
    overflow-y: auto;
}

/* Neofetch output */
.neofetch {
    display: flex;
    gap: var(--space-xl);
    margin: var(--space-md) 0 var(--space-lg);
}

.nf-left pre,
.nf-right pre {
    margin: 0;
    font-size: var(--fs-sm);
    line-height: var(--lh-normal);
}

.nf-art { color: var(--accent); }
.nf-header { color: var(--accent); font-weight: 600; }
.nf-sep { color: var(--overlay); }
.nf-key { color: var(--accent); font-weight: 500; }
.nf-val { color: var(--text); }

/* Terminal prompt & input */
.terminal-line {
    font-size: var(--fs-sm);
    line-height: var(--lh-normal);
    white-space: pre-wrap;
    word-break: break-word;
}

.terminal-prompt {
    color: var(--green);
    font-weight: 500;
    text-shadow: var(--glow-green);
}

.terminal-input-line {
    display: flex;
    align-items: center;
    font-size: var(--fs-sm);
    line-height: var(--lh-normal);
    margin-top: var(--space-sm);
}

.terminal-input-field {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font: inherit;
    font-size: var(--fs-sm);
    padding: 0;
    caret-color: var(--accent);
}

.terminal-output-block {
    font-size: var(--fs-sm);
    color: var(--subtext);
    line-height: var(--lh-normal);
    margin: var(--space-xs) 0 var(--space-sm);
}

.terminal-error { color: var(--red); }

/* Social links below terminal */
.home-social {
    text-align: center;
    margin-top: var(--space-lg);
    font-size: var(--fs-sm);
}

.home-social a {
    color: var(--muted);
    transition: color 0.15s ease;
}

.home-social a:hover { color: var(--link); }

.home-social-sep {
    color: var(--overlay);
    margin: 0 var(--space-sm);
}
```

**Step 4: Run validation and preview**

Run: `npx html-validate "**/*.html" --config .htmlvalidate.json`
Preview: `python -m http.server 8000` — verify homepage renders with neofetch + CLI.

**Step 5: Commit**

```bash
git add index.html js/terminal.js css/styles.css
git commit -m "feat: interactive terminal homepage with neofetch hero and CLI"
```

---

### Task 5: About Page — Terminal Window Wrapping

**Files:**
- Modify: `about/index.html`

**Context:** Wrap the about page content inside the terminal window component. Keep all existing content and SEO metadata. Only change the `<body>` structure to wrap `<main>` content inside `.terminal-window`.

**Step 1: Wrap content in terminal window**

In `about/index.html`, replace the `<main>` block with:

```html
<main id="main-content">
    <div class="terminal-window">
        <div class="terminal-titlebar">
            <div class="terminal-dots">
                <span class="terminal-dot terminal-dot--close" aria-hidden="true"></span>
                <span class="terminal-dot terminal-dot--minimize" aria-hidden="true"></span>
                <span class="terminal-dot terminal-dot--maximize" aria-hidden="true"></span>
            </div>
            <span class="terminal-title">kenny@homelab:~/about</span>
        </div>
        <div class="terminal-body">
            <div class="content-container">
                <!-- ALL existing content from <main> goes here unchanged -->
            </div>
        </div>
    </div>
</main>
```

The `class="content-container"` div preserves existing styling for the about page content. All existing sections (about, experience, skills, languages, education, FAQ) remain inside it.

**Step 2: Run validation**

Run: `npx html-validate "**/*.html" --config .htmlvalidate.json`

**Step 3: Commit**

```bash
git add about/index.html
git commit -m "feat: wrap about page in terminal window"
```

---

### Task 6: Projects Page — Terminal Window + ls -la Styling

**Files:**
- Modify: `projects/index.html`
- Modify: `css/styles.css` (Projects Page section)

**Step 1: Wrap in terminal window and restyle project list**

In `projects/index.html`, wrap content in terminal window (same pattern as Task 5, window title: `kenny@homelab:~/projects`).

Restyle the project list to look like `ls -la` output. Each project becomes a clickable row:

The section heading becomes: `ls -la projects/`

Each project row is an `<a>` tag with grid columns: permissions (`drwxr-xr-x`), name (e.g., `kubernetes/`), and description.

**Step 2: Add ls -la project list CSS**

```css
/* ===== Projects Page (ls -la style) ===== */
.project-ls { font-size: var(--fs-sm); }

.project-ls-header {
    display: grid;
    grid-template-columns: 110px 180px 1fr;
    gap: var(--space-md);
    padding: var(--space-sm);
    color: var(--muted);
    border-bottom: 1px solid var(--surface);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.project-ls-row {
    display: grid;
    grid-template-columns: 110px 180px 1fr;
    gap: var(--space-md);
    padding: var(--space-sm);
    color: var(--text);
    text-decoration: none;
    border-bottom: 1px solid var(--surface);
    transition: background 0.1s ease;
}

.project-ls-row:hover {
    background: var(--surface);
    color: var(--text);
}

.project-ls-col { color: var(--muted); }
.project-ls-name { color: var(--accent); font-weight: 500; }
.project-ls-desc {
    color: var(--subtext);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

**Step 3: Validate and commit**

```bash
git add projects/index.html css/styles.css
git commit -m "feat: projects page with terminal window and ls -la listing"
```

---

### Task 7: Project Detail Pages — Terminal Window Wrapping

**Files:**
- Modify: `homelab/index.html`
- Modify: `kubernetes/index.html`
- Modify: `intune-migration/index.html`

**Context:** Same terminal window wrapping pattern. Each gets its own title bar path. Existing content structure stays — tech cards, service lists, stat grids all remain. The terminal window chrome is the only structural change.

**Step 1: Wrap each page in terminal window**

For each file, wrap the `<main>` content in the terminal window component:
- `homelab/index.html`: title = `kenny@homelab:~/projects/homelab`
- `kubernetes/index.html`: title = `kenny@homelab:~/projects/kubernetes`
- `intune-migration/index.html`: title = `kenny@homelab:~/projects/intune-migration`

Same HTML pattern as Task 5. Each page keeps all its existing content inside `.terminal-body > .content-container`.

**Step 2: Validate and commit**

```bash
git add homelab/index.html kubernetes/index.html intune-migration/index.html
git commit -m "feat: wrap project detail pages in terminal windows"
```

---

### Task 8: Contact Page — Terminal Window + Command Output Styling

**Files:**
- Modify: `contact/index.html`

**Step 1: Wrap in terminal window and restyle**

Window title: `kenny@homelab:~/contact`

Restyle the email display as command output. The heading becomes `echo $EMAIL` and the email is shown as command output. Add a links section with heading `cat links.txt` showing GitHub and LinkedIn URLs.

**Step 2: Validate and commit**

```bash
git add contact/index.html
git commit -m "feat: contact page with terminal window and command output style"
```

---

### Task 9: 404 Page — Terminal Error Style

**Files:**
- Modify: `404.html`

**Step 1: Redesign as terminal error**

Wrap in a terminal window (title: `kenny@homelab:~`). Content shows:
1. A command line: `kenny@homelab:~$ cd <current-path>` (path filled by a small inline script using `textContent`)
2. Error output: `bash: cd: No such file or directory` in `--red`
3. A help line: `kenny@homelab:~$ ` followed by a link styled as command text: `cd ~` linking to homepage

**Step 2: Validate and commit**

```bash
git add 404.html
git commit -m "feat: 404 page as terminal error message"
```

---

### Task 10: Mobile Responsive Adjustments

**Files:**
- Modify: `css/styles.css` (Responsive section)

**Step 1: Update mobile breakpoints**

Replace the existing responsive section with styles that handle:

**768px breakpoint:**
- `body` padding: `0 0 36px` (status bar)
- `.terminal-window`: no border-radius, no side borders, no shadow (full-width)
- `.terminal-body`: reduced padding
- `.terminal-titlebar`: smaller padding
- `.terminal-dot`: 10px size
- `.tab-bar-toggle`: visible
- `.tab-bar-tabs`: absolute dropdown below the bar, hidden by default, shown with `.is-open`
- `.neofetch`: flex-direction column (stacks vertically)
- `.about-header`: single column
- `.homelab-intro`: column direction
- `.project-ls-header`: hidden
- `.project-ls-row`: single column, hide permissions column
- `.project-ls-desc`: white-space normal (wrap)

**480px breakpoint:**
- Base font size: 0.9375rem
- `.skills-grid`: 2 columns
- `.nf-left` (ASCII art): hidden (too wide for small screens)

**Step 2: Validate and commit**

```bash
git add css/styles.css
git commit -m "feat: mobile responsive adjustments for terminal layout"
```

---

### Task 11: Accessibility & Reduced Motion

**Files:**
- Modify: `css/styles.css` (Motion section)

**Context:** Ensure reduced-motion preferences disable all animations. The `terminal.js` already handles `prefers-reduced-motion` for the typing animation. This task handles the CSS side.

**Step 1: Update the reduced motion media query**

The cursor blink animation should be stopped. All transitions reduced. Keep existing print styles.

**Step 2: Final full-site validation**

Run: `npx html-validate "**/*.html" --config .htmlvalidate.json`
Preview every page at `http://localhost:8000` — check desktop and mobile viewport.

**Step 3: Commit**

```bash
git add css/styles.css
git commit -m "feat: accessibility and reduced motion for terminal redesign"
```

---

### Task 12: Cleanup & Large Screen Styles

**Files:**
- Modify: `css/styles.css`

**Step 1: Remove old unused CSS classes**

Remove any orphaned styles from the old design that are no longer referenced in HTML:
- `.navbar`, `.navbar-brand`, `.navbar-menu`, `.navbar-toggle`, `.navbar img` (replaced by `.tab-bar-*`)
- `.home-header`, `.home-title`, `.home-subtitle`, `.home-intro`, `.home-links` (replaced by terminal homepage)
- `.site-footer` (replaced by `.status-bar`)

**Step 2: Keep large screen styles**

The existing large screen media queries (`min-width: 1800px` and `min-width: 2560px`) stay and continue to scale `--max-w` and base font size.

**Step 3: Final validation**

Run: `npx html-validate "**/*.html" --config .htmlvalidate.json`

**Step 4: Commit**

```bash
git add css/styles.css
git commit -m "chore: clean up old styles and finalize terminal redesign"
```

---

## Execution Order & Dependencies

```
Task 1 (CSS Foundation) ─────┐
                              ├─→ Task 4 (Homepage)
Task 2 (Navbar) ──────────────┤
                              ├─→ Task 5 (About)
Task 3 (Footer) ──────────────┤
                              ├─→ Task 6 (Projects)
                              ├─→ Task 7 (Detail Pages)
                              ├─→ Task 8 (Contact)
                              ├─→ Task 9 (404)
                              │
                              ├─→ Task 10 (Mobile)
                              ├─→ Task 11 (Accessibility)
                              └─→ Task 12 (Cleanup)
```

Tasks 1-3 must be done first (in order). Tasks 4-9 can be done in any order after 1-3. Tasks 10-12 come last.
