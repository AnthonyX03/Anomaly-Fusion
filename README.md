# ANOMALY FUSION 3.0 — ULTIMATE EDITION

Juego web de exploración, fabricación, colección, combate y fusiones anómalas. Funciona como PWA en PC y móvil. Esta edición conserva la partida local y amplía la generación procedural de nombres de fusión.

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
- En Ajustes se muestra el número de versión visible: **VERSIÓN 3.0 · ULTIMATE EDITION**.
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
- El Inventario y el Registro identifican explícitamente el valor base del objeto como 100%. El módulo de venta muestra el valor base, el precio estándar de venta al 90% y el pago final, que puede aumentar mediante habilidades de créditos.
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
- Conservados el precio base del 100 %, la venta estándar al 90 %, las variantes de Síntesis de convergencia, las habilidades procedurales y los guardados anteriores.
- Migración de esquema de guardado a versión 8; importación compatible con partidas de versiones 2–8.
- Caché PWA renovada a `anomaly-fusion-v2-0-r1`.


## Revisión 2.2
- Progresión ampliada hasta el nivel máximo 50.
- Recompensas de créditos crecientes por cada nivel, con bonificaciones adicionales al alcanzar rangos.
- Requisitos de desbloqueo de zonas escalonados hasta nivel 50, manteniendo las tres zonas iniciales abiertas.
- Paginación unificada: solo el indicador de página queda centrado entre Anterior y Siguiente.
- Corregidos espacios de contenido y alturas móviles que podían dejar zonas inferiores o paginadores ocultos detrás de la navegación fija.

## Revisión 2.3
- El Registro muestra `Valor Aprox.` como rango observado (mínimo–máximo) para cada objeto, actualizado al obtener ejemplares con nuevos valores.
- El Valor Base deja de mostrarse en el Registro y permanece asociado al objeto del inventario para calcular su precio.
- Los objetos de materiales con valores diferentes ya no se apilan entre sí, evitando perder su precio individual.
- Caché PWA renovada a `anomaly-fusion-v2-3-r1`.


## Economía de fusión (v2.5)

La fusión siempre se completa. El Valor Base resultante suma los Valores Base individuales de ambos ingredientes, aplica una variación aleatoria entera entre −30 % y +30 % (incluido 0 %) y redondea hacia arriba. El Valor Base mínimo es 1 CR. La Central compra cada objeto por el 90 % de su Valor Base, redondeado hacia arriba, con un precio mínimo de 1 CR (se mantienen las bonificaciones de créditos que ya existan en la partida).


## Versión 2.6 — Restauración de zonas y economía de venta
- Restaurados los nombres y descripciones anteriores de las 21 zonas, conservando sus identificadores internos, botín, riesgos y desbloqueos.
- La Central permite vender una unidad o varias unidades en lote; los objetos equipados no se pueden vender.
- El inventario muestra el Valor Base (100 %). La venta estándar paga el 90 % del Valor Base, redondeado hacia arriba, con mínimo de 1 CR. Las bonificaciones de créditos existentes siguen aplicándose al pago final.
- Se actualiza el número de versión visible en Ajustes a 2.6 y la caché PWA a `anomaly-fusion-v2-6-r1`.
- La fusión conserva el cálculo aleatorio de −30 % a +30 %, con redondeo hacia arriba y Valor Base mínimo de 1 CR.


## Versión 2.7 — Valores fijos en el Registro

- Los objetos que no tienen el rasgo **Síntesis de convergencia** muestran `Valor Base: X CR` en el Registro, porque su valor es fijo y no fluctúa.
- Los objetos con el rasgo **Síntesis de convergencia** mantienen `Valor Aprox.` con el rango histórico de valores observados.
- Se actualiza el número de versión visible en Ajustes a 2.7 y la caché PWA a `anomaly-fusion-v2-7-r1`.


## Versión 2.8 — Corrección del valor de cada fusión

