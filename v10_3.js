// JC Training V10.3 — registro avanzado de entrenamiento, extras y finalizador inteligente.
(function(){
'use strict';

const V103_VERSION='10.3';
const v103Clone=x=>JSON.parse(JSON.stringify(x));
const v103Esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const v103Num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return Number.isFinite(n)?n:null;};
const v103Day=()=>dayKey(new Date());
const v103CompletedKey=(date=isoDate())=>`v103Completed:${date}`;
const v103ExtrasKey=(date=isoDate())=>`v103Extras:${date}`;
const v103ExtraDataKey=(date=isoDate())=>`v103ExtraData:${date}`;

function v103Completed(date=isoDate()){return load(v103CompletedKey(date),{})||{};}
function v103SetCompleted(id,value,date=isoDate()){
  const d=v103Completed(date); if(value)d[String(id)]=true; else delete d[String(id)]; save(v103CompletedKey(date),d);
}
function v103Extras(date=isoDate()){return load(v103ExtrasKey(date),[])||[];}
function v103SaveExtras(arr,date=isoDate()){save(v103ExtrasKey(date),arr);}
function v103ExtraData(date=isoDate()){return load(v103ExtraDataKey(date),{})||{};}
function v103SaveExtraData(d,date=isoDate()){save(v103ExtraDataKey(date),d);}
function v103Uid(){return 'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function v103AutoUnilateral(name){return /unilateral|búlgara|bulgara/i.test(String(name||''));}
function v103IsUnilateral(x){return !!(x?.[5]?.unilateral);}
function v103RirOptions(value=''){
  return `<option value="">—</option>${[0,1,2,3,4].map(v=>`<option value="${v}" ${String(value)===String(v)?'selected':''}>${v}</option>`).join('')}`;
}
function v103SetData(ex,si,side=null){
  if(!ex.sets) ex.sets=[];
  if(!ex.sets[si]) ex.sets[si]={kg:'',reps:'',rir:'',done:false};
  if(side){if(!ex.sets[si][side])ex.sets[si][side]={kg:'',reps:'',rir:''};return ex.sets[si][side];}
  return ex.sets[si];
}
function v103EnsureBaseExercise(data,i,x){
  const sets=+x[1]||0, unilateral=v103IsUnilateral(x);
  if(!data[i])data[i]={sets:[],rir:''};
  for(let si=0;si<sets;si++){
    if(!data[i].sets[si])data[i].sets[si]={kg:'',reps:'',rir:'',done:false};
    if(unilateral){
      if(!data[i].sets[si].left)data[i].sets[si].left={kg:'',reps:'',rir:''};
      if(!data[i].sets[si].right)data[i].sets[si].right={kg:'',reps:'',rir:''};
    }
  }
  return data[i];
}
function v103SetAverageRir(data){
  const vals=[];
  Object.values(data||{}).forEach(ex=>(ex.sets||[]).forEach(s=>{
    if(s.left||s.right){['left','right'].forEach(k=>{const n=v103Num(s[k]?.rir);if(n!==null)vals.push(n);});}
    else {const n=v103Num(s.rir);if(n!==null)vals.push(n);}
  }));
  return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;
}

// ---------- Técnica específica para los dos ejercicios que estaban poco claros ----------
const v103PreviousVisual=window.exerciseVisual;
function v103SpecialVisual(name,muscles){
  const n=String(name||'').toLowerCase();
  if(n.includes('reverse pec')){
    return `<div class="v103-tech-seq"><div class="v103-tech-head"><strong>Reverse pec-deck</strong><span>${v103Esc(muscles||'Deltoide posterior · espalda alta')}</span></div><svg viewBox="0 0 620 220" role="img" aria-label="Secuencia reverse pec-deck"><defs><marker id="v103a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill="#22c55e"/></marker></defs><g transform="translate(20,25)"><rect width="270" height="165" rx="18" class="v103-panel"/><text x="135" y="24" text-anchor="middle" class="v103-phase">INICIO · MIRANDO AL RESPALDO</text><rect x="105" y="45" width="60" height="82" rx="10" class="v103-machine"/><circle cx="135" cy="55" r="12" class="v103-body"/><path d="M135 68 L135 105 M135 80 L75 83 M135 80 L195 83 M135 105 L112 140 M135 105 L158 140" class="v103-bodyline"/><circle cx="70" cy="83" r="6" class="v103-handle"/><circle cx="200" cy="83" r="6" class="v103-handle"/></g><g transform="translate(330,25)"><rect width="270" height="165" rx="18" class="v103-panel"/><text x="135" y="24" text-anchor="middle" class="v103-phase">FINAL · BRAZOS ABIERTOS</text><rect x="105" y="45" width="60" height="82" rx="10" class="v103-machine"/><circle cx="135" cy="55" r="12" class="v103-body"/><path d="M135 68 L135 105 M135 80 L42 70 M135 80 L228 70 M135 105 L112 140 M135 105 L158 140" class="v103-bodyline"/><path d="M88 115 C55 108 38 92 30 72 M182 115 C215 108 232 92 240 72" class="v103-arrow" marker-end="url(#v103a)"/><circle cx="38" cy="70" r="6" class="v103-handle"/><circle cx="232" cy="70" r="6" class="v103-handle"/></g></svg><div class="v103-tech-tip">Pecho apoyado · asas a la altura de hombros · abre los brazos sin encoger trapecios.</div></div>`;
  }
  if(n.includes('curl predicador')){
    return `<div class="v103-tech-seq"><div class="v103-tech-head"><strong>Curl predicador máquina/polea</strong><span>${v103Esc(muscles||'Bíceps')}</span></div><svg viewBox="0 0 620 220" role="img" aria-label="Secuencia curl predicador"><defs><marker id="v103b" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill="#22c55e"/></marker></defs><g transform="translate(20,25)"><rect width="270" height="165" rx="18" class="v103-panel"/><text x="135" y="24" text-anchor="middle" class="v103-phase">INICIO · BRAZOS CASI EXTENDIDOS</text><circle cx="85" cy="55" r="12" class="v103-body"/><path d="M85 68 L85 112 M85 112 L65 145 M85 112 L105 145" class="v103-bodyline"/><path d="M95 82 L145 92 L205 62" class="v103-machine"/><path d="M98 82 L145 94 L176 125" class="v103-arm"/><path d="M176 125 H205" class="v103-bar"/></g><g transform="translate(330,25)"><rect width="270" height="165" rx="18" class="v103-panel"/><text x="135" y="24" text-anchor="middle" class="v103-phase">FINAL · FLEXIÓN DE CODO</text><circle cx="85" cy="55" r="12" class="v103-body"/><path d="M85 68 L85 112 M85 112 L65 145 M85 112 L105 145" class="v103-bodyline"/><path d="M95 82 L145 92 L205 62" class="v103-machine"/><path d="M98 82 L145 94 L167 68" class="v103-arm"/><path d="M160 66 H190" class="v103-bar"/><path d="M205 126 C194 105 185 87 170 71" class="v103-arrow" marker-end="url(#v103b)"/></g></svg><div class="v103-tech-tip">Todo el tríceps permanece apoyado · mueve el antebrazo, no el hombro · baja controlado.</div></div>`;
  }
  return null;
}
window.exerciseVisual=function(name,muscles){return v103SpecialVisual(name,muscles)||(typeof v103PreviousVisual==='function'?v103PreviousVisual(name,muscles):'');};

// ---------- Tarjeta base con RIR por serie y completado persistente ----------
const v103OldGetPrevious=window.getPreviousExercise;
window.exerciseCard=function(x,i,date){
  const [name,setsRaw,reps,rest,rirTarget]=x,sets=+setsRaw||0, unilateral=v103IsUnilateral(x);
  const data=load(workoutKey(date),{}), ex=v103EnsureBaseExercise(data,i,x), prev=typeof v103OldGetPrevious==='function'?v103OldGetPrevious(dayKey(new Date(date+'T12:00:00')),i):null;
  const info=EXERCISE_INFO[name]||null, completed=!!v103Completed(date)[String(i)];
  const prevText=prev?`<div class="previous-box"><strong>Sesión anterior · ${prev.date}</strong><div>${(prev.data.sets||[]).map((s,j)=>{const rr=s.rir!==undefined&&s.rir!==''?` · RIR ${s.rir}`:'';return `S${j+1}: ${s.kg||'—'} kg × ${s.reps||'—'}${rr}`;}).join(' · ')}</div></div>`:`<div class="previous-box muted-box">Primera referencia: trabaja alrededor de ${rirTarget||'RIR 1–2'}.</div>`;
  const rows=Array.from({length:sets},(_,si)=>{
    const s=v103SetData(ex,si);
    if(unilateral){
      const l=v103SetData(ex,si,'left'),r=v103SetData(ex,si,'right');
      return `<div class="v103-unilateral-set"><div class="v103-set-title">S${si+1} · objetivo ${reps}/lado</div>${[['left','I',l],['right','D',r]].map(([side,label,o])=>`<div class="set-row v103-side"><div class="set-label">${label}<small>${side==='left'?'izq.':'dcha.'}</small></div><input class="input set-kg" data-ex="${i}" data-set="${si}" data-side="${side}" inputmode="decimal" placeholder="kg" value="${v103Esc(o.kg)}"><input class="input set-reps" data-ex="${i}" data-set="${si}" data-side="${side}" inputmode="numeric" placeholder="${reps}" value="${v103Esc(o.reps)}"><select class="input set-rir" data-ex="${i}" data-set="${si}" data-side="${side}" aria-label="RIR ${label}">${v103RirOptions(o.rir)}</select></div>`).join('')}<button class="check-btn v103-series-check ${s.done?'done':''}" data-check="${i}:${si}" data-rest="${rest}" data-name="${v103Esc(name)}">${s.done?'✓ Serie completa':'○ Marcar serie'}</button></div>`;
    }
    return `<div class="set-row v103-set-row"><div class="set-label">S${si+1}<small>obj ${reps}</small></div><input class="input set-kg" data-ex="${i}" data-set="${si}" inputmode="decimal" placeholder="kg" value="${v103Esc(s.kg)}"><input class="input set-reps" data-ex="${i}" data-set="${si}" inputmode="numeric" placeholder="${reps}" value="${v103Esc(s.reps)}"><select class="input set-rir" data-ex="${i}" data-set="${si}" aria-label="RIR serie ${si+1}">${v103RirOptions(s.rir)}</select><button class="check-btn ${s.done?'done':''}" data-check="${i}:${si}" data-rest="${rest}" data-name="${v103Esc(name)}">${s.done?'✓':'○'}</button></div>`;
  }).join('');
  const how=info?`<details class="howto"><summary>Técnica · músculos · claves</summary><div class="howto-body">${exerciseVisual(name,info.muscles)}<strong>${info.muscles}</strong><ul>${info.cues.map(c=>`<li>${c}</li>`).join('')}</ul></div></details>`:'';
  return `<div class="card exercise-card ${completed?'v103-ex-completed':''}" data-v103-card="${i}"><div class="exercise-head"><div><div class="exercise-name">${v103Esc(name)}</div><div class="exercise-meta">${sets} × ${reps}${unilateral?' / lado':''} · descanso ${rest||'—'} s</div></div><div class="v103-head-badges"><span class="badge">${v103Esc(rirTarget||'RIR 1–2')}</span>${completed?'<span class="v103-completed-badge">✓ Completado</span>':''}</div></div>${prevText}<div class="sets">${rows}</div>${how}<div class="exercise-footer v103-footer"><span class="v103-rir-note">RIR se registra ahora en cada serie.</span><button class="secondary-btn save-ex ${completed?'v103-save-done':''}" data-ex="${i}">${completed?'✓ Ejercicio guardado':'Guardar ejercicio'}</button></div></div>`;
};

window.persistWorkoutInput=function(){
  const plan=TRAINING[v103Day()]; if(!plan?.exercises?.length)return;
  const data=load(workoutKey(),{});
  plan.exercises.forEach((x,i)=>{
    const ex=v103EnsureBaseExercise(data,i,x), unilateral=v103IsUnilateral(x);
    if(unilateral){
      document.querySelectorAll(`.set-kg[data-ex="${i}"][data-side]`).forEach(inp=>v103SetData(ex,+inp.dataset.set,inp.dataset.side).kg=inp.value);
      document.querySelectorAll(`.set-reps[data-ex="${i}"][data-side]`).forEach(inp=>v103SetData(ex,+inp.dataset.set,inp.dataset.side).reps=inp.value);
      document.querySelectorAll(`.set-rir[data-ex="${i}"][data-side]`).forEach(inp=>v103SetData(ex,+inp.dataset.set,inp.dataset.side).rir=inp.value);
    }else{
      document.querySelectorAll(`.set-kg[data-ex="${i}"]:not([data-side])`).forEach(inp=>v103SetData(ex,+inp.dataset.set).kg=inp.value);
      document.querySelectorAll(`.set-reps[data-ex="${i}"]:not([data-side])`).forEach(inp=>v103SetData(ex,+inp.dataset.set).reps=inp.value);
      document.querySelectorAll(`.set-rir[data-ex="${i}"]:not([data-side])`).forEach(inp=>v103SetData(ex,+inp.dataset.set).rir=inp.value);
    }
  });
  save(workoutKey(),data);
  v103PersistExtraInputs();
};

window.bindExerciseEvents=function(){
  document.querySelectorAll('.set-kg,.set-reps,.set-rir').forEach(inp=>{inp.addEventListener(inp.tagName==='SELECT'?'change':'input',persistWorkoutInput);});
  document.querySelectorAll('[data-check]').forEach(btn=>btn.addEventListener('click',toggleSet));
  document.querySelectorAll('.save-ex').forEach(btn=>btn.onclick=()=>{
    persistWorkoutInput(); const i=btn.dataset.ex; v103SetCompleted(i,true); finalizeHistory(); renderToday();
  });
  v103BindExtraEvents();
};

// ---------- Extras de la sesión ----------
function v103NormalizeExtra(ex){return {id:ex.id||v103Uid(),name:ex.name||'Nuevo ejercicio',sets:+ex.sets||3,reps:String(ex.reps||'10'),rest:+ex.rest||90,rirTarget:ex.rirTarget||'RIR 1–2',unilateral:!!ex.unilateral,source:ex.source||'manual'};}
function v103ExtraCard(raw){
  const ex=v103NormalizeExtra(raw), all=v103ExtraData(), d=all[ex.id]||{sets:[]}, completed=!!v103Completed()[`extra:${ex.id}`];
  for(let si=0;si<ex.sets;si++){if(!d.sets[si])d.sets[si]={kg:'',reps:'',rir:'',done:false};if(ex.unilateral){d.sets[si].left=d.sets[si].left||{kg:'',reps:'',rir:''};d.sets[si].right=d.sets[si].right||{kg:'',reps:'',rir:''};}}
  all[ex.id]=d;v103SaveExtraData(all);
  const rows=d.sets.map((s,si)=>ex.unilateral?`<div class="v103-unilateral-set"><div class="v103-set-title">S${si+1} · objetivo ${v103Esc(ex.reps)}/lado</div>${[['left','I'],['right','D']].map(([side,label])=>{const o=s[side];return `<div class="set-row v103-side"><div class="set-label">${label}</div><input class="input extra-kg" data-extra="${ex.id}" data-set="${si}" data-side="${side}" inputmode="decimal" placeholder="kg" value="${v103Esc(o.kg)}"><input class="input extra-reps" data-extra="${ex.id}" data-set="${si}" data-side="${side}" inputmode="numeric" placeholder="${v103Esc(ex.reps)}" value="${v103Esc(o.reps)}"><select class="input extra-rir" data-extra="${ex.id}" data-set="${si}" data-side="${side}">${v103RirOptions(o.rir)}</select></div>`}).join('')}<button class="check-btn v103-series-check extra-check ${s.done?'done':''}" data-extra-check="${ex.id}:${si}" data-rest="${ex.rest}" data-name="${v103Esc(ex.name)}">${s.done?'✓ Serie completa':'○ Marcar serie'}</button></div>`:`<div class="set-row v103-set-row"><div class="set-label">S${si+1}<small>obj ${v103Esc(ex.reps)}</small></div><input class="input extra-kg" data-extra="${ex.id}" data-set="${si}" inputmode="decimal" placeholder="kg" value="${v103Esc(s.kg)}"><input class="input extra-reps" data-extra="${ex.id}" data-set="${si}" inputmode="numeric" placeholder="${v103Esc(ex.reps)}" value="${v103Esc(s.reps)}"><select class="input extra-rir" data-extra="${ex.id}" data-set="${si}">${v103RirOptions(s.rir)}</select><button class="check-btn extra-check ${s.done?'done':''}" data-extra-check="${ex.id}:${si}" data-rest="${ex.rest}" data-name="${v103Esc(ex.name)}">${s.done?'✓':'○'}</button></div>`).join('');
  const info=EXERCISE_INFO[ex.name];
  const how=info?`<details class="howto"><summary>Técnica · músculos · claves</summary><div class="howto-body">${exerciseVisual(ex.name,info.muscles)}<strong>${info.muscles}</strong><ul>${info.cues.map(c=>`<li>${c}</li>`).join('')}</ul></div></details>`:'';
  return `<div class="card exercise-card v103-extra-card ${completed?'v103-ex-completed':''}" data-extra-card="${ex.id}"><div class="exercise-head"><div><div class="exercise-name">${v103Esc(ex.name)} <span class="v103-extra-label">EXTRA</span></div><div class="exercise-meta">${ex.sets} × ${v103Esc(ex.reps)}${ex.unilateral?' / lado':''} · descanso ${ex.rest||'—'} s</div></div>${completed?'<span class="v103-completed-badge">✓ Completado</span>':''}</div><div class="sets">${rows}</div>${how}<div class="exercise-footer v103-footer"><button class="secondary-btn v103-remove-extra" data-extra-remove="${ex.id}">Quitar extra</button><button class="secondary-btn v103-save-extra ${completed?'v103-save-done':''}" data-extra-save="${ex.id}">${completed?'✓ Ejercicio guardado':'Guardar ejercicio'}</button></div></div>`;
}
function v103PersistExtraInputs(){
  const defs=v103Extras(), all=v103ExtraData();
  defs.forEach(ex=>{
    const d=all[ex.id]||{sets:[]}; for(let si=0;si<ex.sets;si++)d.sets[si]=d.sets[si]||{kg:'',reps:'',rir:'',done:false};
    document.querySelectorAll(`[data-extra="${ex.id}"]`).forEach(inp=>{const si=+inp.dataset.set,side=inp.dataset.side||null,o=side?(d.sets[si][side]||(d.sets[si][side]={kg:'',reps:'',rir:''})):d.sets[si];if(inp.classList.contains('extra-kg'))o.kg=inp.value;if(inp.classList.contains('extra-reps'))o.reps=inp.value;if(inp.classList.contains('extra-rir'))o.rir=inp.value;});
    all[ex.id]=d;
  }); v103SaveExtraData(all);
}
function v103BindExtraEvents(){
  document.querySelectorAll('.extra-kg,.extra-reps,.extra-rir').forEach(inp=>inp.addEventListener(inp.tagName==='SELECT'?'change':'input',v103PersistExtraInputs));
  document.querySelectorAll('[data-extra-check]').forEach(btn=>btn.onclick=()=>{
    v103PersistExtraInputs();const [id,si]=btn.dataset.extraCheck.split(':'),all=v103ExtraData(),d=all[id];if(!d)return;d.sets[+si].done=!d.sets[+si].done;all[id]=d;v103SaveExtraData(all);if(d.sets[+si].done&&V3?.settings?.timerEnabled&&+btn.dataset.rest>0)startTimer(+btn.dataset.rest,btn.dataset.name);finalizeHistory();renderToday();
  });
  document.querySelectorAll('[data-extra-save]').forEach(btn=>btn.onclick=()=>{v103PersistExtraInputs();v103SetCompleted(`extra:${btn.dataset.extraSave}`,true);finalizeHistory();renderToday();});
  document.querySelectorAll('[data-extra-remove]').forEach(btn=>btn.onclick=()=>{if(!confirm('¿Quitar este ejercicio extra de la sesión de hoy?'))return;const id=btn.dataset.extraRemove;v103SaveExtras(v103Extras().filter(x=>x.id!==id));const d=v103ExtraData();delete d[id];v103SaveExtraData(d);v103SetCompleted(`extra:${id}`,false);finalizeHistory();renderToday();});
}

// ---------- Añadir ejercicio ----------
function v103ExerciseLibrary(){
  const m=new Map();Object.values(TRAINING).forEach(p=>(p.exercises||[]).forEach(x=>{if(!m.has(x[0]))m.set(x[0],x);}));return [...m.values()].sort((a,b)=>a[0].localeCompare(b[0],'es'));
}
function v103OpenExercisePicker(opts={}){
  const day=opts.day||v103Day(), mode=opts.mode||'today', sheet=el('swapSheet'), lib=v103ExerciseLibrary();
  function drawList(q=''){
    const nq=String(q).toLowerCase();el('v103ExerciseList').innerHTML=lib.filter(x=>!nq||x[0].toLowerCase().includes(nq)).map((x,idx)=>`<button class="v103-ex-choice" data-v103-lib="${encodeURIComponent(x[0])}"><strong>${v103Esc(x[0])}</strong><small>${x[1]} × ${v103Esc(x[2])} · ${x[3]} s</small></button>`).join('')||'<p class="note">Sin coincidencias. Puedes crear uno manualmente.</p>';
    document.querySelectorAll('[data-v103-lib]').forEach(b=>b.onclick=()=>{const x=lib.find(y=>y[0]===decodeURIComponent(b.dataset.v103Lib));v103OpenExerciseForm({day,mode,x});});
  }
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">V10.3 · EJERCICIOS</div><h3>Añadir ejercicio</h3></div><button class="swap-close" id="v103Close">Cerrar</button></div><input id="v103ExSearch" class="input" placeholder="Buscar ejercicio…"><div id="v103ExerciseList" class="v103-ex-list"></div><button id="v103Manual" class="primary-btn" style="width:100%;margin-top:12px">+ Crear ejercicio manualmente</button>`;
  sheet.classList.remove('hidden');el('v103Close').onclick=()=>sheet.classList.add('hidden');el('v103ExSearch').oninput=e=>drawList(e.target.value);el('v103Manual').onclick=()=>v103OpenExerciseForm({day,mode,x:null});drawList();
}
function v103OpenExerciseForm({day,mode,x}){
  const preset=x||['',3,10,90,'RIR 1–2',{unilateral:false}], sheet=el('swapSheet');
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">CONFIGURAR</div><h3>${x?'Añadir ejercicio':'Nuevo ejercicio'}</h3></div><button class="swap-close" id="v103Close">Cerrar</button></div><label class="v9-field"><span>Nombre</span><input id="v103Name" class="input" value="${v103Esc(preset[0])}"></label><div class="v103-grid"><label><span class="small-label">Series</span><input id="v103Sets" class="input" type="number" min="1" value="${preset[1]}"></label><label><span class="small-label">Reps</span><input id="v103Reps" class="input" value="${v103Esc(preset[2])}"></label><label><span class="small-label">Descanso (s)</span><input id="v103Rest" class="input" type="number" min="0" value="${preset[3]}"></label><label><span class="small-label">RIR objetivo</span><input id="v103Target" class="input" value="${v103Esc(preset[4]||'RIR 1–2')}"></label></div><label class="v103-checkline"><input id="v103Unilateral" type="checkbox" ${(preset[5]?.unilateral||v103AutoUnilateral(preset[0]))?'checked':''}> <span>Ejercicio unilateral: registrar izquierda y derecha por separado</span></label>${mode==='today'?`<label class="v103-checkline"><input id="v103AlsoPlan" type="checkbox"> <span>Añadir también al plan habitual de ${day}</span></label>`:''}<button id="v103ConfirmEx" class="primary-btn" style="width:100%;margin-top:14px">Añadir ejercicio</button>`;
  sheet.classList.remove('hidden');el('v103Close').onclick=()=>sheet.classList.add('hidden');el('v103ConfirmEx').onclick=()=>{
    const ex={id:v103Uid(),name:el('v103Name').value.trim(),sets:+el('v103Sets').value||1,reps:el('v103Reps').value.trim()||'10',rest:+el('v103Rest').value||0,rirTarget:el('v103Target').value.trim()||'RIR 1–2',unilateral:el('v103Unilateral').checked,source:'manual'};if(!ex.name)return alert('Indica el nombre del ejercicio.');
    const arr=[ex.name,ex.sets,ex.reps,ex.rest,ex.rirTarget,{unilateral:ex.unilateral}];
    if(mode==='plan'||el('v103AlsoPlan')?.checked){v103AddToPlan(day,arr); if(mode==='plan'){sheet.classList.add('hidden');renderTraining();return;} if(el('v103AlsoPlan')?.checked){sheet.classList.add('hidden');renderToday();return;}}
    const extras=v103Extras();extras.push(ex);v103SaveExtras(extras);sheet.classList.add('hidden');renderToday();
  };
}
function v103AddToPlan(day,arr){
  try{const month=typeof v9MonthNow==='function'?v9MonthNow():isoDate().slice(0,7),all=typeof v9PlansGet==='function'?v9PlansGet():load('v9Plans',{}),p=all[month];if(!p?.training?.[day])throw new Error('plan');p.training[day].exercises.push(arr);if(typeof v9PlansPut==='function')v9PlansPut(all);else save('v9Plans',all);if(typeof v9ApplyMonth==='function')v9ApplyMonth(month);}catch(e){TRAINING[day].exercises.push(arr);}
}

// ---------- Finalizador inteligente local ----------
function v103SessionSeconds(){return V3?.session?.startedAt?Math.max(0,Math.floor((Date.now()-V3.session.startedAt)/1000)):null;}
function v103BaseProgress(){const plan=TRAINING[v103Day()],data=load(workoutKey(),{}),total=plan.exercises.reduce((a,x)=>a+(+x[1]||0),0),done=Object.values(data).reduce((a,ex)=>a+(ex.sets||[]).filter(s=>s.done).length,0);return {total,done,data};}
function v103ExtraProgress(){const defs=v103Extras(),data=v103ExtraData();let total=0,done=0;defs.forEach(x=>{total+=x.sets;done+=(data[x.id]?.sets||[]).filter(s=>s.done).length;});return{total,done};}
function v103FinisherCandidates(day){
  const map={
    lunes:[['Crunch polea alta',3,12,60,'RIR 1–2'],['Cardio LISS / caminata rápida',1,'8 min',0,'Suave']],
    martes:[['Rueda abdominal',3,10,60,'RIR 1–2'],['Crunch polea alta',3,12,60,'RIR 1–2']],
    miércoles:[['Cardio LISS / caminata rápida',1,'8 min',0,'Suave'],['Gemelo máquina/prensa',2,15,60,'RIR 1–2']],
    jueves:[['Crunch polea alta',3,12,60,'RIR 1–2'],['Rueda abdominal',3,10,60,'RIR 1–2']],
    viernes:[['Cardio LISS / caminata rápida',1,'10 min',0,'Suave'],['Crunch polea alta',2,12,60,'RIR 1–2']],
    sábado:[],domingo:[]
  };return map[day]||[];
}
function v103RecommendFinisher(alt=0){
  const day=v103Day(),elapsed=v103SessionSeconds(),base=v103BaseProgress(),avg=v103SetAverageRir(base.data),extra=v103ExtraProgress(),tomorrow=DAYS[(new Date().getDay()+1)%7];
  if(elapsed===null)return {finish:true,title:'Primero inicia el entrenamiento',reason:'Necesito el cronómetro general para saber cuánto tiempo real te queda dentro de la hora.'};
  const rem=Math.max(0,60-Math.floor(elapsed/60));
  if(base.done<base.total)return {finish:true,title:'Termina primero la sesión base',reason:`Llevas ${base.done}/${base.total} series programadas. No añadiría volumen antes de completar el trabajo previsto.`};
  if(rem<6)return {finish:true,title:'Mejor terminar aquí',reason:`Te quedan aproximadamente ${rem} minutos. Prefiero preservar recuperación y no añadir un bloque apresurado.`};
  if(avg!==null&&avg<0.8)return {finish:true,title:'Mejor terminar aquí',reason:`El RIR medio registrado es ${avg.toFixed(1)}: la sesión ya ha sido exigente. Añadir volumen aporta poco frente al coste de recuperación.`};
  if((day==='miércoles'||day==='viernes')&&rem<10)return {finish:true,title:'Sesión completa',reason:`Has terminado pierna y quedan ~${rem} min. No añadiría más volumen de fuerza a la parte inferior.`};
  const cand=v103FinisherCandidates(day);if(!cand.length)return{finish:true,title:'Termina la sesión',reason:'No veo un extra que mejore claramente el plan de hoy.'};
  const x=cand[alt%cand.length];
  let reason='Añade un estímulo pequeño sin repetir innecesariamente el grupo principal.';
  if(day==='martes')reason=`Espalda y bíceps ya están trabajados; mañana toca ${tomorrow}. Un bloque corto de abdomen añade valor con poca interferencia.`;
  if(day==='lunes'||day==='jueves')reason='El torso ya tiene su volumen principal. Un final corto de abdomen es más útil que añadir más presses o tirones.';
  if(day==='miércoles'||day==='viernes')reason='La pierna ya tiene suficiente trabajo. Si te encuentras bien, un cardio muy suave aprovecha el margen sin añadir fatiga muscular relevante.';
  return{finish:false,x,remaining:rem,reason,alt};
}
function v103OpenFinisher(alt=0){
  const r=v103RecommendFinisher(alt),sheet=el('swapSheet');
  if(r.finish){el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">¿CON QUÉ TERMINO?</div><h3>${v103Esc(r.title)}</h3></div><button class="swap-close" id="v103Close">Cerrar</button></div><div class="card"><p>${v103Esc(r.reason)}</p></div><button id="v103FinishNow" class="primary-btn" style="width:100%">Finalizar entrenamiento</button>`;sheet.classList.remove('hidden');el('v103Close').onclick=()=>sheet.classList.add('hidden');el('v103FinishNow').onclick=()=>{sheet.classList.add('hidden');finishWorkoutSession();};return;}
  const x=r.x;el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">FINALIZADOR INTELIGENTE</div><h3>${v103Esc(x[0])}</h3></div><button class="swap-close" id="v103Close">Cerrar</button></div><div class="card v103-suggestion"><strong>${x[1]} × ${v103Esc(x[2])}</strong><span>Descanso ${x[3]||'—'} s · ${v103Esc(x[4])}</span><p>${v103Esc(r.reason)}</p><small>Tiempo disponible aproximado: ${r.remaining} min.</small></div><div class="v103-action-grid"><button id="v103AddSuggestion" class="primary-btn">Añadir al entrenamiento</button><button id="v103AnotherSuggestion" class="secondary-btn">Otra opción</button><button id="v103NoExtra" class="secondary-btn">Terminar entrenamiento</button></div>`;sheet.classList.remove('hidden');el('v103Close').onclick=()=>sheet.classList.add('hidden');el('v103AddSuggestion').onclick=()=>{const ex=v103NormalizeExtra({name:x[0],sets:x[1],reps:x[2],rest:x[3],rirTarget:x[4],unilateral:false,source:'suggested'});const arr=v103Extras();arr.push(ex);v103SaveExtras(arr);sheet.classList.add('hidden');renderToday();};el('v103AnotherSuggestion').onclick=()=>v103OpenFinisher(alt+1);el('v103NoExtra').onclick=()=>{sheet.classList.add('hidden');finishWorkoutSession();};
}

// ---------- Historial con RIR por serie, extras, orden y duración ----------
window.finalizeHistory=function(){
  const day=v103Day(),plan=TRAINING[day],data=load(workoutKey(),{}),order=typeof v5Order==='function'?v5Order(day):plan.exercises.map((_,i)=>i),extras=v103Extras(),extraData=v103ExtraData(),completed=v103Completed();
  const baseTotal=plan.exercises.reduce((a,x)=>a+(+x[1]||0),0),baseDone=Object.values(data).reduce((a,ex)=>a+(ex.sets||[]).filter(s=>s.done).length,0),extraTotal=extras.reduce((a,x)=>a+x.sets,0),extraDone=extras.reduce((a,x)=>a+(extraData[x.id]?.sets||[]).filter(s=>s.done).length,0);
  const details=order.map(i=>({name:plan.exercises[i][0],target:plan.exercises[i][2],sets:v103Clone(data[i]?.sets||[]),completed:!!completed[String(i)],originalIndex:i,unilateral:v103IsUnilateral(plan.exercises[i])}));
  extras.forEach(x=>details.push({name:x.name,target:x.reps,sets:v103Clone(extraData[x.id]?.sets||[]),completed:!!completed[`extra:${x.id}`],extra:true,source:x.source,unilateral:x.unilateral,id:x.id}));
  const hist=load('workoutHistory',[]).filter(h=>h.date!==isoDate());hist.push({date:isoDate(),name:plan.name,totalSets:baseTotal+extraTotal,completedSets:baseDone+extraDone,baseTotalSets:baseTotal,baseCompletedSets:baseDone,extraSets:extraTotal,extraCompletedSets:extraDone,exerciseOrder:order.slice(),elapsed:v103SessionSeconds()??load(`sessionSummary:${isoDate()}`,{}).elapsed??null,details});save('workoutHistory',hist);
};
window.finishWorkoutSession=function(){
  persistWorkoutInput();finalizeHistory();const base=v103BaseProgress(),extra=v103ExtraProgress(),elapsed=v103SessionSeconds()||0,plan=TRAINING[v103Day()];save(`sessionSummary:${isoDate()}`,{date:isoDate(),name:plan.name,elapsed,total:base.total+extra.total,done:base.done+extra.done,baseTotal:base.total,baseDone:base.done,extraTotal:extra.total,extraDone:extra.done});V3.session=null;localStorage.removeItem('activeSession');alert(`Entrenamiento guardado\n${base.done}/${base.total} series base${extra.total?` · +${extra.done}/${extra.total} extra`:''}\nDuración ${fmtElapsed(elapsed)}`);render();
};

// ---------- Panel general de sesión y extras en Hoy ----------
const v103PreviousRenderToday=window.renderToday;
window.renderToday=function(){
  v103PreviousRenderToday();
  const content=el('content'),sections=[...content.querySelectorAll('.section')],trainingSection=sections.find(s=>s.querySelector('.section-title h2')?.textContent.trim()==='Entrenamiento');
  if(!trainingSection)return;
  // Elimina cualquier panel antiguo para no duplicar controles.
  content.querySelectorAll('.v103-session-section').forEach(x=>x.remove());
  const session=V3?.session&&V3.session.date===isoDate()?V3.session:null,base=v103BaseProgress(),extra=v103ExtraProgress();
  const panel=document.createElement('section');panel.className='section v103-session-section';panel.innerHTML=`<div class="card v103-session-card"><div class="v103-session-head"><div><div class="eyebrow">SESIÓN DE HOY</div><strong>${session?'Entrenamiento en curso':'Cronómetro general detenido'}</strong></div><label class="timer-toggle"><input id="v103TimerEnabled" type="checkbox" ${V3?.settings?.timerEnabled?'checked':''}><span>Descansos automáticos</span></label></div><div class="v103-session-kpis"><div><b id="v103LiveTime">${session?fmtElapsed(v103SessionSeconds()):'0:00'}</b><span>tiempo total</span></div><div><b>${base.done}/${base.total}</b><span>series base</span></div><div><b>+${extra.done}/${extra.total}</b><span>series extra</span></div></div><div class="v103-session-actions">${session?'<button id="v103Finish" class="primary-btn">Finalizar entrenamiento</button>':'<button id="v103Start" class="primary-btn">▶ Iniciar entrenamiento</button>'}<button id="v103AddExercise" class="secondary-btn">+ Añadir ejercicio</button><button id="v103Finisher" class="secondary-btn">✨ ¿Con qué termino?</button></div><p class="note">El cronómetro total es independiente del temporizador de descansos y continúa al cambiar de pestaña o reabrir la app.</p></div>`;
  trainingSection.before(panel);
  const extras=v103Extras();if(extras.length){trainingSection.insertAdjacentHTML('beforeend',`<div class="v103-extra-heading"><strong>Ejercicios extra de hoy</strong><span>${extras.length}</span></div>${extras.map(v103ExtraCard).join('')}`);v103BindExtraEvents();}
  el('v103Start')?.addEventListener('click',startWorkoutSession);el('v103Finish')?.addEventListener('click',finishWorkoutSession);el('v103AddExercise')?.addEventListener('click',()=>v103OpenExercisePicker({day:v103Day(),mode:'today'}));el('v103Finisher')?.addEventListener('click',()=>v103OpenFinisher(0));el('v103TimerEnabled')?.addEventListener('change',e=>{V3.settings.timerEnabled=e.target.checked;saveV3Settings();});
};

setInterval(()=>{const node=el('v103LiveTime');if(node&&V3?.session?.date===isoDate())node.textContent=fmtElapsed(v103SessionSeconds());},1000);

// ---------- Entreno: añadir ejercicios sin esperar al día ----------
const v103PreviousRenderTraining=window.renderTraining;
window.renderTraining=function(){
  v103PreviousRenderTraining();
  const content=el('content');
  content.insertAdjacentHTML('afterbegin',`<section class="section"><div class="card v103-plan-add"><div><strong>Añadir ejercicio al plan</strong><p class="note">Puedes preparar cualquier día sin esperar a que llegue. Se permiten ejercicios repetidos.</p></div><div class="v103-plan-controls"><select id="v103PlanDay" class="input">${['lunes','martes','miércoles','jueves','viernes','sábado','domingo'].map(d=>`<option value="${d}">${d[0].toUpperCase()+d.slice(1)}</option>`).join('')}</select><button id="v103PlanAdd" class="secondary-btn">+ Añadir</button></div></div></section>`);
  el('v103PlanAdd').onclick=()=>v103OpenExercisePicker({day:el('v103PlanDay').value,mode:'plan'});
};

// Editor mensual V9: conservar la opción Unilateral.
const v103OldExerciseRow=window.exerciseRow;
if(typeof v103OldExerciseRow==='function'){
  window.exerciseRow=function(day,i,x){return `<div class="v9-ex-grid v103-v9-ex" data-v9-exrow="${day}|${i}"><input class="input" data-f="name" value="${v103Esc(x[0])}" placeholder="Ejercicio"><input class="input" data-f="sets" value="${v103Esc(x[1])}" placeholder="Series"><input class="input" data-f="reps" value="${v103Esc(x[2])}" placeholder="Reps"><input class="input" data-f="rest" value="${v103Esc(x[3])}" placeholder="Descanso"><input class="input" data-f="rir" value="${v103Esc(x[4])}" placeholder="RIR"><label class="v103-v9-unilateral"><input type="checkbox" data-f="unilateral" ${x[5]?.unilateral?'checked':''}> Unilateral</label><button class="secondary-btn v9-danger" data-v9-delex="${day}|${i}">Eliminar</button></div>`;};
  window.readTraining=function(p){Object.keys(p.training).forEach(day=>{p.training[day].name=document.querySelector(`[data-v9-tname="${day}"]`)?.value.trim()||p.training[day].name;p.training[day].focus=document.querySelector(`[data-v9-tfocus="${day}"]`)?.value.trim()||'';const rows=[...document.querySelectorAll(`[data-v9-exrow^="${day}|"]`)];p.training[day].exercises=rows.map(r=>[r.querySelector('[data-f=name]').value.trim(),+r.querySelector('[data-f=sets]').value||0,r.querySelector('[data-f=reps]').value.trim(),+r.querySelector('[data-f=rest]').value||0,r.querySelector('[data-f=rir]').value.trim(),{unilateral:!!r.querySelector('[data-f=unilateral]')?.checked}]).filter(x=>x[0]);});};
}

// ---------- Historial avanzado ----------
const v103PreviousRenderHistory=window.renderHistory;
window.renderHistory=function(){
  v103PreviousRenderHistory();
  const hist=load('workoutHistory',[]).slice().reverse().slice(0,20);if(!hist.length)return;
  const sec=document.createElement('section');sec.className='section v103-history';sec.innerHTML=`<div class="section-title"><h2>Detalle de rendimiento</h2><span>RIR por serie</span></div>${hist.map(h=>`<details class="history-item history-details"><summary><strong>${v103Esc(h.date)} · ${v103Esc(h.name)}</strong><span>${h.completedSets||0}/${h.totalSets||0} series${h.elapsed?` · ${fmtElapsed(h.elapsed)}`:''}</span></summary>${(h.details||[]).map(ex=>`<div class="history-ex"><strong>${v103Esc(ex.name)}${ex.extra?' · EXTRA':''}${ex.completed?' ✓':''}</strong><div>${(ex.sets||[]).map((s,i)=>{if(ex.unilateral&&(s.left||s.right)){const l=s.left||{},r=s.right||{};return `S${i+1}: I ${l.kg||'—'}×${l.reps||'—'} RIR ${l.rir||'—'} · D ${r.kg||'—'}×${r.reps||'—'} RIR ${r.rir||'—'}${s.done?' ✓':''}`;}return `S${i+1}: ${s.kg||'—'} kg × ${s.reps||'—'} · RIR ${s.rir||'—'}${s.done?' ✓':''}`;}).join('<br>')}</div></div>`).join('')}</details>`).join('')}`;el('content').prepend(sec);
};

window.JC_TRAINING_VERSION=V103_VERSION;
render();
})();
