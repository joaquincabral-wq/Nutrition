// JC Training V8 — instalación PWA reforzada para Android/Chrome.
(function () {
  'use strict';

  const installBtn = document.getElementById('installBtn');
  let deferredPrompt = null;

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  function updateInstallButton() {
    if (!installBtn) return;
    if (isStandalone()) {
      installBtn.classList.add('hidden');
      return;
    }
    if (deferredPrompt) {
      installBtn.classList.remove('hidden');
      installBtn.textContent = 'Instalar app';
    }
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    updateInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installBtn) installBtn.classList.add('hidden');
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        try {
          await deferredPrompt.userChoice;
        } finally {
          deferredPrompt = null;
          updateInstallButton();
        }
      } else if (!isStandalone()) {
        alert('Si Chrome todavía muestra "Crear acceso directo", cierra esta pestaña, vuelve a abrir JC Training y espera unos segundos. Después abre el menú de Chrome y busca "Instalar aplicación".');
      }
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        await navigator.serviceWorker.ready;

        // Tras instalar un SW nuevo, una recarga permite que controle la página.
        if (!navigator.serviceWorker.controller && sessionStorage.getItem('jc-v8-reloaded') !== '1') {
          sessionStorage.setItem('jc-v8-reloaded', '1');
          location.reload();
          return;
        }
        updateInstallButton();
      } catch (err) {
        console.error('JC Training V8: no se pudo registrar el service worker', err);
      }
    });
  }

  updateInstallButton();
})();
