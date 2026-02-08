/**
 * Components Loader for Kenny Andries Website
 *
 * Dynamically loads reusable HTML components (navbar, footer) into placeholder
 * elements. This approach allows for consistent navigation across all pages
 * without server-side includes or a build step.
 *
 * Features:
 * - Automatic script execution within loaded components
 * - Error handling with console logging
 * - Works with Apache URL rewriting (no .html extension needed)
 *
 * @requires Placeholder elements with IDs: navbar-placeholder, footer-placeholder
 * @see /components/navbar.html - Contains navigation and mobile menu logic
 * @see /components/footer.html - Contains dynamic year display
 */

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar-placeholder', '/components/navbar');
    loadComponent('footer-placeholder', '/components/footer');
});

/**
 * Loads an HTML component into a placeholder element.
 *
 * Note: Scripts inserted via innerHTML don't execute automatically.
 * This function re-creates script elements to ensure they run.
 *
 * @param {string} elementId - ID of the placeholder element
 * @param {string} componentPath - Path to the component (without .html extension)
 */
function loadComponent(elementId, componentPath) {
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
            executeScripts(element);
            const yearEl = document.getElementById('copyright-year');
            if (yearEl) yearEl.textContent = new Date().getFullYear();
        })
        .catch(error => console.error(`Failed to load ${componentPath}:`, error));
}

/**
 * Re-creates and executes script elements within a container.
 *
 * When HTML is inserted via innerHTML, script tags are parsed but not executed.
 * This function creates new script elements with the same content, which
 * triggers execution.
 *
 * @param {HTMLElement} container - Element containing scripts to execute
 */
function executeScripts(container) {
    container.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');

        // Copy attributes (src, type, etc.)
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });

        // Copy inline script content
        newScript.textContent = oldScript.textContent;

        // Replace old script with new one (triggers execution)
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}
