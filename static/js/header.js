document.addEventListener('DOMContentLoaded', function() {
    // Incluye el header si existe el div
    const headerBar = document.getElementById('header-bar');
    if (headerBar) {
        fetch('/portfolio/header.html')
            .then(res => res.text())
            .then(data => {
                headerBar.innerHTML = data;
            });
    }
});