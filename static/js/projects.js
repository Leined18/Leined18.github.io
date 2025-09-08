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
    new Project("🔦 Cube3D", "https://github.com/Leined18/Cube3D", 4, "Completed", 125)
];

// Renderizar
const table = document.getElementById("project-table");
projects.forEach(project => table.appendChild(project.toRow()));
