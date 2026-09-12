
// JC Nutrition V1.3 — Backup visible y robusto.
(function(){
  'use strict';

  function el(id){ return document.getElementById(id); }

  function exportBackup(){
    const storage = {};
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      storage[k] = localStorage.getItem(k);
    }
    const payload = {
      app: 'JC Nutrition',
      version: '1.3',
      exportedAt: new Date().toISOString(),
      storage
    };
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date();
    const stamp = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    a.href = url;
    a.download = `JC_Nutrition_backup_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  async function importBackup(file){
    if(!file) return;
    try{
      const parsed = JSON.parse(await file.text());

      let storage = null;
      if(parsed && parsed.storage && typeof parsed.storage === 'object'){
        storage = parsed.storage;
      } else if(parsed && typeof parsed === 'object') {
        // Compatibilidad con backups antiguos simples de JC Training
        storage = parsed;
      }

      if(!storage || typeof storage !== 'object'){
        throw new Error('Formato no reconocido');
      }

      if(!confirm('¿Importar este backup? Se restaurarán los datos guardados en la aplicación.')) return;

      Object.entries(storage).forEach(([k,v])=>{
        localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
      });

      alert('Backup importado correctamente. La aplicación se recargará.');
      location.reload();
    }catch(err){
      console.error(err);
      alert('No se ha podido importar el backup. Selecciona un archivo JSON exportado desde JC Training o JC Nutrition.');
    }
  }

  function renderBackupV13(){
    const content = el('content');
    const title = el('pageTitle');
    if(title) title.textContent = 'Backup';
    if(!content) return;

    content.innerHTML = `
      <section class="section">
        <div class="card jn13-backup-card">
          <div class="section-title">
            <h2>Backup</h2>
            <span>JC Nutrition V1.3</span>
          </div>

          <p class="jn13-backup-intro">
            Guarda o recupera tus comidas, planes, sustituciones, mediciones y progreso.
          </p>

          <button id="jn13ImportBtn" class="primary-btn jn13-big-btn" type="button">
            ⬆ Importar backup
          </button>
          <input id="jn13ImportInput" type="file" accept=".json,application/json" style="display:none">

          <button id="jn13ExportBtn" class="secondary-btn jn13-big-btn" type="button">
            ⬇ Exportar backup
          </button>

          <div class="jn13-help">
            También puedes importar el archivo JSON que exportaste desde JC Training.
          </div>
        </div>
      </section>
    `;

    const importBtn = el('jn13ImportBtn');
    const importInput = el('jn13ImportInput');
    const exportBtn = el('jn13ExportBtn');

    importBtn.onclick = () => importInput.click();
    importInput.onchange = () => importBackup(importInput.files?.[0]);
    exportBtn.onclick = exportBackup;
  }

  // Forzar que Backup siempre use esta pantalla, incluso si una versión anterior intenta renderizar otra.
  const previousRender = window.render;
  window.render = function(){
    if(window.state?.view === 'history'){
      document.querySelectorAll('.nav-btn').forEach(b=>{
        b.classList.toggle('active', b.dataset.view === 'history');
      });
      renderBackupV13();
      return;
    }
    previousRender();
  };

  // Reasignar el botón Backup de forma explícita.
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    if(btn.dataset.view === 'history'){
      btn.textContent = 'Backup';
      btn.onclick = () => {
        window.state.view = 'history';
        window.render();
      };
    }
  });

  window.JC_NUTRITION_VERSION = '1.3';
})();
