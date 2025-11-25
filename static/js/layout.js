(function () {
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

        const partialUrl = new URL(partialPath, document.baseURI);

        return fetch(partialUrl.toString())
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`No se pudo cargar el parcial ${partialUrl}`);
                }
                return response.text();
            })
            .then((html) => {
                placeholder.innerHTML = html;
                postProcessPartial(placeholder);
            })
            .catch((error) => {
                console.error(error);
                placeholder.innerHTML = '';
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

    window.Layout = {
        loadPartials
    };
})();
