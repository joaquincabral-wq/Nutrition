// JC Training V10.5 — media mañana opcional inteligente.
(function(){
'use strict';
const V105='10.5';
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function key(date=isoDate()){return `v105MidMorning:${date}`}
function state(date=isoDate()){return load(key(date),null)}
function sumFoods(foods=[]){return foods.reduce((t,x)=>v6Add(t,v6Macros(x)),{kcal:0,p:0,c:0,f:0})}
function selectedMacros(date=isoDate()){const s=state(date);return s?.eaten?sumFoods(s.foods):{kcal:0,p:0,c:0,f:0}}
function remaining(day,date){
  const target=v6PlanTotals(day), consumed=v6ConsumedTotals(day,date);
  return {kcal:Math.max(0,target.kcal-consumed.kcal),p:Math.max(0,target.p-consumed.p),c:Math.max(0,target.c-consumed.c),f:Math.max(0,target.f-consumed.f)};
}
const OPTIONS=[
 {id:'light',name:'Muy ligera',foods:['150 g Melocotón'],why:'Para quitar hambre con poco impacto en el resto del día.'},
 {id:'protein',name:'Proteica',foods:['150 g Queso fresco batido 0%','100 g Arándanos'],why:'Aporta proteína con pocas calorías y deja margen para comida y cena.'},
 {id:'satiety',name:'Más saciante',foods:['150 g Cottage','100 g Melocotón'],why:'Más proteína y saciedad cuando el hambre es mayor.'}
];
function rank(day,date){
  const r=remaining(day,date);
  return OPTIONS.map(o=>{const m=sumFoods(o.foods);let score=0; if(r.p>45)score+=m.p*2;else score+=m.p; score-=Math.max(0,m.kcal-Math.max(100,r.kcal*.18))*.08; score-=Math.max(0,m.f-r.f*.25)*2; return {...o,m,score};}).sort((a,b)=>b.score-a.score);
}
function cardHtml(date=isoDate()){
  const s=state(date); if(!s?.eaten)return `<section class="section v105-mid"><div class="section-title"><h2>Media mañana</h2><span>opcional</span></div><div class="card"><p>¿Tienes hambre? Te propongo una opción según lo que llevas consumido y lo que queda planificado hoy.</p><button class="secondary-btn" id="v105Hungry">Tengo hambre</button></div></section>`;
  const m=sumFoods(s.foods);return `<section class="section v105-mid"><div class="section-title"><h2>Media mañana</h2><span>añadida</span></div><div class="card v105-selected"><strong>✓ ${esc(s.name||'Media mañana')}</strong><div>${s.foods.map(esc).join(' · ')}</div><small>≈ ${v6Fmt(m.kcal)} kcal · P ${v6Fmt(m.p)} g · HC ${v6Fmt(m.c)} g · G ${v6Fmt(m.f)} g</small><button class="secondary-btn" id="v105Edit">Cambiar / quitar</button></div></section>`;
}
function openPicker(){
 const day=dayKey(),date=isoDate(),r=remaining(day,date),opts=rank(day,date),sheet=el('swapSheet');
 el('swapContent').innerHTML=`<div class="swap-head"><div><div class="eyebrow">MEDIA MAÑANA OPCIONAL</div><h3>¿Qué encaja mejor hoy?</h3></div><button class="swap-close" id="v105Close">Cerrar</button></div><div class="card v105-remaining"><b>Antes de añadirla</b><span>Quedan aprox. ${v6Fmt(r.kcal)} kcal · P ${v6Fmt(r.p)} · HC ${v6Fmt(r.c)} · G ${v6Fmt(r.f)}</span></div>${opts.map((o,i)=>`<div class="card v105-option"><div class="v105-rec">${i===0?'RECOMENDADA':'OPCIÓN'}</div><strong>${esc(o.name)}</strong><div>${o.foods.map(esc).join(' + ')}</div><small>≈ ${v6Fmt(o.m.kcal)} kcal · P ${v6Fmt(o.m.p)} · HC ${v6Fmt(o.m.c)} · G ${v6Fmt(o.m.f)}</small><p>${esc(o.why)}</p><button class="${i===0?'primary-btn':'secondary-btn'}" data-v105-pick="${esc(o.id)}">Añadir y contar como consumida</button></div>`).join('')}<button class="secondary-btn" id="v105Remove" style="width:100%;margin-top:8px">Quitar media mañana</button><p class="note">No modifica el plan base. Se añade solo a hoy y sus kcal/macros entran en el total consumido.</p>`;
 sheet.classList.remove('hidden');q('#v105Close').onclick=()=>sheet.classList.add('hidden');q('#v105Remove').onclick=()=>{localStorage.removeItem(key(date));sheet.classList.add('hidden');render()};qa('[data-v105-pick]',sheet).forEach(b=>b.onclick=()=>{const o=OPTIONS.find(x=>x.id===b.dataset.v105Pick);save(key(date),{eaten:true,name:o.name,foods:o.foods,createdAt:new Date().toISOString()});sheet.classList.add('hidden');render()});
}
function bind(){q('#v105Hungry')?.addEventListener('click',openPicker);q('#v105Edit')?.addEventListener('click',openPicker)}
// Cuenta la media mañana seleccionada como consumida, sin alterar el objetivo base del día.
const prevConsumed=v6ConsumedTotals;
v6ConsumedTotals=function(day,date=isoDate()){return v6Add(prevConsumed(day,date),selectedMacros(date))};
// En el plan actual se refleja lo que realmente se ha añadido hoy.
const prevPlan=v6PlanTotals;
v6PlanTotals=function(day,date=null,current=false){const t=prevPlan(day,date,current);return current&&date?v6Add(t,selectedMacros(date)):t};
const prevToday=window.renderToday;
window.renderToday=function(){prevToday();const content=el('content');if(!content)return;const sections=qa('.section',content);const anchor=sections.find(s=>/Macros del día/i.test(s.textContent));(anchor||sections[0])?.insertAdjacentHTML('afterend',cardHtml());bind()};
const prevMeals=window.renderMeals;
window.renderMeals=function(){prevMeals();const content=el('content');if(!content)return;const todaySection=qa('.section',content).find(s=>s.querySelector('h2')?.textContent?.toLowerCase()===dayKey());todaySection?.insertAdjacentHTML('afterbegin',cardHtml());bind()};
window.JC_TRAINING_VERSION=V105;
render();
})();
