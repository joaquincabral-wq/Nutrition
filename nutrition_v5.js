(function(){
'use strict';
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
const stableMeals=window.renderMeals, stableMeasurements=window.renderMeasurements;
function title(t){const e=document.getElementById('pageTitle');if(e)e.textContent=t;}
function localDate(){return new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});}

function renderTodayFood(){
  const d=new Date(), day=dayKey(d), doneMeals=load(mealsKey(),{}), content=el('content');
  const macros=(typeof v6MacroDashboard==='function') ? v6MacroDashboard(day,isoDate(),true) : '';
  const meals=(MEALS[day]||[]).map((m,i)=>mealCard(m,i,doneMeals)).join('');
  content.innerHTML=`
    <section class="section jn5-hero"><div class="card hero">
      <div class="eyebrow">${localDate().toUpperCase()}</div>
      <h2>Plan de alimentación</h2><p>Comidas, macros, medidas y progreso corporal.</p>
    </div></section>
    ${macros}
    <section class="section"><div class="section-title"><h2>Comidas de hoy</h2><span>${(MEALS[day]||[]).length} comidas</span></div>${meals}</section>`;
  if(typeof bindMealEvents==='function') bindMealEvents();
  const reset=document.getElementById('v6ResetDay');
  if(reset && typeof v6ResetCurrentDay==='function') reset.onclick=()=>v6ResetCurrentDay(day,isoDate());
}

function metricArray(){
  try{return (typeof load==='function'&&typeof metricsKey==='function')?load(metricsKey(),[]):[]}catch(e){return []}
}
function renderBodyProgress(){
  const content=el('content'), arr=metricArray();
  const valid=(Array.isArray(arr)?arr:[]).filter(m=>m&&(m.weight||m.waist||m.bodyFat||m.muscleMass));
  const latest=valid.at(-1)||{}, first=valid[0]||{};
  const diff=(f,u)=>{const a=parseFloat(first[f]),b=parseFloat(latest[f]);if(!Number.isFinite(a)||!Number.isFinite(b))return '—';const x=b-a;return `${x>0?'+':''}${x.toFixed(1)}${u}`};
  content.innerHTML=`<section class="section"><div class="card"><div class="section-title"><h2>Progreso corporal</h2><span>${valid.length} registros</span></div>
  <div class="metric-summary"><div><b>${latest.weight||'—'}</b><span>kg peso</span></div><div><b>${latest.waist||'—'}</b><span>cm cintura</span></div><div><b>${latest.bodyFat||'—'}</b><span>% grasa</span></div></div></div></section>
  <section class="section"><div class="card"><div class="section-title"><h2>Desde el inicio</h2><span>tendencia</span></div><div class="metric-summary"><div><b>${diff('weight',' kg')}</b><span>Peso</span></div><div><b>${diff('waist',' cm')}</b><span>Cintura</span></div><div><b>${diff('bodyFat',' pp')}</b><span>Grasa</span></div></div></div></section>
  <section class="section"><div class="card"><div class="section-title"><h2>Registros recientes</h2><span>${Math.min(valid.length,10)}</span></div>${valid.length?valid.slice().reverse().slice(0,10).map(m=>`<div class="history-item"><strong>${m.date||''}${m.time?` · ${m.time}`:''}</strong><p>${m.weight?`${m.weight} kg`:''}${m.waist?` · ${m.waist} cm cintura`:''}${m.bodyFat?` · ${m.bodyFat}% grasa`:''}${m.muscleMass?` · ${m.muscleMass} kg músculo`:''}</p></div>`).join(''):'<p class="note">Todavía no hay mediciones.</p>'}</div></section>`;
}

async function importBackup(file){
  if(!file)return;
  try{
    const parsed=JSON.parse(await file.text());
    let storage=(parsed&&parsed.storage&&typeof parsed.storage==='object')?parsed.storage:null;
    if(!storage && parsed && typeof parsed==='object') storage=parsed;
    if(!storage||typeof storage!=='object') throw new Error('Formato no válido');
    if(!confirm('¿Importar este backup? Se restaurarán los datos guardados.'))return;
    Object.entries(storage).forEach(([k,v])=>localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v)));
    alert('Backup importado correctamente. La app se recargará.');location.reload();
  }catch(e){console.error(e);alert('No se ha podido importar el backup.');}
}
function exportBackup(){
  const storage={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);storage[k]=localStorage.getItem(k)}
  const blob=new Blob([JSON.stringify({app:'JC Nutrition',version:'5.0',exportedAt:new Date().toISOString(),storage},null,2)],{type:'application/json'});
  const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='JC_Nutrition_backup.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);
}
function renderBackup(){
  el('content').innerHTML=`<section class="section"><div class="card"><div class="section-title"><h2>Backup</h2><span>JC Nutrition V5</span></div><p class="note">Importa tu copia anterior o exporta los datos actuales.</p><div class="jn5-backup"><button id="jn5Import" class="primary-btn">Importar backup</button><input id="jn5File" type="file" accept=".json,application/json" hidden><button id="jn5Export" class="secondary-btn">Exportar backup</button></div></div></section>`;
  const f=document.getElementById('jn5File');document.getElementById('jn5Import').onclick=()=>f.click();f.onchange=()=>importBackup(f.files?.[0]);document.getElementById('jn5Export').onclick=exportBackup;
}

// Replace nav nodes to strip all old listeners.
qa('.nav-btn').forEach(b=>{const c=b.cloneNode(true);b.replaceWith(c)});
qa('.nav-btn').forEach(b=>b.onclick=()=>{state.view=b.dataset.view;window.render()});

window.render=function(){
  const allowed=['today','meals','measurements','progress','backup'];if(!allowed.includes(state.view))state.view='today';
  qa('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view));
  if(state.view==='today'){title('Hoy');renderTodayFood()}
  else if(state.view==='meals'){title('Comidas');stableMeals()}
  else if(state.view==='measurements'){title('Medidas');stableMeasurements()}
  else if(state.view==='progress'){title('Progreso');renderBodyProgress()}
  else {title('Backup');renderBackup()}
};

['timerOverlay','timerMini'].forEach(id=>document.getElementById(id)?.remove());
qsa=document.querySelectorAll.bind(document); // no-op legacy safety
window.JC_NUTRITION_VERSION='5.0';document.title='JC Nutrition';state.view='today';window.render();
})();