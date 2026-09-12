
// JC Nutrition V6 service-worker updater
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js?v=6', {scope:'./'});
      await reg.update();
    } catch (e) {
      console.error('SW V6', e);
    }
  });
}
