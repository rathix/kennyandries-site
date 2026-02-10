document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initFooter();
});

function initNavbar() {
    const menu = document.getElementById('navbarItems');
    if (!menu) return;

    // Highlight active link
    const normalizePath = (p) => p.replace(/\/$/, '').replace(/\.html$/, '').replace(/\/index$/, '') || '/';
    const currentPath = normalizePath(window.location.pathname);

    menu.querySelectorAll('a').forEach((link) => {
        let linkPath = '/';
        try {
            linkPath = normalizePath(new URL(link.getAttribute('href') || '/', window.location.origin).pathname);
        } catch {
            return;
        }

        if (currentPath === linkPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    const btn = document.getElementById('navbarToggle');
    if (!btn) return;

    const closeMenu = () => {
        btn.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
    };

    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        menu.classList.toggle('is-open');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    menu.addEventListener('click', (e) => {
        if (e.target instanceof HTMLAnchorElement) closeMenu();
    });
}

function initFooter() {
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}
