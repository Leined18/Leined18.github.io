(function () {
    const REPO_INFO = {
        owner: 'Leined18',
        name: 'Leined18.github.io',
        branch: 'main'
    };

    const REMOTE_BASE = `https://raw.githubusercontent.com/${REPO_INFO.owner}/${REPO_INFO.name}/${REPO_INFO.branch}/`;

    const NAV_ITEMS = [
        { href: './index.html', label: 'Home' },
        { href: './core-projects.html', label: '42 Projects' },
        { href: './other-projects.html', label: 'Other Projects' },
        { href: './skills.html', label: 'Skills' },
        { href: './stats.html', label: 'GitHub Stats' },
        { href: './contact.html', label: 'Contact' }
    ];

    function loadPartials() {
        const placeholders = document.querySelectorAll('[data-partial]');
        const tasks = Array.from(placeholders).map((placeholder) => injectPartial(placeholder));
        return Promise.all(tasks);
    }

    function injectPartial(placeholder) {
        const partialPath = placeholder.dataset.partial;
        if (!partialPath) {
            return Promise.resolve();
        }

        return fetchPartial(partialPath)
            .then((html) => {
                placeholder.innerHTML = html;
                postProcessPartial(placeholder);
            })
            .catch((error) => {
                console.error(error);
                if (!applyInlineFallback(placeholder)) {
                    placeholder.innerHTML = '';
                }
            });
    }

    function fetchPartial(partialPath) {
        const localUrl = new URL(partialPath, document.baseURI);

        return fetch(localUrl.toString())
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`No se pudo cargar el parcial ${localUrl}`);
                }
                return response.text();
            })
            .catch((originalError) => {
                const repoPath = resolveRepoPath(partialPath);
                if (!repoPath) {
                    throw originalError;
                }

                const remoteUrl = new URL(repoPath, REMOTE_BASE);

                return fetch(remoteUrl.toString())
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`No se pudo cargar el parcial remoto ${remoteUrl}`);
                        }
                        return response.text();
                    })
                    .catch(() => {
                        throw originalError;
                    });
            });
    }

    function postProcessPartial(placeholder) {
        const role = placeholder.dataset.role || '';
        if (role === 'navigation') {
            highlightActiveLink(placeholder);
        }
        if (role === 'footer') {
            hydrateFooter(placeholder);
        }
    }

    function applyInlineFallback(placeholder) {
        const role = placeholder.dataset.role || '';
        const template = buildFallbackTemplate(role);
        if (!template) {
            return false;
        }

        placeholder.innerHTML = template;
        postProcessPartial(placeholder);
        return true;
    }

    function buildFallbackTemplate(role) {
        if (role === 'navigation') {
            return `<nav class="primary-nav" aria-label="Secciones del portafolio">${NAV_ITEMS
                .map((item) => `<a href="${item.href}">${item.label}</a>`)
                .join('')}</nav>`;
        }

        if (role === 'footer') {
            return '<footer class="site-footer"><img data-footer-image alt="" hidden><p data-footer-text></p><p data-footer-subtext hidden></p></footer>';
        }

        return '';
    }

    function highlightActiveLink(scope) {
        const anchors = scope.querySelectorAll('a[href]');
        const current = normalizePath(window.location.pathname);

        anchors.forEach((anchor) => {
            const href = anchor.getAttribute('href');
            if (!href) {
                return;
            }
            const anchorPath = normalizePath(new URL(href, window.location.href).pathname);
            if (anchorPath === current) {
                anchor.classList.add('active');
            }
        });
    }

    function hydrateFooter(scope) {
        const footerText = scope.dataset.footerText || '';
        const subtext = scope.dataset.footerSubtext || '';
        const image = scope.dataset.footerImage || '';

        const textNode = scope.querySelector('[data-footer-text]');
        if (textNode) {
            textNode.textContent = footerText;
        }

        const subtextNode = scope.querySelector('[data-footer-subtext]');
        if (subtextNode) {
            if (subtext) {
                subtextNode.textContent = subtext;
                subtextNode.hidden = false;
            } else {
                subtextNode.remove();
            }
        }

        const imageNode = scope.querySelector('[data-footer-image]');
        if (imageNode) {
            if (image) {
                imageNode.src = image;
                imageNode.alt = scope.dataset.footerImageAlt || 'Decorative image';
                imageNode.hidden = false;
            } else {
                imageNode.remove();
            }
        }
    }

    function normalizePath(pathname) {
        let normalized = pathname.replace(/index\.html$/, '');
        if (normalized.length > 1 && normalized.endsWith('/')) {
            normalized = normalized.slice(0, -1);
        }
        return normalized || '/';
    }

    function resolveRepoPath(relativePath) {
        const resolved = new URL(relativePath, document.baseURI).pathname;
        const marker = `/${REPO_INFO.name}/`;

        if (resolved.includes(marker)) {
            return resolved.slice(resolved.indexOf(marker) + marker.length);
        }

        return resolved.replace(/^\//, '');
    }

    window.Layout = {
        loadPartials
    };
})();
