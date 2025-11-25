document.addEventListener('DOMContentLoaded', function() {
    if (window.Layout && typeof window.Layout.loadPartials === 'function') {
        window.Layout.loadPartials();
    } else {
        console.warn('Layout helper is not available.');
    }
});