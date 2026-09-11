// JC Training V10.7 — Entreno en acordeón + desglose de tiempo trabajo/descanso.
(function(){
'use strict';
const V107='10.7';
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TRAIN_ACC_KEY='v107TrainingAccordion';
const restKey=(date=isoDate())=>`v107RestSeconds:${date}`;
const manualRestKey=(date=isoDate())=>`v107ManualRest:${date}`;
function getAcc(){return load(TRAIN_ACC_KEY,{})||{}}
function setAcc(x){save(TRAIN_ACC_KEY,x)}
function restSeconds(date=isoDate()){
  const manual=+load(manualRestKey(date),0)||0;
  return manual || (+load(restKey(date),0)||0);
}
function saveRestSeconds(sec,date=isoDate()){save(restKey(date),Math.max(0,Math.round(sec||0)))}
function effectiveTotal(date=isoDate()){
  const manual=+load(`v104Duration:${date}`,0)||0;if(manual)return manual;
  const h=(load('workoutHistory',[])||[]).find(x=>x.date===date);if(h?.elapsed)return +h.elapsed;
  const s=load(`sessionSummary:${date}`,null);return +s?.elapsed||0;
}
function splitTime(date=isoDate()){
  const total=effectiveTotal(date), rest=Math.min(total||Infinity,restSeconds(date));
  return {total,rest:Number.isFinite(rest)?rest:restSeconds(date),work:total?Math.max(0,total-(Number.isFinite(rest)?rest:0)):0};
}
function updateStoredSplit(date=isoDate()){
  const t=splitTime(date), hist=load('workoutHistory',[])||[], h=hist.find(x=>x.date===date);
  if(h){h.restSeconds=t.rest;h.workSeconds=t.work;save('workoutHistory',hist)}
  const s=load(`sessionSummary:${date}`,null);if(s){s.restSeconds=t.rest;s.workSeconds=t.work;save(`sessionSummary:${date}`,s)}
}
function openRestEditor(date=isoDate()){
  const current=restSeconds(date), mins=Math.floor(current/60), secs=current%60, sheet=el('swapSheet');
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">DESCANSO REAL</div><h3>${esc(date)}</h3></div><button class="swap-close" id="v107RestClose">Cerrar</button></div><div class="v107-time-grid"><label>Minutos<input id="v107RestMin" class="input" type="number" min="0" value="${mins}"></label><label>Segundos<input id="v107RestSec" class="input" type="number" min="0" max="59" value="${secs}"></label></div><button id="v107RestSave" class="primary-btn" style="width:100%;margin-top:12px">Guardar descanso total</button><p class="note">Si usas los temporizadores de JC Training, el descanso se registra automáticamente. Si controlas los descansos con el reloj, puedes introducir aquí el total manual.</p>`;
  sheet.classList.remove('hidden');q('#v107RestClose').onclick=()=>sheet.classList.add('hidden');q('#v107RestSave').onclick=()=>{const sec=(+q('#v107RestMin').value||0)*60+Math.min(59,+q('#v107RestSec').value||0);save(manualRestKey(date),Math.max(0,sec));updateStoredSplit(date);sheet.classList.add('hidden');render();};
}

// Acumula descanso real mientras el temporizador interno está corriendo.
let lastSample=Date.now();
setInterval(()=>{
  const now=Date.now(), delta=Math.max(0,Math.min(2,(now-lastSample)/1000));lastSample=now;
  if(!V3?.session || V3.session.date!==isoDate())return;
  const timerVisible=(state?.timerRemaining>0) && !state?.timerPaused;
  if(timerVisible && !load(manualRestKey(),0)) saveRestSeconds(restSeconds()+delta);
},1000);

function planTime(plan){
  if(!plan?.exercises?.length)return {sets:0,work:0,rest:0,transition:0,total:0};
  const sets=plan.exercises.reduce((a,x)=>a+(+x[1]||0),0);
  // 45 s por serie como estimación conservadora de ejecución efectiva.
  const work=Math.round(sets*45);
  const rest=Math.round(plan.exercises.reduce((a,x)=>a+Math.max(0,(+x[1]||0)-1)*(+x[3]||0),0));
  const transition=Math.round(Math.max(0,plan.exercises.length-1)*60);
  return {sets,work,rest,transition,total:work+rest+transition};
}
function latestForDay(day){
  const targetName=TRAINING[day]?.name;
  return (load('workoutHistory',[])||[]).slice().reverse().find(h=>h.name===targetName)||null;
}
function timeFooter(day){
  const p=TRAINING[day], est=planTime(p), latest=latestForDay(day);
  const latestHtml=latest?(()=>{const total=+latest.elapsed||0,rest=+latest.restSeconds||0,work=latest.workSeconds!=null?+latest.workSeconds:Math.max(0,total-rest);return `<div class="v107-actual"><strong>Última sesión</strong><span>Total ${total?fmtElapsed(total):'—'} · ejercicio ${work?fmtElapsed(work):'—'} · descansos ${rest?fmtElapsed(rest):'—'}</span></div>`})():'';
  return `<div class="card v107-time-footer"><div class="v107-time-title"><strong>Tiempo estimado del día</strong><span>${est.sets} series</span></div><div class="v107-time-kpis"><div><b>${fmtElapsed(est.total)}</b><span>total*</span></div><div><b>${fmtElapsed(est.work)}</b><span>ejercicio</span></div><div><b>${fmtElapsed(est.rest)}</b><span>descansos</span></div></div><small>*Total estimado = ejecución + descansos programados + ~1 min entre ejercicios. No sustituye al cronómetro real.</small>${latestHtml}</div>`;
}

const oldTraining=window.renderTraining;
window.renderTraining=function(){
  oldTraining();
  const content=q('#content'), days=qa('.v7-day-section',content);if(!days.length)return;
  let st=getAcc();if(!Object.keys(st).length){days.forEach(s=>{const d=q('h2',s)?.textContent?.trim().split(' · ')[0]?.toLowerCase();if(d)st[d]=d===dayKey()});setAcc(st)}
  const apply=(section,open)=>{section.classList.toggle('v107-day-collapsed',!open);const b=q('.v107-day-toggle',section);if(b){b.textContent=open?'Contraer':'Ampliar';b.setAttribute('aria-expanded',String(open))}};
  days.forEach(section=>{
    const head=q('.section-title',section), h=q('h2',head);if(!head||!h)return;const day=h.textContent.trim().split(' · ')[0].toLowerCase();section.dataset.v107Day=day;
    if(!q('.v107-time-footer',section))section.insertAdjacentHTML('beforeend',timeFooter(day));
    let b=q('.v107-day-toggle',head);if(!b){b=document.createElement('button');b.type='button';b.className='secondary-btn v107-day-toggle';head.appendChild(b)}
    apply(section,st[day]!==false);
    const toggle=()=>{const x=getAcc(),open=section.classList.contains('v107-day-collapsed');x[day]=open;setAcc(x);apply(section,open)};
    b.onclick=e=>{e.preventDefault();e.stopPropagation();toggle()};head.classList.add('v107-clickable');head.onclick=e=>{if(!e.target.closest('button'))toggle()};
  });
  if(!q('#v107TrainingControls',content)){
    const controls=document.createElement('section');controls.id='v107TrainingControls';controls.className='section v107-controls';controls.innerHTML='<div class="v107-control-row"><button class="secondary-btn" id="v107ExpandTraining">Expandir todos</button><button class="secondary-btn" id="v107CollapseTraining">Contraer todos</button></div>';days[0].parentNode.insertBefore(controls,days[0]);
    const all=open=>{const x=getAcc();days.forEach(s=>{x[s.dataset.v107Day]=open;apply(s,open)});setAcc(x)};q('#v107ExpandTraining').onclick=()=>all(true);q('#v107CollapseTraining').onclick=()=>all(false);
  }
};

// Hoy: desglose en vivo total / fuera de descanso / descanso.
const oldToday=window.renderToday;
window.renderToday=function(){
  oldToday();
  const panel=q('.v103-session-card');if(!panel)return;
  let box=q('#v107TimeSplit',panel);if(!box){box=document.createElement('div');box.id='v107TimeSplit';box.className='v107-live-split';const anchor=q('.v103-session-kpis',panel);anchor?.insertAdjacentElement('afterend',box)}
  const total=V3?.session?.date===isoDate()?Math.max(0,Math.floor((Date.now()-V3.session.startedAt)/1000)):effectiveTotal();const rest=restSeconds(),work=total?Math.max(0,total-rest):0;
  box.innerHTML=`<div><b id="v107Total">${total?fmtElapsed(total):'0:00'}</b><span>total</span></div><div><b id="v107Work">${work?fmtElapsed(work):'0:00'}</b><span>ejercicio*</span></div><div><b id="v107Rest">${rest?fmtElapsed(rest):'0:00'}</b><span>descanso</span></div>`;
  if(!q('#v107EditRest',panel)){const actions=q('.v103-session-actions',panel),b=document.createElement('button');b.id='v107EditRest';b.className='secondary-btn';b.textContent='✎ Descanso total';b.onclick=()=>openRestEditor();actions?.appendChild(b);const note=document.createElement('p');note.className='note v107-note';note.textContent='*“Ejercicio” = tiempo total menos descansos registrados; incluye cambios de máquina y preparación.';panel.appendChild(note)}
};
setInterval(()=>{const a=q('#v107Total'),b=q('#v107Work'),c=q('#v107Rest');if(!a||!b||!c)return;const total=V3?.session?.date===isoDate()?Math.max(0,Math.floor((Date.now()-V3.session.startedAt)/1000)):effectiveTotal(),rest=restSeconds(),work=total?Math.max(0,total-rest):0;a.textContent=fmtElapsed(total||0);b.textContent=fmtElapsed(work||0);c.textContent=fmtElapsed(rest||0)},1000);

// Al finalizar, conserva el desglose real en historial/resumen.
const oldFinish=window.finishWorkoutSession;
window.finishWorkoutSession=function(){
  const date=isoDate(), total=V3?.session?.date===date?Math.max(0,Math.floor((Date.now()-V3.session.startedAt)/1000)):effectiveTotal(date), rest=restSeconds(date);
  oldFinish();
  const hist=load('workoutHistory',[])||[],h=hist.find(x=>x.date===date);if(h){h.elapsed=+h.elapsed||total;h.restSeconds=rest;h.workSeconds=Math.max(0,(+h.elapsed||total)-rest);save('workoutHistory',hist)}
  const s=load(`sessionSummary:${date}`,null);if(s){s.restSeconds=rest;s.workSeconds=Math.max(0,(+s.elapsed||total)-rest);save(`sessionSummary:${date}`,s)}
};

// Historial: muestra el desglose y permite corregir descanso manual.
const oldHistory=window.renderHistory;
window.renderHistory=function(){
  oldHistory();
  qa('.history-details').forEach(d=>{
    const txt=q('summary strong',d)?.textContent||'',date=(txt.match(/\d{4}-\d{2}-\d{2}/)||[])[0];if(!date)return;const t=splitTime(date);
    if(!q('.v107-history-time',d)){const x=document.createElement('div');x.className='v107-history-time';x.innerHTML=`<strong>Tiempo</strong><span>Total ${t.total?fmtElapsed(t.total):'—'} · ejercicio ${t.work?fmtElapsed(t.work):'—'} · descansos ${t.rest?fmtElapsed(t.rest):'—'}</span><button class="secondary-btn v107-hist-rest">Editar descanso</button>`;d.appendChild(x);q('.v107-hist-rest',x).onclick=e=>{e.preventDefault();e.stopPropagation();openRestEditor(date)}}
  });
};

window.JC_TRAINING_VERSION=V107;
render();
})();
