// JC Training V6 — nutrición flexible, macros y redistribución.
// Se carga después de V5 y conserva entrenamiento, orden, historial y temporizadores.

const V6_NUTRITION = [
  {key:'egg',patterns:['huevo','huevos'],mode:'unit',kcal:72,p:6.3,c:0.4,f:4.8,label:'Huevo'},
  {key:'eggwhite',patterns:['claras','clara'],mode:'100ml',kcal:43,p:10.5,c:0.7,f:0.2,label:'Claras'},
  {key:'oats',patterns:['avena'],mode:'100g',kcal:370,p:13,c:60,f:7,label:'Avena'},
  {key:'whey',patterns:['whey','proteina','proteína'],mode:'100g',kcal:380,p:78,c:8,f:6,label:'Whey'},
  {key:'peanutpowder',patterns:['cacahuete en polvo'],mode:'100g',kcal:370,p:45,c:30,f:11,label:'Cacahuete en polvo'},
  {key:'almondmilk',patterns:['bebida de almendras','bebida almendras'],mode:'100ml',kcal:13,p:0.4,c:0.3,f:1.1,label:'Bebida de almendras'},
  {key:'rice',patterns:['arroz'],mode:'100g',kcal:360,p:7,c:79,f:0.8,label:'Arroz',group:'carb'},
  {key:'pasta',patterns:['pasta'],mode:'100g',kcal:350,p:12,c:72,f:1.5,label:'Pasta',group:'carb'},
  {key:'potato',patterns:['patata'],mode:'100g',kcal:77,p:2,c:17,f:0.1,label:'Patata',group:'carb'},
  {key:'sweetpotato',patterns:['batata','boniato'],mode:'100g',kcal:86,p:1.6,c:20,f:0.1,label:'Batata',group:'carb'},
  {key:'couscous',patterns:['cuscus','cuscús'],mode:'100g',kcal:376,p:12.8,c:77,f:0.6,label:'Cuscús',group:'carb'},
  {key:'chicken',patterns:['pollo'],mode:'100g',kcal:110,p:23,c:0,f:1.5,label:'Pollo',group:'protein'},
  {key:'turkey',patterns:['pavo'],mode:'100g',kcal:110,p:23,c:0,f:1.5,label:'Pavo',group:'protein'},
  {key:'beef',patterns:['ternera magra','carne magra','ternera'],mode:'100g',kcal:150,p:21,c:0,f:7,label:'Ternera magra',group:'protein'},
  {key:'hake',patterns:['merluza'],mode:'100g',kcal:86,p:18,c:0,f:1.5,label:'Merluza',group:'protein'},
  {key:'cod',patterns:['bacalao'],mode:'100g',kcal:82,p:18,c:0,f:0.7,label:'Bacalao',group:'protein'},
  {key:'seabream',patterns:['dorada'],mode:'100g',kcal:120,p:19,c:0,f:5,label:'Dorada',group:'protein'},
  {key:'whitefish',patterns:['pescado blanco','pescado'],mode:'100g',kcal:95,p:19,c:0,f:2,label:'Pescado blanco',group:'protein'},
  {key:'qfb',patterns:['queso fresco batido'],mode:'100g',kcal:46,p:8,c:3.5,f:0.5,label:'Queso fresco batido 0%',group:'protein'},
  {key:'skyr',patterns:['skyr'],mode:'100g',kcal:62,p:10.5,c:4,f:0.2,label:'Skyr',group:'protein'},
  {key:'cottage',patterns:['cottage'],mode:'100g',kcal:98,p:12,c:3,f:4,label:'Cottage',group:'protein'},
  {key:'kefir',patterns:['kefir','kéfir'],mode:'100g',kcal:64,p:3.6,c:4.7,f:3.5,label:'Kéfir',group:'protein'},
  {key:'oil',patterns:['aove','aceite'],mode:'100g',kcal:884,p:0,c:0,f:100,label:'AOVE',group:'fat'},
  {key:'pistachio',patterns:['pistacho','pistachos'],mode:'100g',kcal:560,p:20,c:28,f:45,label:'Pistachos',group:'fat'},
  {key:'walnut',patterns:['nuez','nueces'],mode:'100g',kcal:654,p:15,c:14,f:65,label:'Nueces',group:'fat'},
  {key:'avocado',patterns:['aguacate'],mode:'100g',kcal:160,p:2,c:8.5,f:14.7,label:'Aguacate',group:'fat'},
  {key:'blueberry',patterns:['arandano','arándano','arándanos','arandanos'],mode:'100g',kcal:57,p:0.7,c:14.5,f:0.3,label:'Arándanos',group:'fruit'},
  {key:'melon',patterns:['melon','melón'],mode:'100g',kcal:34,p:0.8,c:8.2,f:0.2,label:'Melón',group:'fruit'},
  {key:'peach',patterns:['melocoton','melocotón'],mode:'100g',kcal:39,p:0.9,c:9.5,f:0.3,label:'Melocotón',group:'fruit'},
  {key:'strawberry',patterns:['fresa','fresas'],mode:'100g',kcal:32,p:0.7,c:7.7,f:0.3,label:'Fresas',group:'fruit'},
  {key:'plum',patterns:['ciruela'],mode:'100g',kcal:46,p:0.7,c:11.4,f:0.3,label:'Ciruela',group:'fruit'},
  {key:'apple',patterns:['manzana'],mode:'100g',kcal:52,p:0.3,c:13.8,f:0.2,label:'Manzana',group:'fruit'},
  {key:'banana',patterns:['platano','plátano'],mode:'100g',kcal:89,p:1.1,c:22.8,f:0.3,label:'Plátano',group:'fruit'},
  {key:'fruit',patterns:['fruta'],mode:'100g',kcal:45,p:0.6,c:10.5,f:0.2,label:'Fruta',group:'fruit'},
  {key:'vegetables',patterns:['verduras','verdura'],mode:'100g',kcal:30,p:1.5,c:5,f:0.3,label:'Verduras'},
  {key:'salad',patterns:['ensalada'],mode:'100g',kcal:20,p:1,c:3,f:0.2,label:'Ensalada'}
];

