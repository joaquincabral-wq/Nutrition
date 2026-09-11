// JC Training V11 — control de descansos real, STOP temporal, edición de ejercicios/series y cierre inteligente.
(function(){
'use strict';
const V11='11';
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>isoDate();
const day=()=>dayKey();
const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};

// ---------- Claves V11 ----------
const stopKey=(date=today())=>`v11Stop:${date}`;
const stopTotalKey=(date=today())=>`v11StopTotal:${date}`;
const restTotalKey=(date=today())=>`v11RestTotal:${date}`;
const seriesKey=(date=today())=>`v11SeriesOverride:${date}`;
const skippedKey=(date=today())=>`v11SkippedExercises:${date}`;
const restStateKey=(date=today())=>`v11RestState:${date}`;

function getStop(date=today()){return load(stopKey(date),null)}
function setStop(v,date=today()){if(v)save(stopKey(date),v);else localStorage.removeItem(stopKey(date));}
function getSeries(date=today()){return load(seriesKey(date),{})||{}}
function putSeries(v,date=today()){save(seriesKey(date),v)}
function getSkipped(date=today()){return load(skippedKey(date),{})||{}}
function putSkipped(v,date=today()){save(skippedKey(date),v)}
function getRestState(date=today()){return load(restStateKey(date),null)}
function putRestState(v,date=today()){if(v)save(restStateKey(date),v);else localStorage.removeItem(restStateKey(date));}
function manualRest(date=today()){return +load(`v107ManualRest:${date}`,0)||0}
function realRest(date=today()){return manualRest(date)||(+load(restTotalKey(date),0)||0)}
function addRest(seconds,date=today()){if(manualRest(date))return;save(restTotalKey(date),(+load(restTotalKey(date),0)||0)+Math.max(0,seconds||0));}

function sessionSeconds(){
  if(!V3?.session?.startedAt)return null;
  const st=getStop();
  const end=st?.stoppedAt||Date.now();
  return Math.max(0,Math.floor((end-V3.session.startedAt)/1000));
}
function stopSeconds(date=today()){return +load(stopTotalKey(date),0)||0}

// ---------- STOP temporal: congela TODO el tiempo ----------
function setStopButton(){
  const panel=q('.v103-session-card'); if(!panel||!V3?.session||V3.session.date!==today())return;
  const actions=q('.v103-session-actions',panel); if(!actions)return;
  let b=q('#v11Stop',actions); if(!b){b=document.createElement('button');b.id='v11Stop';b.className='secondary-btn v11-stop';actions.appendChild(b)}
  const st=getStop();
  b.textContent=st?'▶ Reanudar':'⏸ STOP temporal';
  b.classList.toggle('v11-stopped',!!st);
  b.onclick=()=>st?resumeAll():stopAll();
}
function stopAll(){
  if(!V3?.session?.startedAt||getStop())return;
  const r=getRestState();
  setStop({stoppedAt:Date.now(),timerWasPaused:!!state.timerPaused,restWasActive:!!r?.active});
  state.timerPaused=true;
  try{updateTimer()}catch(_){ }
  setStopButton(); updateLiveTimes();
}
function resumeAll(){
  const st=getStop(); if(!st||!V3?.session?.startedAt)return;
  const d=Math.max(0,Date.now()-st.stoppedAt);
  V3.session.startedAt+=d;
  save('activeSession',V3.session);
  save(stopTotalKey(),stopSeconds()+Math.round(d/1000));
  setStop(null);
  state.timerPaused=!!st.timerWasPaused;
  const rs=getRestState(); if(rs?.active){rs.lastTick=Date.now();rs.paused=state.timerPaused;putRestState(rs)}
  try{updateTimer()}catch(_){ }
  setStopButton(); updateLiveTimes();
}
function normalizeStopBeforeFinish(){if(getStop())resumeAll();}

// ---------- Descanso: cuenta atrás y después tiempo extra ----------
let v11RestInterval=null;
function fmtClock(sec,prefix=''){
  sec=Math.max(0,Math.floor(sec||0));const m=Math.floor(sec/60),s=sec%60;return `${prefix}${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function renderRestUI(){
  const rs=getRestState(); if(!rs?.active)return;
  const overtime=+rs.overtime||0, remaining=Math.max(0,+rs.remaining||0), over=remaining<=0;
  state.timerRemaining=remaining; state.timerPaused=!!rs.paused;
  const txt=over?fmtClock(overtime,'+'):fmtClock(remaining);
  if(el('timerValue'))el('timerValue').textContent=txt;
  if(el('timerMiniValue'))el('timerMiniValue').textContent=txt;
  if(el('timerExercise'))el('timerExercise').textContent=over?`Tiempo extra · ${rs.name||''}`:(rs.name||'');
  if(el('timerMiniExercise'))el('timerMiniExercise').textContent=over?`Extra · ${rs.name||''}`:(rs.name||'');
  if(el('timerPause'))el('timerPause').textContent=rs.paused?'Continuar':'Pausa';
  if(el('timerMiniPause'))el('timerMiniPause').textContent=rs.paused?'Continuar':'Pausa';
  q('#v11NextSet')?.classList.toggle('v11-overtime',over);
}
function ensureNextSetButtons(){
  const actions=q('#timerOverlay .timer-actions');
  if(actions&&!q('#v11NextSet',actions)){
    const b=document.createElement('button');b.id='v11NextSet';b.className='primary-btn';b.textContent='Siguiente serie';actions.insertBefore(b,q('#timerSkip',actions));b.onclick=endRest;
  }
  const mini=q('#timerMini > div:last-child');
  if(mini&&!q('#v11MiniNext',mini)){
    const b=document.createElement('button');b.id='v11MiniNext';b.className='primary-btn';b.textContent='Siguiente';b.onclick=e=>{e.stopPropagation();endRest()};mini.prepend(b);
  }
}
function endRest(){
  clearInterval(v11RestInterval);v11RestInterval=null;clearInterval(state.timer);state.timer=null;
  putRestState(null);state.timerRemaining=0;state.timerPaused=false;
  el('timerOverlay')?.classList.add('hidden');el('timerMini')?.classList.add('hidden');updateLiveTimes();
}
function tickRest(){
  const rs=getRestState();if(!rs?.active){clearInterval(v11RestInterval);v11RestInterval=null;return;}
  if(getStop()||rs.paused){rs.lastTick=Date.now();putRestState(rs);return;}
  const now=Date.now();let delta=Math.floor((now-(rs.lastTick||now))/1000);if(delta<=0)return;delta=Math.min(delta,120);rs.lastTick=(rs.lastTick||now)+delta*1000;
  addRest(delta);
  while(delta>0){
    if(rs.remaining>0){const used=Math.min(delta,rs.remaining);rs.remaining-=used;delta-=used;if(rs.remaining===0&&!rs.alerted){rs.alerted=true;if(navigator.vibrate)navigator.vibrate([250,150,250]);}}
    else {rs.overtime=(+rs.overtime||0)+delta;delta=0;}
  }
  putRestState(rs);renderRestUI();updateLiveTimes();
}
const originalStartTimer=window.startTimer;
window.startTimer=function(sec,name){
  endRest();
  const rs={active:true,name:name||'',target:+sec||0,remaining:+sec||0,overtime:0,paused:false,lastTick:Date.now(),alerted:false};putRestState(rs);
  state.timerRemaining=rs.remaining;state.timerPaused=false;
  if(el('timerExercise'))el('timerExercise').textContent=rs.name;
  el('timerOverlay')?.classList.remove('hidden');el('timerMini')?.classList.add('hidden');ensureNextSetButtons();renderRestUI();
  v11RestInterval=setInterval(tickRest,250);
};
// Sobrescribe controles de los temporizadores anteriores.
setTimeout(()=>{
  ensureNextSetButtons();
  if(el('timerAdd'))el('timerAdd').onclick=()=>{const rs=getRestState();if(!rs)return;if(rs.remaining<=0){rs.remaining=30;rs.overtime=0;rs.alerted=false}else rs.remaining+=30;rs.lastTick=Date.now();putRestState(rs);renderRestUI()};
  if(el('timerPause'))el('timerPause').onclick=()=>{const rs=getRestState();if(!rs)return;rs.paused=!rs.paused;rs.lastTick=Date.now();putRestState(rs);state.timerPaused=rs.paused;renderRestUI()};
  if(el('timerSkip'))el('timerSkip').onclick=endRest;
  if(el('timerMiniPause'))el('timerMiniPause').onclick=e=>{e.stopPropagation();el('timerPause')?.click()};
  if(el('timerMiniSkip'))el('timerMiniSkip').onclick=e=>{e.stopPropagation();endRest()};
},0);
const recoveredRest=getRestState();if(recoveredRest?.active){recoveredRest.lastTick=Date.now();putRestState(recoveredRest);setTimeout(()=>{ensureNextSetButtons();el('timerOverlay')?.classList.remove('hidden');renderRestUI();v11RestInterval=setInterval(tickRest,250)},100)}

// ---------- Series de HOY: + / − sin alterar el plan base ----------
function baseSetCount(i,date=today()){
  const p=TRAINING[day()]?.exercises?.[i];if(!p)return 0;const o=getSeries(date);return Math.max(1,+o[i]||+p[1]||1);
}
const prevExerciseCard=window.exerciseCard;
window.exerciseCard=function(x,i,date){
  const copy=Array.isArray(x)?x.slice():x; if(Array.isArray(copy)&&date===today()){copy[1]=baseSetCount(i,date)}
  return prevExerciseCard(copy,i,date);
};
function changeTodaySeries(i,delta){
  const plan=TRAINING[day()]?.exercises?.[i];if(!plan)return;const o=getSeries(),cur=baseSetCount(i),next=Math.max(1,cur+delta);
  if(next===cur)return;
  if(delta<0){const data=load(workoutKey(),{}),s=data[i]?.sets?.[cur-1];if(s&&(s.done||s.kg||s.reps||s.rir)&&!confirm('La última serie tiene datos. ¿Quitarla solo de la sesión de hoy?'))return;}
  o[i]=next;putSeries(o);renderToday();
}
function changeExtraSeries(id,delta){
  const defs=load(`v103Extras:${today()}`,[])||[],ex=defs.find(x=>x.id===id);if(!ex)return;const next=Math.max(1,(+ex.sets||1)+delta);if(next===ex.sets)return;
  if(delta<0){const d=load(`v103ExtraData:${today()}`,{})?.[id]?.sets?.[(+ex.sets||1)-1];if(d&&(d.done||d.kg||d.reps||d.rir)&&!confirm('La última serie extra tiene datos. ¿Quitarla?'))return;}
  ex.sets=next;save(`v103Extras:${today()}`,defs);renderToday();
}

// toggleSet robusto cuando hoy se añaden series sobre el plan base.
window.toggleSet=function(e){
  persistWorkoutInput();const [ei,si]=e.currentTarget.dataset.check.split(':').map(Number),data=load(workoutKey(),{});
  data[ei]=data[ei]||{sets:[]};data[ei].sets=data[ei].sets||[];data[ei].sets[si]=data[ei].sets[si]||{kg:'',reps:'',rir:'',done:false};
  data[ei].sets[si].done=!data[ei].sets[si].done;save(workoutKey(),data);
  if(data[ei].sets[si].done&&V3?.settings?.timerEnabled&&+e.currentTarget.dataset.rest>0)startTimer(+e.currentTarget.dataset.rest,e.currentTarget.dataset.name);
  finalizeHistory();renderToday();
};

// ---------- Eliminar / restaurar ejercicio SOLO HOY ----------
function skipToday(i){
  if(!confirm('¿Eliminar este ejercicio de la sesión de hoy? El plan habitual no cambiará.'))return;
  const s=getSkipped();s[i]=true;putSkipped(s);const c=load(`v103Completed:${today()}`,{})||{};delete c[String(i)];save(`v103Completed:${today()}`,c);renderToday();
}
function restoreToday(i){const s=getSkipped();delete s[i];putSkipped(s);renderToday();}

// ---------- Modificar el plan mensual actual desde Entreno ----------
function persistCurrentMonthTraining(){
  const month=today().slice(0,7),all=load('v9Plans',{})||{};if(!all[month])all[month]={training:JSON.parse(JSON.stringify(TRAINING)),meals:JSON.parse(JSON.stringify(MEALS))};
  all[month].training=JSON.parse(JSON.stringify(TRAINING));save('v9Plans',all);
}
function planChangeSeries(d,i,delta){const x=TRAINING[d]?.exercises?.[i];if(!x)return;x[1]=Math.max(1,(+x[1]||1)+delta);persistCurrentMonthTraining();renderTraining();}
function planDeleteExercise(d,i){const x=TRAINING[d]?.exercises?.[i];if(!x)return;if(!confirm(`¿Eliminar “${x[0]}” del plan de ${d}? El historial anterior no se modifica.`))return;TRAINING[d].exercises.splice(i,1);persistCurrentMonthTraining();renderTraining();}

// ---------- Progreso ajustado (omite ejercicios quitados hoy y respeta series extra) ----------
function adjustedProgress(){
  const p=TRAINING[day()]||{exercises:[]},data=load(workoutKey(),{}),sk=getSkipped(),ov=getSeries();let total=0,done=0;
  p.exercises.forEach((x,i)=>{if(sk[i])return;const n=Math.max(1,+ov[i]||+x[1]||1);total+=n;for(let si=0;si<n;si++)if(data[i]?.sets?.[si]?.done)done++;});
  const defs=load(`v103Extras:${today()}`,[])||[],ed=load(`v103ExtraData:${today()}`,{})||{};let extraTotal=0,extraDone=0;defs.forEach(x=>{extraTotal+=+x.sets||0;extraDone+=(ed[x.id]?.sets||[]).slice(0,+x.sets||0).filter(s=>s.done).length});
  return {total,done,extraTotal,extraDone};
}
function patchHistory(){
  const pr=adjustedProgress(),hist=load('workoutHistory',[])||[],h=hist.find(x=>x.date===today());if(h){h.totalSets=pr.total+pr.extraTotal;h.completedSets=pr.done+pr.extraDone;h.baseTotalSets=pr.total;h.baseCompletedSets=pr.done;h.extraSets=pr.extraTotal;h.extraCompletedSets=pr.extraDone;h.skippedExercises=Object.keys(getSkipped()).filter(k=>getSkipped()[k]);h.restSeconds=realRest();h.stopSeconds=stopSeconds();save('workoutHistory',hist)}
}
const oldFinalize=window.finalizeHistory;window.finalizeHistory=function(){oldFinalize();patchHistory();};

// ---------- Cierre automático al acabar ----------
let finishPromptShown=false;
function allDone(){const p=adjustedProgress();return p.total>0&&p.done>=p.total&&p.extraDone>=p.extraTotal;}
function showFinishPrompt(){
  if(finishPromptShown||!V3?.session||V3.session.date!==today()||!allDone())return;finishPromptShown=true;const sheet=el('swapSheet'),sec=sessionSeconds()||0;
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">ENTRENAMIENTO COMPLETADO</div><h3>Sesión base terminada</h3></div><button class="swap-close" id="v11CloseFinish">Cerrar</button></div><div class="card v11-finish-time"><strong>${fmtElapsed(sec)}</strong><span>tiempo activo total</span></div><p class="note">¿Quieres terminar aquí o aprovechar el margen para algún trabajo extra?</p><div class="v11-finish-actions"><button id="v11FinishNow" class="primary-btn">Finalizar entrenamiento</button><button id="v11SmartExtra" class="secondary-btn">✨ ¿Con qué termino?</button><button id="v11AddExtra" class="secondary-btn">+ Añadir ejercicio</button></div>`;
  sheet.classList.remove('hidden');
  q('#v11CloseFinish').onclick=()=>{finishPromptShown=false;sheet.classList.add('hidden')};
  q('#v11FinishNow').onclick=()=>{sheet.classList.add('hidden');normalizeStopBeforeFinish();window.finishWorkoutSession()};
  q('#v11SmartExtra').onclick=()=>{finishPromptShown=false;sheet.classList.add('hidden');q('#v103Finisher')?.click()};
  q('#v11AddExtra').onclick=()=>{finishPromptShown=false;sheet.classList.add('hidden');q('#v103AddExercise')?.click()};
}

// ---------- Enriquecer HOY ----------
const oldToday=window.renderToday;
window.renderToday=function(){
  oldToday();
  const sk=getSkipped(),section=qa('.section',q('#content')).find(s=>q('.section-title h2',s)?.textContent?.trim()==='Entrenamiento');
  qa('.exercise-card[data-v103-card]',section||document).forEach(card=>{
    const i=+card.dataset.v103Card,footer=q('.exercise-footer',card)||card;
    if(!q('.v11-ex-controls',card)){
      const box=document.createElement('div');box.className='v11-ex-controls';box.innerHTML=`<button class="secondary-btn" data-v11-minus="${i}">− Serie</button><button class="secondary-btn" data-v11-plus="${i}">+ Serie</button><button class="v11-danger" data-v11-skip="${i}">Eliminar de hoy</button>`;footer.insertAdjacentElement('beforebegin',box);
    }
  });
  qa('[data-v11-plus]').forEach(b=>b.onclick=()=>changeTodaySeries(+b.dataset.v11Plus,1));qa('[data-v11-minus]').forEach(b=>b.onclick=()=>changeTodaySeries(+b.dataset.v11Minus,-1));qa('[data-v11-skip]').forEach(b=>b.onclick=()=>skipToday(+b.dataset.v11Skip));
  qa('.v103-extra-card').forEach(card=>{const id=card.dataset.extraCard,footer=q('.exercise-footer',card)||card;if(!q('.v11-extra-series',card)){const box=document.createElement('div');box.className='v11-ex-controls v11-extra-series';box.innerHTML=`<button class="secondary-btn" data-v11-extra-minus="${esc(id)}">− Serie</button><button class="secondary-btn" data-v11-extra-plus="${esc(id)}">+ Serie</button>`;footer.insertAdjacentElement('beforebegin',box)}});
  qa('[data-v11-extra-plus]').forEach(b=>b.onclick=()=>changeExtraSeries(b.dataset.v11ExtraPlus,1));qa('[data-v11-extra-minus]').forEach(b=>b.onclick=()=>changeExtraSeries(b.dataset.v11ExtraMinus,-1));
  const hidden=Object.keys(sk).filter(i=>sk[i]);if(hidden.length&&section){const box=document.createElement('div');box.className='card v11-skipped';box.innerHTML=`<strong>Ejercicios eliminados de hoy</strong>${hidden.map(i=>`<button class="secondary-btn" data-v11-restore="${i}">${esc(TRAINING[day()]?.exercises?.[+i]?.[0]||'Ejercicio')} · Restaurar</button>`).join('')}`;section.appendChild(box);qa('[data-v11-restore]',box).forEach(b=>b.onclick=()=>restoreToday(+b.dataset.v11Restore));}
  const pr=adjustedProgress(),panel=q('.v103-session-card');if(panel){const kp=qa('.v103-session-kpis > div',panel);if(kp[1]){q('b',kp[1]).textContent=`${pr.done}/${pr.total}`;q('span',kp[1]).textContent='series base'}if(kp[2])q('b',kp[2]).textContent=`+${pr.extraDone}/${pr.extraTotal}`;setStopButton();}
  const sticky=q('#v104Sticky');if(sticky){const time=sessionSeconds();sticky.innerHTML=`<b>${pr.done}/${pr.total}</b> series base${pr.extraTotal?` · <b>+${pr.extraDone}/${pr.extraTotal}</b> extra`:''}<span id="v104StickyTime">${time!==null?fmtElapsed(time):'—'}</span>`;}
  setTimeout(showFinishPrompt,100);
};

// Al guardar un ejercicio, comprueba si era el último.
const oldBind=window.bindExerciseEvents;
window.bindExerciseEvents=function(){
  oldBind();
  qa('.save-ex,[data-extra-save]').forEach(btn=>{const prev=btn.onclick;btn.onclick=(e)=>{finishPromptShown=false;prev?.call(btn,e);setTimeout(showFinishPrompt,160)}});
};

// ---------- Enriquecer ENTREN0 ----------
const oldTraining=window.renderTraining;
window.renderTraining=function(){
  oldTraining();
  qa('.v7-day-section').forEach(section=>{
    const d=section.dataset.v107Day||q('h2',section)?.textContent?.trim().split(' · ')[0]?.toLowerCase();if(!d||!TRAINING[d])return;
    const cards=qa(':scope > .card.compact',section).slice(0,TRAINING[d].exercises.length);
    cards.forEach((card,i)=>{if(q('.v11-plan-controls',card))return;const box=document.createElement('div');box.className='v11-plan-controls';box.innerHTML=`<button class="secondary-btn" data-v11-plan-minus="${d}:${i}">− Serie</button><button class="secondary-btn" data-v11-plan-plus="${d}:${i}">+ Serie</button><button class="v11-danger" data-v11-plan-delete="${d}:${i}">Eliminar ejercicio</button>`;card.appendChild(box)});
  });
  qa('[data-v11-plan-plus]').forEach(b=>b.onclick=()=>{const [d,i]=b.dataset.v11PlanPlus.split(':');planChangeSeries(d,+i,1)});qa('[data-v11-plan-minus]').forEach(b=>b.onclick=()=>{const [d,i]=b.dataset.v11PlanMinus.split(':');planChangeSeries(d,+i,-1)});qa('[data-v11-plan-delete]').forEach(b=>b.onclick=()=>{const [d,i]=b.dataset.v11PlanDelete.split(':');planDeleteExercise(d,+i)});
};

// ---------- Tiempo vivo V11 y resumen final ----------
function updateLiveTimes(){
  const total=sessionSeconds();if(total===null)return;const rest=Math.min(total,realRest()),work=Math.max(0,total-rest);
  ['v103LiveTime','v104StickyTime','v107Total'].forEach(id=>{const n=el(id);if(n)n.textContent=fmtElapsed(total)});if(el('v107Rest'))el('v107Rest').textContent=fmtElapsed(rest);if(el('v107Work'))el('v107Work').textContent=fmtElapsed(work);
}
setInterval(updateLiveTimes,500);

const oldFinish=window.finishWorkoutSession;
window.finishWorkoutSession=function(){
  normalizeStopBeforeFinish();endRest();const total=sessionSeconds()||(+load(`v104Duration:${today()}`,0)||0),rest=Math.min(total,realRest()),stop=stopSeconds();oldFinish();
  const hist=load('workoutHistory',[])||[],h=hist.find(x=>x.date===today());if(h){h.elapsed=+h.elapsed||total;h.restSeconds=rest;h.workSeconds=Math.max(0,h.elapsed-rest);h.stopSeconds=stop;save('workoutHistory',hist)}
  const s=load(`sessionSummary:${today()}`,null);if(s){s.restSeconds=rest;s.workSeconds=Math.max(0,(+s.elapsed||total)-rest);s.stopSeconds=stop;save(`sessionSummary:${today()}`,s)}
  finishPromptShown=false;render();
};

// Historial: añade STOP cuando exista.
const oldHistory=window.renderHistory;
window.renderHistory=function(){oldHistory();qa('.history-details').forEach(d=>{const text=q('summary strong',d)?.textContent||'',date=(text.match(/\d{4}-\d{2}-\d{2}/)||[])[0];if(!date)return;const st=stopSeconds(date);if(st&&!q('.v11-stop-history',d)){const p=document.createElement('div');p.className='v11-stop-history';p.textContent=`STOP temporal acumulado: ${fmtElapsed(st)} (no incluido en la duración activa)`;d.appendChild(p)}})};

// Reaplica UI al cargar y marca versión.
window.JC_TRAINING_VERSION='11';
render();
})();
