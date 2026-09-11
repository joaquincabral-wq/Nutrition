// JC Training V7 — planificación semanal editable desde Entreno y Comidas.
// Se carga después de V6. No altera el plan base ni el historial ya registrado.

const V7_DAY_INDEX = {domingo:0,lunes:1,martes:2,'miércoles':3,jueves:4,viernes:5,'sábado':6};

function v7DateLabel(dateStr){
  const d=new Date(dateStr+'T12:00:00');
  return d.toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit'});
}
function v7NextDateForDay(day){
  const now=new Date();
  const target=V7_DAY_INDEX[day];
  let delta=(target-now.getDay()+7)%7;
  const d=new Date(now); d.setDate(now.getDate()+delta);
  return isoDate(d);
}
function v7OrderFor(day,date){
  const specific=load(v5TodayKey(date),null);
  if(v5ValidOrder(specific,day)) return specific;
  const habit=load(v5HabitKey(day),null);
  if(v5ValidOrder(habit,day)) return habit;
  return v5BaseOrder(day);
}
function v7SetOrderFor(day,date,order){ if(v5ValidOrder(order,day)) save(v5TodayKey(date),order); }
function v7MoveOrder(day,date,from,to){
  const order=v7OrderFor(day,date); if(to<0||to>=order.length)return;
  const next=order.slice(); const [item]=next.splice(from,1); next.splice(to,0,item);
  v7SetOrderFor(day,date,next); renderTraining();
}
function v7SaveHabit(day,date){
  const order=v7OrderFor(day,date); save(v5HabitKey(day),order); save(v5TodayKey(date),order); renderTraining();
}
function v7RestoreHabit(day,date){ localStorage.removeItem(v5TodayKey(date)); renderTraining(); }
function v7RestoreOriginal(day,date){ localStorage.removeItem(v5TodayKey(date)); localStorage.removeItem(v5HabitKey(day)); renderTraining(); }

function v7TrainingDay(day){
  const plan=TRAINING[day], date=v7NextDateForDay(day), order=v7OrderFor(day,date), custom=order.some((v,i)=>v!==i);
  const rows=order.map((orig,pos)=>{const x=plan.exercises[orig];return `<div class="card compact v7-plan-row"><div class="v7-plan-main"><span class="v7-order-num">${pos+1}</span><div><strong>${x[0]}</strong><span>${x[1]} × ${x[2]} · descanso ${x[3]||'—'} s · ${x[4]}</span></div></div><div class="v7-plan-actions"><button class="secondary-btn" data-v7-up="${day}|${date}|${pos}" ${pos===0?'disabled':''}>↑</button><button class="secondary-btn" data-v7-down="${day}|${date}|${pos}" ${pos===order.length-1?'disabled':''}>↓</button></div></div>`}).join('');
  return `<section class="section v7-day-section"><div class="section-title"><div><h2>${day.toUpperCase()} · ${plan.name}</h2><small class="v7-next">Próxima sesión: ${v7DateLabel(date)} · ${custom?'orden personalizado':'orden base/habitual'}</small></div><span>${plan.focus}</span></div>
    ${plan.exercises.length?`<div class="card v7-toolbar"><p>Prepara el orden antes de llegar al gimnasio. Los cambios de “próxima sesión” solo afectan a ${v7DateLabel(date)}.</p><div class="order-toolbar"><button class="secondary-btn" data-v7-habit="${day}|${date}">Guardar como habitual</button><button class="secondary-btn" data-v7-restore-habit="${day}|${date}">Usar habitual</button><button class="secondary-btn" data-v7-original="${day}|${date}">Restaurar original</button></div></div>${rows}`:'<div class="card compact"><span class="note">Descanso.</span></div>'}
  </section>`;
}

renderTraining=function(){
  el('content').innerHTML=`<section class="section"><div class="card v7-info"><strong>Planificador semanal</strong><p>Puedes reordenar cualquier día con antelación. El historial de sesiones anteriores no se modifica.</p></div></section>${Object.keys(TRAINING).map(v7TrainingDay).join('')}`;
  document.querySelectorAll('[data-v7-up]').forEach(b=>b.onclick=()=>{const [day,date,pos]=b.dataset.v7Up.split('|');v7MoveOrder(day,date,+pos,+pos-1);});
  document.querySelectorAll('[data-v7-down]').forEach(b=>b.onclick=()=>{const [day,date,pos]=b.dataset.v7Down.split('|');v7MoveOrder(day,date,+pos,+pos+1);});
  document.querySelectorAll('[data-v7-habit]').forEach(b=>b.onclick=()=>{const [day,date]=b.dataset.v7Habit.split('|');v7SaveHabit(day,date);});
  document.querySelectorAll('[data-v7-restore-habit]').forEach(b=>b.onclick=()=>{const [day,date]=b.dataset.v7RestoreHabit.split('|');v7RestoreHabit(day,date);});
  document.querySelectorAll('[data-v7-original]').forEach(b=>b.onclick=()=>{const [day,date]=b.dataset.v7Original.split('|');v7RestoreOriginal(day,date);});
};

