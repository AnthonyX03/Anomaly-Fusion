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
- En Ajustes se muestra el número de versión visible: **VERSIÓN 1.2**.
- La PWA comprueba actualizaciones al abrir, al volver a la pestaña y cada 60 segundos mientras está abierta. La caché interna se actualiza con cada revisión para evitar cargar archivos antiguos.

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


## Revisión 1.0-r3

- El botón de instalación está disponible únicamente en Ajustes, junto a las opciones de instalación y actualización.
- Los controles de paginación reservan un espacio constante y los listados paginados mantienen una huella estable en escritorio y móvil.
- El sistema de resultados de fusión se presenta como **Síntesis de convergencia**; los nombres procedurales se limitan a cuatro palabras y se eliminan repeticiones consecutivas.
- La versión visible sigue siendo **1.0**. La caché interna del service worker usa `anomaly-fusion-v1-0-r3` para refrescar los archivos publicados.


## Revisión 1.1
- Eliminado el destello azul táctil al pulsar botones, fichas del Registro y tarjetas en móviles; el foco accesible conserva un indicador discreto de color cian.
- Los ordenamientos del Inventario y Registro ahora son menús propios del HUD (Nombre A-Z, nivel y valor), sin desplegables nativos del navegador.
- Reiniciar e importar partida usan un diálogo de confirmación integrado en la interfaz; ya no se muestran ventanas `confirm()` del navegador.
- Añadidas tres zonas explorables: Laboratorio sumergido, Jardín de sílice y Estación de eco.
- Añadido cierre de menús y ventanas con la tecla Escape y actualizado el identificador de caché de la PWA.


## Revisión 1.2
- Recetas con tarjetas compactas y paginación reservada para evitar saltos al cambiar de página.
- Botón Loot dentro del HUD de cada zona; el inventario de hallazgos se muestra en una lista desplazable sin paginación.
- Progresión por nivel de Operador: Bosque hundido, Mina abandonada y Vertedero orbital disponibles desde el inicio; las zonas posteriores se desbloquean progresivamente entre los niveles 2 y 16.
- Rangos de Operador renovados y mostrados en el perfil; la experiencia se obtiene explorando, fusionando, fabricando y fundiendo, con recompensa adicional al combatir.
- Guardado migrado a versión 7 para conservar partidas anteriores.


## Revisión 1.3
- Recuperado el botón **Envío de suministro** junto a **Solicitar suministro** dentro de La Central; la vista separa la petición del seguimiento y reclamación del envío.
- Aumentados los niveles mínimos de desbloqueo de las zonas posteriores a las tres iniciales.
- Añadidos materiales, consumibles, herramientas y diez criaturas base; el bestiario de enemigos suma seis linajes nuevos con variantes procedurales.
- Añadido el filtro **Síntesis** al Inventario y al Registro. Detecta objetos fusionados mediante el rasgo persistente **Síntesis de convergencia**, también compatible con objetos guardados en versiones anteriores.
- Los objetos de síntesis conservan el rasgo principal aunque tengan un rasgo adicional de combate, extracción o defensa.
- Versión visible 1.3 y caché PWA renovada.

## Revisión 1.4
- «Envío de suministro» en la Central funciona como módulo de venta: permite vender una unidad o un lote, muestra valor base por objeto y pago real calculado con bonificaciones. Los objetos equipados quedan protegidos.
- El selector de objetos de fusión incluye un menú de filtros junto al buscador con las mismas categorías del Inventario, incluida Síntesis.
- Los materiales se agrupan solo si comparten nombre, categoría y procedencia; objetos obtenidos mediante funciones distintas permanecen en pilas separadas. Los resultados de síntesis siempre se conservan como instancias separadas y etiquetadas.
- Versión visible 1.4 y caché PWA renovada.


## Revisión 1.5
- El Inventario y el Registro identifican explícitamente el valor base del objeto como 100%. El módulo de venta muestra el valor base, el precio estándar de venta al 70% y el pago final, que puede aumentar mediante habilidades de créditos.
- Corregido el flujo de venta individual para retirar la unidad por su identificador exacto y no consumir accidentalmente otra pila con el mismo nombre.
- Nuevas habilidades de compañeros y equipo: Mandíbula recolectora, Cazador de alijos, Resonancia de aprendizaje, Compartimento oculto, Memoria de campo y Recolector adaptativo.
- La exploración ahora concede realmente botín adicional cuando se activan las bonificaciones; la probabilidad combina Recolección y Botín, con una segunda tirada influida por Suerte. Se corrige la duplicación anterior del conjunto de posibles objetos, que no aumentaba por sí misma la cantidad de recompensas.
- Los enemigos pueden dejar botín duplicado según las habilidades equipadas. Las bonificaciones de Experiencia se aplican a exploración, combate, fusión, fabricación y fundición.
- Panel de bonificaciones actualizado para mostrar la probabilidad de botín adicional y la experiencia extra.
- Versión visible 1.5 y caché PWA renovada.


## Revisión 1.6

- El Registro conserva las variantes de nivel de los objetos con el rasgo «Síntesis de convergencia».
- En la información de un objeto fusionado se pueden consultar los niveles descubiertos, incluidos sus estadísticas, habilidades y rasgos desbloqueados.
- Cada variante de nivel se guarda en la partida y se mantiene separada de la instancia actual del objeto. La consulta de niveles inferiores no modifica el objeto del inventario ni el equipo.
- Las partidas anteriores migran automáticamente la variante de síntesis que ya tengan registrada; los nuevos niveles descubiertos se añaden al historial.
- Versión visible 1.6 y caché PWA renovada.