- Corregido un error por el que una variante de Síntesis de convergencia ya registrada podía sustituir el valor recién calculado de una nueva fusión con el mismo nombre.
- Cada resultado conserva el valor individual calculado a partir de los valores de sus ingredientes y la fluctuación de −30 % a +30 %, aunque comparta nombre y nivel con una variante anterior.
- Se mantiene el Registro con rango histórico aproximado para objetos de Síntesis de convergencia, el precio de venta al 90 % y el resto de la interfaz.
- Actualizada la versión visible y la caché de la PWA a 2.8.


## Versión 3.0 — Ultimate Edition

- Se amplían los bancos de nombres de fusión por categoría, con decenas de bases temáticas por familia.
- Los resultados combinan una base temática con prefijos, epítetos y designaciones de serie para generar una variedad mucho mayor sin concatenar nombres de ingredientes.
- Las anomalías de fusión tienen más familias nominales y códigos de identificación de tres caracteres.
- El historial de fusiones conserva hasta 10 resultados recientes en lugar de 3.
- Actualizada la caché PWA a 3.0 para evitar servir el JavaScript anterior.

## Versión 2.9 — Contador del Registro

- El contador «Objetos registrados» de Inicio ahora muestra el número de nombres únicos descubiertos que figuran en el Registro, en lugar de contar las unidades que hay en la Bolsa.
- El indicador de progreso también utiliza el total de entradas registradas.
- Las partidas anteriores se migran conservando los descubrimientos ya guardados y añadiendo al Registro los nombres que sigan en el inventario.
- El Registro no tiene un límite fijo de entradas impuesto por la interfaz: usa paginación dinámica. La cantidad real de nombres posibles sí depende de las combinaciones y reglas procedurales del juego; no es matemáticamente infinita, y los objetos con el mismo nombre se muestran como una sola entrada.
- Actualizada la versión visible y la caché de la PWA a 2.9.


### Ajustes de edición 3.0 (mesa de creación)
- Icono de madera sustituido por un símbolo Unicode más compatible con fuentes de escritorio, evitando el emoji 🪵 ausente en algunos sistemas.
- La mesa muestra seis recetas por página en escritorio (tres columnas por dos filas) y cuatro en móvil para conservar la navegación compacta.
- Las recetas de objetos procedurales eligen materiales según el nombre y la función del objeto (madera/fibra, metal, electrónica, cristal, biomateriales o energía), en lugar de reutilizar un coste genérico por categoría.


## Rework de recetas — Ultimate Edition 3.0

- Todas las recetas se reconstruyen con ingredientes del mismo nivel/rareza que el objeto final.
- La selección prioriza afinidad temática entre nombre, descripción y materiales (metal, tecnología, cristal, biológico o anomalía).
- Si una familia no tiene suficientes ingredientes de ese nivel, amplía la selección a materiales del mismo nivel, sin bajar de nivel.
- Se mantiene la versión visible 3.0; se actualizó la caché del service worker para entregar el parche.

### Generación evolutiva de nombres (revisión 3.0)
Los nombres de síntesis se construyen con vocabulario controlado por categoría y temas semánticos heredados de los ingredientes. Las fusiones sucesivas conservan internamente los temas y el linaje de conceptos, de modo que los objetos fusionados pueden combinarse sin concatenar fragmentos aleatorios ni acumular nombres cada vez más largos. Los nombres se mantienen breves (normalmente dos palabras y como máximo tres) y los metadatos de linaje se guardan con las variantes de síntesis.


### Revisión de fabricación y audio (3.0)
- Recetas con cantidades variables por material (de 1 a 4 unidades), según nivel del resultado, y entre 2 y 4 tipos de componentes cuando el catálogo de ese nivel lo permite.
- La selección de ingredientes prioriza la afinidad semántica y mantiene la coincidencia de nivel/rareza del material con el resultado.
- La cámara de fusión tiene un zumbido electrónico continuo y suave durante el proceso, con fundido al terminar; exploración y fabricación conservan sus señales propias.
- Se mantiene la versión visible 3.0 y la compatibilidad con partidas anteriores.


## Compatibilidad de iconos (revisión r6)

Los iconos de objetos, recetas, botín, registro, fundición y suministros se dibujan mediante SVG integrados en el juego. Esto evita depender de las fuentes de emoji instaladas en Android, iOS, Windows o Linux. Los iconos se asignan por familias semánticas (madera, plantas, cristal, metal, tecnología, fluidos, criaturas y anomalías), con estilos y colores coherentes. La versión visible del juego permanece en 3.0.


