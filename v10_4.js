// JC Training V10.4 — fiabilidad, recuperación, flujo compacto y cantidades nutricionales.
(function(){
'use strict';
const V104='10.4';
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null};
function durationKey(date=isoDate()){return `v104Duration:${date}`}
function manualDuration(date=isoDate()){return +load(durationKey(date),0)||0}
function setManualDuration(sec,date=isoDate()){save(durationKey(date),Math.max(0,Math.round(sec||0)))}
function effectiveDuration(date=isoDate()){
  const m=manualDuration(date); if(m)return m;
  const s=load(`sessionSummary:${date}`,null); if(s?.elapsed)return +s.elapsed;
  const h=(load('workoutHistory',[])||[]).find(x=>x.date===date); return +h?.elapsed||0;
}
function updateHistoryDuration(date,sec){
  const hist=load('workoutHistory',[])||[]; const h=hist.find(x=>x.date===date); if(h)h.elapsed=sec; save('workoutHistory',hist);
  const s=load(`sessionSummary:${date}`,null); if(s){s.elapsed=sec;save(`sessionSummary:${date}`,s)}
}
function openDurationEditor(date=isoDate()){
  const cur=effectiveDuration(date), mins=Math.floor(cur/60), secs=cur%60, sheet=el('swapSheet');
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">DURACIÓN REAL</div><h3>Editar entrenamiento · ${esc(date)}</h3></div><button class="swap-close" id="v104Close">Cerrar</button></div><div class="v104-duration-grid"><label>Minutos<input id="v104Min" class="input" type="number" min="0" value="${mins}"></label><label>Segundos<input id="v104Sec" class="input" type="number" min="0" max="59" value="${secs}"></label></div><button id="v104SaveDuration" class="primary-btn" style="width:100%;margin-top:12px">Guardar duración</button><p class="note">Sirve para recuperar el tiempo aunque el cronómetro no se hubiese iniciado o se perdiese la sesión.</p>`;
  sheet.classList.remove('hidden'); q('#v104Close').onclick=()=>sheet.classList.add('hidden'); q('#v104SaveDuration').onclick=()=>{const sec=(+q('#v104Min').value||0)*60+Math.min(59,+q('#v104Sec').value||0);setManualDuration(sec,date);updateHistoryDuration(date,sec);sheet.classList.add('hidden');render();};
}

// Autoguardado reforzado: persiste cada edición inmediatamente y también al ocultarse/cerrarse la app.
let saveTimer=null;
document.addEventListener('input',e=>{if(e.target.matches('.set-kg,.set-reps,.extra-kg,.extra-reps')){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{persistWorkoutInput()}catch(_){ }},80)}},true);
document.addEventListener('change',e=>{if(e.target.matches('.set-rir,.extra-rir')){try{persistWorkoutInput()}catch(_){ }}},true);
['visibilitychange','pagehide'].forEach(ev=>window.addEventListener(ev,()=>{try{persistWorkoutInput()}catch(_){ }}));

// Al guardar, recuerda que debe saltar al siguiente ejercicio pendiente.
const oldBind=window.bindExerciseEvents;
window.bindExerciseEvents=function(){
  oldBind();
  qa('.save-ex').forEach(btn=>{const original=btn.onclick;btn.onclick=()=>{sessionStorage.setItem('v104JumpNext','1');original?.();};});
  qa('[data-extra-save]').forEach(btn=>{const original=btn.onclick;btn.onclick=()=>{sessionStorage.setItem('v104JumpNext','1');original?.();};});
};

