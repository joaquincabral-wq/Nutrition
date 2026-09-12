JC NUTRITION V6

Objetivo principal: eliminar el arrastre de versiones antiguas en la PWA.

- Nuevo identificador/start_url de PWA.
- Service worker nuevo con skipWaiting + clients.claim.
- Borra todas las caches antiguas al activarse.
- index/app/style usan network-first.
- CSS y JS críticos eliminan cualquier bloque de entrenamiento heredado.
- Se muestra una pequeña marca 'V6' arriba a la derecha para confirmar que se está cargando esta versión.

IMPORTANTE:
Después de subirla a GitHub Pages, abrir primero la URL en Chrome con:
?app=jc-nutrition-v6
y comprobar que aparece 'V6'. Si la PWA instalada sigue mostrando la versión vieja,
desinstalar el acceso/app anterior y volver a instalar desde esa URL.