## Revisión de iconografía semántica PC y móvil

Los iconos de objetos y zonas se dibujan con SVG integrado y no dependen de emojis instalados. La selección prioriza la categoría del objeto (armas, equipo, criaturas, anomalías, lingotes, herramientas y consumibles) y después usa palabras del nombre para distinguir materiales, vegetales, cristales, tecnología y fluidos. Las zonas tienen iconos propios relacionados con su nombre y entorno. El número de versión visible se mantiene en 3.0.


## Ajuste de sonido y coherencia de nombres evolutivos

- El sonido continuo de la barra de fusión tiene tres capas y un nivel reforzado. El nuevo control de volumen (0–100 %) afecta a todos los sonidos, se aplica en tiempo real y queda guardado en la partida.
- Rework de nombres: los nombres se basan en materiales y propiedades realmente presentes. «Madera + Ramas» produce «Trama Leñosa», dos ingredientes de hojas producen «Manto de Hojas», y los términos eléctricos/anómalos solo aparecen cuando los ingredientes justifican esa propiedad. Se evita añadir «Voltaico», «Espectral» u otros adjetivos por azar.
- Se mantiene la versión visible 3.0 y se renueva la caché de la PWA para que se carguen los cambios.

## Rework procedural de nombres (v2)

La fusión ahora prioriza vocabulario material concreto y reglas semánticas reproducibles. Las combinaciones vegetales distinguen madera, ramas y hojas; los nombres eléctricos o anómalos requieren que un ingrediente aporte realmente esa propiedad. Se corrigió además una colisión léxica por la que «batería» podía activar la detección de «bate» como arma. El volumen general ajustable continúa en Ajustes y el sonido de fusión usa el control maestro de volumen. Caché PWA actualizada para forzar la carga de esta revisión.


### Ajuste de audio de fusión
Se redujo notablemente el nivel de las tres capas del zumbido continuo, se suavizó el filtro de la capa grave y se moderó la frecuencia aguda para evitar saturación y sonido áspero. El control general de volumen sigue funcionando.


## Actualización: volumen y evolución procedural infinita
- Barra de volumen más larga en Ajustes, adaptada a móvil y escritorio.
- En el selector de niveles del Registro, los valores numéricos aparecen sin la etiqueta CR.
- Las fusiones que usan objetos sintetizados generan nombres evolutivos nuevos, conservan la genealogía semántica y guardan la profundidad de fusión. El generador de nombres original sigue actuando para fusiones de objetos base.
- Caché PWA actualizada a r13.

## Rework del inventario (r14)
- Las tarjetas del inventario muestran solo nombre, rareza/nivel, tipo, valor y rasgo de fusión cuando corresponde.
- Al pulsar una tarjeta se abre una ficha HUD ampliada con descripción, habilidades, rasgos, estadísticas, cantidad y datos del objeto.
- Los nombres largos se ajustan dentro de las tarjetas y de la ficha para evitar desbordamientos.
- El selector de niveles descubiertos del Registro muestra solo el nivel y su estado de mejora; no añade el valor numérico al selector. La ficha del Registro conserva intacto su campo «Valor Aprox.: xCR – xCR».


### Corrección del inventario (r15)
- Las tarjetas de la Bolsa usan el modo compacto interactivo, por lo que el toque abre la ficha HUD.
- Se muestra el nombre corto sin el sufijo «Herramienta de Fibra» en la tarjeta y en el encabezado de la ficha.
- «Herramienta de Fibra» se conserva en la ficha ampliada como tipo de objeto.
- Se actualizó la caché de la PWA a r15.


## Inventario: descripción y síntesis restauradas (r16)
- Las tarjetas de la Bolsa vuelven a mostrar la descripción breve del objeto, limitada a dos líneas para evitar desbordamientos.
- Los objetos fusionados muestran explícitamente «✦ Síntesis de convergencia» en la tarjeta.
- Se conserva el HUD de detalles al pulsar la tarjeta.