// Hoy: ejercicios completados compactos, progreso fijo, duración manual y salto al siguiente.
const oldToday=window.renderToday;
window.renderToday=function(){
  oldToday();
  const cards=qa('.exercise-card');
  cards.forEach(card=>{
    const done=card.classList.contains('v103-ex-completed'); if(!done)return;
    card.classList.add('v104-collapsed');
    const head=q('.exercise-head',card); if(head&&!q('.v104-toggle',head)){const b=document.createElement('button');b.className='secondary-btn v104-toggle';b.textContent='Ver';b.onclick=()=>{card.classList.toggle('v104-collapsed');b.textContent=card.classList.contains('v104-collapsed')?'Ver':'Ocultar'};head.appendChild(b)}
  });
  const panel=q('.v103-session-card'); if(panel&&!q('#v104ManualDuration',panel)){
    const actions=q('.v103-session-actions',panel); const b=document.createElement('button');b.id='v104ManualDuration';b.className='secondary-btn';b.textContent='✎ Editar duración';b.onclick=()=>openDurationEditor();actions?.appendChild(b);
    const saved=manualDuration(); if(saved){const p=document.createElement('p');p.className='v104-manual-time';p.textContent=`Duración manual guardada: ${fmtElapsed(saved)}`;panel.appendChild(p)}
  }
  let sticky=q('#v104Sticky'); if(!sticky){sticky=document.createElement('div');sticky.id='v104Sticky';sticky.className='v104-sticky';document.body.appendChild(sticky)}
  const base=typeof v103BaseProgress==='function'?v103BaseProgress():null, extra=typeof v103ExtraProgress==='function'?v103ExtraProgress():null;
  if(base){sticky.innerHTML=`<b>${base.done}/${base.total}</b> series base${extra?.total?` · <b>+${extra.done}/${extra.total}</b> extra`:''}<span id="v104StickyTime">${V3?.session?.date===isoDate()?fmtElapsed(Math.max(0,Math.floor((Date.now()-V3.session.startedAt)/1000))):effectiveDuration()?fmtElapsed(effectiveDuration()):'—'}</span>`;sticky.classList.add('show')}
  if(sessionStorage.getItem('v104JumpNext')){sessionStorage.removeItem('v104JumpNext');setTimeout(()=>{const next=qa('.exercise-card').find(c=>!c.classList.contains('v103-ex-completed'));next?.scrollIntoView({behavior:'smooth',block:'start'})},80)}
};
setInterval(()=>{const n=q('#v104StickyTime');if(n&&V3?.session?.date===isoDate())n.textContent=fmtElapsed(Math.max(0,Math.floor((Date.now()-V3.session.startedAt)/1000)))},1000);

// Cambiar alimento: alimento + cantidad. Recalcula automáticamente porque mealSubs alimenta v6Macros/v6PlanTotals.
window.showFoodSwap=function(text,mi=null,fi=null,date=isoDate(),apply=true){
  const current=(apply&&mi!==null&&fi!==null&&typeof v6CurrentText==='function')?v6CurrentText(date,mi,fi,text):text;
  const srcKey=identifyFood(current)||identifyFood(text), parsed=parseAmount(current)||parseAmount(text); if(!srcKey||!parsed)return alert('Todavía no hay equivalencias configuradas para este alimento.');
  const src=FOOD_DB[srcKey], opts=[srcKey,...(GROUP_OPTIONS[src.group]||[]).filter(k=>k!==srcKey)], sheet=el('swapSheet');
  const optionHtml=opts.map(k=>`<option value="${k}" ${k===srcKey?'selected':''}>${esc(FOOD_DB[k].label)}</option>`).join('');
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">CAMBIAR ALIMENTO</div><h3>${esc(src.label)}</h3></div><button class="swap-close" id="v104FoodClose">Cerrar</button></div><div class="swap-source"><span>Actual</span><br><b>${esc(current)}</b></div><label class="v104-food-field">Alimento<select id="v104FoodKey" class="input">${optionHtml}</select></label><label class="v104-food-field">Cantidad<input id="v104FoodAmount" class="input" inputmode="decimal" value="${parsed.amount}"></label><div id="v104FoodPreview" class="card v104-food-preview"></div>${apply?'<button id="v104UseFood" class="primary-btn" style="width:100%">Confirmar cambio</button><button id="v104FoodReset" class="secondary-btn" style="width:100%;margin-top:8px">Volver al alimento original</button>':''}<p class="swap-note">Puedes mantener el mismo alimento y cambiar únicamente su cantidad. Kcal y macros del día se recalculan al confirmar.</p>`;
  sheet.classList.remove('hidden');
  function replacement(){const k=q('#v104FoodKey').value,a=Math.max(0,num(q('#v104FoodAmount').value)||0);return substituteText(k,a)}
  function preview(){const t=replacement(),m=typeof v6Macros==='function'?v6Macros(t):null;q('#v104FoodPreview').innerHTML=`<strong>${esc(t)}</strong>${m?`<span>≈ ${v6Fmt(m.kcal)} kcal · P ${v6Fmt(m.p)} g · HC ${v6Fmt(m.c)} g · G ${v6Fmt(m.f)} g</span>`:''}`}
  q('#v104FoodClose').onclick=()=>sheet.classList.add('hidden'); q('#v104FoodKey').onchange=preview;q('#v104FoodAmount').oninput=preview;preview();
  if(apply){q('#v104UseFood').onclick=()=>{setMealSub(date,mi,fi,{replacement:replacement(),original:text});sheet.classList.add('hidden');render()};q('#v104FoodReset').onclick=()=>{setMealSub(date,mi,fi,null);sheet.classList.add('hidden');render()}}
};

