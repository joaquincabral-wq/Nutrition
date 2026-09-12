
const DAYS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

const BASE_MEALS={
 lunes:[
  ['Desayuno postentreno',['60 g avena','30 g whey','100 g arándanos','300 ml bebida de almendras sin azúcar']],
  ['Comida',['250 g pollo','75 g arroz en crudo','300 g verduras','10 g AOVE','150 g melón']],
  ['Merienda',['250 g queso fresco batido 0%','150 g melocotón','15 g pistachos']],
  ['Cena',['250 g merluza','200 g patata en crudo','300 g verduras','10 g AOVE']]
 ],
 martes:[
  ['Desayuno postentreno',['3 huevos','150 ml claras','60 g avena','100 g arándanos','250 ml bebida de almendras sin azúcar']],
  ['Comida',['250 g ternera magra','75 g arroz en crudo','300 g verduras','5 g AOVE','150 g melón']],
  ['Merienda',['250 g queso fresco batido 0%','150 g melocotón']],
  ['Cena',['300 g bacalao','200 g patata en crudo','300 g verduras','10 g AOVE']]
 ],
 miércoles:[
  ['Desayuno postentreno',['60 g avena','30 g whey','10 g cacahuete en polvo','100 g arándanos','300 ml bebida de almendras']],
  ['Comida',['250 g pollo/pavo','85 g arroz en crudo','300 g verduras','10 g AOVE','150 g fruta']],
  ['Merienda',['250 g queso fresco batido 0%','150 g fruta','15 g pistachos']],
  ['Cena',['250 g dorada','250 g patata en crudo','300 g ensalada/verdura','5 g AOVE']]
 ],
 jueves:[
  ['Desayuno postentreno',['3 huevos','150 ml claras','60 g avena','100 g fruta','250 ml bebida de almendras sin azúcar']],
  ['Comida',['250 g pollo','75 g arroz en crudo','300 g verduras','10 g AOVE','150 g fruta']],
  ['Merienda',['250 g queso fresco batido 0%','150 g fruta']],
  ['Cena',['250 g merluza','200 g patata en crudo','300 g verduras','10 g AOVE']]
 ],
 viernes:[
  ['Desayuno postentreno',['60 g avena','30 g whey','10 g cacahuete en polvo','100 g arándanos','300 ml bebida de almendras']],
  ['Comida',['250 g ternera magra','85 g arroz en crudo','300 g verduras','5 g AOVE','150 g fruta']],
  ['Merienda',['250 g queso fresco batido 0%','150 g fruta','15 g pistachos']],
  ['Cena',['300 g pescado blanco','250 g patata en crudo','300 g verduras','10 g AOVE']]
 ],
 sábado:[
  ['Desayuno',['2 huevos','150 ml claras','60 g aguacate','150 g fruta']],
  ['Comida',['250 g pollo/pavo','60 g arroz en crudo','300 g verduras','10 g AOVE','150 g fruta']],
  ['Merienda',['250 g queso fresco batido 0%','150 g fruta']],
  ['Cena',['250 g pescado','150 g patata en crudo','300 g ensalada','10 g AOVE']]
 ],
 domingo:[
  ['Desayuno',['2 huevos','90 ml claras','60 g aguacate','150 g fruta']],
  ['Comida',['250 g carne magra','200 g patata en crudo','300 g verduras','5 g AOVE','150 g fruta']],
  ['Merienda',['250 g queso fresco batido 0%','150 g fruta']],
  ['Cena',['250 g pescado blanco','150 g patata en crudo','300 g ensalada','10 g AOVE']]
 ]
};

