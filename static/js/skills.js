
const DATA_URL = new URL("../data/skills.json", import.meta.url);

const styles = `
    #skill-details {
        display: none;
        margin: 30px auto 0;
        padding: 25px;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(128,128,128,.25);
        border-radius: 16px;
        background: rgba(128,128,128,.04);
        animation: skillFadeIn .3s ease;
    }

    #skill-details.active {
        display: block;
    }

    .skill-details-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        margin-bottom: 25px;
    }

    .skill-details-header h3 {
        margin: 0;
    }

    .skill-details-close {
        border: 0;
        background: transparent;
        color: inherit;
        font-size: 1.3rem;
        cursor: pointer;
    }

    .skill-orbit {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }

    .technology-node {
        --node-color: #3498db;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;

        width: 105px;
        height: 105px;
        padding: 10px;
        box-sizing: border-box;

        border: 1px solid var(--node-color);
        border-radius: 50%;

        background: color-mix(
            in srgb,
            var(--node-color) 12%,
            transparent
        );

        color: inherit;
        text-decoration: none;
        text-align: center;

        transition: transform .25s ease,
                    box-shadow .25s ease,
                    background .25s ease;
    }

    .technology-node:hover {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 0 18px color-mix(
            in srgb,
            var(--node-color) 35%,
            transparent
        );
    }

    .technology-node img {
        width: 30px;
        height: 30px;
        object-fit: contain;
    }

    .technology-node .technology-fallback {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--node-color);
    }

    .technology-node span {
        font-size: .75rem;
        font-weight: 600;
        overflow-wrap: anywhere;
    }

    .skill-empty {
        text-align: center;
        opacity: .7;
    }

    .skill-item {
        cursor: pointer;
    }

    .skill-item.selected {
        outline: 2px solid rgba(52,152,219,.8);
        outline-offset: 4px;
    }

    @keyframes skillFadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 600px) {
        .technology-node {
            width: 88px;
            height: 88px;
        }

        .technology-node img {
            width: 25px;
            height: 25px;
        }
    }
`;


/* 1. Load JSON */

async function loadSkills() {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
        throw new Error(`Could not load skills: ${response.status}`);
    }

    const data = await response.json();
    return data.skills;
}


/* 2. Create isolated module styles */

function injectStyles() {
    if (document.querySelector("#skills-module-styles")) {
        return;
    }

    const styleElement = document.createElement("style");
    styleElement.id = "skills-module-styles";
    styleElement.textContent = styles;

    document.head.appendChild(styleElement);
}


/* 3. Create the details panel */

function createDetailsPanel(container) {
    container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "skill-details-header";

    const title = document.createElement("h3");
    title.className = "skill-details-title";

    const closeButton = document.createElement("button");
    closeButton.className = "skill-details-close";
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Cerrar detalles");

    const orbit = document.createElement("div");
    orbit.className = "skill-orbit";

    header.append(title, closeButton);
    container.append(header, orbit);

    return {
        title,
        closeButton,
        orbit
    };
}


/* 4. Validate external URLs */

function getSafeUrl(value) {
    if (!value) return null;

    try {
        const url = new URL(value);

        if (url.protocol === "https:" || url.protocol === "http:") {
            return url.href;
        }
    } catch {
        return null;
    }

    return null;
}


/* 5. Create one technology circle */

function createTechnologyNode(technology) {
    const link = getSafeUrl(technology.link);
    const logo = getSafeUrl(technology.logoLink);

    const node = document.createElement(link ? "a" : "div");

    node.className = "technology-node";
    node.style.setProperty(
        "--node-color",
        technology.color || "#3498db"
    );

    if (link) {
        node.href = link;
        node.target = "_blank";
        node.rel = "noopener noreferrer";
    }

    if (logo) {
        const image = document.createElement("img");
        image.src = logo;
        image.alt = "";
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.remove();
            addFallback(node, technology.name);
        }, { once: true });

        node.appendChild(image);
    } else {
        addFallback(node, technology.name);
    }

    const name = document.createElement("span");
    name.textContent = technology.name;

    node.appendChild(name);

    return node;
}


/* 6. Fallback when there is no logo */

function addFallback(container, name) {
    const fallback = document.createElement("div");

    fallback.className = "technology-fallback";
    fallback.textContent = name.substring(0, 2).toUpperCase();

    container.prepend(fallback);
}


/* 7. Render technologies */

function renderTechnologies(orbit, technologies) {
    orbit.replaceChildren();

    if (!technologies || technologies.length === 0) {
        const message = document.createElement("p");

        message.className = "skill-empty";
        message.textContent =
            "Todavía no hay tecnologías añadidas a esta habilidad.";

        orbit.appendChild(message);
        return;
    }

    technologies.forEach(technology => {
        const node = createTechnologyNode(technology);
        orbit.appendChild(node);
    });
}


/* 8. Select a skill */

function selectSkill(skill, panel, panelElements) {
    const { title, orbit } = panelElements;

    title.textContent = skill.name;

    renderTechnologies(orbit, skill.items);

    panel.classList.add("active");

    panel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


/* 9. Initialize events */

async function initializeSkills() {
    injectStyles();

    const cards = document.querySelectorAll(".skill-item");
    const panel = document.querySelector("#skill-details");

    if (!panel || cards.length === 0) {
        return;
    }

    const panelElements = createDetailsPanel(panel);

    try {
        const skills = await loadSkills();

        const skillsById = new Map(
            skills.map(skill => [skill.id, skill])
        );

        cards.forEach(card => {
            const skillId = card.dataset.skillId;
            const skill = skillsById.get(skillId);

            if (!skill) return;

            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-expanded", "false");

            const select = () => {
                cards.forEach(item => {
                    item.classList.remove("selected");
                    item.setAttribute("aria-expanded", "false");
                });

                card.classList.add("selected");
                card.setAttribute("aria-expanded", "true");

                selectSkill(skill, panel, panelElements);
            };

            card.addEventListener("click", select);

            card.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select();
                }
            });
        });

        panelElements.closeButton.addEventListener("click", () => {
            panel.classList.remove("active");

            cards.forEach(card => {
                card.classList.remove("selected");
                card.setAttribute("aria-expanded", "false");
            });
        });

    } catch (error) {
        console.error("Skills module error:", error);
        panel.textContent =
            "No se pudieron cargar los datos de las habilidades.";
        panel.classList.add("active");
    }
}


/* 10. Start module */

initializeSkills();