function v6Norm(s){ return (typeof nrm==='function'?nrm(s):String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')); }
function v6FoodDef(text){ const t=v6Norm(text); return V6_NUTRITION.find(x=>x.patterns.some(p=>t.includes(v6Norm(p))))||null; }
function v6Qty(text, def){
  text=String(text||'');
  if(def?.mode==='unit'){
    const m=text.match(/([0-9]+(?:[.,][0-9]+)?)\s*(?:huevo|huevos|ud|uds|unidad|unidades)?/i);
    return m?+m[1].replace(',','.') : 1;
  }
  const m=text.match(/([0-9]+(?:[.,][0-9]+)?)\s*(g|ml)/i);
  return m?+m[1].replace(',','.') : null;
}
function v6Macros(text){
  const def=v6FoodDef(text), q=v6Qty(text,def); if(!def||q===null) return {kcal:0,p:0,c:0,f:0,known:false,def:null,qty:q};
  const mult=def.mode==='unit'?q:q/100;
  return {kcal:def.kcal*mult,p:def.p*mult,c:def.c*mult,f:def.f*mult,known:true,def,qty:q};
}
function v6Add(a,b){ return {kcal:a.kcal+b.kcal,p:a.p+b.p,c:a.c+b.c,f:a.f+b.f}; }
function v6Round(n,d=0){ const p=10**d; return Math.round(n*p)/p; }
function v6Fmt(n,d=0){ return v6Round(n,d).toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d}); }

