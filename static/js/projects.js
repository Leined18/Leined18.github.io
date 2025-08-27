// Clase Project
class Project {
    constructor(name, link, rank, status, score) {
        this.name = name;
        this.link = link;
        this.rank = rank;
        this.status = status;
        this.score = score;
    }

    // Devuelve fila en HTML
    toRow() {
        return `
      <tr>
        <td>${this.link ? `<a href="${this.link}" target="_blank">${this.name}</a>` : this.name}</td>
        <td>${this.rank}</td>
        <td class="${this.status.toLowerCase().replace(" ", "-")}">${this.status}</td>
        <td class="score">${this.score}</td>
      </tr>
    `;
    }
}

// Lista de proyectos
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
    new Project("🤖 CPP Modules 00-04", "", 4, "In progress", "-"),
    new Project("🖧 NetPractice", "https://github.com/Leined18/Netpractice", 4, "Completed", 100),
    new Project("🔦 Cube3D", "https://github.com/Leined18/Cube3D", 4, "Pending", "-")
];

// Renderizar en la tabla
const table = document.getElementById("project-table");
projects.forEach(project => {
    table.innerHTML += project.toRow();
});