### Ajuste de tipografía de tarjetas (r17)
La descripción de los objetos vuelve al tamaño tipográfico original de las tarjetas (.7rem, interlineado 1.4) y el distintivo «✦ Síntesis de convergencia» conserva un tamaño pequeño, sin agrandar la tarjeta. Se redujo el espacio vertical entre elementos para que descripción, distintivo y valor entren mejor en las tarjetas de altura fija.


### Inventario sin texto recortado (r18)
- Las descripciones y la línea «✦ Síntesis de convergencia» ya no usan puntos suspensivos ni límites de líneas.
- El texto puede ocupar varias líneas y las tarjetas crecen para mostrar el contenido completo.


### r19 — Alineación del pie de las tarjetas
- El bloque de categoría/valor y el enlace «Ver detalles» se mantienen al fondo de la tarjeta tanto en objetos normales como en objetos de fusión, independientemente de que tengan rasgo de síntesis.


## r20 — nombres de equipo y desequipado
- En el selector y en los espacios de equipo se usa el nombre corto visible, ocultando el sufijo «Herramienta de Fibra» sin modificar el nombre interno del objeto.
- Los nombres largos se parten dentro de sus contenedores para evitar desbordamientos en móvil y escritorio.
- Cada espacio equipado muestra un botón «Desequipar» junto al de elegir objeto; solo aparece cuando hay un objeto equipado.
- Caché PWA actualizada a r20.


## r21 — síntesis azul y controles de equipo
- El rasgo «Síntesis de convergencia» vuelve al azul en la bolsa y en las tarjetas de objetos equipados.
- El registro muestra nombres cortos en la lista y en el detalle, conservando los nombres internos completos para búsquedas y compatibilidad.
- Los botones «Elegir objeto» y «Desequipar» ahora están agrupados en una fila de acciones para que no aparezcan debajo del nombre del objeto.
- Caché PWA actualizada a r21.


### r22 — Ajustes visuales de equipo y síntesis
- Se recupera el azul de rareza anterior para el rasgo Síntesis de convergencia en la bolsa, con un fondo azul tenue y borde de acento.
- Los controles Elegir objeto y Desequipar permanecen juntos en una fila fija a la derecha. Las ranuras de equipo conservan una altura constante y los botones no saltan debajo del nombre ni cambian el tamaño de la ranura.


### r23 — Color correcto de Síntesis de convergencia
- El texto del rasgo usa el verde menta/turquesa claro `#A7E1D3` tanto en la bolsa como en las tarjetas de equipo.
- Se elimina el fondo, el borde lateral, el relleno y el redondeado añadidos al rasgo: queda únicamente el texto coloreado, sin recuadro.
- Caché PWA actualizada a r23.


### r24 — Igualar el color del rasgo de síntesis
- Corregido el color de «Síntesis de convergencia» en las tarjetas de la bolsa para que use el mismo azul que en Equipo y Objetos equipados (`#55BAFF`).
- El rasgo se muestra como texto sin fondo ni recuadro.


### r25 — Color real de Síntesis de convergencia (cian de Equipo)
- El color mostrado en Equipo y Objetos equipados para «Síntesis de convergencia» es el cian del tema (`var(--cyan)` = `#53f2d1`), no el azul de rareza `#55baff`.
- Se corrige el rasgo en las tarjetas de la bolsa para usar exactamente el mismo color cian, sin fondo ni recuadro.
- Caché PWA actualizada a r25.


### r26 — Dos registros separados (Base y Síntesis)
- El Registro de objetos se divide en dos bases de datos seleccionables con botones superiores:
  - **Registro Base**: objetos ordinarios (sin rasgo de síntesis).
  - **Registro de Síntesis**: solo objetos con el rasgo «Síntesis de convergencia».
- Se elimina el filtro «Síntesis» de las categorías (ya no es necesario: la separación se hace por pestaña).
- En la pantalla de Inicio los descubiertos se muestran por separado: contador de Registro Base y contador de Registro de Síntesis.
- El contador de la pestaña Registro indica el total del modo activo (BASE o SÍNTESIS).
- Caché PWA actualizada a r26.


