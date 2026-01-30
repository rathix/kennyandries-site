// Load navbar and footer components using native fetch (no jQuery needed)
document.addEventListener('DOMContentLoaded', () => {
    const load = (id, path) => {
        const el = document.getElementById(id);
        if (el) {
            fetch(path)
                .then(r => r.text())
                .then(html => { el.innerHTML = html; })
                .catch(err => console.error(`Failed to load ${path}:`, err));
        }
    };

    load('navbar-placeholder', 'components/navbar.html');
    load('footer-placeholder', 'components/footer.html');
});
