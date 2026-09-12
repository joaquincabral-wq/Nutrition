
// JC Nutrition V2 — base limpia sobre la PWA V1.1 que funcionaba.
(function(){
  'use strict';

  const baseRenderToday = renderToday;

  function localDateLabel(){
    return new Date().toLocaleDateString('es-ES',{
      weekday:'long', day:'numeric', month:'long'
    });
  }

  // HOY: conserva la lógica estable de comidas/macros y elimina solo entrenamiento.
  renderToday = function(){
    baseRenderToday();

    const content = document.getElementById('content');
    if(!content) return;

    [...content.querySelectorAll(':scope > .section')].forEach(section=>{
      const title = section.querySelector('.section-title h2')?.textContent?.trim().toLowerCase() || '';
      if(title === 'entrenamiento') section.remove();
      if(section.querySelector('.card.hero')) section.remove();
    });

    const hero = document.createElement('section');
    hero.className = 'section jn2-hero';
    hero.innerHTML = `
      <div class="card hero">
        <div class="eyebrow">${localDateLabel().toUpperCase()}</div>
        <h2>Plan de alimentación</h2>
        <p>Comidas, macros y progreso corporal.</p>
      </div>`;
    content.insertAdjacentElement('afterbegin', hero);
  };

  function exportBackup(){
    const storage = {};
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      storage[k] = localStorage.getItem(k);
    }

    const payload = {
      app:'JC Nutrition',
      version:'2.0',
      exportedAt:new Date().toISOString(),
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
    document.getElementById('jn2Status').textContent = 'Backup exportado correctamente.';
  }

  async function importBackup(file){
    if(!file) return;
    try{
      const parsed = JSON.parse(await file.text());

      let storage = null;
      if(parsed && parsed.storage && typeof parsed.storage === 'object'){
        storage = parsed.storage;
      }else if(parsed && typeof parsed === 'object'){
        storage = parsed;
      }

      if(!storage || typeof storage !== 'object'){
        throw new Error('Formato no válido');
      }

      if(!confirm('¿Importar este backup? Se restaurarán los datos guardados.')) return;

      Object.entries(storage).forEach(([k,v])=>{
        localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
      });

      alert('Backup importado correctamente. La aplicación se recargará.');
      location.reload();
    }catch(err){
      console.error(err);
      alert('No se ha podido importar el backup. Selecciona un JSON exportado desde JC Training o JC Nutrition.');
    }
  }

  // BACKUP: pantalla propia; no renderiza historial de entrenamientos.
  renderHistory = function(){
    const content = document.getElementById('content');
    content.innerHTML = `
      <section class="section">
        <div class="card">
          <div class="section-title">
            <h2>Copia de seguridad</h2>
            <span>JC Nutrition V2</span>
          </div>

          <p class="note">
            Puedes importar el backup JSON de la antigua JC Training.
          </p>

          <div class="jn2-backup-actions">
            <button id="jn2Import" class="primary-btn" type="button">Importar backup</button>
            <input id="jn2File" type="file" accept=".json,application/json" hidden>
            <button id="jn2Export" class="secondary-btn" type="button">Exportar backup</button>
          </div>

          <p id="jn2Status" class="note">
            Se guardan comidas, sustituciones, planes, mediciones y progreso.
          </p>
        </div>
      </section>
    `;

    const input = document.getElementById('jn2File');
    document.getElementById('jn2Import').onclick = ()=>input.click();
    input.onchange = ()=>importBackup(input.files?.[0]);
    document.getElementById('jn2Export').onclick = exportBackup;
  };

  document.title = 'JC Nutrition';
  document.querySelectorAll('.eyebrow').forEach(e=>{
    if((e.textContent||'').trim()==='JC TRAINING') e.textContent='JC NUTRITION';
  });

  window.JC_NUTRITION_VERSION='2.0';

  // Render inicial limpio.
  render();
})();
