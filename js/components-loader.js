document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar-placeholder', '/components/navbar.html', initNavbar);
    loadComponent('footer-placeholder', '/components/footer.html', initFooter);
});

function loadComponent(elementId, componentPath, callback) {
    const element = document.getElementById(elementId);

    if (!element) {
        console.warn(`Placeholder element #${elementId} not found`);
        return;
    }

    fetch(componentPath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            element.innerHTML = html;
            if (callback) callback();
        })
        .catch(error => console.error(`Failed to load ${componentPath}:`, error));
}

function initNavbar() {
    // Highlight active link
    const normalizePath = (p) => p.replace(/\/$/, '').replace(/\.html$/, '').replace(/\/index$/, '') || '/';
    const currentPath = normalizePath(window.location.pathname);
    document.querySelectorAll('#navbarItems a').forEach((link) => {
        const linkPath = normalizePath(new URL(link.href).pathname);
        if (currentPath === linkPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Toggle mobile menu
    const btn = document.getElementById('navbarToggle');
    const menu = document.getElementById('navbarItems');

    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        menu.classList.toggle('is-open');
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            btn.setAttribute('aria-expanded', 'false');
            menu.classList.remove('is-open');
        }
    });

    // Close when clicking a link
    menu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            btn.setAttribute('aria-expanded', 'false');
            menu.classList.remove('is-open');
        }
    });
}

function initFooter() {
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}
