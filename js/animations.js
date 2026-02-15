(function () {
    'use strict';

    var TYPING_SPEED = 30;
    var PAUSE_BETWEEN_PANES = 300;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initTerminalTyping() {
        if (reduceMotion) {
            initCollapsibleExperience();
            return;
        }

        // Skip homepage (has its own terminal.js)
        if (document.querySelector('.terminal-window--home')) {
            initCollapsibleExperience();
            return;
        }

        var containers = document.querySelectorAll('.terminal-body .content-container');
        if (!containers.length) return;

        // Derive prompt from terminal title
        var terminalWindow = containers[0].closest('.terminal-window');
        var titleEl = terminalWindow ? terminalWindow.querySelector('.terminal-title') : null;
        var prompt = titleEl ? titleEl.textContent.trim() + '$ ' : 'kenny@homelab:~$ ';

        // Build pane data: store children, create prompt lines
        var panes = [];
        for (var i = 0; i < containers.length; i++) {
            var cmd = containers[i].getAttribute('data-cmd') || 'cat readme.md';

            // Store original children
            var children = [];
            while (containers[i].firstChild) {
                children.push(containers[i].removeChild(containers[i].firstChild));
            }

            // Create prompt line
            var line = document.createElement('div');
            line.className = 'terminal-line';

            var promptSpan = document.createElement('span');
            promptSpan.className = 'terminal-prompt';
            promptSpan.textContent = prompt;

            var cmdSpan = document.createElement('span');
            cmdSpan.textContent = '';

            var cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.textContent = '\u2588';

            line.appendChild(promptSpan);
            line.appendChild(cmdSpan);
            line.appendChild(cursor);
            containers[i].appendChild(line);

            panes.push({
                el: containers[i],
                cmd: cmd,
                children: children,
                cmdSpan: cmdSpan,
                cursor: cursor
            });
        }

        var done = false;
        var currentPane = 0;
        var charIndex = 0;

        function typeNextChar() {
            if (done) return;

            var pane = panes[currentPane];

            if (charIndex < pane.cmd.length) {
                pane.cmdSpan.textContent += pane.cmd[charIndex];
                charIndex++;
                setTimeout(typeNextChar, TYPING_SPEED);
            } else {
                // Command typed — remove cursor, reveal content
                if (pane.cursor.parentNode) {
                    pane.cursor.parentNode.removeChild(pane.cursor);
                }

                pane.children.forEach(function (child) {
                    pane.el.appendChild(child);
                });
                pane.children = null;

                // Advance to next pane
                currentPane++;
                charIndex = 0;

                if (currentPane < panes.length) {
                    setTimeout(typeNextChar, PAUSE_BETWEEN_PANES);
                } else {
                    finish();
                }
            }
        }

        function finish() {
            done = true;
            cleanup();
            initCollapsibleExperience();
        }

        function skip() {
            if (done) return;
            done = true;
            cleanup();

            // Instantly complete all panes
            panes.forEach(function (pane) {
                if (pane.cursor && pane.cursor.parentNode) {
                    pane.cursor.parentNode.removeChild(pane.cursor);
                }
                pane.cmdSpan.textContent = pane.cmd;
                if (pane.children) {
                    pane.children.forEach(function (child) {
                        pane.el.appendChild(child);
                    });
                    pane.children = null;
                }
            });

            initCollapsibleExperience();
        }

        function cleanup() {
            document.removeEventListener('click', skipHandler);
            document.removeEventListener('keydown', skipHandler);
        }

        function skipHandler(e) {
            if (e.type === 'click') {
                var t = e.target;
                while (t && t !== document.body) {
                    if (t.tagName === 'NAV' || t.tagName === 'FOOTER' || t.tagName === 'A') return;
                    t = t.parentNode;
                }
            }
            skip();
        }

        document.addEventListener('click', skipHandler);
        document.addEventListener('keydown', skipHandler);

        typeNextChar();
    }

    // ── Collapsible experience items ──
    function initCollapsibleExperience() {
        var items = document.querySelectorAll('.experience-item');
        if (!items.length) return;

        // Avoid double-init
        if (items[0].hasAttribute('role')) return;

        items.forEach(function (item, index) {
            var desc = item.querySelector('.experience-desc');
            var bullets = item.querySelector('.experience-bullets');
            if (!desc && !bullets) return;

            var details = document.createElement('div');
            details.className = 'experience-details';
            if (desc) details.appendChild(desc);
            if (bullets) details.appendChild(bullets);
            item.appendChild(details);

            var role = item.querySelector('.experience-role');
            if (role) {
                var toggle = document.createElement('span');
                toggle.className = 'experience-toggle';
                toggle.setAttribute('aria-hidden', 'true');
                toggle.textContent = '+';
                role.appendChild(toggle);
            }

            if (index > 0) {
                item.classList.add('is-collapsed');
            }

            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');

            function toggleItem(e) {
                if (e && e.target && e.target.tagName === 'A') return;
                item.classList.toggle('is-collapsed');
                var expanded = !item.classList.contains('is-collapsed');
                item.setAttribute('aria-expanded', String(expanded));
            }

            item.addEventListener('click', toggleItem);
            item.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleItem();
                }
            });
        });
    }

    // ── Init on DOM ready ──
    document.addEventListener('DOMContentLoaded', function () {
        initTerminalTyping();
    });
})();