## Revisión 1.7

- El selector de variantes de síntesis del Registro ahora usa un menú desplegable integrado, similar al selector de ordenación. Solo muestra niveles que el jugador ha descubierto (N1, N2, etc.) y marca el nivel más alto conocido.
- Los precios de los objetos con rasgo «Síntesis de convergencia» quedan fijados por nombre y nivel: el valor base se conserva y el valor de nivel aumenta de forma predecible un 35 % por cada nivel adicional. Volver a fusionar el mismo objeto al mismo nivel no vuelve a alterar su precio ni reemplaza las habilidades procedurales ya registradas para esa variante.
- Añadidas nuevas habilidades procedurales de compañeros: Cartógrafo de alijos, Reciclador de campo, Memoria fractal, Tasador de anomalías y Vínculo de contención. Usan los mismos tipos de estadísticas soportados por el juego.
- Caché de la PWA actualizada a 1.7; la versión visible es 1.7.


## Revisión 1.8
- Reescrita la descripción del Inventario con lore del mundo: el operador conserva los hallazgos y sus procedencias, mientras que las pilas de distinto origen permanecen separadas.
- Ampliado el lore de la Mesa de creación: reconstruye planos fragmentarios de gremios desaparecidos, ordena recetas de nivel 1 a 5 y procesa materiales en componentes.
- Reforzado el lore del Horno Industrial con protocolos de refinado anteriores al Colapso, fases de calentamiento y estabilización.
- El Registro se presenta como el archivo de la Central, con fichas parciales que solo se completan mediante descubrimientos reales.
- Añadidos tres recursos narrativos recuperables: Archivo de ceniza, Sello de cartógrafo y Ampolla de memoria. Incorporadas tres recetas de archivo: Mapa de ceniza restaurado, Sello de cartógrafo calibrado y Memoria de expedición sellada.
- Añadidos dos linajes hostiles procedurales, Archivista hueco y Cartógrafo de la grieta, con 20 variantes cada uno. Las habilidades de compañeros capturados siguen generándose durante el flujo normal de adquisición, en lugar de fijarse en la ficha base.
- Ajustado el ancho del texto de las cabeceras para mejorar legibilidad en pantallas estrechas.
- Versión visible 1.8; caché PWA renovada a `anomaly-fusion-v1-8-r1` para que la instalación detecte los archivos nuevos.


## Revisión 1.9

- Versión visible 1.9; caché PWA renovada a `anomaly-fusion-v1-9-r1`.
- Descripciones de la Central, Inventario y suministros reducidas a explicaciones breves y funcionales, sin lore.
- Envío de suministro (venta individual o en lote) trasladado a un cuarto botón independiente de la Central, junto a Mesa de creación, Horno industrial y Solicitar suministros.
- Eliminada la pestaña secundaria duplicada de venta dentro de Solicitar suministros.


## Versión 2.0 — Expansión mayor

- Interfaz de La Central reorganizada en una cuadrícula fija de 2 × 2 para sus cuatro módulos: Mesa de creación, Horno industrial, Solicitar suministros y Envío de suministro. La venta solo está disponible en el cuarto módulo de la Central; se elimina el duplicado del área de suministros.
- En Envío de suministro se añade un filtro por categoría y Síntesis. Seleccionar visibles respeta la búsqueda y el filtro; las selecciones permanecen activas al cambiar de categoría, y el total incluye todas las unidades seleccionadas. Los objetos equipados siguen protegidos.
- Catálogo de recetas paginado de cuatro en cuatro, con tarjetas compactas y dos columnas en móvil. La zona de paginación conserva una altura fija entre páginas.
- Añadidas seis zonas de alto nivel: Cámara criogénica (N22), Archivo orbital (N24), Raíces de titanio (N27), Fundición errante (N30), Observatorio fractal (N34) y Costa nula (N38). Las tres primeras zonas originales siguen desbloqueadas desde el nivel 1.
- Añadidos más de 40 objetos base entre materiales, componentes, herramientas, armas, equipo y criaturas de las nuevas regiones.
- El bestiario alcanza 28 linajes procedurales con 20 variantes cada uno (560 variantes de enemigo), incluyendo seis nuevos tipos de criaturas base en esta revisión.
- Añadidos once linajes de enemigos procedurales con variantes de nombre, nivel, salud y botín.
- Ampliados los rangos de Operador hasta nivel 45: Maestro de expedición, Estratega del vacío, Custodio del umbral, Soberano de anomalías, Arquitecto de convergencia y Nexo trascendente.
- Conservados el precio base del 100 %, la venta estándar al 70 %, las variantes de Síntesis de convergencia, las habilidades procedurales y los guardados anteriores.
- Migración de esquema de guardado a versión 8; importación compatible con partidas de versiones 2–8.
- Caché PWA renovada a `anomaly-fusion-v2-0-r1`.


## Revisión 2.1
- Progresión ampliada hasta el nivel máximo 50.
- Recompensas de créditos crecientes por cada nivel, con bonificaciones adicionales al alcanzar rangos.
- Requisitos de desbloqueo de zonas escalonados hasta nivel 50, manteniendo las tres zonas iniciales abiertas.
- Paginación unificada: solo el indicador de página queda centrado entre Anterior y Siguiente.
- Corregidos espacios de contenido y alturas móviles que podían dejar zonas inferiores o paginadores ocultos detrás de la navegación fija.