### r27 — Nombres de síntesis sin sufijo «· tipo»
- Los nombres de objetos fusionados ya no muestran el sufijo tras «·» (ej. «Prisma Abisal · Madera Compuesta» → «Prisma Abisal»).
- Ese descriptor se muestra en «Tipo de objeto» dentro de la información del objeto (válido para todos los objetos de síntesis, incluidos los ya guardados).
- Las fusiones nuevas generan nombres limpios sin el separador «·».
- Historial de fusiones, resultado pendiente de reclamar y títulos de tarjetas usan el nombre visible limpio.
- Caché PWA actualizada a r27.


### r28 — Combate HUD, salud y botín en riesgo
- Corregido el bug que mostraba el código SVG en bruto en «Hallazgos» tras explorar: ahora se muestran iconos visuales con el mismo estilo del juego.
- El combate pasa a un HUD modal obligatorio: no se puede salir de la zona ni cambiar de pantalla hasta resolver el encuentro.
- Añadida integridad (salud) del operador en combate, basada en nivel y defensa.
- Si el operador cae a 0 de integridad, pierde el botín obtenido en esa expedición.
- Al ganar se conserva el botín y se mantienen las recompensas / posibilidad de captura.
- Interfaz de combate más visual: avatar de operador y enemigo, barras de integridad de ambos lados y aviso del botín en riesgo.
- Caché PWA actualizada a r28.


### r29 — Equipo, iconos de fusión y anomalías base
- En Objetos equipados, las herramientas/armas de síntesis muestran sus habilidades o rasgos útiles (recolección, daño, rasgo secundario) como las criaturas, no solo «Síntesis de convergencia».
- El rasgo de síntesis sigue apareciendo como línea secundaria (◇ Rasgo).
- En las ranuras de equipo (incluido compañero) solo se muestra el nombre del objeto, sin el sufijo «· habilidad».
- Iconos de criaturas fusionadas: misma base visual de criatura con anillo de fusión, ojo en cian y marca de síntesis para distinguirlas.
- Añadidas ~200 **Anomalías Base** al catálogo. Pueden aparecer en cualquier zona de exploración con probabilidad baja (~8%, ligeramente mejorada por Suerte).
- Caché PWA actualizada a r29.


### r30 — Iconos de fusión visibles, sonido suave y selector de 10
- Iconos de síntesis diferenciados para **criaturas, armas, equipo, herramientas y anomalías**: borde/acentos cian y marca de fusión, detectando el rasgo desde inventario y registro (no solo el catálogo base).
- Sonido de la barra de fusión sustituido por un hum grave y suave (solo senos filtrados, sin sierra), menos agresivo.
- El selector de objetos de fusión/equipo muestra **10 objetos por página** (antes 9).
- Caché PWA actualizada a r30.


### r31 — Hotfix crítico de iconos
- Corregido ReferenceError: `isFusedIcon` no estaba definido en `itemIconMarkup`, lo que rompía el renderizado de iconos y la interfaz.
- Se restaura la detección de síntesis desde inventario/registro y los iconos diferenciados de fusión.
- Caché PWA actualizada a r31.


### r32 — Iconos de fusión solo por color y hum sin petardeo
- Iconos de síntesis: misma forma que el objeto base; solo cambian a una paleta cian/menta/violeta según tipo. Sin círculos, flechas ni contornos extra.
- Sonido de la barra de fusión rehecho: tres senos graves filtrados, entrada y salida exponencial para evitar clics/petardeo.
- Caché PWA actualizada a r32.


### r33 — Nombres limpios en fusión y pad medio sin petardeo
- Las ranuras de la máquina de fusión usan el nombre corto (sin sufijo «· tipo»).
- Toasts/log de reclamación también usan el nombre visible limpio.
- Sonido de fusión rehecho otra vez: pad medio (sin graves), entrada lenta, no se reinicia si ya suena, salida lineal suave.
- Caché PWA actualizada a r33.


