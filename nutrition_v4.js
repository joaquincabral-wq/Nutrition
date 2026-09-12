
(function(){
'use strict';

const qs=(s,r=document)=>r.querySelector(s);
const qsa=(s,r=document)=>[...r.querySelectorAll(s)];

const baseMeals = window.renderMeals;
const baseMeasurements = window.renderMeasurements;

function setTitle(t){
  const e=document.getElementById('pageTitle');
  if(e) e.textContent=t;
}

function stripTrainingFromToday(){
  const content=document.getElementById('content');
  if(!content) return;

  // Remove by known classes/ids first.
  [
    '.v103-session-section','.v103-sticky','.v104-sticky','.v11-session-end',
    '.workout-card','.training-card','.training-summary',
    '[data-workout-section]','#workoutToday'
  ].forEach(sel => qsa(sel,content).forEach(n=>n.remove()));

  // Remove any top-level section/card that contains unmistakable training UI.
  qsa(':scope > .section, :scope > .card', content).forEach(block=>{
    const txt=(block.textContent||'').toLowerCase();
    if(
      txt.includes('iniciar entrenamiento') ||
      txt.includes('cronómetro general') ||
      txt.includes('añadir ejercicio') ||
      txt.includes('¿con qué termino?') ||
      txt.includes('series base') ||
      txt.includes('descansos automáticos') ||
      txt.includes('progreso de entrenamiento')
    ){
      block.remove();
    }
  });

  // Remove any remaining training descendants.
  qsa('button',content).forEach(b=>{
    const t=(b.textContent||'').toLowerCase();
    if(
      t.includes('iniciar entrenamiento') ||
      t.includes('añadir ejercicio') ||
      t.includes('¿con qué termino?') ||
      t.includes('editar duración') ||
      t.includes('descanso total')
    ){
      b.closest('.card,.section')?.remove();
    }
  });
}

function renderTodayNutrition(){
  // Use stable original Today once, then strip everything training-related.
  if(typeof window.__baseTodayV4 === 'function'){
    window.__baseTodayV4();
  }else if(typeof window.renderTodayOriginalV4 === 'function'){
    window.renderTodayOriginalV4();
  }
  stripTrainingFromToday();

  const content=document.getElementById('content');
  if(!content) return;

  if(!content.querySelector('.jn4-hero')){
    const d=new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});
    const s=document.createElement('section');
    s.className='section jn4-hero';
    s.innerHTML=`<div class="card hero">
      <div class="eyebrow">${d.toUpperCase()}</div>
      <h2>Plan de alimentación</h2>
      <p>Comidas, macros, medidas y progreso corporal.</p>
    </div>`;
    content.insertAdjacentElement('afterbegin',s);
  }
}

function renderProgressNutrition(){
  const content=document.getElementById('content');
  const metrics = typeof load==='function' && typeof metricsKey==='function' ? load(metricsKey(),[]) : [];
  const arr=Array.isArray(metrics)?metrics:[];
  const valid=arr.filter(m=>m && (m.weight||m.waist||m.bodyFat||m.muscleMass));
  const latest=valid.at(-1)||{};

  content.innerHTML=`
    <section class="section">
      <div class="card">
        <div class="section-title"><h2>Progreso corporal</h2><span>${valid.length} registros</span></div>
        <div class="metric-summary">
          <div><b>${latest.weight||'—'}</b><span>kg último peso</span></div>
          <div><b>${latest.waist||'—'}</b><span>cm cintura</span></div>
          <div><b>${latest.bodyFat||'—'}</b><span>% grasa</span></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="card">
        <div class="section-title"><h2>Registros recientes</h2><span>${Math.min(valid.length,10)}</span></div>
        ${valid.length ? valid.slice().reverse().slice(0,10).map(m=>`
          <div class="history-item">
            <strong>${m.date||''}${m.time?` · ${m.time}`:''}</strong>
            <p>${m.weight?`${m.weight} kg`:''}${m.waist?` · ${m.waist} cm cintura`:''}${m.bodyFat?` · ${m.bodyFat}% grasa`:''}${m.muscleMass?` · ${m.muscleMass} kg músculo`:''}</p>
          </div>`).join('') : '<p class="note">Todavía no hay mediciones.</p>'}
      </div>
    </section>`;
}