function v7ResetMealDate(date){
  localStorage.removeItem(v6OmitKey(date));
  localStorage.removeItem(v6RedisKey(date));
  localStorage.removeItem(`mealSubs:${date}`);
  renderMeals();
}
function v7RestoreMealItem(date,mi,fi){ v6SetOmitted(date,mi,fi,false); renderMeals(); }

function v7OpenOmit(day,date,mi,fi){
  const orig=MEALS[day][mi][1][fi], text=v6CurrentText(date,mi,fi,orig), mac=v6Macros(text), proposal=v6FindRedistribution(day,date,mi,fi,text), sheet=el('swapSheet'), sourceId=`${mi}:${fi}`;
  let proposalHtml='<div class="v6-no-proposal">No encuentro una redistribución automática razonable en las comidas posteriores de ese día.</div>';
  if(proposal){
    const targetOrig=MEALS[day][proposal.mi][1][proposal.fi], targetText=v6CurrentText(date,proposal.mi,proposal.fi,targetOrig), def=v6FoodDef(targetText), q=v6Qty(targetText,def), newQ=v6Round((q||0)+proposal.delta,0);
    proposalHtml=`<div class="v6-proposal"><span>Propuesta</span><strong>${MEALS[day][proposal.mi][0]}: ${def?.label||targetText}</strong><p>${v6Fmt(q||0)} → <b>${v6Fmt(newQ)} g</b> (+${v6Fmt(proposal.delta)} g)</p><small>Compensa aproximadamente el macro principal del alimento omitido.</small></div><button id="v7OmitRedis" class="primary-btn" style="width:100%;margin-top:10px">Omitir y redistribuir</button>`;
    setTimeout(()=>{const b=el('v7OmitRedis');if(b)b.onclick=()=>{v6SetOmitted(date,mi,fi,true);v6SetRedis(date,sourceId,{targetMi:proposal.mi,targetFi:proposal.fi,delta:v6Round(proposal.delta,1),source:text});sheet.classList.add('hidden');renderMeals();};},0);
  }
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">PLANIFICAR ${day.toUpperCase()} · ${v7DateLabel(date)}</div><h3>Omitir ${text}</h3></div><button class="swap-close" id="v7OmitClose">Cerrar</button></div><div class="v6-omit-macros">≈ ${v6Fmt(mac.kcal)} kcal · P ${v6Fmt(mac.p)} g · HC ${v6Fmt(mac.c)} g · G ${v6Fmt(mac.f)} g</div><button id="v7OmitNoComp" class="secondary-btn" style="width:100%;margin-top:12px">Omitir sin compensar</button>${proposalHtml}<p class="swap-note">El cambio solo afecta a la próxima fecha indicada. El plan base permanece intacto.</p>`;
  sheet.classList.remove('hidden'); el('v7OmitClose').onclick=()=>sheet.classList.add('hidden');
  el('v7OmitNoComp').onclick=()=>{v6SetOmitted(date,mi,fi,true);v6SetRedis(date,sourceId,null);sheet.classList.add('hidden');renderMeals();};
}