### r34 — Rework global de audio (sin petardeo)
- `sound()` rehecho con ataque y release lineales desde 0 (elimina clics al arrancar/parar).
- Solo ondas seno/triángulo suaves; eliminada la sierra.
- Volumen de picos más bajo y filtro low-pass en cada beep.
- Hum de fusión más suave, sin reinicios y con fade de salida.
- Cues de progreso de tareas más suaves.
- Caché PWA actualizada a r34.


### r35 — Hum de fusión más limpio + sonido de venta
- Hum de fusión reducido a dos senos medios, volumen más bajo y fades más largos para cortar el petardeo residual.
- El beep de fin de fusión se retrasa un poco tras iniciar el fade del hum.
- Nuevo sonido de venta en Envío de suministro: arpegio corto ascendente (C-E-G), distinto a los beeps de UI.
- Caché PWA actualizada a r35.


### r36 — Fusión con el mismo audio de exploración
- La barra de fusión ya no usa hum continuo (fuente del petardeo): usa los mismos pitidos de progreso que la exploración.
- Volumen de los beeps de barra un poco más alto.
- Caché PWA actualizada a r36.


### r37 — Parche anti-petardeo en móvil
- Beeps con anti-solape (mín. 45 ms entre sonidos).
- Envelope exponencial 0.0001→pico→0.0001 y ataque más largo (mejor en Android/iOS).
- Compresor suave en la salida maestra para evitar picos.
- Menos cues en barras de progreso y beep final ligeramente diferido.
- Desbloqueo de AudioContext en el primer toque/clic.
- Caché PWA actualizada a r37.


### r38 — Ajustes reorganizados por secciones con botones
- Ajustes agrupados en **Partida**, **Sonido** y **Adaptabilidad**.
- Partida: exportar, importar, borrar/actualizar e instalar app.
- Sonido: silenciar/activar, barra de volumen y botones − / +.
- Adaptabilidad: pantalla completa, reducir animaciones, densidad y modo de pantalla.
- Caché PWA actualizada a r38.


### r39 — Expansión Tráfico de Órganos + recetas por nivel
- Recetas bloqueadas por nivel de Operador: N2→10, N3→20, N4→30, N5→40.
- Nueva categoría **Órgano** y rasgo **Ilegal** (no se vende en Envío de suministro).
- **Mesa de extracción**: consume criaturas orgánicas (no robots) y produce órganos seleccionables.
- **Mercado Negro**: venta exclusiva de mercancía ilegal con mejor pago.
- Filtro Órganos en inventario, registro y selector de fusión.
- Catálogo amplio de órganos por tipo de criatura + icono propio.
- Caché PWA actualizada a r39.


### r40 — Clínica, filtro Órganos y más contenido ilegal
- Filtro **Órganos** visible en inventario y registro (junto a Criaturas).
- Nueva página **Clínica** (debajo de La Central) con:
  - Mesa de extracción
  - Mercado Negro
- Catálogo de órganos ampliado (cientos de combinaciones + 100 nombres propios).
- Nuevos nombres de fusión para órganos (pool `organ` + familia `organico`).
- Caché PWA actualizada a r40.


### r41 — Clínica reparada + Contenido Adicional en ajustes
- Reconstruida por completo la página Clínica (HTML truncado en r40).
- Mesa de extracción y Mercado Negro operativos con estructura completa.
- En Ajustes: apartado **Contenido Adicional** con el título de la expansión «Tráfico de Órganos» y descripción breve.
- Caché PWA actualizada a r41.


### r42 — Estructura Clínica/Central corregida
- Eliminados restos del Mercado Negro anidados dentro de La Central (IDs duplicados y HTML roto).
- Página Clínica independiente y equilibrada (divs correctos).
- La Central vuelve a contener solo creación, horno, suministros, envío y bonus.
- Caché PWA actualizada a r42.


### r43 — Iconos de combate SVG y retirar en fusión
- En combate, criaturas y operador usan iconos SVG integrados (no emoji sueltos).
- Icono de Operador rediseñado (casco/operativo cian).
- En la cámara de fusión: botón **Retirar** junto a Cambiar objeto para vaciar la ranura.
- Caché PWA actualizada a r43.


