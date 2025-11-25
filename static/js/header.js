document.addEventListener('DOMContentLoaded', function() {
    // Incluye el header si existe el div
    const headerBar = document.getElementById('header-bar');
    if (headerBar) {
        const headerUrl = new URL('./header.html', document.baseURI);
        fetch(headerUrl.toString())
            .then(res => res.text())
            .then(data => {
                headerBar.innerHTML = data;
                highlightActiveLink(headerBar);
            });
    }
});

function highlightActiveLink(container) {
    const anchors = container.querySelectorAll('a[href]');
    const current = normalizePath(window.location.pathname);

    anchors.forEach((anchor) => {
        const anchorPath = normalizePath(new URL(anchor.getAttribute('href'), window.location.href).pathname);
        if (anchorPath === current) {
            anchor.classList.add('active');
        }
    });
}

function normalizePath(pathname) {
    let normalized = pathname.replace(/index\.html$/, '');
    if (normalized.length > 1 && normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
    }
    return normalized;
}