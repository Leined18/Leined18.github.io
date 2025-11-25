(() => {
	const table = document.querySelector('[data-project-table]');
	if (!table) {
		return;
	}

	const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));
	const dataUrl = new URL('../static/data/projects.json', document.baseURI);
	const remoteUrl = 'https://raw.githubusercontent.com/Leined18/Leined18.github.io/main/static/data/projects.json';

	loadProjectData([dataUrl.toString(), remoteUrl])
		.then((payload) => {
			if (!Array.isArray(payload)) {
				throw new Error('El formato de projects.json no es válido.');
			}
			payload.forEach((project) => {
				tbody.appendChild(buildRow(project));
			});
		})
		.catch((error) => {
			console.error(error);
			renderFallback(tbody);
		});
})();

function loadProjectData(candidates) {
	if (!Array.isArray(candidates) || candidates.length === 0) {
		return Promise.reject(new Error('No hay fuentes de datos configuradas.'));
	}

	const [current, ...rest] = candidates;

	return fetch(current)
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Unable to load project data: ${res.status}`);
			}
			return res.json();
		})
		.catch((error) => {
			if (rest.length === 0) {
				throw error;
			}
			return loadProjectData(rest);
		});
}

function buildRow(project) {
	const row = document.createElement('tr');

	const nameCell = document.createElement('td');
	nameCell.className = 'project-name';

	const rankCell = document.createElement('td');
	rankCell.textContent = formatValue(project.rank);

	const statusCell = document.createElement('td');
	statusCell.appendChild(buildStatus(project.status));

	const scoreCell = document.createElement('td');
	scoreCell.textContent = formatValue(project.score);
	scoreCell.classList.toggle('score-boost', typeof project.score === 'number' && project.score >= 120);

	const labelEl = buildProjectLabel(project);
	nameCell.appendChild(labelEl);

	if (Array.isArray(project.subprojects) && project.subprojects.length > 0) {
		nameCell.appendChild(buildOptionsMenu(project, { labelEl, rankCell, statusCell, scoreCell }));
	}

	row.appendChild(nameCell);
	row.appendChild(rankCell);
	row.appendChild(statusCell);
	row.appendChild(scoreCell);

	return row;
}

function buildProjectLabel(project) {
	const wrapper = document.createElement('span');
	wrapper.className = 'project-label';
	updateProjectLabel(wrapper, project);
	return wrapper;
}

function buildStatus(status) {
	const normalized = normalizeStatus(status);
	const pill = document.createElement('span');
	pill.className = `status-pill status--${normalized.slug}`;
	pill.textContent = normalized.label;
	return pill;
}

function buildOptionsMenu(project, context) {
	const wrapper = document.createElement('div');
	wrapper.className = 'options-menu';

	const toggle = document.createElement('button');
	toggle.type = 'button';
	toggle.setAttribute('aria-haspopup', 'true');
	toggle.setAttribute('aria-expanded', 'false');
	toggle.textContent = '≡';

	const panel = document.createElement('div');
	panel.className = 'options-panel';

	const backButton = document.createElement('button');
	backButton.type = 'button';
	backButton.className = 'back-btn';
	backButton.textContent = '⬅ Volver al principal';
	backButton.addEventListener('click', () => {
		resetPrimary(project, context);
		collapsePanel(panel, toggle);
	});

	panel.appendChild(backButton);

	project.subprojects.forEach((sub) => {
		const option = document.createElement('button');
		option.type = 'button';
		option.textContent = sub.label;
		option.addEventListener('click', () => {
			swapProject(sub, context);
			collapsePanel(panel, toggle);
		});
		panel.appendChild(option);
	});

	toggle.addEventListener('click', (event) => {
		event.stopPropagation();
		const isActive = panel.classList.toggle('active');
		toggle.setAttribute('aria-expanded', String(isActive));
	});

	document.addEventListener('click', (event) => {
		if (!wrapper.contains(event.target)) {
			collapsePanel(panel, toggle);
		}
	});

	wrapper.appendChild(toggle);
	wrapper.appendChild(panel);

	return wrapper;
}

function swapProject(candidate, context) {
	const { labelEl, rankCell, statusCell, scoreCell } = context;
	updateProjectLabel(labelEl, candidate);

	rankCell.textContent = formatValue(candidate.rank);
	statusCell.innerHTML = '';
	statusCell.appendChild(buildStatus(candidate.status));

	scoreCell.textContent = formatValue(candidate.score);
	scoreCell.classList.toggle('score-boost', typeof candidate.score === 'number' && candidate.score >= 120);
}

function resetPrimary(project, context) {
	swapProject(project, context);
}

function updateProjectLabel(wrapper, project) {
	wrapper.innerHTML = '';
	const label = project.label || 'Proyecto';
	if (project.url) {
		const link = document.createElement('a');
		link.href = project.url;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.textContent = label;
		wrapper.appendChild(link);
	} else {
		const span = document.createElement('span');
		span.textContent = label;
		wrapper.appendChild(span);
	}
}

function formatValue(value) {
	if (value === null || value === undefined || value === '') {
		return '—';
	}
	return value;
}

function normalizeStatus(status) {
	const raw = String(status || 'Pending').trim();
	const slug = raw.toLowerCase().replace(/\s+/g, '-');
	const label = raw
		.toLowerCase()
		.split(' ')
		.map((fragment) => fragment.charAt(0).toUpperCase() + fragment.slice(1))
		.join(' ');
	return { slug, label };
}

function collapsePanel(panel, toggle) {
	panel.classList.remove('active');
	toggle.setAttribute('aria-expanded', 'false');
}

function renderFallback(container) {
	const row = document.createElement('tr');
	const cell = document.createElement('td');
	cell.colSpan = 4;
	cell.textContent = 'No se pudieron cargar los proyectos en este momento.';
	row.appendChild(cell);
	container.appendChild(row);
}
