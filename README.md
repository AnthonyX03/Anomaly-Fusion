# Anomaly Fusion — build 0.6

Juego web de exploración, fabricación, colección y fusiones anómalas. Funciona como PWA en PC y móvil.

## Contenido
- 12 zonas de exploración y un catálogo de cientos de objetos: menas, lingotes, armas, herramientas, equipo, materiales y consumibles.
- Registro de objetos descubiertos: cuadrícula de 10 por página, búsqueda, categorías y fichas con descripción, rareza, valor y métodos de obtención.
- Mesa de creación con categorías de recetas y tres recetas por página.
- Horno para fundir menas y producir los lingotes correspondientes.
- Máquina de fusión con resultados basados en los objetos usados, reclamación del resultado e historial de las tres últimas fusiones.
- Anomalías con habilidades pasivas procedurales y un espacio específico para equiparlas.
- Envío de suministros para vender objetos individualmente o en lotes, mostrando el pago exacto antes de confirmar.
- Consumibles y entregas de suministro reclamables.
- Guardado local automático y ajustes de interfaz.
- **Exportación e importación de partidas** en archivos JSON desde Ajustes.
- **Actualización de PWA:** el navegador comprueba actualizaciones al abrir, al volver a la pestaña y cada 60 segundos mientras está abierta. El service worker usa estrategia de red primero para recibir archivos nuevos cuando hay conexión y conserva caché como respaldo sin conexión.
- **Reiniciar y actualizar:** borra la partida local, limpia las cachés de Anomaly Fusion, desregistra el service worker anterior y recarga la aplicación para que se descargue la versión actual.

## Exportar e importar una partida
1. Abre **Ajustes → Exportar** y guarda el archivo `.json` en un lugar seguro.
2. En el dispositivo donde quieras continuar, abre **Ajustes → Importar** y selecciona ese archivo.
3. Confirma la importación. Esta sustituye la partida actual del dispositivo.

La copia de seguridad incluye el progreso de juego y los ajustes guardados. No contiene datos de cuentas ni se sube a ningún servidor.

## Probar localmente
Puedes abrir `index.html` para revisar la interfaz básica. Para probar el service worker, la actualización automática y la instalación PWA, sirve la carpeta mediante `localhost` o HTTPS. Los service workers no funcionan con normalidad desde `file://`.

## Publicar en GitHub Pages
1. Sube todos los archivos de esta carpeta a la raíz de un repositorio.
2. En **Settings → Pages**, selecciona la rama y la carpeta raíz.
3. Abre la URL HTTPS publicada. La instalación aparecerá cuando el navegador cumpla sus requisitos.

## Actualizaciones y caché
Cada nueva versión debe incrementar el nombre de caché `CACHE` en `sw.js` (por ejemplo, `anomaly-fusion-v7`). Al activar la nueva versión se eliminan automáticamente las cachés antiguas de Anomaly Fusion. La comprobación periódica necesita conexión; sin conexión se utiliza la copia almacenada en caché.

## Privacidad y guardado
La partida se guarda localmente en el navegador del dispositivo. Exporta una copia antes de borrar los datos del navegador o cambiar de dispositivo. La opción **Reiniciar y actualizar** elimina la partida local de forma irreversible.