### r44 — Mercado Negro alineado, extracción con % y Pinzas
- Mercado Negro con la misma UI que Envío de suministro (filas, checkbox, cantidad, totales).
- Extracción nerfeada: éxito por órgano según nivel N y cantidad seleccionada; la criatura se consume siempre.
- Se muestra N y % de éxito en cada órgano.
- Nuevo equipo **Pinzas** (muchas variedades) con bonus de éxito de extracción.
- Caché PWA actualizada a r44.


### r45 — Nombres largos en selector de fusión
- Los nombres de órganos y objetos largos se limitan a 2 líneas con corte limpio en el picker, inventario, registro y extracción.
- Caché PWA actualizada a r45.


### r46 — Mercado completo + Síntesis de Criatura
- Nueva sección **Mercado** (bajo Clínica) con 4 pestañas: Compra, Negro Compra, Venta, Negro Venta.
- Diario de 10 productos con stock limitado; se renueva a las 00:00.
- Venta con fluctuación diaria 50/75/100/150/200%.
- Compra con requisito de nivel (como recetas); el diario no lo exige.
- Mercado negro de compra: todo ilegal (órganos, armas balísticas, criaturas…).
- Clínica: Mercado Negro sustituido por **Síntesis de Criatura** (5 órganos → engendro ilegal, 10 s).
- Caché PWA actualizada a r46.


### r47 — Mercado en rejilla, nav móvil y síntesis por ranuras
- Mercado movido bajo Inventario en el menú.
- Catálogo de compra en tarjetas con paginación de 10 (diario sin páginas).
- Textos de venta reducidos al % actual visible.
- Nav móvil: botones Sistemas / Gestión que despliegan destinos.
- Extracción: Retirar criatura + paginación de órganos (10).
- Síntesis de criatura: 5 ranuras con selector tipo fusión y Retirar.
- Caché PWA actualizada a r47.


### r48 — Reloj en inicio, ajustes por pestañas, estabilización
- Inicio: fecha y hora en tiempo real junto al saludo.
- Ajustes: botones Partida / Sonido / Adaptabilidad que muestran cada bloque.
- Eliminado el apartado Contenido Adicional.
- Endurecido init y eliminadas llamadas a Mercado Negro antiguo en Clínica.
- Caché PWA actualizada a r48.


### r49 — Reparación crítica de arranque
- Restaurado `stateDefault` y `let state = loadState()` (habían desaparecido y rompían toda la app).
- Migraciones de partida movidas después de cargar el estado.
- Caché PWA actualizada a r49.


### r50 — Ajustes sin scroll + importación reparada
- Modal de ajustes sin barra de scroll interna en Partida/Sonido/Adaptabilidad.
- Importar partida más tolerante (con o sin contenedor save, equipped opcional).
- Mensajes de error más claros y aplicación null-safe tras importar.
- Caché PWA actualizada a r50.


### r51 — Confirmaciones, esquinas del modal y nav móvil
- Declarado `pendingConfirmAction` (fallo en strict mode que rompía Importar y Borrar partida).
- showConfirm más seguro.
- Modal de ajustes/confirmación con esquinas redondeadas sin recorte.
- Nav móvil: botones «Sistemas principales» y «Gestión de objetos» más claros y visuales.
- Caché PWA actualizada a r51.


### r52 — Mercado rework + anomalía en síntesis
- Mercado legal: sin criaturas ni anomalías; materiales, lingotes, herramientas, armas no balísticas, equipo y consumibles.
- Mercado negro: órganos, criaturas, armas balísticas e ilegales.
- Filtros en ambos mercados de compra.
- Paginación: 4 en móvil, 6 en PC.
- Diario: 12 productos.
- Síntesis: ranura de anomalía opcional junto al órgano 5; rasgo Hibridación anómala.
- Caché PWA actualizada a r52.


### r53 — Arranque + extracción unificada
- Restaurado stateDefault / state (rompía toda la app).
- Extracción: un solo % de éxito global; si falla, cero órganos.
- Nivel de órganos ≤ nivel de la criatura (N1 solo N1, N2 hasta N2, etc.), tirada aleatoria por órgano.
- Cada órgano se instancia con su propio nivel (como ítems únicos de fusión).
- Caché PWA actualizada a r53.
