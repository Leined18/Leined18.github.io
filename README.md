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
│   ├── header.html        # Parcial de navegación compartida
│   ├── index.html
│   ├── music.html
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
│       ├── header.js      # Inserta navegación y destaca la ruta activa
│       └── projects.js    # Render dinámico de la tabla de proyectos
└── README.md
```

## Puntos clave

- **Layout modular**: separamos tokens, layout, componentes reutilizables y estilos por página para facilitar la evolución.
- **Datos desacoplados**: los proyectos del cursus se gestionan desde `static/data/projects.json`, manteniendo el render en `projects.js`.
- **Navegación compartida**: `portfolio/header.html` funciona como parcial y `header.js` la incluye en todas las vistas de la carpeta.
- **Accesibilidad**: elementos con etiquetas semánticas, formularios etiquetados y estados de foco consistentes.

## Desarrollo local

1. Clona el repositorio.
2. Abre `index.html` o cualquier archivo dentro de `portfolio/` directamente en el navegador (no requiere build).
3. Para emular GitHub Pages en otra carpeta, respeta las rutas relativas (no utilices `/ruta/absoluta`).

## Próximos pasos sugeridos

1. Automatizar la carga de música y otros datos externos mediante APIs (Last.fm, Spotify).
2. Añadir pruebas visuales (Percy, Playwright) para asegurar consistencia tras refactors.
3. Documentar patrones de componentes con Storybook o estilo similar para el sistema de diseño.

---

**En producción:** https://Leined18.github.io/index