const DB=[
 ['avena',['avena'],389,16.9,66.3,6.9],
 ['whey',['whey','proteina en polvo','proteína en polvo'],390,78,8,6],
 ['arandanos',['arándanos','arandanos'],57,.7,14.5,.3],
 ['bebida_almendras',['bebida de almendras'],15,.5,.3,1.1],
 ['pollo',['pollo','pollo/pavo'],120,23,0,2.6],
 ['pavo',['pavo'],115,24,0,1.5],
 ['arroz',['arroz'],360,7,80,.7],
 ['verduras',['verduras','verdura'],30,2,5,.3],
 ['aove',['aove','aceite'],884,0,0,100],
 ['melon',['melón','melon'],34,.8,8.2,.2],
 ['qfb',['queso fresco batido'],46,8,4,.2],
 ['melocoton',['melocotón','melocoton'],39,.9,9.5,.3],
 ['pistachos',['pistachos'],562,20,28,45],
 ['merluza',['merluza','pescado blanco'],86,18.5,0,1.8],
 ['patata',['patata'],77,2,17,.1],
 ['huevo',['huevo','huevos'],143,12.6,.7,9.5],
 ['claras',['claras'],48,10.5,.7,.2],
 ['ternera',['ternera','carne magra'],170,24,0,8],
 ['bacalao',['bacalao'],82,18,0,.7],
 ['cacahuete',['cacahuete en polvo'],380,46,35,12],
 ['fruta',['fruta'],50,.6,12,.2],
 ['dorada',['dorada'],115,20,0,4],
 ['ensalada',['ensalada'],20,1,3,.2],
 ['aguacate',['aguacate'],160,2,8.5,14.7],
 ['pescado',['pescado'],110,20,0,3]
];

const state={view:'today',selectedDay:dayKey(),selectedDate:localISO()};

