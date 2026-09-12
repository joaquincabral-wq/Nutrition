
// JC Nutrition V1.2 — router limpio + backup propio.
(function(){
  'use strict';

  function el(id){ return document.getElementById(id); }
  function setTitle(t){ const x=el('pageTitle'); if(x) x.textContent=t; }

  function downloadBackup(){
    const storage={};
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      storage[k]=localStorage.getItem(k);
    }
    const payload={
      app:'JC Nutrition',
      version:'1.2',
      exportedAt:new Date().toISOString(),
      storage
    };
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    const d=new Date();
    const stamp=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    a.href=url;
    a.download=`JC_Nutrition_backup_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    const status=el('jnBackupStatus');
    if(status) status.textContent='Backup exportado correctamente.';
  }

  async function restoreBackup(file){
    if(!file) return;
    try{
      const parsed=JSON.parse(await file.text());

      // Accept both the old JC Training backup and the new JC Nutrition backup.
      let storage=null;
      if(parsed && parsed.storage && typeof parsed.storage==='object'){
        storage=parsed.storage;
      }
      if(!storage) throw new Error('Formato no válido');

      if(!confirm('Se restaurarán los datos guardados de esta copia en JC Nutrition. ¿Continuar?')) return;

      Object.entries(storage).forEach(([k,v])=>{
        // Old backups usually store already-stringified localStorage values.
        // Some older exports may hold objects directly.
        localStorage.setItem(k, typeof v==='string' ? v : JSON.stringify(v));
      });

      alert('Backup restaurado correctamente. La aplicación se recargará ahora.');
      location.reload();
    }catch(err){
      alert('No se ha podido importar el backup. Usa un archivo JSON exportado desde JC Training o JC Nutrition.');
    }
  }

  function renderBackup(){
    setTitle('Backup');
    const content=el('content');
    if(!content) return;

    content.innerHTML=`
      <section class="section">
        <div class="card">
          <div class="section-title">
            <h2>Copia de seguridad</h2>
            <span>JC Nutrition V1.2</span>
          </div>
          <p>Exporta tus comidas, sustituciones, planes, mediciones y demás datos guardados en este dispositivo.</p>
          <div class="jn-backup-actions">
            <button id="jnExportBackup" class="primary-btn">Exportar backup</button>
            <label class="secondary-btn jn-file-label">
              Importar backup
              <input id="jnImportBackup" type="file" accept="application/json,.json" hidden>
            </label>
          </div>
          <p id="jnBackupStatus" class="note">
            También puedes importar el backup JSON de la antigua JC Training.
          </p>
        </div>
      </section>
      <section class="section">
        <div class="card">
          <div class="section-title"><h2>Aplicación</h2><span>Nutrición</span></div>
          <p class="note">El entrenamiento se registra en Garmin. Esta aplicación conserva alimentación, mediciones y progreso corporal.</p>
        </div>
      </section>`;

    el('jnExportBackup').onclick=downloadBackup;
    el('jnImportBackup').onchange=e=>restoreBackup(e.target.files?.[0]);
  }

  // Keep Today nutrition-only while using the stable Today renderer beneath it.
  const stableToday=window.renderToday;
  function renderNutritionToday(){
    stableToday();
    const content=el('content');
    if(!content) return;

    [...content.querySelectorAll(':scope > .section')].forEach(section=>{
      const title=section.querySelector('.section-title h2')?.textContent?.trim().toLowerCase()||'';
      if(title==='entrenamiento') section.remove();
      if(section.querySelector('.card.hero')) section.remove();
    });

    if(!content.querySelector('.jn-hero')){
      const hero=document.createElement('section');
      hero.className='section jn-hero';
      const date=new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});
      hero.innerHTML=`<div class="card hero">
        <div class="eyebrow">${date.toUpperCase()}</div>
        <h2>Plan de alimentación</h2>
        <p>Comidas, macros y progreso corporal.</p>
      </div>`;
      content.insertAdjacentElement('afterbegin',hero);
    }
  }
  window.renderToday=renderNutritionToday;

  // Explicit final router. This is intentionally the last router loaded.
  window.render=function(){
    document.querySelectorAll('.nav-btn').forEach(b=>{
      b.classList.toggle('active', b.dataset.view===state.view);
    });

    switch(state.view){
      case 'today':
        setTitle('Hoy');
        window.renderToday();
        break;
      case 'meals':
        setTitle('Comidas');
        window.renderMeals();
        break;
      case 'measurements':
        setTitle('Medidas');
        window.renderMeasurements();
        break;
      case 'progress':
        setTitle('Progreso');
        window.renderProgress();
        break;
      case 'history':
        renderBackup();
        break;
      default:
        state.view='today';
        setTitle('Hoy');
        window.renderToday();
    }
  };

  // Rebuild nav handlers explicitly and remove Training.
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    if(btn.dataset.view==='training'){
      btn.remove();
      return;
    }
    if(btn.dataset.view==='history') btn.textContent='Backup';
    btn.onclick=()=>{
      state.view=btn.dataset.view;
      window.render();
    };
  });

  document.title='JC Nutrition';
  window.JC_NUTRITION_VERSION='1.2';

  // Start cleanly on a valid Nutrition view.
  if(!['today','meals','measurements','progress','history'].includes(state.view)){
    state.view='today';
  }
  window.render();
})();
