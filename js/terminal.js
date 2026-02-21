/* terminal.js - Interactive CLI for the homepage */
(function () {
    'use strict';

    var PROMPT = 'kenny@arch-btw:~$ ';
    var TYPING_SPEED = 30;

    var ASCII_ART = [
        ' \u2588\u2588\u2557  \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2557 ',
        ' \u2588\u2588\u2551 \u2588\u2588\u2554\u255d\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557',
        ' \u2588\u2588\u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551',
        ' \u2588\u2588\u2554\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551',
        ' \u2588\u2588\u2551  \u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551',
        ' \u255a\u2550\u255d  \u255a\u2550\u255d\u255a\u2550\u255d  \u255a\u2550\u255d'
    ];

    var SYSINFO = [
        { key: null,      val: 'kenny@arch-btw', header: true },
        { key: null,      val: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500', sep: true },
        { key: 'Name',    val: 'Kenny Andries' },
        { key: 'Role',    val: 'System Engineer & IT Consultant' },
        { key: 'Company', val: 'NMBS/SNCB \u00b7 Rathix Consulting' },
        { key: 'Stack',   val: 'Intune \u00b7 Exchange \u00b7 Entra ID \u00b7 K8s' },
        { key: 'OS',      val: 'NixOS / Fedora Atomic' },
        { key: 'Shell',   val: 'PowerShell \u00b7 Bash \u00b7 Ansible' },
        { key: 'Uptime',  val: '6+ years in enterprise IT' }
    ];

    /**
     * Sanitise user input to prevent XSS.
     * Creates a temporary element and uses textContent round-trip.
     */
    function escapeHtml(str) {
        var tmp = document.createElement('div');
        tmp.textContent = str;
        return tmp.textContent;
    }

    /**
     * Pad a string to the given width with trailing spaces.
     */
    function pad(str, width) {
        while (str.length < width) { str += ' '; }
        return str;
    }

    /**
     * Build the neofetch DOM element.
     * Only uses hardcoded strings - no user input involved.
     */
    function createNeofetchElement() {
        var wrapper = document.createElement('div');
        wrapper.className = 'neofetch';

        /* Left side: ASCII art */
        var left = document.createElement('div');
        left.className = 'nf-left';
        var artPre = document.createElement('pre');
        /* ASCII_ART is hardcoded, safe to build with spans for coloring */
        var artFragments = [];
        ASCII_ART.forEach(function (line) {
            artFragments.push('<span class="nf-art">' + line + '</span>');
        });
        artPre.innerHTML = artFragments.join('\n'); /* safe: hardcoded content only */
        left.appendChild(artPre);

        /* Right side: sysinfo */
        var right = document.createElement('div');
        right.className = 'nf-right';
        var infoPre = document.createElement('pre');
        var infoFragments = [];
        SYSINFO.forEach(function (item) {
            if (item.header) {
                infoFragments.push('<span class="nf-header">' + item.val + '</span>');
            } else if (item.sep) {
                infoFragments.push('<span class="nf-sep">' + item.val + '</span>');
            } else {
                infoFragments.push('<span class="nf-key">' + pad(item.key, 9) + '</span><span class="nf-val">' + item.val + '</span>');
            }
        });
        infoPre.innerHTML = infoFragments.join('\n'); /* safe: hardcoded content only */
        right.appendChild(infoPre);

        wrapper.appendChild(left);
        wrapper.appendChild(right);
        return wrapper;
    }

    /**
     * Command handlers.
     * Each returns an array of strings (output lines), or a special signal.
     * Navigation commands use window.location.href.
     */
    var COMMANDS = {
        'help': function () {
            return [
                'Available commands:',
                '',
                '  help        Show this help message',
                '  about       Learn more about me',
                '  projects    View my projects',
                '  contact     Get in touch',
                '  whoami      Who am I?',
                '  clear       Clear the terminal',
                ''
            ];
        },
        'about': function () { window.location.href = '/about'; },
        'projects': function () { window.location.href = '/projects'; },
        'contact': function () { window.location.href = '/contact'; },
        'clear': function () { return 'CLEAR'; },
        'whoami': function () {
            return ['System engineer. Automates things. Breaks homelabs on purpose.'];
        },
        'ls projects/': function () { window.location.href = '/projects'; },
        'cd about': function () { window.location.href = '/about'; },
        'cd projects': function () { window.location.href = '/projects'; },
        'cd contact': function () { window.location.href = '/contact'; },
        'cat about.txt': function () { window.location.href = '/about'; },
        'sudo rm -rf /': function () { return ['Nice try.']; }
    };

    /**
     * Create a terminal line element showing a prompt + command text.
     * Uses textContent for the command portion to prevent XSS.
     */
    function createPromptLine(commandText) {
        var line = document.createElement('div');
        line.className = 'terminal-line';

        var promptSpan = document.createElement('span');
        promptSpan.className = 'terminal-prompt';
        promptSpan.textContent = PROMPT;

        var cmdSpan = document.createElement('span');
        cmdSpan.textContent = commandText;

        line.appendChild(promptSpan);
        line.appendChild(cmdSpan);
        return line;
    }

    /**
     * Create an output block element from an array of text lines.
     * Uses textContent to prevent XSS.
     */
    function createOutputBlock(lines, isError) {
        var block = document.createElement('div');
        block.className = 'terminal-output-block';
        if (isError) {
            block.classList.add('terminal-error');
        }
        block.textContent = lines.join('\n');
        return block;
    }

    /**
     * Main terminal initialisation.
     */
    function initTerminal() {
        var output = document.getElementById('terminal-output');
        var input = document.getElementById('terminal-input');
        var inputLine = document.getElementById('terminal-input-line');
        var body = document.querySelector('.terminal-body');

        if (!output || !input || !inputLine || !body) { return; }

        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reducedMotion) {
            /* Skip animation: show neofetch immediately */
            output.appendChild(createPromptLine('neofetch'));
            output.appendChild(createNeofetchElement());
            inputLine.hidden = false;
            input.focus();
            return;
        }

        /* Animated intro: type "neofetch" character by character */
        var typingLine = document.createElement('div');
        typingLine.className = 'terminal-line';

        var typingPrompt = document.createElement('span');
        typingPrompt.className = 'terminal-prompt';
        typingPrompt.textContent = PROMPT;

        var typingCmd = document.createElement('span');
        typingCmd.textContent = '';

        typingLine.appendChild(typingPrompt);
        typingLine.appendChild(typingCmd);
        output.appendChild(typingLine);

        var command = 'neofetch';
        var charIndex = 0;

        function typeNextChar() {
            if (charIndex < command.length) {
                typingCmd.textContent += command[charIndex];
                charIndex++;
                setTimeout(typeNextChar, TYPING_SPEED);
            } else {
                /* Typing complete - show neofetch output */
                output.appendChild(createNeofetchElement());
                inputLine.hidden = false;
                input.focus();
            }
        }

        typeNextChar();

        /* Handle command input */
        input.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter') { return; }

            var rawValue = input.value.trim();
            var cmd = rawValue.toLowerCase();
            input.value = '';

            /* Echo the command (uses textContent via createPromptLine) */
            output.appendChild(createPromptLine(escapeHtml(rawValue)));

            if (cmd === '') {
                scrollToBottom();
                return;
            }

            var handler = COMMANDS[cmd];

            if (handler) {
                var result = handler();

                if (result === 'CLEAR') {
                    while (output.firstChild) {
                        output.removeChild(output.firstChild);
                    }
                    return;
                }

                if (Array.isArray(result)) {
                    output.appendChild(createOutputBlock(result, false));
                }
                /* If result is undefined (navigation), nothing to append */
            } else {
                output.appendChild(
                    createOutputBlock(['bash: ' + escapeHtml(rawValue) + ': command not found'], true)
                );
            }

            scrollToBottom();
        });

        /* Click terminal body to focus input (but not if clicking a link) */
        body.addEventListener('click', function (e) {
            if (e.target.tagName !== 'A') {
                input.focus();
            }
        });

        function scrollToBottom() {
            body.scrollTop = body.scrollHeight;
        }
    }

    /* Boot */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTerminal);
    } else {
        initTerminal();
    }
})();
