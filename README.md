# JOYA CERO — Laboratorio de fusión

Prototipo jugable de navegador, responsive para móvil y PC. No necesita librerías ni servicios externos.

## Ejecutar
- Abre `index.html` directamente para jugar (el guardado local funciona en la mayoría de navegadores).
- Para probar la PWA/offline, sirve la carpeta con un servidor local o publícala con HTTPS.

## Publicar en GitHub Pages
1. Crea un repositorio y sube `index.html`, `game.js`, `manifest.webmanifest` y `sw.js`.
2. En **Settings → Pages**, selecciona la rama y la carpeta raíz.
3. Abre la URL HTTPS generada. Puedes instalarla desde el navegador compatible.

## Mecánicas incluidas
- HUD negro tecnológico y navegación adaptable; barra inferior en móvil.
- Máquina de fusión: cualquier par de objetos, progreso de 10 s, resultados coherentes con los ingredientes cuando hay combinaciones reconocidas y resultados experimentales.
- 6 zonas de exploración, recolección de materiales y encuentros hostiles.
- La Central: recetas de fabricación y horno de lingotes, ambos con proceso de 10 s.
- Suministros con créditos, venta de objetos, materiales, herramientas, armas y criaturas capturadas.
- Rareza de nivel 1 a 5 con colores distintos, inventario por categorías y páginas.
- Equipo con daño, defensa y bonus de recolección.
- Sonidos generados por Web Audio, ajustes de escala, reducción de animaciones y pantalla completa.
- Guardado automático con `localStorage`.

## Nota
Es un prototipo local: el contenido y la economía están diseñados para una primera versión jugable, no para un servidor multijugador. El catálogo puede ampliarse con más objetos y reglas de fusión.
