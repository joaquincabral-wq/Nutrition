// JC Training V10 — biblioteca de alimentos + alta manual + editor de comidas mejorado.
(function(){
'use strict';
const V10_CUSTOM='v10CustomFoods', V10_MIG='v10Migration1';
const clone=x=>JSON.parse(JSON.stringify(x));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function customFoods(){return load(V10_CUSTOM,[])||[];}
function saveCustomFoods(x){save(V10_CUSTOM,x);}
function slug(s){return 'custom_'+norm(s).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')+'_'+Date.now();}
function registerCustomFoods(){
  customFoods().forEach(x=>{
    if(!V6_NUTRITION.some(n=>n.key===x.key)) V6_NUTRITION.push(x);
    if(typeof FOOD_DB!=='undefined' && !FOOD_DB[x.key]) FOOD_DB[x.key]={label:x.label,patterns:x.patterns,group:x.group||null,eq:x.kcal,state:'según etiqueta'};
  });
}
registerCustomFoods();

// Corrección del plan de septiembre: los desayunos con huevos + avena llevan 250 ml de bebida de almendras.
function addAlmondMilkToEggOats(plan){
  ['tuesday','thursday'].forEach(day=>{
    const meals=plan?.meals?.[day]; if(!meals?.[0]?.[1]) return;
    const foods=meals[0][1], hasOats=foods.some(x=>norm(x).includes('avena')), hasEgg=foods.some(x=>norm(x).includes('huevo')), hasMilk=foods.some(x=>norm(x).includes('bebida de almendras'));
    if(hasOats&&hasEgg&&!hasMilk) foods.push('250 ml bebida de almendras sin azúcar');
  });
}
if(!load(V10_MIG,false)){
  try{
    const p=load('v9Plans',{})||{};
    if(p['2026-09']) addAlmondMilkToEggOats(p['2026-09']);
    save('v9Plans',p); save(V10_MIG,true);
  }catch(e){console.warn('V10 migration',e);}
}

function foodLibrary(){
  const seen=new Set();
  return V6_NUTRITION.filter(x=>x.label&&!seen.has(norm(x.label))&&(seen.add(norm(x.label)),true)).sort((a,b)=>a.label.localeCompare(b.label,'es'));
}
function qtyUnit(def){return def.mode==='unit'?'ud':def.mode==='100ml'?'ml':'g';}
function defaultQty(def){return def.mode==='unit'?1:def.mode==='100ml'?250:100;}
function makeFoodText(def,qty){const u=qtyUnit(def);return `${qty} ${u} ${def.label}`;}
function esc10(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}

function openFoodPicker(onPick){
  const sheet=el('swapSheet'), list=foodLibrary();
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">V10 · BIBLIOTECA</div><h3>Añadir alimento</h3></div><button class="swap-close" id="v10Close">Cerrar</button></div>
  <input id="v10Search" class="input" placeholder="Buscar alimento…" autocomplete="off">
  <div class="v10-food-library" id="v10FoodList"></div>
  <button id="v10CreateCustom" class="primary-btn" style="width:100%;margin-top:12px">+ Crear alimento nuevo</button>
  <p class="swap-note">El escáner de código de barras y etiquetas nutricionales lo dejamos para V11.</p>`;
  sheet.classList.remove('hidden'); el('v10Close').onclick=()=>sheet.classList.add('hidden');
  function draw(q=''){
    const n=norm(q); const rows=list.filter(x=>!n||norm(x.label).includes(n)).map(x=>`<button class="v10-food-choice" data-v10-key="${x.key}"><span>${x.label}</span><small>${x.kcal} kcal / ${x.mode==='unit'?'ud':'100 '+(x.mode==='100ml'?'ml':'g')}</small></button>`).join('');
    el('v10FoodList').innerHTML=rows||'<p class="note">No hay coincidencias. Puedes crear el alimento.</p>';
    document.querySelectorAll('[data-v10-key]').forEach(b=>b.onclick=()=>openQty(list.find(x=>x.key===b.dataset.v10Key),onPick));
  }
  draw(); el('v10Search').oninput=e=>draw(e.target.value); el('v10CreateCustom').onclick=()=>openCustomFood(onPick);
}
function openQty(def,onPick){
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">AÑADIR</div><h3>${esc10(def.label)}</h3></div><button class="swap-close" id="v10Close">Cerrar</button></div>
  <label class="v9-field"><span>Cantidad (${qtyUnit(def)})</span><input id="v10Qty" class="input" type="number" inputmode="decimal" min="0" step="1" value="${defaultQty(def)}"></label>
  <div class="card compact"><span class="note">Referencia nutricional: ${def.kcal} kcal · P ${def.p} · HC ${def.c} · G ${def.f} ${def.mode==='unit'?'por unidad':'por 100 '+(def.mode==='100ml'?'ml':'g')}.</span></div>
  <button id="v10ConfirmFood" class="primary-btn" style="width:100%;margin-top:12px">Añadir</button>`;
  el('v10Close').onclick=()=>el('swapSheet').classList.add('hidden');
  el('v10ConfirmFood').onclick=()=>{const q=+(el('v10Qty').value||0);if(q<=0)return alert('Indica una cantidad válida.');el('swapSheet').classList.add('hidden');onPick(makeFoodText(def,q));};
}
function openCustomFood(onPick){
  el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">MIS ALIMENTOS</div><h3>Crear alimento</h3></div><button class="swap-close" id="v10Close">Cerrar</button></div>
  <label class="v9-field"><span>Nombre</span><input id="v10Name" class="input" placeholder="Ej. Yogur natural X"></label>
  <div class="v10-grid2"><label class="v9-field"><span>Unidad de referencia</span><select id="v10Mode" class="input"><option value="100g">por 100 g</option><option value="100ml">por 100 ml</option><option value="unit">por unidad</option></select></label><label class="v9-field"><span>Cantidad que vas a tomar</span><input id="v10Take" class="input" type="number" inputmode="decimal" value="100"></label></div>
  <div class="v10-grid2"><label class="v9-field"><span>kcal</span><input id="v10Kcal" class="input" type="number" inputmode="decimal"></label><label class="v9-field"><span>Proteína (g)</span><input id="v10P" class="input" type="number" inputmode="decimal"></label><label class="v9-field"><span>Hidratos (g)</span><input id="v10C" class="input" type="number" inputmode="decimal"></label><label class="v9-field"><span>Grasa (g)</span><input id="v10F" class="input" type="number" inputmode="decimal"></label></div>
  <button id="v10SaveCustom" class="primary-btn" style="width:100%;margin-top:12px">Guardar y añadir</button>
  <p class="swap-note">Introduce los valores de la etiqueta para la unidad de referencia seleccionada. En V11 podremos rellenarlos mediante escaneo.</p>`;
  el('v10Close').onclick=()=>el('swapSheet').classList.add('hidden');
  el('v10Mode').onchange=e=>{el('v10Take').value=e.target.value==='unit'?1:100;};
  el('v10SaveCustom').onclick=()=>{
    const label=el('v10Name').value.trim(),mode=el('v10Mode').value,take=+(el('v10Take').value||0),kcal=+(el('v10Kcal').value||0),p=+(el('v10P').value||0),c=+(el('v10C').value||0),f=+(el('v10F').value||0);
    if(!label||take<=0||kcal<0||p<0||c<0||f<0)return alert('Revisa nombre, cantidad y valores nutricionales.');
    const def={key:slug(label),patterns:[norm(label)],mode,kcal,p,c,f,label,group:null}; const all=customFoods();all.push(def);saveCustomFoods(all);V6_NUTRITION.push(def);el('swapSheet').classList.add('hidden');onPick(makeFoodText(def,take));
  };
}

// Mejora + Añadir alimento del editor mensual V9 mediante delegación en captura.
document.addEventListener('click',function(e){
  const b=e.target.closest?.('[data-v9-addfood]'); if(!b)return;
  e.preventDefault(); e.stopImmediatePropagation();
  const month=document.getElementById('v9Month')?.value||isoDate().slice(0,7);
  const [day,mi]=b.dataset.v9Addfood.split('|'); const all=window.v9PlansGet(),p=all[month]; window.v9ReadMeals(p);
  openFoodPicker(text=>{p.meals[day][+mi][1].push(text);all[month]=p;window.v9PlansPut(all);if(month===window.v9MonthNow())window.v9ApplyMonth(month);window.v9Render(month,'meals');});
},true);

// Botón visible en el planificador semanal para añadir un alimento a cualquier comida de la próxima fecha.
const oldV7MealCard=v7MealCard;
v7MealCard=function(day,date,m,mi){
  const html=oldV7MealCard(day,date,m,mi);
  const i=html.lastIndexOf('</div>'); return html.slice(0,i)+'<button class="secondary-btn v10-add-day-food" data-v10-add-day="'+day+'|'+date+'|'+mi+'">+ Añadir alimento</button>'+html.slice(i);
};
const oldRenderMealsV10=renderMeals;
renderMeals=function(){
  oldRenderMealsV10();
  document.querySelectorAll('[data-v10-add-day]').forEach(b=>b.onclick=()=>{
    const [day,date,mi]=b.dataset.v10AddDay.split('|');
    openFoodPicker(text=>{
      // Se guarda como adición específica de fecha para no alterar el plan base.
      const key=`v10MealAdds:${date}`,d=load(key,{}),id=String(mi);(d[id]||(d[id]=[])).push(text);save(key,d);renderMeals();
    });
  });
};

// Integra adiciones de fecha en las tarjetas y en los macros del plan actual.
const oldV6PlanTotals=v6PlanTotals;
v6PlanTotals=function(day,date=null,current=false){
  const total=oldV6PlanTotals(day,date,current); if(!(current&&date))return total;
  const adds=load(`v10MealAdds:${date}`,{});Object.values(adds).flat().forEach(text=>{const m=v6Macros(text);total.kcal+=m.kcal;total.p+=m.p;total.c+=m.c;total.f+=m.f;});return total;
};
const oldV7MealCard2=v7MealCard;
v7MealCard=function(day,date,m,mi){
  let html=oldV7MealCard2(day,date,m,mi); const adds=load(`v10MealAdds:${date}`,{})[String(mi)]||[];
  if(adds.length){const rows=adds.map((text,i)=>{const mac=v6Macros(text);return `<div class="food-row v10-added"><div class="food-text">${esc10(text)}<span class="original-food">Añadido para ${v7DateLabel(date)}</span><span class="v6-food-macro">≈ ${v6Fmt(mac.kcal)} kcal · P ${v6Fmt(mac.p)} · HC ${v6Fmt(mac.c)} · G ${v6Fmt(mac.f)}</span></div><button class="food-omit-btn" data-v10-remove-add="${date}|${mi}|${i}">Quitar</button></div>`}).join('');html=html.replace('<button class="secondary-btn v10-add-day-food"',rows+'<button class="secondary-btn v10-add-day-food"');}
  return html;
};
const oldRenderMealsV10b=renderMeals;
renderMeals=function(){oldRenderMealsV10b();document.querySelectorAll('[data-v10-remove-add]').forEach(b=>b.onclick=()=>{const [date,mi,i]=b.dataset.v10RemoveAdd.split('|'),key=`v10MealAdds:${date}`,d=load(key,{});(d[mi]||[]).splice(+i,1);if(!(d[mi]||[]).length)delete d[mi];save(key,d);renderMeals();});};

// V10.1 — sincronización completa Comidas <-> Hoy y macros de alimentos añadidos.
function v10DateAdds(date=isoDate()){ return load(`v10MealAdds:${date}`,{})||{}; }
function v10MealAdds(date,mi){ return v10DateAdds(date)[String(mi)]||[]; }
function v10AddsMacros(date,mi=null){
  let total={kcal:0,p:0,c:0,f:0}; const adds=v10DateAdds(date);
  const rows=mi===null?Object.values(adds).flat():(adds[String(mi)]||[]);
  rows.forEach(text=>{ total=v6Add(total,v6Macros(text)); });
  return total;
}

// Los alimentos añadidos a una fecha concreta también cuentan como consumidos
// cuando esa comida está marcada con ✓.
const oldV6ConsumedTotalsV101=v6ConsumedTotals;
v6ConsumedTotals=function(day,date=isoDate()){
  let total=oldV6ConsumedTotalsV101(day,date), done=load(`meals:${date}`,{});
  Object.keys(done).forEach(mi=>{ if(done[mi]) total=v6Add(total,v10AddsMacros(date,+mi)); });
  return total;
};

// Muestra en Hoy los alimentos añadidos desde la pestaña Comidas.
const oldMealCardV101=mealCard;
mealCard=function(m,i,doneMeals){
  let html=oldMealCardV101(m,i,doneMeals), date=isoDate(), adds=v10MealAdds(date,i);
  if(!adds.length) return html;
  const rows=adds.map((text,ai)=>{ const mac=v6Macros(text); return `<div class="food-row v10-added"><div class="food-text">${esc10(text)}<span class="original-food">Añadido hoy</span><span class="v6-food-macro">≈ ${v6Fmt(mac.kcal)} kcal · P ${v6Fmt(mac.p)} · HC ${v6Fmt(mac.c)} · G ${v6Fmt(mac.f)}</span></div><button class="food-omit-btn" data-v10-remove-today-add="${date}|${i}|${ai}">Quitar</button></div>`; }).join('');
  const marker='</div></div>', pos=html.lastIndexOf(marker);
  return pos>=0 ? html.slice(0,pos)+rows+html.slice(pos) : html;
};

// Reengancha el botón Quitar después de renderizar Hoy.
const oldBindMealEventsV101=bindMealEvents;
bindMealEvents=function(){
  oldBindMealEventsV101();
  document.querySelectorAll('[data-v10-remove-today-add]').forEach(b=>b.onclick=()=>{
    const [date,mi,idx]=b.dataset.v10RemoveTodayAdd.split('|'), key=`v10MealAdds:${date}`, d=load(key,{});
    (d[mi]||[]).splice(+idx,1); if(!(d[mi]||[]).length) delete d[mi]; save(key,d); render();
  });
};

// Restaurar el plan original elimina también los alimentos añadidos ese día.
const oldV6ResetDayV101=v6ResetDay;
v6ResetDay=function(){ localStorage.removeItem(`v10MealAdds:${isoDate()}`); oldV6ResetDayV101(); };
const oldV7ResetMealDateV101=v7ResetMealDate;
v7ResetMealDate=function(date){ localStorage.removeItem(`v10MealAdds:${date}`); oldV7ResetMealDateV101(date); };

// Considera una fecha "modificada" aunque el único cambio sea un alimento añadido.
v7MealDay=function(day){
  const date=v7NextDateForDay(day), base=v6PlanTotals(day), current=v6PlanTotals(day,date,true), dist=v6MacroPct(current);
  const hasAdds=Object.values(v10DateAdds(date)).some(a=>Array.isArray(a)&&a.length);
  const changed=Math.abs(base.kcal-current.kcal)>.5 || Object.keys(load(v6OmitKey(date),{})).length || Object.keys(load(`mealSubs:${date}`,{})).length || hasAdds;
  return `<section class="section v7-day-section"><div class="section-title"><div><h2>${day.toUpperCase()}</h2><small class="v7-next">Plan para ${v7DateLabel(date)}${changed?' · modificado':''}</small></div><span>${TRAINING[day].name}</span></div><div class="card v6-day-summary v7-summary"><strong>≈ ${v6Fmt(current.kcal)} kcal</strong><span>P ${v6Fmt(current.p)} g · HC ${v6Fmt(current.c)} g · G ${v6Fmt(current.f)} g</span><small>Distribución: P ${v6Fmt(dist.p)}% · HC ${v6Fmt(dist.c)}% · G ${v6Fmt(dist.f)}%</small>${changed?`<button class="secondary-btn v7-reset-day" data-v7-meal-reset="${date}">Restaurar plan base de este día</button>`:''}</div>${MEALS[day].map((m,mi)=>v7MealCard(day,date,m,mi)).join('')}</section>`;
};

// Backup V7.1 ya exporta todo localStorage, por lo que incluye automáticamente v10CustomFoods y v10MealAdds:*.
window.JC_TRAINING_VERSION='10.1';
window.v9ApplyMonth(); render();
})();