function localISO(d=new Date()){
 const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
 return `${y}-${m}-${day}`;
}
function dayKey(d=new Date()){return DAYS[d.getDay()]}
function load(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function money(n){return Math.round(n)}
function parseQty(text){
 const m=String(text).match(/([0-9]+(?:[.,][0-9]+)?)\s*(g|ml)/i);
 if(m)return +m[1].replace(',','.');
 const u=String(text).match(/^([0-9]+)\s+huevos?/i);
 if(u)return +u[1]*60;
 return null;
}
function foodDef(text){const t=text.toLowerCase();return DB.find(x=>x[1].some(p=>t.includes(p)))}
function macros(text){
 const def=foodDef(text),q=parseQty(text);
 if(!def||q==null)return {kcal:0,p:0,c:0,f:0,known:false};
 const factor=q/100;
 return {kcal:def[2]*factor,p:def[3]*factor,c:def[4]*factor,f:def[5]*factor,known:true};
}
function add(a,b){return {kcal:a.kcal+b.kcal,p:a.p+b.p,c:a.c+b.c,f:a.f+b.f}}
function planForDay(day){
 const month=localISO().slice(0,7),plans=load('v9Plans',{});
 return plans?.[month]?.meals?.[day] || BASE_MEALS[day];
}
function currentText(date,mi,fi,original){
 const subs=load(`mealSubs:${date}`,{});
 let text=subs[`${mi}:${fi}`]?.replacement || original;
 const reds=load(`v6MealRedis:${date}`,{});
 let extra=0;
 Object.values(reds).forEach(r=>{if(r&&r.targetMi===mi&&r.targetFi===fi)extra+=Number(r.delta||0)});
 if(extra){
  const q=parseQty(text);
  if(q!=null) text=text.replace(/([0-9]+(?:[.,][0-9]+)?)\s*(g|ml)/i,`${Math.round(q+extra)} $2`);
 }
 return text;
}
function omitted(date,mi,fi){return !!load(`v6MealOmit:${date}`,{})[`${mi}:${fi}`]}
function addedFoods(date,mi){return load(`v10MealAdds:${date}`,{})[String(mi)]||[]}
function dayTotals(day,date){
 let total={kcal:0,p:0,c:0,f:0};
 const plan=planForDay(day);
 plan.forEach((m,mi)=>m[1].forEach((f,fi)=>{if(!omitted(date,mi,fi))total=add(total,macros(currentText(date,mi,fi,f)))}));
 Object.values(load(`v10MealAdds:${date}`,{})).flat().forEach(x=>total=add(total,macros(x)));
 return total;
}
function consumedTotals(day,date){
 let total={kcal:0,p:0,c:0,f:0};
 const done=load(`meals:${date}`,{}),plan=planForDay(day);
 plan.forEach((m,mi)=>{
  if(done[mi]){
   m[1].forEach((f,fi)=>{if(!omitted(date,mi,fi))total=add(total,macros(currentText(date,mi,fi,f)))});
   addedFoods(date,mi).forEach(x=>total=add(total,macros(x)));
  }
 });
 return total;
}
function pct(v,t){return t?Math.min(100,v/t*100):0}
function setPage(title){document.getElementById('pageTitle').textContent=title;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view))}
function macroBlock(day,date){
 const target=dayTotals(day,date),cons=consumedTotals(day,date);
 return `<section class="section"><div class="section-title"><h2>Macros del día</h2><span>estimación</span></div><div class="card">
  <div class="kpi-grid"><div class="kpi"><b>${money(target.kcal)}</b><span>kcal plan</span></div><div class="kpi"><b>${money(cons.kcal)}</b><span>kcal consumidas</span></div><div class="kpi"><b>${money(Math.max(0,target.kcal-cons.kcal))}</b><span>kcal restantes</span></div></div>
  ${bar('Proteína',cons.p,target.p,'g')}${bar('Hidratos',cons.c,target.c,'g')}${bar('Grasas',cons.f,target.f,'g')}
 </div></section>`;
}
function bar(label,v,t,u){return `<div class="macro-row"><div class="macro-head"><span>${label}</span><strong>${Math.round(v)} / ${Math.round(t)} ${u}</strong></div><div class="track"><i style="width:${pct(v,t)}%"></i></div></div>`}
function mealCard(day,date,m,mi,editable=true){
 const done=!!load(`meals:${date}`,{})[mi];
 const foods=m[1].map((orig,fi)=>{
  const text=currentText(date,mi,fi,orig),isO=omitted(date,mi,fi),mac=macros(text);
  return `<div class="food ${isO?'omitted':''}"><div><strong>${text}</strong>${mac.known?`<small>≈ ${Math.round(mac.kcal)} kcal · P ${Math.round(mac.p)} · HC ${Math.round(mac.c)} · G ${Math.round(mac.f)}</small>`:''}</div>${editable?`<div class="food-actions"><button class="tiny" data-edit="${mi}:${fi}">Editar</button><button class="tiny" data-omit="${mi}:${fi}">${isO?'Restaurar':'Omitir'}</button></div>`:''}</div>`;
 }).join('');
 const adds=addedFoods(date,mi).map((x,i)=>`<div class="food"><div><strong>${x}</strong><small>Añadido</small></div>${editable?`<button class="tiny danger" data-rmadd="${mi}:${i}">Quitar</button>`:''}</div>`).join('');
 return `<div class="card"><div class="meal-head"><strong>${m[0]}</strong>${editable?`<button class="check ${done?'done':''}" data-done="${mi}">${done?'✓':'○'}</button>`:''}</div><div class="food-list">${foods}${adds}</div>${editable?`<button class="secondary" data-add="${mi}" style="width:100%;margin-top:10px">+ Añadir alimento</button>`:''}</div>`;
}
function bindMealActions(day,date){
 document.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>{const d=load(`meals:${date}`,{}),i=b.dataset.done;d[i]=!d[i];save(`meals:${date}`,d);render()});
 document.querySelectorAll('[data-omit]').forEach(b=>b.onclick=()=>{const [mi,fi]=b.dataset.omit.split(':'),k=`v6MealOmit:${date}`,d=load(k,{}),id=`${mi}:${fi}`;d[id]?delete d[id]:d[id]=true;save(k,d);render()});
 document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const [mi,fi]=b.dataset.edit.split(':').map(Number),plan=planForDay(day),orig=plan[mi][1][fi],cur=currentText(date,mi,fi,orig),val=prompt('Nuevo alimento/cantidad:',cur);if(val&&val.trim()){const k=`mealSubs:${date}`,d=load(k,{});d[`${mi}:${fi}`]={replacement:val.trim()};save(k,d);render()}});
 document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const mi=b.dataset.add,val=prompt('Añadir alimento (ej. 200 g sandía):');if(val&&val.trim()){const k=`v10MealAdds:${date}`,d=load(k,{});(d[mi]||(d[mi]=[])).push(val.trim());save(k,d);render()}});
 document.querySelectorAll('[data-rmadd]').forEach(b=>b.onclick=()=>{const [mi,i]=b.dataset.rmadd.split(':'),k=`v10MealAdds:${date}`,d=load(k,{});(d[mi]||[]).splice(+i,1);save(k,d);render()});
}
function renderToday(){
 const d=new Date(),day=dayKey(d),date=localISO(d),plan=planForDay(day);
 document.getElementById('content').innerHTML=`<section class="section"><div class="card hero"><div class="eyebrow">${d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}).toUpperCase()}</div><h2>Plan de alimentación</h2><p>Comidas, macros, medidas y progreso corporal.</p></div></section>${macroBlock(day,date)}<section class="section"><div class="section-title"><h2>Comidas de hoy</h2><span>${plan.length} comidas</span></div>${plan.map((m,i)=>mealCard(day,date,m,i,true)).join('')}</section>`;
 bindMealActions(day,date);
}
function renderMeals(){
 const days=['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
 const day=state.selectedDay,date=nextDate(day),plan=planForDay(day),tot=dayTotals(day,date);
 document.getElementById('content').innerHTML=`<section class="section"><div class="day-tabs">${days.map(d=>`<button class="${d===day?'primary':'secondary'}" data-day="${d}">${d}</button>`).join('')}</div></section><section class="section"><div class="section-title"><h2>${day.toUpperCase()}</h2><span>${date}</span></div><div class="card"><strong>≈ ${Math.round(tot.kcal)} kcal</strong><p class="note">P ${Math.round(tot.p)} g · HC ${Math.round(tot.c)} g · G ${Math.round(tot.f)} g</p></div>${plan.map((m,i)=>mealCard(day,date,m,i,true)).join('')}</section>`;
 document.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{state.selectedDay=b.dataset.day;render()});
 bindMealActions(day,date);
}
function nextDate(day){
 const target=DAYS.indexOf(day),d=new Date(),diff=(target-d.getDay()+7)%7;
 d.setDate(d.getDate()+diff);return localISO(d);
}
function renderMeasurements(){
 const arr=load('metrics',[]).slice().reverse();
 document.getElementById('content').innerHTML=`<section class="section"><div class="card"><div class="section-title"><h2>Nueva medición</h2><span>${localISO()}</span></div>
 <div class="row"><label class="field"><span>Fecha</span><input id="mDate" class="input" type="date" value="${localISO()}"></label><label class="field"><span>Hora</span><input id="mTime" class="input" type="time" value="${new Date().toTimeString().slice(0,5)}"></label></div>
 <div class="row"><label class="field"><span>Peso kg</span><input id="mWeight" class="input" inputmode="decimal"></label><label class="field"><span>Cintura cm</span><input id="mWaist" class="input" inputmode="decimal"></label></div>
 <div class="row"><label class="field"><span>Grasa %</span><input id="mFat" class="input" inputmode="decimal"></label><label class="field"><span>Masa muscular kg</span><input id="mMuscle" class="input" inputmode="decimal"></label></div>
 <button id="saveMetric" class="primary" style="width:100%">Guardar medición</button></div></section>
 <section class="section"><div class="section-title"><h2>Últimas mediciones</h2><span>${arr.length}</span></div><div class="card">${arr.slice(0,12).map((m,i)=>`<div class="history-item"><strong>${m.date||''}${m.time?' · '+m.time:''}</strong><div class="note">${m.weight?m.weight+' kg':''}${m.waist?' · '+m.waist+' cm cintura':''}${m.bodyFat?' · '+m.bodyFat+'% grasa':''}${m.muscleMass?' · '+m.muscleMass+' kg músculo':''}</div></div>`).join('')||'<p class="note">Sin mediciones.</p>'}</div></section>`;
 document.getElementById('saveMetric').onclick=()=>{const a=load('metrics',[]);a.push({date:mDate.value,time:mTime.value,weight:mWeight.value,waist:mWaist.value,bodyFat:mFat.value,muscleMass:mMuscle.value});a.sort((x,y)=>(x.date+x.time).localeCompare(y.date+y.time));save('metrics',a);render()};
}
function renderProgress(){
 const arr=load('metrics',[]),first=arr[0]||{},last=arr[arr.length-1]||{};
 const delta=(k,u)=>{const a=parseFloat(first[k]),b=parseFloat(last[k]);return Number.isFinite(a)&&Number.isFinite(b)?`${b-a>0?'+':''}${(b-a).toFixed(1)} ${u}`:'—'};
 document.getElementById('content').innerHTML=`<section class="section"><div class="card"><div class="section-title"><h2>Progreso corporal</h2><span>${arr.length} registros</span></div><div class="kpi-grid"><div class="kpi"><b>${last.weight||'—'}</b><span>kg</span></div><div class="kpi"><b>${last.waist||'—'}</b><span>cm cintura</span></div><div class="kpi"><b>${last.bodyFat||'—'}</b><span>% grasa</span></div></div></div></section><section class="section"><div class="card"><div class="section-title"><h2>Desde el inicio</h2><span>tendencia</span></div><div class="kpi-grid"><div class="kpi"><b>${delta('weight','kg')}</b><span>Peso</span></div><div class="kpi"><b>${delta('waist','cm')}</b><span>Cintura</span></div><div class="kpi"><b>${delta('bodyFat','pp')}</b><span>Grasa</span></div></div></div></section>`;
}
function renderBackup(){
 document.getElementById('content').innerHTML=`<section class="section"><div class="card"><div class="section-title"><h2>Backup</h2><span>CLEAN V1</span></div><p class="note">Importa un JSON de la antigua JC Training o exporta los datos actuales.</p><div class="backup-actions"><button id="importBtn" class="primary">Importar backup</button><input id="importFile" type="file" accept=".json,application/json" hidden><button id="exportBtn" class="secondary">Exportar backup</button></div><p id="backupStatus" class="note"></p></div></section>`;
 importBtn.onclick=()=>importFile.click();
 importFile.onchange=()=>importBackup(importFile.files?.[0]);
 exportBtn.onclick=exportBackup;
}
function exportBackup(){
 const storage={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);storage[k]=localStorage.getItem(k)}
 const blob=new Blob([JSON.stringify({app:'JC Nutrition CLEAN',version:'1',exportedAt:new Date().toISOString(),storage},null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`jc-nutrition-backup-${localISO()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
 backupStatus.textContent='Backup exportado.';
}
async function importBackup(file){
 if(!file)return;
 try{
  const p=JSON.parse(await file.text());
  if(p.storage&&typeof p.storage==='object'){
   Object.entries(p.storage).forEach(([k,v])=>localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v)));
   if(p.metrics)save('metrics',p.metrics);
  }else{
   if(p.metrics)save('metrics',p.metrics);
   Object.entries(p.storage||{}).forEach(([k,v])=>localStorage.setItem(k,JSON.stringify(v)));
  }
  backupStatus.textContent='Backup importado correctamente.';
  alert('Backup importado. La app se recargará.');
  location.reload();
 }catch(e){backupStatus.textContent='Archivo no válido.'}
}
function render(){
 setPage(state.view==='today'?'Hoy':state.view==='meals'?'Comidas':state.view==='measurements'?'Medidas':state.view==='progress'?'Progreso':'Backup');
 if(state.view==='today')renderToday();
 if(state.view==='meals')renderMeals();
 if(state.view==='measurements')renderMeasurements();
 if(state.view==='progress')renderProgress();
 if(state.view==='backup')renderBackup();
}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>{state.view=b.dataset.view;render()});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
render();
