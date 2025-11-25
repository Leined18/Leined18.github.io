class Project {
    constructor(name, link, rank, status, score, subprojects = []) {
        this.name = name;
        this.link = link;
        this.rank = rank;
        this.status = status;
        this.score = score;
        this.subprojects = subprojects;
    }

    toRow() {
        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.classList.add("project-name");

        const nameSpan = document.createElement("span");
        nameSpan.innerHTML = this.link
            ? `<a href="${this.link}" target="_blank">${this.name}</a>`
            : this.name;
        tdName.appendChild(nameSpan);

        // Rank, Status, Score
        const tdRank = document.createElement("td");
        tdRank.textContent = this.rank;

        const tdStatus = document.createElement("td");
        tdStatus.textContent = this.status;
        tdStatus.classList.add(this.status.toLowerCase().replace(" ", "-"));

        const tdScore = document.createElement("td");
        tdScore.textContent = this.score;
        tdScore.classList.add("score");

        // Subproyectos
        if (this.subprojects.length > 0) {
            const optionsBtn = document.createElement("button");
            optionsBtn.textContent = "≡";
            optionsBtn.classList.add("options-btn");

            const submenu = document.createElement("div");
            submenu.classList.add("submenu");

            const backBtn = document.createElement("button");
            backBtn.textContent = "⬅ Volver al principal";
            backBtn.style.display = "none";
            submenu.appendChild(backBtn);

            this.subprojects.forEach(sub => {
                const subBtn = document.createElement("button");
                subBtn.textContent = sub.name;
                subBtn.addEventListener("click", () => {
                    nameSpan.innerHTML = sub.link
                        ? `<a href="${sub.link}" target="_blank">${sub.name}</a>`
                        : sub.name;
                    tdRank.textContent = sub.rank;
                    tdStatus.textContent = sub.status;
                    tdStatus.className = sub.status.toLowerCase().replace(" ", "-");
                    tdScore.textContent = sub.score;

                    backBtn.style.display = "block";
                });
                submenu.appendChild(subBtn);
            });

            backBtn.addEventListener("click", () => {
                nameSpan.innerHTML = this.link
                    ? `<a href="${this.link}" target="_blank">${this.name}</a>`
                    : this.name;
                tdRank.textContent = this.rank;
                tdStatus.textContent = this.status;
                tdStatus.className = this.status.toLowerCase().replace(" ", "-");
                tdScore.textContent = this.score;

                backBtn.style.display = "none";
            });

            tdName.appendChild(optionsBtn);
            tdName.appendChild(submenu);

            optionsBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const rect = optionsBtn.getBoundingClientRect();
                const submenuHeight = submenu.scrollHeight;
                const spaceBelow = window.innerHeight - rect.bottom;
                const topPosition = spaceBelow < submenuHeight ? rect.top - submenuHeight : rect.bottom;
                submenu.style.top = topPosition + "px";
                submenu.style.left = rect.left + rect.width / 2 + "px";
                submenu.style.transform = "translateX(-50%)";
                submenu.classList.toggle("active");
            });

            document.addEventListener("click", (e) => {
                if (!tdName.contains(e.target)) {
                    submenu.classList.remove("active");
                }
            });
        }

        tr.appendChild(tdName);
        tr.appendChild(tdRank);
        tr.appendChild(tdStatus);
        tr.appendChild(tdScore);

        return tr;
    }
}

