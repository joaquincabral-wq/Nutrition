// JC Training V4: mediciones corporales, progreso de cargas, sustituciones y temporizador minimizable.

const V4 = { selectedExercise: null };
const nrm = s => String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const round5 = n => Math.max(5, Math.round(n/5)*5);

// ---------- TIMER MINIMIZABLE ----------
function timerMiniEls(){ return {mini:el('timerMini'), value:el('timerMiniValue'), ex:el('timerMiniExercise')}; }
function minimizeTimer(){ el('timerOverlay').classList.add('hidden'); const m=timerMiniEls(); m.mini.classList.remove('hidden'); updateTimer(); }
function expandTimer(){ const m=timerMiniEls(); m.mini.classList.add('hidden'); el('timerOverlay').classList.remove('hidden'); updateTimer(); }
function hideAllTimers(){ el('timerOverlay').classList.add('hidden'); timerMiniEls().mini.classList.add('hidden'); }
startTimer=function(sec,name){
  clearInterval(state.timer); state.timerRemaining=sec; state.timerPaused=false;
  el('timerExercise').textContent=name; timerMiniEls().ex.textContent=name;
  el('timerOverlay').classList.remove('hidden'); timerMiniEls().mini.classList.add('hidden'); updateTimer();
  state.timer=setInterval(()=>{ if(!state.timerPaused){ state.timerRemaining--; updateTimer(); if(state.timerRemaining<=0){ clearInterval(state.timer); if(navigator.vibrate) navigator.vibrate([250,150,250]); hideAllTimers(); } } },1000);
  setTimeout(()=>{ if(state.timerRemaining>0 && !el('timerOverlay').classList.contains('hidden')) minimizeTimer(); },1400);
};
updateTimer=function(){
  const m=Math.floor(Math.max(0,state.timerRemaining)/60),s=Math.max(0,state.timerRemaining)%60, txt=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el('timerValue').textContent=txt; el('timerPause').textContent=state.timerPaused?'Continuar':'Pausa';
  const mini=timerMiniEls(); if(mini.value) mini.value.textContent=txt;
};
if(el('timerMinimize')) el('timerMinimize').onclick=minimizeTimer;
if(el('timerMini')) el('timerMini').onclick=e=>{ if(!e.target.closest('[data-mini-action]')) expandTimer(); };
if(el('timerMiniPause')) el('timerMiniPause').onclick=e=>{e.stopPropagation();state.timerPaused=!state.timerPaused;updateTimer();};
if(el('timerMiniSkip')) el('timerMiniSkip').onclick=e=>{e.stopPropagation();clearInterval(state.timer);hideAllTimers();};

