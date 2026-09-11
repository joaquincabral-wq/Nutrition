// JC Training V5: reordenación flexible de ejercicios por sesión.
// Mantiene intactos ejercicios, series, reps, descansos y datos históricos.

const JC_V5_BASE_RENDER_TODAY = renderToday;
const JC_V5_BASE_FINALIZE_HISTORY = finalizeHistory;

function v5DayId(date=new Date()){ return dayKey(date); }
function v5BaseOrder(day){
  const p=TRAINING[day];
  return p ? p.exercises.map((_,i)=>i) : [];
}
function v5ValidOrder(order, day){
  const base=v5BaseOrder(day);
  if(!Array.isArray(order) || order.length!==base.length) return false;
  return [...order].sort((a,b)=>a-b).every((v,i)=>v===base[i]);
}
function v5HabitKey(day){ return `exerciseOrder:habit:${day}`; }
function v5TodayKey(date=isoDate()){ return `exerciseOrder:today:${date}`; }
function v5Order(day=v5DayId(), date=isoDate()){
  const today=load(v5TodayKey(date),null);
  if(v5ValidOrder(today,day)) return today;
  const habit=load(v5HabitKey(day),null);
  if(v5ValidOrder(habit,day)) return habit;
  return v5BaseOrder(day);
}
function v5SetTodayOrder(order,date=isoDate()){ save(v5TodayKey(date),order); }
function v5Move(day,fromPos,toPos){
  const order=v5Order(day);
  if(toPos<0 || toPos>=order.length) return;
  const next=order.slice(); const [item]=next.splice(fromPos,1); next.splice(toPos,0,item);
  v5SetTodayOrder(next); renderToday();
}
function v5SaveHabit(day){
  const order=v5Order(day); save(v5HabitKey(day),order); save(v5TodayKey(),order);
  renderToday();
}
function v5RestoreBase(day){
  localStorage.removeItem(v5TodayKey());
  localStorage.removeItem(v5HabitKey(day));
  renderToday();
}
function v5RestoreHabit(day){
  localStorage.removeItem(v5TodayKey());
  renderToday();
}

function v5ReorderPanel(plan,day){
  const order=v5Order(day);
  return `<section class="section"><div class="section-title"><h2>Orden de hoy</h2><span>${plan.exercises.length} ejercicios</span></div>
    <div class="card"><div class="order-badge">↕ Orden flexible</div><p class="order-note">Mueve un ejercicio si una máquina está ocupada o te conviene cambiar de zona. No cambian series, repeticiones, RIR ni descansos.</p>
      <div class="order-toolbar"><button id="v5DoneOrder" class="primary-btn">Terminar</button><button id="v5SaveHabit" class="secondary-btn">Guardar habitual</button><button id="v5RestoreBase" class="secondary-btn">Restaurar original</button></div>
    </div>
    ${order.map((orig,pos)=>{ const x=plan.exercises[orig]; return `<div class="card compact reorder-card"><div class="reorder-head"><span class="drag-grip">≡</span><div class="reorder-main"><strong>${pos+1}. ${x[0]}</strong><span>${x[1]} × ${x[2]} · descanso ${x[3]||'—'} s · ${x[4]}</span></div><div class="reorder-actions"><button class="secondary-btn" data-v5-up="${pos}" ${pos===0?'disabled':''}>↑</button><button class="secondary-btn" data-v5-down="${pos}" ${pos===order.length-1?'disabled':''}>↓</button></div></div></div>`; }).join('')}
  </section>`;
}

function v5BindReorder(day){
  document.querySelectorAll('[data-v5-up]').forEach(b=>b.onclick=()=>v5Move(day,+b.dataset.v5Up,+b.dataset.v5Up-1));
  document.querySelectorAll('[data-v5-down]').forEach(b=>b.onclick=()=>v5Move(day,+b.dataset.v5Down,+b.dataset.v5Down+1));
  const done=el('v5DoneOrder'); if(done) done.onclick=()=>{ save('v5ReorderMode',false); renderToday(); };
  const habit=el('v5SaveHabit'); if(habit) habit.onclick=()=>{ v5SaveHabit(day); save('v5ReorderMode',false); renderToday(); };
  const restore=el('v5RestoreBase'); if(restore) restore.onclick=()=>{ v5RestoreBase(day); };
}

renderToday=function(){
  const d=new Date(), day=dayKey(d), plan=TRAINING[day], content=el('content');
  const reorderMode=load('v5ReorderMode',false);
  if(!plan || !plan.exercises.length){ return JC_V5_BASE_RENDER_TODAY(); }
  if(reorderMode){ content.innerHTML=v5ReorderPanel(plan,day); v5BindReorder(day); return; }

  const doneMeals=load(mealsKey(),{}), order=v5Order(day);
  const isCustom=order.some((v,i)=>v!==i);
  content.innerHTML=`
    <section class="section"><div class="card hero"><div class="eyebrow">${fmtDate(d).toUpperCase()}</div><h2>${plan.name}</h2><p>${plan.focus}</p><div class="stat-row"><div class="stat"><strong>${plan.exercises.reduce((a,x)=>a+x[1],0)}</strong><span>series</span></div><div class="stat"><strong>${estimateMinutes(plan)}</strong><span>min aprox.</span></div><div class="stat"><strong>1–2</strong><span>RIR objetivo</span></div></div></div></section>
    ${typeof workoutModeBar==='function'?workoutModeBar(plan):''}
    <section class="section"><div class="section-title"><h2>Entrenamiento</h2><span>${isCustom?'orden personalizado':'orden base'}</span></div><div class="order-toolbar"><button id="v5Reorder" class="secondary-btn">↕ Reordenar ejercicios</button>${isCustom?'<button id="v5RestoreHabit" class="secondary-btn">Restaurar habitual</button>':''}</div>
      ${order.map(orig=>exerciseCard(plan.exercises[orig],orig,isoDate())).join('')}
    </section>
    <section class="section"><div class="section-title"><h2>Comidas</h2><span>sin media mañana</span></div>${(MEALS[day]||[]).map((m,i)=>mealCard(m,i,doneMeals)).join('')}</section>`;
  bindExerciseEvents(); bindMealEvents();
  if(typeof bindV3WorkoutMode==='function') bindV3WorkoutMode();
  const rb=el('v5Reorder'); if(rb) rb.onclick=()=>{ persistWorkoutInput(); save('v5ReorderMode',true); renderToday(); };
  const rh=el('v5RestoreHabit'); if(rh) rh.onclick=()=>v5RestoreHabit(day);
  // Reengancha mejoras de V4/V4.1 si existen.
  if(typeof bindV4Events==='function') bindV4Events();
};

// Historial: guarda el orden REAL realizado, sin alterar la identidad de los ejercicios.
finalizeHistory=function(){
  const day=dayKey(), plan=TRAINING[day], data=load(workoutKey(),{}), order=v5Order(day);
  const totalSets=plan.exercises.reduce((a,x)=>a+x[1],0);
  const completedSets=Object.values(data).reduce((a,ex)=>a+(ex.sets||[]).filter(s=>s.done).length,0);
  const hist=load('workoutHistory',[]).filter(h=>h.date!==isoDate());
  hist.push({date:isoDate(),name:plan.name,totalSets,completedSets,exerciseOrder:order.slice(),details:order.map(i=>({name:plan.exercises[i][0],target:plan.exercises[i][2],sets:(data[i]?.sets||[]),rir:data[i]?.rir??'',originalIndex:i}))});
  save('workoutHistory',hist);
};

render();