function v6OmitKey(date=isoDate()){ return `v6MealOmit:${date}`; }
function v6RedisKey(date=isoDate()){ return `v6MealRedis:${date}`; }
function v6Omitted(date,mi,fi){ return !!load(v6OmitKey(date),{})[`${mi}:${fi}`]; }
function v6SetOmitted(date,mi,fi,value){ const k=v6OmitKey(date),d=load(k,{}),id=`${mi}:${fi}`; if(value)d[id]=true; else delete d[id]; save(k,d); if(!value){const r=load(v6RedisKey(date),{});delete r[id];save(v6RedisKey(date),r);} }
function v6Redistributions(date=isoDate()){ return load(v6RedisKey(date),{}); }
function v6SetRedis(date,sourceId,val){ const k=v6RedisKey(date),d=load(k,{}); if(val)d[sourceId]=val; else delete d[sourceId]; save(k,d); }
function v6ExtraFor(date,mi,fi){
  const r=v6Redistributions(date); let extra=0;
  Object.values(r).forEach(x=>{if(x&&x.targetMi===mi&&x.targetFi===fi) extra+=(+x.delta||0);});
  return extra;
}
function v6SubText(date,mi,fi,original){ const s=(typeof getMealSub==='function'?getMealSub(date,mi,fi):null); return s?.replacement||original; }
function v6CurrentText(date,mi,fi,original){
  let text=v6SubText(date,mi,fi,original); const extra=v6ExtraFor(date,mi,fi); if(!extra) return text;
  const def=v6FoodDef(text),q=v6Qty(text,def); if(!def||q===null||def.mode==='unit') return text;
  const unit=/\bml\b/i.test(text)?'ml':'g'; const total=v6Round(q+extra,0);
  return `${total} ${unit} ${def.label}${/crudo|seco/i.test(text)?' (en crudo)':''}`;
}
function v6ItemMacros(date,mi,fi,original){ if(v6Omitted(date,mi,fi)) return {kcal:0,p:0,c:0,f:0,known:true}; return v6Macros(v6CurrentText(date,mi,fi,original)); }
function v6PlanTotals(day,date=null,current=false){
  let total={kcal:0,p:0,c:0,f:0}; (MEALS[day]||[]).forEach((m,mi)=>m[1].forEach((f,fi)=>{ const x=current&&date?v6ItemMacros(date,mi,fi,f):v6Macros(f); total=v6Add(total,x); })); return total;
}
function v6ConsumedTotals(day,date=isoDate()){
  const done=load(`meals:${date}`,{}); let total={kcal:0,p:0,c:0,f:0};
  (MEALS[day]||[]).forEach((m,mi)=>{if(done[mi])m[1].forEach((f,fi)=>{total=v6Add(total,v6ItemMacros(date,mi,fi,f));});}); return total;
}
function v6MacroPct(t){ const kcalMacro=t.p*4+t.c*4+t.f*9||1; return {p:t.p*4/kcalMacro*100,c:t.c*4/kcalMacro*100,f:t.f*9/kcalMacro*100}; }
function v6Bar(label,value,target,unit){ const pct=target?Math.min(140,value/target*100):0; return `<div class="macro-row"><div class="macro-label"><span>${label}</span><strong>${v6Fmt(value,0)} / ${v6Fmt(target,0)} ${unit} · ${v6Fmt(target?value/target*100:0,0)}%</strong></div><div class="macro-track"><i style="width:${Math.min(100,pct)}%" class="${pct>110?'over':''}"></i></div></div>`; }
function v6MacroDashboard(day,date=isoDate(),interactive=true){
  const target=v6PlanTotals(day), current=v6PlanTotals(day,date,true), consumed=v6ConsumedTotals(day,date), dist=v6MacroPct(current);
  return `<section class="section v6-macros"><div class="section-title"><h2>Macros del día</h2><span>estimación</span></div><div class="card macro-card">
    <div class="macro-kcal"><div><span>Objetivo base</span><strong>${v6Fmt(target.kcal)} kcal</strong></div><div><span>Plan actual</span><strong>${v6Fmt(current.kcal)} kcal</strong></div><div><span>Consumido</span><strong>${v6Fmt(consumed.kcal)} kcal</strong></div></div>
    ${v6Bar('Proteína',consumed.p,target.p,'g')}${v6Bar('Hidratos',consumed.c,target.c,'g')}${v6Bar('Grasas',consumed.f,target.f,'g')}
    <div class="macro-distribution"><span>Distribución del plan actual:</span><b>P ${v6Fmt(dist.p)}%</b><b>HC ${v6Fmt(dist.c)}%</b><b>G ${v6Fmt(dist.f)}%</b></div>
    <p class="macro-note">Valores aproximados. El objetivo base es el plan original del día; las barras muestran lo consumido según las comidas marcadas ✓.</p>
    ${interactive?'<button id="v6ResetDay" class="secondary-btn v6-reset">Restaurar plan original de hoy</button>':''}
  </div></section>`;
}

