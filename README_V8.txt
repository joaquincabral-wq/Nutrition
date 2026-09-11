JC TRAINING V8

Objetivo de esta versión:
Intentar que Chrome/Android detecte JC Training como PWA instalable y muestre "Instalar aplicación",
en lugar de limitarse a "Crear acceso directo".

Cambios:
- manifest.json reforzado con id, scope, start_url raíz y display standalone.
- Iconos PNG 192x192 y 512x512, además de variante maskable.
- v8.js registra y espera al Service Worker y gestiona beforeinstallprompt.
- sw.js actualizado a caché V8.
- index.html actualizado para cargar v8.js y metadatos PWA.

ARCHIVOS A SUBIR A GITHUB:
1. index.html              (sustituir)
2. manifest.json           (sustituir)
3. sw.js                   (sustituir)
4. v8.js                   (nuevo)
5. icon-192.png            (nuevo)
6. icon-512.png            (nuevo)

No borres los archivos anteriores.

DESPUÉS DE QUE NETLIFY PUBLIQUE:
1. Abre JC Training en Chrome.
2. Recarga una vez.
3. Si ya tenías un acceso directo antiguo, elimínalo de la pantalla de inicio antes de probar.
4. Espera unos segundos y abre ⋮.
5. Lo correcto sería ver "Instalar aplicación" o una opción equivalente.
6. Si sigue apareciendo "Crear acceso directo", envíame una captura y revisamos el criterio que aún esté fallando.