// Historial: duración editable y recuperación de series guardadas.
function openHistoryEditor(date){
  const hist=load('workoutHistory',[])||[], h=hist.find(x=>x.date===date); if(!h)return alert('No hay detalle editable para ese entrenamiento.');
  const sheet=el('swapSheet');
  const body=(h.details||[]).map((ex,ei)=>`<details class="v104-hist-ex"><summary>${esc(ex.name)}${ex.extra?' · EXTRA':''}</summary>${(ex.sets||[]).map((s,si)=>ex.unilateral?`<div class="v104-hist-set"><b>S${si+1}</b><span>I</span><input class="input" data-he="${ei}" data-hs="${si}" data-side="left" data-f="kg" value="${esc(s.left?.kg||'')}" placeholder="kg"><input class="input" data-he="${ei}" data-hs="${si}" data-side="left" data-f="reps" value="${esc(s.left?.reps||'')}" placeholder="reps"><input class="input" data-he="${ei}" data-hs="${si}" data-side="left" data-f="rir" value="${esc(s.left?.rir||'')}" placeholder="RIR"><span>D</span><input class="input" data-he="${ei}" data-hs="${si}" data-side="right" data-f="kg" value="${esc(s.right?.kg||'')}" placeholder="kg"><input class="input" data-he="${ei}" data-hs="${si}" data-side="right" data-f="reps" value="${esc(s.right?.reps||'')}" placeholder="reps"><input class="input" data-he="${ei}" data-hs="${si}" data-side="right" data-f="rir" value="${esc(s.right?.rir||'')}" placeholder="RIR"></div>`:`<div class="v104-hist-set"><b>S${si+1}</b><input class="input" data-he="${ei}" data-hs="${si}" data-f="kg" value="${esc(s.kg||'')}" placeholder="kg"><input class="input" data-he="${ei}" data-hs="${si}" data-f="reps" value="${esc(s.reps||'')}" placeholder="reps"><input class="input" data-he="${ei}" data-hs="${si}" data-f="rir" value="${esc(s.rir||'')}" placeholder="RIR"><label><input type="checkbox" data-he="${ei}" data-hs="${si}" data-f="done" ${s.done?'checked':''}> ✓</label></div>`).join('')}</details>`).join('');
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">RECUPERAR / EDITAR</div><h3>${esc(date)} · ${esc(h.name)}</h3></div><button class="swap-close" id="v104HistClose">Cerrar</button></div><button id="v104HistDuration" class="secondary-btn" style="width:100%;margin-bottom:10px">✎ Editar duración (${h.elapsed?fmtElapsed(h.elapsed):'sin tiempo'})</button>${body}<button id="v104HistSave" class="primary-btn" style="width:100%;margin-top:12px">Guardar cambios</button>`;
  sheet.classList.remove('hidden');q('#v104HistClose').onclick=()=>sheet.classList.add('hidden');q('#v104HistDuration').onclick=()=>openDurationEditor(date);
  q('#v104HistSave').onclick=()=>{qa('[data-he]',sheet).forEach(inp=>{const ex=h.details[+inp.dataset.he],s=ex.sets[+inp.dataset.hs],f=inp.dataset.f,side=inp.dataset.side;if(side){s[side]=s[side]||{};s[side][f]=inp.value}else if(f==='done')s.done=inp.checked;else s[f]=inp.value});h.completedSets=(h.details||[]).reduce((a,e)=>a+(e.sets||[]).filter(s=>s.done).length,0);save('workoutHistory',hist);sheet.classList.add('hidden');renderHistory()};
}
const oldHist=window.renderHistory;
window.renderHistory=function(){oldHist();qa('.history-details').forEach(d=>{const txt=q('summary strong',d)?.textContent||'',date=(txt.match(/\d{4}-\d{2}-\d{2}/)||[])[0];if(date&&!q('.v104-edit-history',d)){const b=document.createElement('button');b.className='secondary-btn v104-edit-history';b.textContent='Editar / recuperar';b.onclick=e=>{e.preventDefault();e.stopPropagation();openHistoryEditor(date)};d.appendChild(b)}})};

window.JC_TRAINING_VERSION=V104;
render();
})();