function v7MealCard(day,date,m,mi){
  return `<div class="card v7-meal-card"><div class="meal-title"><strong>${m[0]}</strong><span class="v7-date-pill">${v7DateLabel(date)}</span></div><div class="food-list">${m[1].map((orig,fi)=>{
    const omitted=v6Omitted(date,mi,fi), current=v6CurrentText(date,mi,fi,orig), mac=v6ItemMacros(date,mi,fi,orig), sub=getMealSub(date,mi,fi), extra=v6ExtraFor(date,mi,fi), supported=identifyFood(orig)&&parseAmount(orig);
    return `<div class="food-row v6-food ${omitted?'v6-omitted':''}"><div class="food-text ${sub?'subbed':''}">${omitted?`<s>${current}</s><span class="original-food">Omitido para ${v7DateLabel(date)}</span>`:`${current}${sub?`<span class="original-food">Original: ${orig}</span>`:''}${extra?`<span class="v6-adjust">Ajustado +${v6Fmt(extra)} g por redistribución</span>`:''}<span class="v6-food-macro">≈ ${v6Fmt(mac.kcal)} kcal · P ${v6Fmt(mac.p)} · HC ${v6Fmt(mac.c)} · G ${v6Fmt(mac.f)}</span>`}</div><div class="v6-food-actions">${omitted?`<button class="food-swap-btn" data-v7-food-restore="${day}|${date}|${mi}|${fi}">Restaurar</button>`:`${supported?`<button class="food-swap-btn" data-v7-food-swap="${day}|${date}|${mi}|${fi}">Cambiar</button>`:''}<button class="food-omit-btn" data-v7-food-omit="${day}|${date}|${mi}|${fi}">Omitir</button>`}</div></div>`;
  }).join('')}</div></div>`;
}

function v7MealDay(day){
  const date=v7NextDateForDay(day), base=v6PlanTotals(day), current=v6PlanTotals(day,date,true), dist=v6MacroPct(current), changed=Math.abs(base.kcal-current.kcal)>.5 || Object.keys(load(v6OmitKey(date),{})).length || Object.keys(load(`mealSubs:${date}`,{})).length;
  return `<section class="section v7-day-section"><div class="section-title"><div><h2>${day.toUpperCase()}</h2><small class="v7-next">Plan para ${v7DateLabel(date)}${changed?' · modificado':''}</small></div><span>${TRAINING[day].name}</span></div><div class="card v6-day-summary v7-summary"><strong>≈ ${v6Fmt(current.kcal)} kcal</strong><span>P ${v6Fmt(current.p)} g · HC ${v6Fmt(current.c)} g · G ${v6Fmt(current.f)} g</span><small>Distribución: P ${v6Fmt(dist.p)}% · HC ${v6Fmt(dist.c)}% · G ${v6Fmt(dist.f)}%</small>${changed?`<button class="secondary-btn v7-reset-day" data-v7-meal-reset="${date}">Restaurar plan base de este día</button>`:''}</div>${MEALS[day].map((m,mi)=>v7MealCard(day,date,m,mi)).join('')}</section>`;
}

renderMeals=function(){
  el('content').innerHTML=`<section class="section"><div class="card v7-info"><strong>Planificador de comidas</strong><p>Puedes cambiar u omitir alimentos de cualquier día antes de que llegue. Los cambios se guardan para la próxima fecha de ese día y no alteran el plan base.</p></div></section>${Object.keys(MEALS).map(v7MealDay).join('')}`;
  document.querySelectorAll('[data-v7-food-swap]').forEach(b=>b.onclick=()=>{const [day,date,mi,fi]=b.dataset.v7FoodSwap.split('|');showFoodSwap(MEALS[day][+mi][1][+fi],+mi,+fi,date,true);});
  document.querySelectorAll('[data-v7-food-omit]').forEach(b=>b.onclick=()=>{const [day,date,mi,fi]=b.dataset.v7FoodOmit.split('|');v7OpenOmit(day,date,+mi,+fi);});
  document.querySelectorAll('[data-v7-food-restore]').forEach(b=>b.onclick=()=>{const [day,date,mi,fi]=b.dataset.v7FoodRestore.split('|');v7RestoreMealItem(date,+mi,+fi);});
  document.querySelectorAll('[data-v7-meal-reset]').forEach(b=>b.onclick=()=>v7ResetMealDate(b.dataset.v7MealReset));
};

// Amplía el backup para incluir planificación futura y órdenes semanales.
const V7_PREV_EXPORT = exportData;
exportData=function(){
  const payload={metrics:load(metricsKey(),[]),workoutHistory:load('workoutHistory',[]),storage:{}};
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i);
    if(k.startsWith('workout:')||k.startsWith('meals:')||k.startsWith('mealSubs:')||k.startsWith('v6MealOmit:')||k.startsWith('v6MealRedis:')||k.startsWith('exerciseOrder:')||k==='v3Settings'||k==='activeSession'||k.startsWith('sessionSummary:')) payload.storage[k]=load(k,{});
  }
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`jc-training-backup-${isoDate()}.json`;a.click();URL.revokeObjectURL(a.href);
};

render();