// ---------- FOOD SUBSTITUTIONS ----------
// eq is the comparison anchor per 100 g/ml. Carbs/fruit/fats use kcal; proteins/dairy use protein grams.
const FOOD_DB = {
  rice:{label:'Arroz',patterns:['arroz'],group:'carb',eq:360,state:'en crudo'},
  pasta:{label:'Pasta',patterns:['pasta'],group:'carb',eq:350,state:'en crudo'},
  potato:{label:'Patata',patterns:['patata'],group:'carb',eq:77,state:'en crudo'},
  sweetpotato:{label:'Batata',patterns:['batata','boniato'],group:'carb',eq:86,state:'en crudo'},
  couscous:{label:'Cuscús',patterns:['cuscus'],group:'carb',eq:376,state:'en seco'},
  oats:{label:'Avena',patterns:['avena'],group:'carb',eq:370,state:'en seco'},

  melon:{label:'Melón',patterns:['melon'],group:'fruit',eq:34,state:'parte comestible'},
  peach:{label:'Melocotón',patterns:['melocoton'],group:'fruit',eq:39,state:'parte comestible'},
  strawberry:{label:'Fresas',patterns:['fresas','fresa'],group:'fruit',eq:32,state:'parte comestible'},
  blueberry:{label:'Arándanos',patterns:['arandanos','arandano'],group:'fruit',eq:57,state:'parte comestible'},
  plum:{label:'Ciruela',patterns:['ciruela'],group:'fruit',eq:46,state:'parte comestible'},
  apple:{label:'Manzana',patterns:['manzana'],group:'fruit',eq:52,state:'parte comestible'},
  banana:{label:'Plátano',patterns:['platano'],group:'fruit',eq:89,state:'parte comestible'},
  fruit:{label:'Fruta',patterns:['fruta'],group:'fruit',eq:45,state:'parte comestible'},

  chicken:{label:'Pollo',patterns:['pollo'],group:'protein',eq:23,state:'en crudo'},
  turkey:{label:'Pavo',patterns:['pavo'],group:'protein',eq:23,state:'en crudo'},
  beef:{label:'Ternera magra',patterns:['ternera','carne magra'],group:'protein',eq:21,state:'en crudo'},
  hake:{label:'Merluza',patterns:['merluza'],group:'protein',eq:18,state:'en crudo'},
  cod:{label:'Bacalao',patterns:['bacalao'],group:'protein',eq:18,state:'en crudo'},
  seabream:{label:'Dorada',patterns:['dorada'],group:'protein',eq:19,state:'en crudo'},
  whitefish:{label:'Pescado blanco',patterns:['pescado blanco','pescado'],group:'protein',eq:19,state:'en crudo'},

  qfb:{label:'Queso fresco batido 0%',patterns:['queso fresco batido'],group:'dairy',eq:8,state:'tal como se consume'},
  skyr:{label:'Skyr natural',patterns:['skyr'],group:'dairy',eq:10.5,state:'tal como se consume'},
  cottage:{label:'Cottage',patterns:['cottage'],group:'dairy',eq:12,state:'tal como se consume'},
  kefir:{label:'Kéfir natural',patterns:['kefir'],group:'dairy',eq:3.6,state:'tal como se consume'},

  oliveoil:{label:'AOVE',patterns:['aove','aceite'],group:'fat',eq:884,state:'tal como se consume'},
  pistachio:{label:'Pistachos',patterns:['pistachos','pistacho'],group:'fat',eq:560,state:'tal como se consume'},
  walnuts:{label:'Nueces',patterns:['nueces','nuez'],group:'fat',eq:654,state:'tal como se consume'},
  avocado:{label:'Aguacate',patterns:['aguacate'],group:'fat',eq:160,state:'parte comestible'}
};
const GROUP_OPTIONS = {
  carb:['rice','pasta','potato','sweetpotato','couscous'],
  fruit:['melon','peach','strawberry','blueberry','plum','apple','banana'],
  protein:['chicken','turkey','beef','hake','cod','seabream','whitefish'],
  dairy:['qfb','skyr','cottage','kefir'],
  fat:['oliveoil','pistachio','walnuts','avocado']
};
function identifyFood(text){ const t=nrm(text); for(const [k,v] of Object.entries(FOOD_DB)){ if(v.patterns.some(p=>t.includes(nrm(p)))) return k; } return null; }
function parseAmount(text){ const m=String(text).match(/([0-9]+(?:[.,][0-9]+)?)\s*(g|ml)/i); return m?{amount:+m[1].replace(',','.'),unit:m[2].toLowerCase()}:null; }
function substituteText(targetKey, amount){ const f=FOOD_DB[targetKey]; const unit='g'; return `${round5(amount)} ${unit} ${f.label}${f.state?` (${f.state})`:''}`; }
function getMealSub(date,mi,fi){ return load(`mealSubs:${date}`,{})[`${mi}:${fi}`]||null; }
function setMealSub(date,mi,fi,val){ const k=`mealSubs:${date}`, d=load(k,{}); if(val) d[`${mi}:${fi}`]=val; else delete d[`${mi}:${fi}`]; save(k,d); }
function showFoodSwap(text,mi=null,fi=null,date=isoDate(),apply=true){
  const srcKey=identifyFood(text), parsed=parseAmount(text); if(!srcKey||!parsed) return alert('Todavía no hay equivalencias configuradas para este alimento.');
  const src=FOOD_DB[srcKey], options=(GROUP_OPTIONS[src.group]||[]).filter(k=>k!==srcKey);
  const sheet=el('swapSheet');
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">SUSTITUCIÓN EQUIVALENTE</div><h3>Cambiar ${src.label}</h3></div><button class="swap-close" id="swapClose">Cerrar</button></div>
    <div class="swap-source"><span>Plan actual</span><br><b>${text}</b></div>
    ${options.map(k=>{const t=FOOD_DB[k], amount=parsed.amount*src.eq/t.eq; return `<div class="swap-option"><div><strong>${substituteText(k,amount)}</strong><span>${src.group==='protein'||src.group==='dairy'?'Equivalencia aprox. por proteína':'Equivalencia aprox. por energía'}.</span></div>${apply?`<button class="swap-use" data-swap="${k}" data-amount="${amount}">Usar hoy</button>`:''}</div>`}).join('')}
    ${apply?`<button class="secondary-btn" id="swapReset" style="width:100%;margin-top:12px">Volver al alimento original</button>`:''}
    <p class="swap-note">Las equivalencias son aproximadas y están pensadas para mantener razonablemente el objetivo nutricional de la comida. Arroz, pasta, patata y batata se comparan en el estado indicado (crudo/seco).</p>`;
  sheet.classList.remove('hidden');
  el('swapClose').onclick=()=>sheet.classList.add('hidden');
  if(apply){
    document.querySelectorAll('[data-swap]').forEach(btn=>btn.onclick=()=>{ const replacement=substituteText(btn.dataset.swap,+btn.dataset.amount); setMealSub(date,mi,fi,{replacement,original:text}); sheet.classList.add('hidden'); render(); });
    el('swapReset').onclick=()=>{setMealSub(date,mi,fi,null);sheet.classList.add('hidden');render();};
  }
}
mealCard=function(m,i,doneMeals){
  const done=!!doneMeals[i], date=isoDate();
  return `<div class="card"><div class="meal-title"><strong>${m[0]}</strong><button class="check-btn ${done?'done':''}" data-meal="${i}">${done?'✓':'○'}</button></div><div class="food-list">${m[1].map((f,fi)=>{const sub=getMealSub(date,i,fi), supported=identifyFood(f)&&parseAmount(f); return `<div class="food-row"><div class="food-text ${sub?'subbed':''}">${sub?sub.replacement:f}${sub?`<span class="original-food">Original: ${f}</span>`:''}</div>${supported?`<button class="food-swap-btn" data-foodswap="${i}:${fi}">Cambiar</button>`:''}</div>`}).join('')}</div></div>`;
};
mealStaticCard=function(m,dayName){ return `<div class="card compact"><strong>${m[0]}</strong><div class="food-list">${m[1].map(f=>`<div class="food-row"><div class="food-text">${f}</div>${identifyFood(f)&&parseAmount(f)?`<button class="food-swap-btn" data-preview-food="${encodeURIComponent(f)}">Opciones</button>`:''}</div>`).join('')}</div></div>`; };
const oldBindMealEvents=bindMealEvents;
bindMealEvents=function(){ oldBindMealEvents(); document.querySelectorAll('[data-foodswap]').forEach(btn=>btn.onclick=()=>{const [mi,fi]=btn.dataset.foodswap.split(':').map(Number);showFoodSwap(MEALS[dayKey()][mi][1][fi],mi,fi,isoDate(),true);}); };
renderMeals=function(){
  el('content').innerHTML=Object.keys(MEALS).map(day=>`<section class="section"><div class="section-title"><h2>${day.toUpperCase()}</h2><span>${TRAINING[day].name}</span></div>${MEALS[day].map(m=>mealStaticCard(m,day)).join('')}</section>`).join('');
  document.querySelectorAll('[data-preview-food]').forEach(btn=>btn.onclick=()=>showFoodSwap(decodeURIComponent(btn.dataset.previewFood),null,null,isoDate(),false));
};

// ---------- BODY MEASUREMENTS ----------
function numVal(v){ const n=parseFloat(String(v||'').replace(',','.')); return Number.isFinite(n)?n:null; }
function genericChart(metrics,field,label){
  const pts=metrics.filter(m=>numVal(m[field])!==null).slice(-16); if(pts.length<2) return `<div class="card"><p class="note">Añade al menos dos registros de ${label.toLowerCase()} para ver la evolución.</p></div>`;
  const vals=pts.map(p=>numVal(p[field])), min=Math.min(...vals),max=Math.max(...vals),w=600,h=170,pad=22,range=(max-min)||1;
  const coords=vals.map((v,i)=>[pad+i*(w-2*pad)/(vals.length-1),h-pad-(v-min)*(h-2*pad)/range]);
  return `<div class="chart"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline fill="none" stroke="#38bdf8" stroke-width="4" points="${coords.map(c=>c.join(',')).join(' ')}"/>${coords.map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="4" fill="#22c55e"/>`).join('')}</svg></div><div class="chart-legend">Inicio ${vals[0].toFixed(1)} · Actual ${vals.at(-1).toFixed(1)} · Cambio ${(vals.at(-1)-vals[0]).toFixed(1)}</div>`;
}
function saveBodyMetrics(){
  const ids=['Weight','Waist','Chest','Hips','Neck','ArmR','ArmL','ThighR','ThighL','BodyFat','Sleep','Hunger','Energy','Steps'];
  const map={Weight:'weight',Waist:'waist',Chest:'chest',Hips:'hips',Neck:'neck',ArmR:'armR',ArmL:'armL',ThighR:'thighR',ThighL:'thighL',BodyFat:'bodyFat',Sleep:'sleep',Hunger:'hunger',Energy:'energy',Steps:'steps'};
  const rec={date:isoDate()}; ids.forEach(id=>{rec[map[id]]=el('m'+id)?.value||'';});
  const arr=load(metricsKey(),[]).filter(x=>x.date!==rec.date);arr.push(rec);arr.sort((a,b)=>a.date.localeCompare(b.date));save(metricsKey(),arr);renderMeasurements();
}
function renderMeasurements(){
  const metrics=load(metricsKey(),[]),today=metrics.find(m=>m.date===isoDate())||{}, latest=metrics.at(-1)||{};
  const fields=[['Weight','Peso','kg'],['Waist','Cintura','cm'],['Chest','Pecho','cm'],['Hips','Cadera','cm'],['Neck','Cuello','cm'],['ArmR','Brazo D','cm'],['ArmL','Brazo I','cm'],['ThighR','Muslo D','cm'],['ThighL','Muslo I','cm'],['BodyFat','Grasa','%']];
  const metricOptions=[['weight','Peso'],['waist','Cintura'],['chest','Pecho'],['hips','Cadera'],['armR','Brazo D'],['thighR','Muslo D']];
  const selected=load('bodyChartField','waist');
  el('content').innerHTML=`<section class="section"><div class="card"><div class="section-title"><h2>Mediciones corporales</h2><span>${isoDate()}</span></div><div class="measure-grid">${fields.map(([id,label,unit])=>`<label><span class="small-label">${label} (${unit})</span><input id="m${id}" class="input" inputmode="decimal" value="${today[{Weight:'weight',Waist:'waist',Chest:'chest',Hips:'hips',Neck:'neck',ArmR:'armR',ArmL:'armL',ThighR:'thighR',ThighL:'thighL',BodyFat:'bodyFat'}[id]]||''}"></label>`).join('')}</div><div class="measure-grid" style="margin-top:10px"><label><span class="small-label">Sueño 1–5</span><input id="mSleep" class="input" type="number" min="1" max="5" value="${today.sleep||''}"></label><label><span class="small-label">Hambre 1–5</span><input id="mHunger" class="input" type="number" min="1" max="5" value="${today.hunger||''}"></label><label><span class="small-label">Energía 1–5</span><input id="mEnergy" class="input" type="number" min="1" max="5" value="${today.energy||''}"></label><label><span class="small-label">Pasos</span><input id="mSteps" class="input" inputmode="numeric" value="${today.steps||''}"></label></div><button id="saveBodyMetrics" class="primary-btn" style="width:100%;margin-top:12px">Guardar mediciones</button></div></section>
  <section class="section"><div class="section-title"><h2>Evolución corporal</h2><select id="bodyMetricSelect" class="input" style="width:auto">${metricOptions.map(([k,l])=>`<option value="${k}" ${k===selected?'selected':''}>${l}</option>`).join('')}</select></div><div id="bodyChart">${genericChart(metrics,selected,metricOptions.find(x=>x[0]===selected)?.[1]||selected)}</div></section>
  <section class="section"><div class="grid-2"><button id="exportBtnBody" class="secondary-btn">Exportar copia</button><label class="secondary-btn" style="text-align:center">Importar<input id="importFileBody" type="file" accept="application/json" hidden></label></div></section>`;
  el('saveBodyMetrics').onclick=saveBodyMetrics; el('bodyMetricSelect').onchange=e=>{save('bodyChartField',e.target.value);renderMeasurements();}; el('exportBtnBody').onclick=exportData; el('importFileBody').onchange=importData;
}

// ---------- TRAINING PROGRESS ----------
function allExerciseSessions(){
  const hist=load('workoutHistory',[]), map={}; hist.forEach(h=>(h.details||[]).forEach(ex=>{ if(!map[ex.name]) map[ex.name]=[]; const sets=(ex.sets||[]).filter(s=>numVal(s.kg)!==null&&numVal(s.reps)!==null); if(!sets.length)return; const maxKg=Math.max(...sets.map(s=>numVal(s.kg))); const volume=sets.reduce((a,s)=>a+numVal(s.kg)*numVal(s.reps),0); map[ex.name].push({date:h.date,maxKg,volume,reps:sets.map(s=>numVal(s.reps)),rir:ex.rir}); })); return map;
}
function workoutProgressChart(rows){ if(rows.length<2)return '<div class="card"><p class="note">Necesitas al menos dos sesiones registradas de este ejercicio.</p></div>'; const vals=rows.map(r=>r.maxKg),min=Math.min(...vals),max=Math.max(...vals),w=600,h=180,pad=22,range=(max-min)||1,coords=vals.map((v,i)=>[pad+i*(w-2*pad)/(vals.length-1),h-pad-(v-min)*(h-2*pad)/range]); return `<div class="chart"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline fill="none" stroke="#38bdf8" stroke-width="4" points="${coords.map(c=>c.join(',')).join(' ')}"/>${coords.map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="4" fill="#22c55e"/>`).join('')}</svg></div>`; }
renderProgress=function(){
  const map=allExerciseSessions(), names=Object.keys(map).sort(), selected=(V4.selectedExercise&&map[V4.selectedExercise])?V4.selectedExercise:(names[0]||''); V4.selectedExercise=selected; const rows=(map[selected]||[]).slice(-12); const first=rows[0],last=rows.at(-1);
  el('content').innerHTML=`<section class="section"><div class="card"><div class="section-title"><h2>Progreso de entrenamiento</h2><span>cargas reales</span></div>${names.length?`<label><span class="small-label">Ejercicio</span><select id="progressExercise" class="input">${names.map(n=>`<option ${n===selected?'selected':''}>${n}</option>`).join('')}</select></label><div class="metric-summary" style="margin-top:12px"><div><b>${last?last.maxKg:'—'}</b><span>kg última sesión</span></div><div><b>${first&&last?(last.maxKg-first.maxKg>=0?'+':'')+(last.maxKg-first.maxKg).toFixed(1):'—'}</b><span>kg desde inicio</span></div><div><b>${last?Math.round(last.volume):'—'}</b><span>volumen última</span></div></div>`:'<p class="note">Registra entrenamientos para empezar a ver la evolución de cargas.</p>'}</div></section>
  ${names.length?`<section class="section"><div class="section-title"><h2>Evolución de carga</h2><span>${rows.length} sesiones</span></div>${workoutProgressChart(rows)}</section><section class="section"><div class="card" style="overflow:auto"><table class="progress-table"><thead><tr><th>Fecha</th><th>Máx. kg</th><th>Reps</th><th>RIR</th><th>Volumen</th></tr></thead><tbody>${rows.slice().reverse().map(r=>`<tr><td>${r.date}</td><td>${r.maxKg}</td><td>${r.reps.join('/')}</td><td>${r.rir||'—'}</td><td>${Math.round(r.volume)}</td></tr>`).join('')}</tbody></table></div></section>`:''}`;
  if(el('progressExercise')) el('progressExercise').onchange=e=>{V4.selectedExercise=e.target.value;renderProgress();};
};

// ---------- ROUTING ----------
render=function(){
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view));
  const titles={today:'Hoy',training:'Entrenamiento',meals:'Comidas',measurements:'Mediciones',progress:'Progreso',history:'Historial'}; el('pageTitle').textContent=titles[state.view]||'JC Training';
  if(state.view==='today') renderToday();
  if(state.view==='training') renderTraining();
  if(state.view==='meals') renderMeals();
  if(state.view==='measurements') renderMeasurements();
  if(state.view==='progress') renderProgress();
  if(state.view==='history') renderHistory();
};

// Add food-swap binding after Today render (V3 wraps renderToday, so wrap the final version here).
const v4PreviousRenderToday=renderToday;
renderToday=function(){ v4PreviousRenderToday(); document.querySelectorAll('[data-foodswap]').forEach(btn=>btn.onclick=()=>{const [mi,fi]=btn.dataset.foodswap.split(':').map(Number);showFoodSwap(MEALS[dayKey()][mi][1][fi],mi,fi,isoDate(),true);}); };

// Backup V4-specific data too.
const baseExportV4=exportData;
exportData=function(){
  const payload={metrics:load(metricsKey(),[]),workoutHistory:load('workoutHistory',[]),storage:{}};
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('workout:')||k.startsWith('meals:')||k.startsWith('mealSubs:')||k==='v3Settings'||k==='activeSession'||k.startsWith('sessionSummary:'))payload.storage[k]=load(k,{});}
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`jc-training-backup-${isoDate()}.json`;a.click();URL.revokeObjectURL(a.href);
};

render();
