# Terminal Desktop Redesign — Design Document

**Date:** 2026-02-15
**Status:** Approved

## Goal

Full visual redesign of kennyandries.com. The current site is well-structured but looks too plain. The redesign transforms it into an immersive terminal desktop environment while keeping the existing Catppuccin Mocha color scheme, JetBrains Mono font, and vanilla HTML/CSS/JS stack (no frameworks).

## Approach: "Desktop Environment"

The entire site looks like a retro terminal desktop environment. Each page is a terminal window with proper window chrome. The homepage features an interactive command prompt. Navigation uses a tmux-style tab bar.

## Visual Framework

### Desktop Background
- Page background: `--bg-alt` (#181825), the darkest Catppuccin color
- Acts as the "desktop wallpaper" behind terminal windows
- No CRT effects (no scanlines, no flicker, no screen curvature)
- Clean, crisp rendering throughout

### Terminal Window Component
Every content block lives inside a reusable terminal window component:
- **Title bar:** Thin bar with three colored dots (red `--red`, yellow `--yellow`, green `--green`) on the left. Window title shows a path like `kenny@homelab:~/about` in `--muted` text.
- **Window body:** Background `--bg` (#1e1e2e), border `--surface`. Slightly rounded corners (~6px) on the window outer, square corners on the content area.
- **Drop shadow:** Subtle shadow to lift windows off the desktop.

### Typography
- JetBrains Mono throughout (unchanged)
- Subtle text-shadow glow on headings and the prompt using `--accent` color (neon terminal feel, not CRT)
- All existing CSS custom properties maintained

## Homepage — The Interactive Terminal

The homepage is a single large terminal window centered on the desktop.

### Title Bar
`kenny@homelab:~$` with three colored dots.

### Part 1: Neofetch-style Hero
Typing animation runs on page load simulating a `neofetch` command. Output:
- **Left side:** ASCII art logo/initials "KA" in block letters using `--accent` and `--green`
- **Right side:** Key-value system info:
  ```
  kenny@homelab
  ─────────────
  Name     Kenny Andries
  Role     System Engineer & IT Consultant
  Company  NMBS/SNCB · Rathix Consulting
  Stack    Intune · Exchange · Entra ID · K8s
  OS       NixOS / Fedora Atomic
  Shell    PowerShell · Bash · Ansible
  Uptime   6+ years in enterprise IT
  ```
- Keys in `--accent`, values in `--text`, separator in `--surface`

### Part 2: Interactive CLI Prompt
Below the neofetch output, a blinking cursor prompt: `kenny@homelab:~$ █`

Supported commands:
- `help` — lists available commands
- `about` — navigates to /about
- `projects` / `ls projects/` — navigates to /projects
- `contact` — navigates to /contact
- `clear` — clears terminal output
- `whoami` — short one-liner
- `sudo rm -rf /` — easter egg ("Nice try.")
- Unrecognized: `command not found: <input>`

Implementation: a real `<input>` element styled as terminal text. Clicking anywhere in the terminal window focuses the input.

### Below the Terminal
Small muted links for GitHub and LinkedIn for visitors who skip the CLI.

## Navigation: Terminal Tab Bar

Persistent bar at the top of every page, styled like tmux/iTerm2 tabs:

```
[ ~ home ]  [ about ]  [ projects ]  [ contact ]  [ cv ↓ ]
```

- Active tab: `--accent` text + bottom border or `--surface` background
- Inactive tabs: `--muted` text
- Bar background: `--bg-alt`
- Mobile: collapses to hamburger dropdown styled as a terminal menu

## Content Pages

Each page is a terminal window (or multiple for pages with distinct sections).

### Content Styling
- **Headings:** styled as command prompts: `$ cat experience`
- **Section dividers:** `─────` box-drawing character horizontal rules
- **Lists:** `→` arrows or `$` prompts
- **Tech cards:** bordered boxes with ASCII-style corners, or `systemctl status` output style
- **Skills grid:** mimics `pacman -Qg` output — category in `--green`, items in `--subtext`

### About Page
- Window title: `kenny@homelab:~/about`
- Portrait: 1px `--surface` border, slightly desaturated
- Experience: each job like a process in `ps aux` / `systemctl list-units` — role as "unit name", company+dates as metadata
- Skills: grouped list mimicking `pacman -Qg`
- Languages and education: key-value pairs

### Projects Page
- Window title: `kenny@homelab:~/projects`
- Project listing styled like `ls -la` output with columns
- Each project is a clickable row with hover highlight (like selecting a line in `less`)
- Tags in `--muted` after description

### Project Detail Pages (Homelab, Kubernetes, Intune)
- Window title shows project path: `kenny@homelab:~/projects/homelab`
- Tech cards keep grid layout but with terminal-window treatment (mini windows or ASCII-bordered boxes)
- Service lists with icons stay as-is
- Stats grid (Intune page) styled as `top`-style key-value output

### Contact Page
- Window title: `kenny@homelab:~/contact`
- Email: `$ echo $EMAIL` → `hello@kennyandries.com`
- Links rendered as command output

### 404 Page
- `bash: /path: No such file or directory`
- Suggestion to run `cd ~` (link to home)

## Footer

Styled as a terminal status line: `-- kenny@homelab -- /about -- 2026 --` in `--muted`

## Mobile Handling

- Terminal windows become full-width, stacked
- Tab bar collapses to hamburger dropdown
- Homepage interactive CLI works on mobile (keyboard opens when tapping prompt)
- Window title bars stay but shrink

## Technical Constraints

- Vanilla HTML/CSS/JS — no frameworks, no build tools
- Same directory structure and clean URL pattern
- Component loading via existing `components-loader.js` pattern
- SEO metadata (OG, Twitter Cards, JSON-LD) preserved on all pages
- Accessibility: skip links, aria labels, keyboard navigation, focus management
- `prefers-reduced-motion`: disable typing animations, show content immediately