async function importAnyBackup(file){
  if(!file) return;
  try{
    const parsed=JSON.parse(await file.text());
    let storage=null;

    if(parsed && parsed.storage && typeof parsed.storage==='object'){
      storage=parsed.storage;
    }else if(parsed && typeof parsed==='object'){
      // Accept old app backup formats that were direct object maps.
      storage=parsed;
    }

    if(!storage || typeof storage!=='object') throw new Error('Formato no reconocido');

    if(!confirm('¿Importar este backup? Se restaurarán los datos guardados.')) return;

    Object.entries(storage).forEach(([k,v])=>{
      localStorage.setItem(k, typeof v==='string' ? v : JSON.stringify(v));
    });

    alert('Backup importado correctamente. La app se recargará.');
    location.reload();
  }catch(err){
    console.error(err);
    alert('No se ha podido importar el backup. Usa un archivo JSON exportado desde JC Training o JC Nutrition.');
  }
}

function exportAllBackup(){
  const storage={};
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i);
    storage[k]=localStorage.getItem(k);
  }
  const payload={app:'JC Nutrition',version:'4.0',exportedAt:new Date().toISOString(),storage};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='JC_Nutrition_backup.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function renderBackupNutrition(){
  const content=document.getElementById('content');
  content.innerHTML=`
    <section class="section">
      <div class="card">
        <div class="section-title"><h2>Backup</h2><span>JC Nutrition V4</span></div>
        <p class="note">Importa tu copia anterior o exporta los datos actuales.</p>
        <div class="jn4-backup-actions">
          <button id="jn4ImportBtn" class="primary-btn" type="button">Importar backup</button>
          <input id="jn4ImportFile" type="file" accept=".json,application/json" hidden>
          <button id="jn4ExportBtn" class="secondary-btn" type="button">Exportar backup</button>
        </div>
      </div>
    </section>`;
  const input=document.getElementById('jn4ImportFile');
  document.getElementById('jn4ImportBtn').onclick=()=>input.click();
  input.onchange=()=>importAnyBackup(input.files?.[0]);
  document.getElementById('jn4ExportBtn').onclick=exportAllBackup;
}

// Capture the original stable renderToday BEFORE replacing.
window.__baseTodayV4 = window.renderToday;

// Hard replace router AFTER all previous scripts loaded.
window.render=function(){
  const allowed=['today','meals','measurements','progress','backup'];
  if(!allowed.includes(state.view)) state.view='today';

  qsa('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view));

  if(state.view==='today'){
    setTitle('Hoy');
    renderTodayNutrition();
  }else if(state.view==='meals'){
    setTitle('Comidas');
    baseMeals();
  }else if(state.view==='measurements'){
    setTitle('Medidas');
    baseMeasurements();
  }else if(state.view==='progress'){
    setTitle('Progreso');
    renderProgressNutrition();
  }else if(state.view==='backup'){
    setTitle('Backup');
    renderBackupNutrition();
  }
};

// Replace nav click handlers by cloning nodes (removes old listeners).
qsa('.nav-btn').forEach(btn=>{
  const clone=btn.cloneNode(true);
  btn.replaceWith(clone);
});
qsa('.nav-btn').forEach(btn=>{
  btn.onclick=()=>{
    state.view=btn.dataset.view;
    window.render();
  };
});

// Remove training overlays/timers from DOM permanently.
['timerOverlay','timerMini'].forEach(id=>document.getElementById(id)?.remove());
qsa('.v103-sticky,.v104-sticky,.v11-session-end').forEach(n=>n.remove());

document.title='JC Nutrition';
window.JC_NUTRITION_VERSION='4.0';
state.view='today';
window.render();
})();