// Lista de proyectos (fuera de la clase)
const projects = [
    new Project("📚 Libft", "https://github.com/Leined18/Libft", 0, "Completed", 125),
    new Project("🖨️ ft_printf", "https://github.com/Leined18/ft_printf", 1, "Completed", 100),
    new Project("📀 Born2beroot", "", 1, "Completed", 125),
    new Project("📜 get_next_line", "https://github.com/Leined18/get_next_line", 1, "Completed", 112),
    new Project("🎮 So_long", "https://github.com/Leined18/so_long", 2, "Completed", 125),
    new Project("↹ Push_swap", "https://github.com/Leined18/Push_swap", 2, "Completed", 125),
    new Project("🔗 Minitalk", "https://github.com/Leined18/Minitalk", 2, "Completed", 125),
    new Project("🍴 Philosophers", "https://github.com/Leined18/Philosophers", 3, "Completed", 100),
    new Project("🐚 Minishell", "https://github.com/Leined18/minishell", 3, "Completed", 125),
    new Project("🤖 CPP Modules 00-04", "", 4, "Completed", "-", [
        new Project("CPP 00", "https://github.com/Leined18/cpp-module-00", 4, "Completed", 100),
        new Project("CPP 01", "https://github.com/Leined18/cpp-module-01", 4, "Completed", 100),
        new Project("CPP 02", "https://github.com/Leined18/cpp-module-02", 4, "Completed", 100),
        new Project("CPP 03", "https://github.com/Leined18/cpp-module-03", 4, "Completed", 100),
        new Project("CPP 04", "https://github.com/Leined18/cpp-module-04", 4, "Completed", 100),
    ]),
    new Project("🖧 NetPractice", "https://github.com/Leined18/Netpractice", 4, "Completed", 100),
    new Project("🔦 Cube3D", "https://github.com/Leined18/Cube3D", 4, "Completed", 125),
    (() => {
        const table = document.querySelector('[data-project-table]');
        if (!table) {
            return;
        }

        const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));
        const DATA_URL = new URL('../static/data/projects.json', document.baseURI);

        fetch(DATA_URL.toString())
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Unable to load project data: ${res.status}`);
                }
                return res.json();
            })
            .then((projects) => {
                if (!Array.isArray(projects)) {
                    throw new Error('El formato de projects.json no es válido.');
                }
                projects.forEach((project) => {
                    tbody.appendChild(buildRow(project));
                });
            })
            .catch((error) => {
                console.error(error);
                renderFallback(tbody);
            });
    })();

    function buildRow(project) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.className = 'project-name';

        const rankCell = document.createElement('td');
        rankCell.textContent = project.rank ?? '—';

        const statusCell = document.createElement('td');
        statusCell.appendChild(buildStatus(project.status));

        const scoreCell = document.createElement('td');
        scoreCell.textContent = project.score ?? '—';
        if (typeof project.score === 'number' && project.score >= 120) {
            scoreCell.classList.add('score-boost');
        }

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
        const pill = document.createElement('span');
        const normalized = (status || 'Pending').toLowerCase().replace(/\s+/g, '-');
        pill.className = `status-pill status--${normalized}`;
        pill.textContent = status || 'Pending';
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
            panel.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });

        panel.appendChild(backButton);

        project.subprojects.forEach((sub) => {
            const option = document.createElement('button');
            option.type = 'button';
            option.textContent = sub.label;
            option.addEventListener('click', () => {
                swapProject(sub, context);
                panel.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
            panel.appendChild(option);
        });

        toggle.addEventListener('click', (evt) => {
            evt.stopPropagation();
            const isActive = panel.classList.toggle('active');
            toggle.setAttribute('aria-expanded', String(isActive));
        });

        document.addEventListener('click', (evt) => {
            if (!wrapper.contains(evt.target)) {
                panel.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        wrapper.appendChild(toggle);
        wrapper.appendChild(panel);

        return wrapper;
    }

    function swapProject(candidate, context) {
        const { labelEl, rankCell, statusCell, scoreCell } = context;
        updateProjectLabel(labelEl, candidate);

        rankCell.textContent = candidate.rank ?? '—';
        statusCell.innerHTML = '';
        statusCell.appendChild(buildStatus(candidate.status));

        scoreCell.textContent = candidate.score ?? '—';
        scoreCell.classList.toggle('score-boost', typeof candidate.score === 'number' && candidate.score >= 120);
    }

    function resetPrimary(project, context) {
        swapProject(project, context);
    }

    function renderFallback(container) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'No se pudieron cargar los proyectos en este momento.';
        row.appendChild(cell);
        container.appendChild(row);
    }

    function updateProjectLabel(wrapper, project) {
        wrapper.innerHTML = '';
        if (project.url) {
            const link = document.createElement('a');
            link.href = project.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = project.label;
            wrapper.appendChild(link);
        } else {
            const span = document.createElement('span');
            span.textContent = project.label;
            wrapper.appendChild(span);
        }
    }
