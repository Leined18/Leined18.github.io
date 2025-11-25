# Leined18.github.io

Portafolio personal de **Danpalac** desplegado con GitHub Pages. El objetivo del repositorio es ofrecer una visión clara y escalable del trabajo realizado (cursus 42, proyectos paralelos, stack técnico y métricas en vivo), cuidando la arquitectura front-end para iterar con facilidad.

## Estructura

```
.
├── assets/                # Recursos estáticos (imágenes, logotipos)
├── index.html             # Landing principal "Leined World"
├── portfolio/             # Sitio del portafolio (subsecciones)
│   ├── contact.html
│   ├── core-projects.html
│   ├── footer.html        # Parcial de footer configurable
│   ├── header.html        # Parcial de navegación compartida
│   ├── index.html
│   ├── other-projects.html
│   ├── skills.html
│   └── stats.html
├── static/
│   ├── css/
│   │   ├── base.css       # Tokens y resets
│   │   ├── layout.css     # Layout y tipografía común
│   │   ├── components/    # Buttons, cards, tables...
│   │   ├── pages/         # Estilos específicos (home, portfolio)
│   │   ├── proyects.css   # Ajustes puntuales de la tabla 42
│   │   └── styles.css     # Agregador de los módulos anteriores
│   ├── data/
│   │   └── projects.json  # Fuente de datos para 42 Projects
│   └── js/
│       ├── header.js      # Punto de entrada que inicializa los parciales
│       ├── layout.js      # Loader de parciales (header/footer)
│       └── projects.js    # Render dinámico de la tabla de proyectos
└── README.md
```

## Puntos clave

- **Layout modular**: separamos tokens, layout, componentes reutilizables y estilos por página para facilitar la evolución.
- **Datos desacoplados**: los proyectos del cursus se gestionan desde `static/data/projects.json`.
- **Parciales reutilizables**: `portfolio/header.html` y `portfolio/footer.html` se inyectan dinámicamente mediante `static/js/layout.js`.
- **Accesibilidad**: elementos con etiquetas semánticas, formularios etiquetados y estados de foco consistentes.

## Desarrollo local

1. Clona el repositorio.
2. Instala dependencias opcionales para linting (requiere Node 18+):
	```bash
	npm install
	```
3. Para que los parciales y fuentes de datos carguen sin depender del fallback remoto, levanta un servidor local sencillo (por ejemplo, `npx serve` o `python -m http.server`) y navega a `http://localhost:PORT`.
4. Si prefieres abrir `index.html` directamente desde el sistema de archivos, el sitio seguirá funcionando pero recurrirá al contenido hospedado en GitHub Raw como respaldo.
5. Para emular GitHub Pages en otra carpeta, respeta las rutas relativas (no utilices `/ruta/absoluta`).

## Validaciones disponibles

- `npm run lint:html`: analiza la semántica básica de los HTML con HTMLHint.
- `npm run lint:css`: valida las hojas de estilo con Stylelint.
- `npm run lint`: ejecuta ambas tareas en cascada.

## Próximos pasos

1. Exponer la integración musical como microservicio y enlazarlo desde el portafolio cuando esté listo.
2. Añadir pruebas visuales (Percy, Playwright) para asegurar consistencia tras refactors.
3. Documentar patrones de componentes con Storybook o estilo similar para el sistema de diseño.

---

**En producción:** https://Leined18.github.io/index
