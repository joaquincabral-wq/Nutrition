// JC Training V3 enhancements - loaded after app.js
const V3 = {
  settings: load('v3Settings',{timerEnabled:true}),
  session: load('activeSession',null)
};
function saveV3Settings(){ save('v3Settings',V3.settings); }
function activePlan(){ return TRAINING[dayKey()]; }
function sessionElapsed(){ if(!V3.session?.startedAt) return 0; return Math.max(0,Math.floor((Date.now()-V3.session.startedAt)/1000)); }
function fmtElapsed(sec){ const m=Math.floor(sec/60),s=sec%60; return `${m}:${String(s).padStart(2,'0')}`; }
function startWorkoutSession(){
  if(!activePlan().exercises.length) return;
  V3.session={date:isoDate(),name:activePlan().name,startedAt:Date.now(),completed:false};
  save('activeSession',V3.session); render();
}
function finishWorkoutSession(){
  persistWorkoutInput(); finalizeHistory();
  const data=load(workoutKey(),{}), plan=activePlan();
  const total=plan.exercises.reduce((a,x)=>a+x[1],0);
  const done=Object.values(data).reduce((a,ex)=>a+(ex.sets||[]).filter(s=>s.done).length,0);
  const elapsed=sessionElapsed();
  const summaries=plan.exercises.map((x,i)=>({name:x[0],sets:(data[i]?.sets||[]),rir:data[i]?.rir??''}));
  save(`sessionSummary:${isoDate()}`,{date:isoDate(),name:plan.name,elapsed,total,done,summaries});
  V3.session=null; localStorage.removeItem('activeSession');
  alert(`Entrenamiento guardado\n${done}/${total} series · ${fmtElapsed(elapsed)}`); render();
}
function progressionBadge(prev,target){
  if(!prev) return {label:'CALIBRAR',cls:'neutral'};
  const sets=(prev.data.sets||[]).filter(s=>s.kg||s.reps); if(!sets.length) return {label:'CALIBRAR',cls:'neutral'};
  const complete=sets.length>0 && sets.every(s=>(+s.reps||0)>=target);
  const rir=Number(prev.data.rir);
  if(complete && (rir===1||rir===2)) return {label:'↑ SUBIR',cls:'up'};
  if(complete) return {label:'= MANTENER',cls:'hold'};
  return {label:'= MANTENER',cls:'hold'};
}
function exerciseVisual(name, muscles){
  return `<div class="exercise-visual" aria-label="Esquema de ${name}">
    <svg viewBox="0 0 360 120" role="img"><rect x="1" y="1" width="358" height="118" rx="18" class="visual-bg"/>
    <circle cx="58" cy="33" r="13" class="body-line"/><path d="M58 46 L58 80 M58 57 L35 72 M58 57 L83 70 M58 80 L42 105 M58 80 L76 105" class="body-line"/>
    <path d="M112 60 H158 M145 47 L158 60 L145 73" class="motion-line"/>
    <text x="178" y="48" class="visual-title">${name}</text><text x="178" y="73" class="visual-sub">${muscles||'Técnica y control'}</text><text x="178" y="94" class="visual-note">Esquema orientativo · consulta las claves técnicas</text>
    </svg></div>`;
}
const baseExerciseCard=exerciseCard;
exerciseCard=function(x,i,date){
  const [name,sets,reps,rest,rir]=x, data=load(workoutKey(date),{});
  const ex=data[i]||{sets:Array.from({length:sets},()=>({kg:'',reps:'',done:false})),rir:''};
  const prev=getPreviousExercise(dayKey(new Date(date+'T12:00:00')),i), info=EXERCISE_INFO[name];
  const badge=progressionBadge(prev,reps);
  const prevText=prev?`<div class="previous-box"><div class="previous-head"><strong>Última sesión · ${prev.date}</strong><span class="progress-badge ${badge.cls}">${badge.label}</span></div><div>${(prev.data.sets||[]).map((s,j)=>`S${j+1}: ${s.kg||'—'} kg × ${s.reps||'—'}`).join(' · ')}${prev.data.rir!==''?` · RIR ${prev.data.rir}`:''}</div><span>${progressionHint(prev,reps)}</span></div>`:`<div class="previous-box muted-box"><span class="progress-badge neutral">CALIBRAR</span> Primera referencia: elige una carga que permita ${reps} reps con RIR 1–2.</div>`;
  const rows=ex.sets.map((s,si)=>`<div class="set-row"><div class="set-label">S${si+1}<small>OBJ ${reps}</small></div><input class="input set-kg" data-ex="${i}" data-set="${si}" inputmode="decimal" placeholder="kg" value="${s.kg}"><input class="input set-reps" data-ex="${i}" data-set="${si}" inputmode="numeric" placeholder="${reps} reps" value="${s.reps}"><button class="check-btn ${s.done?'done':''}" data-check="${i}:${si}" data-rest="${rest}" data-name="${name}">${s.done?'✓':'○'}</button></div>`).join('');
  const how=info?`<details class="howto"><summary>Técnica · músculos · claves</summary><div class="howto-body">${exerciseVisual(name,info.muscles)}<strong>${info.muscles}</strong><ul>${info.cues.map(c=>`<li>${c}</li>`).join('')}</ul></div></details>`:'';
  return `<div class="card exercise-card"><div class="exercise-head"><div><div class="exercise-name">${name}</div><div class="exercise-meta">${sets} × ${reps} · descanso ${rest||'—'} s</div></div><span class="badge">${rir}</span></div>${prevText}<div class="sets">${rows}</div>${how}<div class="exercise-footer"><label><span class="small-label">RIR final</span><select class="input ex-rir" data-ex="${i}"><option value="">—</option>${[0,1,2,3,4].map(v=>`<option ${String(ex.rir)===String(v)?'selected':''}>${v}</option>`).join('')}</select></label><button class="secondary-btn save-ex" data-ex="${i}">Guardar ejercicio</button></div></div>`;
};
const baseToggleSet=toggleSet;
toggleSet=function(e){
  persistWorkoutInput(); const [ei,si]=e.currentTarget.dataset.check.split(':').map(Number);
  const data=load(workoutKey(),{}); data[ei].sets[si].done=!data[ei].sets[si].done; save(workoutKey(),data);
  if(data[ei].sets[si].done && V3.settings.timerEnabled && +e.currentTarget.dataset.rest>0) startTimer(+e.currentTarget.dataset.rest,e.currentTarget.dataset.name);
  finalizeHistory(); renderToday();
};
const baseRenderToday=renderToday;
renderToday=function(){
  baseRenderToday(); const content=el('content'), first=content.querySelector('.section'); if(!first) return;
  const plan=activePlan(), session=V3.session && V3.session.date===isoDate()?V3.session:null;
  const controls=document.createElement('section'); controls.className='section';
  controls.innerHTML=`<div class="card session-panel"><div class="session-top"><div><div class="eyebrow">MODO ENTRENAMIENTO</div><strong>${session?'Sesión en curso':'Listo para entrenar'}</strong></div><label class="timer-toggle"><input id="timerEnabled" type="checkbox" ${V3.settings.timerEnabled?'checked':''}><span>Descansos automáticos</span></label></div>${plan.exercises.length?`<div class="session-actions">${session?`<div class="live-time" id="liveSessionTime">${fmtElapsed(sessionElapsed())}</div><button id="finishWorkout" class="primary-btn">Finalizar entrenamiento</button>`:`<button id="startWorkout" class="primary-btn wide">Empezar entrenamiento</button>`}</div>`:''}<p class="note">El temporizador es opcional. Si lo desactivas, los descansos siguen visibles como referencia.</p></div>`;
  first.after(controls);
  const tog=el('timerEnabled'); if(tog) tog.onchange=()=>{V3.settings.timerEnabled=tog.checked;saveV3Settings();};
  if(el('startWorkout')) el('startWorkout').onclick=startWorkoutSession;
  if(el('finishWorkout')) el('finishWorkout').onclick=finishWorkoutSession;
};
const baseRenderHistory=renderHistory;
renderHistory=function(){
  baseRenderHistory(); const summary=load(`sessionSummary:${isoDate()}`,null); if(!summary) return;
  const section=document.createElement('section'); section.className='section'; section.innerHTML=`<div class="section-title"><h2>Último resumen</h2><span>V3</span></div><div class="card summary-card"><strong>${summary.name}</strong><div class="summary-grid"><div><b>${summary.done}/${summary.total}</b><span>series</span></div><div><b>${fmtElapsed(summary.elapsed)}</b><span>duración</span></div></div></div>`; el('content').prepend(section);
};
setInterval(()=>{ if(V3.session && el('liveSessionTime')) el('liveSessionTime').textContent=fmtElapsed(sessionElapsed()); },1000);
render();
