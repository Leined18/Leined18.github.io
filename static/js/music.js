document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('[data-music-feed]');
    if (!container) {
        return;
    }

    const feedUrl = container.dataset.musicFeed || '../static/data/music.json';
    const endpoint = new URL(feedUrl, document.baseURI);
    const remoteEndpoint = 'https://raw.githubusercontent.com/Leined18/Leined18.github.io/main/static/data/music.json';

    loadMusicFeed([endpoint.toString(), remoteEndpoint])
        .then((payload) => {
            renderLastTrack(container, payload);
        })
        .catch((error) => {
            console.error(error);
            container.textContent = 'No se pudo obtener la última canción escuchada.';
        });
});

function loadMusicFeed(candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
        return Promise.reject(new Error('No hay feeds configurados.'));
    }

    const [current, ...rest] = candidates;

    return fetch(current)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Unable to load music feed: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            if (rest.length === 0) {
                throw error;
            }
            return loadMusicFeed(rest);
        });
}

function renderLastTrack(container, payload) {
    if (!payload || !Array.isArray(payload.recentTracks) || payload.recentTracks.length === 0) {
        container.textContent = 'Sin canciones registradas recientemente.';
        return;
    }

    const [latest] = payload.recentTracks;
    container.innerHTML = '';

    const tile = document.createElement('article');
    tile.className = 'music-card';

    if (latest.artwork) {
        const figure = document.createElement('img');
        figure.src = latest.artwork;
        figure.alt = `Portada de ${latest.album || latest.title}`;
        figure.loading = 'lazy';
        tile.appendChild(figure);
    }

    const meta = document.createElement('div');
    meta.className = 'music-meta';

    const title = document.createElement('h3');
    title.textContent = latest.title;
    meta.appendChild(title);

    if (latest.artist) {
        const artist = document.createElement('p');
        artist.className = 'music-artist';
        artist.textContent = latest.artist;
        meta.appendChild(artist);
    }

    if (latest.album) {
        const album = document.createElement('p');
        album.className = 'music-album';
        album.textContent = latest.album;
        meta.appendChild(album);
    }

    const footer = document.createElement('p');
    footer.className = 'music-timestamp';
    footer.textContent = formatTimestamp(latest.timestamp, payload.lastUpdated);
    meta.appendChild(footer);

    if (latest.url) {
        const link = document.createElement('a');
        link.href = latest.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'button btn-secondary';
        link.textContent = 'Escuchar';
        meta.appendChild(link);
    }

    tile.appendChild(meta);
    container.appendChild(tile);
}

function formatTimestamp(timestamp, fallback) {
    const candidate = timestamp || fallback;
    if (!candidate) {
        return 'Actualizado recientemente';
    }

    const date = new Date(candidate);
    if (Number.isNaN(date.getTime())) {
        return 'Actualizado recientemente';
    }

    return new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
}
