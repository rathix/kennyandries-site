// Load navbar and footer components using native fetch (no jQuery needed)
document.addEventListener('DOMContentLoaded', () => {
    const load = (id, path) => {
        const el = document.getElementById(id);
        if (el) {
            fetch(path)
                .then(r => r.text())
                .then(html => {
                    el.innerHTML = html;
                    // Scripts inserted via innerHTML don't execute, so we need to re-add them
                    el.querySelectorAll('script').forEach(oldScript => {
                        const newScript = document.createElement('script');
                        if (oldScript.src) {
                            newScript.src = oldScript.src;
                        } else {
                            newScript.textContent = oldScript.textContent;
                        }
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    });
                })
                .catch(err => console.error(`Failed to load ${path}:`, err));
        }
    };

    load('navbar-placeholder', 'components/navbar.html');
    load('footer-placeholder', 'components/footer.html');
});
