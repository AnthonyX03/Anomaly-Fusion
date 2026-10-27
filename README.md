# JOYA CERO — Laboratorio de fusión

Prototipo jugable de navegador, responsive para móvil y PC. No necesita librerías ni servicios externos.

## Ejecutar
- Abre `index.html` directamente para jugar.
- Para probar la PWA/offline, sirve la carpeta con un servidor local o publícala con HTTPS.

## Publicar en GitHub Pages
1. Crea un repositorio y sube `index.html`, `game.js`, `manifest.webmanifest` y `sw.js`.
2. En **Settings → Pages**, selecciona la rama y la carpeta raíz.
3. Abre la URL HTTPS generada. Puedes instalarla desde el navegador compatible.

## Cambios de esta versión (v0.4)
- La fusión y la venta usan un selector visual del inventario, con tarjetas de objetos, búsqueda y paginación; no desplegables.
- Exploración muestra 3 zonas por página. Al pulsar una zona se abre su informe con descripción, recursos y botón para explorar.
- La Central separa Mesa de creación y Horno en botones; la mesa muestra 3 recetas por página.
- Solicitar suministros y Vender objetos son módulos separados. La venta permite elegir objetos mediante el inventario y protege los objetos equipados.
- Partida nueva sin créditos ni objetos. Explora para obtener materiales iniciales.
- La cápsula anómala puede generar objetos raros procedurales además de sus recompensas conocidas.
- La máquina de fusión deja el resultado pendiente de reclamar; reclamarlo lo añade al inventario y reinicia los espacios. El historial conserva las 3 fusiones más recientes.
- Los resultados de fusión se generan a partir de los materiales y categorías de los dos objetos, sin resultados aleatorios ajenos como zombies al combinar madera y chatarra.
- La Central incluye una sección propia de suministros con animación de entrega y botón para reclamar el contenido. Los objetos no entran al inventario hasta reclamarlos.
- El horno presenta lingotes como producto final y explica explícitamente que se funde mena de hierro, cobre u oro con carbón.

## Mecánicas incluidas
- HUD negro tecnológico, navegación adaptable y barra inferior en móvil.
- 6 zonas, materiales, encuentros hostiles y recompensas.
- Fabricación y horno con procesos de 10 segundos.
- Rareza de nivel 1 a 5, inventario por categorías y páginas.
- Equipo con daño, defensa y bonus de recolección.
- Sonidos generados por Web Audio, ajustes de escala, reducción de animaciones y pantalla completa.
- Guardado automático con `localStorage`.

Es un prototipo local: contenido y economía están diseñados para una primera versión jugable, no para un servidor multijugador.


## JOYA CERO v0.4
- Catálogo ampliado con decenas de materiales, armas, herramientas, criaturas y objetos raros.
- Las fusiones pueden generar anomalías con pasivas procedurales y únicas; se equipan desde Equipo.
- La Central incorpora Envío de suministro: selecciona objetos individuales o lotes, consulta el pago exacto antes de confirmar y cobra al enviar.
- El inventario conserva el precio base y ya no permite vender directamente. Los objetos equipados quedan protegidos.