function v6Group(def){ if(!def)return null; if(def.group==='fruit'||def.group==='carb')return 'carb'; if(def.group==='protein')return 'protein'; if(def.group==='fat')return 'fat'; return null; }
function v6Metric(mac,group){ return group==='protein'?mac.p:group==='fat'?mac.f:mac.c; }
function v6FindRedistribution(day,date,sourceMi,sourceFi,sourceText){
  const source=v6Macros(sourceText), group=v6Group(source.def); if(!source.known||!group)return null;
  const sourceMetric=v6Metric(source,group); if(sourceMetric<=0)return null;
  const done=load(`meals:${date}`,{}), meals=MEALS[day]||[];
  const candidates=[];
  for(let mi=sourceMi+1;mi<meals.length;mi++){
    if(done[mi]) continue;
    meals[mi][1].forEach((orig,fi)=>{
      if(mi===sourceMi&&fi===sourceFi)return; if(v6Omitted(date,mi,fi))return;
      const text=v6CurrentText(date,mi,fi,orig), mac=v6Macros(text), g=v6Group(mac.def); if(!mac.known)return;
      const exact=g===group; const compatible=(group==='carb'&&g==='carb')||(group==='protein'&&g==='protein')||(group==='fat'&&g==='fat');
      if(!compatible)return;
      const perUnit=v6Metric(mac,group)/(mac.qty||1); if(perUnit<=0)return;
      // Prefer same broad category and later meals, then compact additions.
      candidates.push({mi,fi,text,mac,score:(mi-sourceMi)*10+(exact?0:5),delta:sourceMetric/perUnit});
    });
  }
  candidates.sort((a,b)=>a.score-b.score||a.delta-b.delta); return candidates[0]||null;
}
function v6OpenOmit(mi,fi){
  const day=dayKey(),date=isoDate(),orig=MEALS[day][mi][1][fi],text=v6CurrentText(date,mi,fi,orig),mac=v6Macros(text), proposal=v6FindRedistribution(day,date,mi,fi,text),sheet=el('swapSheet');
  const sourceId=`${mi}:${fi}`;
  let proposalHtml='<div class="v6-no-proposal">No encuentro una redistribución automática razonable en las comidas pendientes.</div>';
  if(proposal){
    const targetOrig=MEALS[day][proposal.mi][1][proposal.fi],targetText=v6CurrentText(date,proposal.mi,proposal.fi,targetOrig),def=v6FoodDef(targetText),q=v6Qty(targetText,def),newQ=v6Round((q||0)+proposal.delta,0);
    proposalHtml=`<div class="v6-proposal"><span>Propuesta</span><strong>${MEALS[day][proposal.mi][0]}: ${def?.label||targetText}</strong><p>${v6Fmt(q||0)} → <b>${v6Fmt(newQ)} g</b> (+${v6Fmt(proposal.delta)} g)</p><small>Compensa aproximadamente el macro principal del alimento omitido.</small></div><button id="v6OmitRedis" class="primary-btn" style="width:100%;margin-top:10px">Omitir y redistribuir</button>`;
    setTimeout(()=>{const b=el('v6OmitRedis');if(b)b.onclick=()=>{v6SetOmitted(date,mi,fi,true);v6SetRedis(date,sourceId,{targetMi:proposal.mi,targetFi:proposal.fi,delta:v6Round(proposal.delta,1),source:text});sheet.classList.add('hidden');render();};},0);
  }
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">OMITIR ALIMENTO</div><h3>${text}</h3></div><button class="swap-close" id="v6OmitClose">Cerrar</button></div>
    <div class="v6-omit-macros">≈ ${v6Fmt(mac.kcal)} kcal · P ${v6Fmt(mac.p)} g · HC ${v6Fmt(mac.c)} g · G ${v6Fmt(mac.f)} g</div>
    <button id="v6OmitNoComp" class="secondary-btn" style="width:100%;margin-top:12px">Omitir sin compensar</button>${proposalHtml}
    <p class="swap-note">La redistribución es una propuesta aproximada. Nunca cambia la dieta base: solo modifica el día actual y puedes restaurarlo.</p>`;
  sheet.classList.remove('hidden'); el('v6OmitClose').onclick=()=>sheet.classList.add('hidden');
  el('v6OmitNoComp').onclick=()=>{v6SetOmitted(date,mi,fi,true);v6SetRedis(date,sourceId,null);sheet.classList.add('hidden');render();};
}
function v6RestoreItem(mi,fi){ const date=isoDate();v6SetOmitted(date,mi,fi,false);render(); }
function v6ResetDay(){ localStorage.removeItem(v6OmitKey());localStorage.removeItem(v6RedisKey());localStorage.removeItem(`mealSubs:${isoDate()}`);render(); }

// Override meal cards with Cambiar / Omitir and macro badges.
mealCard=function(m,i,doneMeals){
  const done=!!doneMeals[i],date=isoDate();
  return `<div class="card"><div class="meal-title"><strong>${m[0]}</strong><button class="check-btn ${done?'done':''}" data-meal="${i}">${done?'✓':'○'}</button></div><div class="food-list">${m[1].map((orig,fi)=>{
    const omitted=v6Omitted(date,i,fi), current=v6CurrentText(date,i,fi,orig), mac=v6ItemMacros(date,i,fi,orig), sub=(typeof getMealSub==='function'?getMealSub(date,i,fi):null), extra=v6ExtraFor(date,i,fi), supported=(typeof identifyFood==='function'&&identifyFood(orig)&&parseAmount(orig));
    return `<div class="food-row v6-food ${omitted?'v6-omitted':''}"><div class="food-text ${sub?'subbed':''}">${omitted?`<s>${current}</s><span class="original-food">Omitido hoy</span>`:`${current}${sub?`<span class="original-food">Original: ${orig}</span>`:''}${extra?`<span class="v6-adjust">Ajustado +${v6Fmt(extra)} g por redistribución</span>`:''}<span class="v6-food-macro">≈ ${v6Fmt(mac.kcal)} kcal · P ${v6Fmt(mac.p)} · HC ${v6Fmt(mac.c)} · G ${v6Fmt(mac.f)}</span>`}</div><div class="v6-food-actions">${omitted?`<button class="food-swap-btn" data-v6-restore="${i}:${fi}">Restaurar</button>`:`${supported?`<button class="food-swap-btn" data-foodswap="${i}:${fi}">Cambiar</button>`:''}<button class="food-omit-btn" data-v6-omit="${i}:${fi}">Omitir</button>`}</div></div>`;
  }).join('')}</div></div>`;
};

const V6_PREV_BIND_MEAL_EVENTS=bindMealEvents;
bindMealEvents=function(){
  V6_PREV_BIND_MEAL_EVENTS();
  document.querySelectorAll('[data-v6-omit]').forEach(b=>b.onclick=()=>{const [mi,fi]=b.dataset.v6Omit.split(':').map(Number);v6OpenOmit(mi,fi);});
  document.querySelectorAll('[data-v6-restore]').forEach(b=>b.onclick=()=>{const [mi,fi]=b.dataset.v6Restore.split(':').map(Number);v6RestoreItem(mi,fi);});
};

// Wrap V5 Today to inject dashboard after hero while preserving all training features.
const V6_PREV_RENDER_TODAY=renderToday;
renderToday=function(){
  V6_PREV_RENDER_TODAY();
  const content=el('content'),day=dayKey(); if(!content||!MEALS[day])return;
  const first=content.querySelector('.section'); if(first){ first.insertAdjacentHTML('afterend',v6MacroDashboard(day,isoDate(),true)); }
  const reset=el('v6ResetDay');if(reset)reset.onclick=v6ResetDay;
  // V5 rendered meal cards with V6 function, but bind again after dashboard injection.
  bindMealEvents();
};

// Meals tab: show base macro totals for every day; today is interactive.
renderMeals=function(){
  const today=dayKey(),date=isoDate();
  el('content').innerHTML=Object.keys(MEALS).map(day=>{
    const base=v6PlanTotals(day),dist=v6MacroPct(base),isToday=day===today,done=isToday?load(`meals:${date}`,{}):{};
    return `<section class="section"><div class="section-title"><h2>${day.toUpperCase()}</h2><span>${TRAINING[day].name}</span></div><div class="card v6-day-summary"><strong>≈ ${v6Fmt(base.kcal)} kcal</strong><span>P ${v6Fmt(base.p)} g · HC ${v6Fmt(base.c)} g · G ${v6Fmt(base.f)} g</span><small>Distribución: P ${v6Fmt(dist.p)}% · HC ${v6Fmt(dist.c)}% · G ${v6Fmt(dist.f)}%</small></div>${isToday?MEALS[day].map((m,i)=>mealCard(m,i,done)).join(''):MEALS[day].map(m=>mealStaticCard(m,day)).join('')}</section>`;
  }).join('');
  if(today&&MEALS[today])bindMealEvents();
  document.querySelectorAll('[data-preview-food]').forEach(btn=>btn.onclick=()=>showFoodSwap(decodeURIComponent(btn.dataset.previewFood),null,null,isoDate(),false));
};

render();
