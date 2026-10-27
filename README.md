# Anomaly Fusion — versión 1.0

Juego web de exploración, fabricación, colección, combate y fusiones anómalas. Funciona como PWA en PC y móvil. El número visible de versión se mantiene en **1.0**; la revisión interna de caché se ha actualizado para que el navegador cargue estos cambios.

## Contenido
- 12 zonas de exploración con HUD independiente y un catálogo de cientos de materiales, menas, lingotes, armas, herramientas, equipo, consumibles y criaturas.
- **Bestiario de 200 enemigos base** generados a partir de 10 linajes y 20 variantes: zombies, mutantes, merodeadores humanos, infectados, soldados desertores, ghouls, híbridos, cosechadores, aberraciones y drones biológicos.
- Los enemigos cambian de nivel según la zona y el progreso del operador. Al derrotarlos, existe una probabilidad de estabilizarlos y adquirirlos como compañeros; la probabilidad mejora con el nivel, la suerte y las pasivas de Captura equipadas.
- **Compañeros equipables** desde Equipo. Cada ejemplar puede desarrollar una o dos habilidades procedurales: daño, defensa, recolección, suerte, créditos o captura. Las criaturas de nivel alto tienen mejores valores y más posibilidades de obtener dos habilidades. Los compañeros apoyan el combate y aportan sus bonificaciones mientras están equipados.
- Registro de objetos descubiertos: cuadrícula de 10 por página, búsqueda, filtros de categoría integrados como botones, orden por nombre/nivel/valor y fichas con descripción, rareza, valor y métodos de obtención. El Registro no revela los componentes exactos de las fusiones procedurales.
- Mesa de creación con categorías de recetas y tres recetas por página. La categoría Materiales incluye 250 recetas, con cadenas de procesamiento mineral, biomateriales, componentes industriales, cristales, electrónica, materiales tóxicos, recursos volcánicos, criogénicos, abisales, dimensionales, reciclaje y aleaciones avanzadas. Las recetas se ordenan por nivel de salida, del 1 al 5.
- Horno para fundir menas y producir los lingotes correspondientes, con tres tipos de mena por página.
- Máquina de fusión con resultados procedurales coherentes, reclamación obligatoria del resultado e historial de las tres últimas fusiones. Los resultados de nivel alto son más probables cuando se combinan componentes de nivel alto.
- Los nombres generados por fusión se mantienen cortos y legibles, sin concatenar nombres de materiales indefinidamente. Cada instancia adquirida de armas, herramientas y equipo puede recibir estadísticas, rasgos y habilidades procedurales diferentes, también si procede de una receta o suministro; el nivel influye en la calidad y potencia. El Registro muestra las habilidades y rasgos conocidos sin revelar los componentes exactos de una fusión.
- Anomalías con pasivas procedurales y un espacio específico para equiparlas. Las pasivas incluyen daño, defensa, recolección, suerte, créditos y captura.
- Envío de suministros para vender objetos individualmente o en lotes, mostrando el pago exacto antes de confirmar.
- La Central muestra los objetos detectados durante la animación de una entrega. El botón Reclamar se habilita al finalizar la transmisión; solo al reclamar se añaden los objetos al inventario.
- Consumibles, fabricación y fundición con barras de progreso y sonidos sintetizados de interfaz configurables.
- Guardado local automático y ajustes de interfaz: tamaño, reducción de movimiento, pantalla completa y modo Automático/Móvil/PC 16:9.
- **Exportación e importación de partidas** en archivos JSON desde Ajustes.
- En Ajustes se muestra el número de versión visible: **VERSIÓN 1.0**.
- La PWA comprueba actualizaciones al abrir, al volver a la pestaña y cada 60 segundos mientras está abierta. La caché interna usa `anomaly-fusion-v1-0-r2`; el nombre visible del juego sigue siendo 1.0.

## Exportar e importar una partida
1. Abre **Ajustes → Exportar** y guarda el archivo `.json` en un lugar seguro.
2. En el dispositivo donde quieras continuar, abre **Ajustes → Importar** y selecciona ese archivo.
3. Confirma la importación. Esta sustituye la partida actual del dispositivo.

La copia de seguridad incluye el progreso, las criaturas adquiridas, sus habilidades y los ajustes guardados. No contiene datos de cuentas ni se sube a ningún servidor.

## Probar localmente
Puedes abrir `index.html` para revisar la interfaz básica. Para probar el service worker, la actualización automática y la instalación PWA, sirve la carpeta mediante `localhost` o HTTPS. Los service workers no funcionan con normalidad desde `file://`.

## Publicar en GitHub Pages
1. Exporta una copia de seguridad desde Ajustes si quieres conservar el progreso actual.
2. Sube todos los archivos de esta carpeta a la raíz de un repositorio.
3. En **Settings → Pages**, selecciona la rama y la carpeta raíz.
4. Abre la URL HTTPS publicada. La instalación aparecerá cuando el navegador cumpla sus requisitos.

## Actualizaciones y caché
La versión visible sigue siendo 1.0. Esta revisión usa la caché `anomaly-fusion-v1-0-r2`; cada nueva revisión debe incrementar el sufijo interno de caché en `sw.js` para distinguir los archivos actualizados. Al activarse, el service worker elimina las cachés antiguas de Anomaly Fusion. Las comprobaciones necesitan conexión; sin conexión se utiliza la copia almacenada en caché.

## Modo de pantalla
En **Ajustes → Modo de pantalla**, elige **Automático** para el comportamiento adaptable, **Móvil** para priorizar navegación táctil y una columna, o **PC · 16:9** para una composición de escritorio panorámica.

## Compañeros y bestiario
Durante los combates de exploración se muestra una estimación de la probabilidad de adquisición. Al derrotar a un enemigo se calcula la probabilidad final con el nivel del enemigo, el nivel del operador, la suerte y las bonificaciones de captura. Si se estabiliza, se incorpora al inventario como una instancia individual con habilidades procedurales. En **Equipo → Compañero de campo** se puede equipar; sus bonificaciones se aplican mientras esté activo. Ejemplares de nivel alto pueden tener dos habilidades.

## Privacidad y guardado
La partida se guarda localmente en el navegador del dispositivo. Exporta una copia antes de borrar los datos del navegador o cambiar de dispositivo. La opción **Reiniciar y actualizar** elimina la partida local de forma irreversible.
