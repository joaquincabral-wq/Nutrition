
const APP_KEY='jcNutritionNoTraining_v2';
const emptyState=()=>({settings:{kcal:2011,protein:0,carbs:0,fat:0},foods:[],daily:{},measurements:[],menuPlans:{}});
let db=load();
let currentView='today';
let deferredPrompt=null;

function load(){
  try{
    const x=JSON.parse(localStorage.getItem(APP_KEY));
    if(x&&typeof x==='object'){const merged=Object.assign(emptyState(),x);merged.menuPlans=merged.menuPlans||{};return merged}return emptyState();
  }catch{return emptyState()}
}
function save(){localStorage.setItem(APP_KEY,JSON.stringify(db))}
function todayISO(){let d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function num(v){let x=Number(String(v??'').replace(',','.'));return Number.isFinite(x)?x:0}
function fmt(v,d=1){return num(v).toFixed(d).replace('.0','')}
function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function day(date){if(!db.daily[date])db.daily[date]={entries:[],completedMeals:{}};return db.daily[date]}
function totals(date){
  return day(date).entries.filter(e=>!e.omitted).reduce((a,e)=>{
    a.kcal+=num(e.kcal);a.protein+=num(e.protein);a.carbs+=num(e.carbs);a.fat+=num(e.fat);return a
  },{kcal:0,protein:0,carbs:0,fat:0})
}
function targetLine(name,value,target,unit='g'){
  let pct=target>0?Math.min(100,Math.round(value/target*100)):0;
  return `<div class="macro"><div class="macro-head"><b>${name}</b><span>${fmt(value)} / ${target||'—'} ${unit}</span></div><div class="progress"><div class="bar" style="width:${pct}%"></div></div></div>`;
}
function lastMeasurement(){return [...db.measurements].sort((a,b)=>b.date.localeCompare(a.date))[0]}
function content(){return document.getElementById('content')}
function setTitle(t){document.getElementById('pageTitle').textContent=t}

function render(){
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
  ({today:renderToday,meals:renderMeals,measurements:renderMeasurements,progress:renderProgress,backup:renderBackup}[currentView]||renderToday)();
}
function renderToday(){
  setTitle('Hoy');let date=todayISO(),t=totals(date),m=lastMeasurement(),d=day(date);
  let remain=Math.max(0,num(db.settings.kcal)-t.kcal);
  content().innerHTML=`
  <section class="card">
    <div class="toolbar"><div><div class="kicker">RESUMEN DIARIO</div><h2>${new Date(date+'T12:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}</h2></div></div>
    <div class="grid4">
      <div class="stat"><b>${Math.round(t.kcal)}</b><span>kcal consumidas</span></div>
      <div class="stat"><b>${Math.round(remain)}</b><span>kcal restantes</span></div>
      <div class="stat"><b>${fmt(t.protein)}</b><span>proteína g</span></div>
      <div class="stat"><b>${fmt(t.carbs)}</b><span>hidratos g</span></div>
    </div>
    ${targetLine('Calorías',t.kcal,num(db.settings.kcal),'kcal')}
    ${targetLine('Proteína',t.protein,num(db.settings.protein))}
    ${targetLine('Hidratos',t.carbs,num(db.settings.carbs))}
    ${targetLine('Grasas',t.fat,num(db.settings.fat))}
  </section>
  <section class="card">
    <div class="toolbar"><h2>Comidas de hoy</h2><button class="btn primary" onclick="openAddEntry('${date}')">+ Añadir</button></div>
    ${renderDayMeals(date)}
  </section>
  <section class="card">
    <div class="toolbar"><h2>Última medición</h2><button class="btn secondary" onclick="go('measurements')">Registrar</button></div>
    ${m?`<div class="grid4"><div class="stat"><b>${fmt(m.weight)}</b><span>peso kg</span></div><div class="stat"><b>${fmt(m.waist)}</b><span>cintura cm</span></div><div class="stat"><b>${fmt(m.bodyFat)}</b><span>grasa %</span></div><div class="stat"><b>${fmt(m.muscle)}</b><span>músculo kg</span></div></div>`:'<div class="empty">Todavía no hay mediciones.</div>'}
  </section>`;
}
const MEALS=['Desayuno','Media mañana','Comida','Merienda','Cena','Otros'];
function renderDayMeals(date){
  let d=day(date);
  return MEALS.map(meal=>{
    let rows=d.entries.filter(e=>e.meal===meal);
    if(!rows.length)return '';
    let done=!!d.completedMeals[meal];
    return `<div class="meal-card ${done?'done':''}">
      <div class="meal-head"><div><h3>${done?'✅ ':''}${meal}</h3></div>
      <button class="btn secondary" onclick="toggleMeal('${date}','${meal}')">${done?'Reabrir':'Completar'}</button></div>
      ${rows.map(e=>entryHTML(date,e)).join('')}
    </div>`
  }).join('')||'<div class="empty">No hay alimentos registrados hoy.</div>';
}
function entryHTML(date,e){
  return `<div class="food-row ${e.omitted?'omitted':''}">
    <div><div class="food-name">${esc(e.name)}</div><div class="food-meta">${fmt(e.qty)} ${esc(e.unit||'g')} · ${Math.round(num(e.kcal))} kcal · P ${fmt(e.protein)} · HC ${fmt(e.carbs)} · G ${fmt(e.fat)}</div></div>
    <div class="actions">
      <button class="btn blue" onclick="editEntry('${date}','${e.id}')">Cambiar</button>
      <button class="btn ${e.omitted?'secondary':'danger'}" onclick="omitEntry('${date}','${e.id}')">${e.omitted?'Restaurar':'Omitir'}</button>
    </div>
  </div>`
}
function toggleMeal(date,meal){let d=day(date);d.completedMeals[meal]=!d.completedMeals[meal];save();render()}
function omitEntry(date,id){let e=day(date).entries.find(x=>x.id===id);if(e){e.omitted=!e.omitted;save();render()}}
function editEntry(date,id){let e=day(date).entries.find(x=>x.id===id);if(e)openEntryModal(date,e)}
function openAddEntry(date=todayISO()){openEntryModal(date,null)}

function renderMeals(){
  setTitle('Comidas');let date=document.getElementById('mealDateKeep')?.value||todayISO();
  content().innerHTML=`
  <section class="card">
    <div class="toolbar"><div><div class="kicker">PLAN Y REGISTRO</div><h2>Comidas</h2></div><input id="mealDateKeep" class="date" type="date" value="${date}" onchange="renderMeals()"></div>
    <div class="actions"><button class="btn primary" onclick="openAddEntry(document.getElementById('mealDateKeep').value)">+ Añadir alimento</button><button class="btn secondary" onclick="openMenuPlanner(document.getElementById('mealDateKeep').value)">📅 Programar menús</button><button class="btn secondary" onclick="openFoodDB()">Base de alimentos</button><button class="btn blue" onclick="openBarcode()">Código de barras</button></div>
  </section>
  <section class="card">${renderDayMeals(date)}</section>
  <section class="card"><h2>Resumen</h2>${mealSummary(date)}</section>`;
}
function mealSummary(date){
  let t=totals(date);return `<div class="grid4"><div class="stat"><b>${Math.round(t.kcal)}</b><span>kcal</span></div><div class="stat"><b>${fmt(t.protein)}</b><span>P g</span></div><div class="stat"><b>${fmt(t.carbs)}</b><span>HC g</span></div><div class="stat"><b>${fmt(t.fat)}</b><span>G g</span></div></div>`;
}

function openEntryModal(date,e){
  let isEdit=!!e;
  showModal(`<div class="toolbar"><h2>${isEdit?'Cambiar alimento':'Añadir alimento'}</h2><button class="btn secondary" onclick="closeModal()">Cerrar</button></div>
  <label>Fecha</label><input id="eDate" type="date" value="${date}">
  <label>Comida</label><select id="eMeal">${MEALS.map(x=>`<option ${e?.meal===x?'selected':''}>${x}</option>`).join('')}</select>
  <label>Alimento</label><input id="eName" value="${esc(e?.name||'')}" placeholder="Ej. pechuga de pollo">
  <div class="grid2"><div><label>Cantidad</label><input id="eQty" type="number" step=".1" value="${e?.qty??''}"></div><div><label>Unidad</label><select id="eUnit">${['g','ml','unidad','ración'].map(x=>`<option ${e?.unit===x?'selected':''}>${x}</option>`).join('')}</select></div></div>
  <div class="grid4"><div><label>kcal</label><input id="eKcal" type="number" step=".1" value="${e?.kcal??''}"></div><div><label>Proteína</label><input id="eProtein" type="number" step=".1" value="${e?.protein??''}"></div><div><label>Hidratos</label><input id="eCarbs" type="number" step=".1" value="${e?.carbs??''}"></div><div><label>Grasa</label><input id="eFat" type="number" step=".1" value="${e?.fat??''}"></div></div>
  <label>Buscar en mi base</label><div class="search-row"><input id="eSearch" placeholder="Escribe un alimento"><button class="btn secondary" onclick="searchFoodForEntry()">Buscar</button></div><div id="eResults"></div>
  <div class="actions"><button class="btn primary" onclick="saveEntry('${e?.id||''}')">${isEdit?'Guardar cambios':'Añadir'}</button>${isEdit?`<button class="btn danger" onclick="deleteEntry('${date}','${e.id}')">Eliminar</button>`:''}</div>`);
}
function saveEntry(id){
  let date=document.getElementById('eDate').value||todayISO(),d=day(date);
  let data={id:id||uid(),meal:eMeal.value,name:eName.value.trim(),qty:num(eQty.value),unit:eUnit.value,kcal:num(eKcal.value),protein:num(eProtein.value),carbs:num(eCarbs.value),fat:num(eFat.value),omitted:false};
  if(!data.name)return alert('Indica el alimento.');
  if(id){
    Object.keys(db.daily).forEach(k=>db.daily[k].entries=db.daily[k].entries.filter(x=>x.id!==id));
  }
  d.entries.push(data);save();closeModal();render();
}
function deleteEntry(date,id){if(confirm('¿Eliminar este alimento?')){day(date).entries=day(date).entries.filter(x=>x.id!==id);save();closeModal();render()}}
function searchFoodForEntry(){
  let q=eSearch.value.trim().toLowerCase();let res=db.foods.filter(f=>f.name.toLowerCase().includes(q)||String(f.brand||'').toLowerCase().includes(q)).slice(0,8);
  eResults.innerHTML=res.length?res.map(f=>`<div class="food-row"><div><b>${esc(f.name)}</b><div class="food-meta">${esc(f.brand||'')} · ${Math.round(num(f.kcal))} kcal / ${fmt(f.serving||100)} g</div></div><button class="btn blue" onclick="useFood('${f.id}')">Usar</button></div>`).join(''):'<div class="empty">Sin coincidencias.</div>';
}
function useFood(id){let f=db.foods.find(x=>x.id===id);if(!f)return;eName.value=f.name;eQty.value=f.serving||100;eUnit.value=f.unit||'g';eKcal.value=f.kcal;eProtein.value=f.protein;eCarbs.value=f.carbs;eFat.value=f.fat}

function openFoodDB(){
  showModal(`<div class="toolbar"><h2>Base de alimentos</h2><button class="btn secondary" onclick="closeModal()">Cerrar</button></div>
  <div class="search-row"><input id="foodSearch" placeholder="Buscar" oninput="drawFoodDB()"><button class="btn primary" onclick="openFoodEditor()">+ Nuevo</button></div>
  <div id="foodDBList"></div>`);drawFoodDB();
}
function drawFoodDB(){
  let q=(document.getElementById('foodSearch')?.value||'').toLowerCase();
  let list=db.foods.filter(f=>!q||f.name.toLowerCase().includes(q)||String(f.brand||'').toLowerCase().includes(q));
  foodDBList.innerHTML=list.length?list.map(f=>`<div class="food-row"><div><b>${esc(f.name)}</b><div class="food-meta">${esc(f.brand||'')} · ${fmt(f.serving||100)} ${esc(f.unit||'g')} · ${Math.round(num(f.kcal))} kcal · ${f.barcode?`EAN ${esc(f.barcode)}`:''}</div></div><button class="btn secondary" onclick="openFoodEditor('${f.id}')">Editar</button></div>`).join(''):'<div class="empty">Tu base está vacía.</div>';
}
function openFoodEditor(id=''){
  let f=db.foods.find(x=>x.id===id)||{};
  showModal(`<div class="toolbar"><h2>${id?'Editar':'Nuevo'} alimento</h2><button class="btn secondary" onclick="openFoodDB()">Atrás</button></div>
  <label>Nombre</label><input id="fName" value="${esc(f.name||'')}"><label>Marca</label><input id="fBrand" value="${esc(f.brand||'')}">
  <div class="grid2"><div><label>Ración de referencia</label><input id="fServing" type="number" step=".1" value="${f.serving??100}"></div><div><label>Unidad</label><select id="fUnit">${['g','ml','unidad','ración'].map(x=>`<option ${f.unit===x?'selected':''}>${x}</option>`).join('')}</select></div></div>
  <div class="grid4"><div><label>kcal</label><input id="fKcal" type="number" step=".1" value="${f.kcal??''}"></div><div><label>Proteína</label><input id="fProtein" type="number" step=".1" value="${f.protein??''}"></div><div><label>Hidratos</label><input id="fCarbs" type="number" step=".1" value="${f.carbs??''}"></div><div><label>Grasa</label><input id="fFat" type="number" step=".1" value="${f.fat??''}"></div></div>
  <div class="grid2"><div><label>Fibra</label><input id="fFiber" type="number" step=".1" value="${f.fiber??''}"></div><div><label>Azúcares</label><input id="fSugar" type="number" step=".1" value="${f.sugar??''}"></div></div>
  <label>Código de barras</label><input id="fBarcode" inputmode="numeric" value="${esc(f.barcode||'')}">
  <div class="actions"><button class="btn primary" onclick="saveFood('${id}')">Guardar</button>${id?`<button class="btn danger" onclick="deleteFood('${id}')">Eliminar</button>`:''}</div>`);
}
function saveFood(id){
  let data={id:id||uid(),name:fName.value.trim(),brand:fBrand.value.trim(),serving:num(fServing.value)||100,unit:fUnit.value,kcal:num(fKcal.value),protein:num(fProtein.value),carbs:num(fCarbs.value),fat:num(fFat.value),fiber:num(fFiber.value),sugar:num(fSugar.value),barcode:fBarcode.value.trim()};
  if(!data.name)return alert('Indica el nombre.');
  if(id)db.foods=db.foods.map(x=>x.id===id?data:x);else db.foods.push(data);save();openFoodDB()
}
function deleteFood(id){if(confirm('¿Eliminar este alimento de tu base?')){db.foods=db.foods.filter(x=>x.id!==id);save();openFoodDB()}}

function openBarcode(){
  showModal(`<div class="toolbar"><h2>Código de barras</h2><button class="btn secondary" onclick="closeModal()">Cerrar</button></div>
  <p class="muted">Escribe o escanea el EAN. La app buscará primero en tu base y, si no existe, intentará consultarlo en Open Food Facts.</p>
  <div class="search-row"><input id="barcodeInput" inputmode="numeric" placeholder="841..."><button class="btn primary" onclick="lookupBarcode()">Buscar</button></div>
  <div class="actions"><button class="btn blue" onclick="scanBarcode()">📷 Escanear con cámara</button></div><div id="barcodeResult"></div>`);
}
async function scanBarcode(){
  if(!('BarcodeDetector'in window)){alert('Este navegador no permite escaneo directo. Introduce el código manualmente.');return}
  try{
    let stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
    let video=document.createElement('video');video.autoplay=true;video.playsInline=true;video.srcObject=stream;barcodeResult.innerHTML='';barcodeResult.appendChild(video);video.style.width='100%';
    let det=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']});
    let timer=setInterval(async()=>{try{let b=await det.detect(video);if(b.length){clearInterval(timer);stream.getTracks().forEach(t=>t.stop());barcodeInput.value=b[0].rawValue;lookupBarcode()}}catch{}},500);
    setTimeout(()=>{clearInterval(timer);stream.getTracks().forEach(t=>t.stop())},30000);
  }catch{alert('No se pudo abrir la cámara.')}
}
async function lookupBarcode(){
  let code=barcodeInput.value.trim();if(!code)return;
  let local=db.foods.find(f=>f.barcode===code);if(local){barcodeResult.innerHTML=`<div class="notice"><b>${esc(local.name)}</b><br>Encontrado en tu base.</div><div class="actions"><button class="btn primary" onclick="closeModal();openAddEntry()">Añadir a comida</button></div>`;return}
  barcodeResult.innerHTML='<p class="muted">Buscando…</p>';
  try{
    let r=await fetch('https://world.openfoodfacts.org/api/v2/product/'+encodeURIComponent(code)+'.json');
    let j=await r.json();if(!j.product)throw 0;let p=j.product,n=p.nutriments||{};
    let f={id:uid(),name:p.product_name_es||p.product_name||'Producto '+code,brand:p.brands||'',serving:100,unit:'g',kcal:num(n['energy-kcal_100g']),protein:num(n.proteins_100g),carbs:num(n.carbohydrates_100g),fat:num(n.fat_100g),fiber:num(n.fiber_100g),sugar:num(n.sugars_100g),barcode:code};
    db.foods.push(f);save();barcodeResult.innerHTML=`<div class="notice"><b>${esc(f.name)}</b><br>${Math.round(f.kcal)} kcal / 100 g. Guardado en tu base.</div>`;
  }catch{barcodeResult.innerHTML='<div class="notice danger-note">No se ha encontrado el producto. Puedes crearlo manualmente en la base de alimentos.</div>'}
}


function mondayOf(dateStr){
  let d=new Date((dateStr||todayISO())+'T12:00:00');
  let day=(d.getDay()+6)%7; d.setDate(d.getDate()-day);
  return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)
}
function addDays(dateStr,n){
  let d=new Date(dateStr+'T12:00:00');d.setDate(d.getDate()+n);
  return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)
}
function planDay(date){if(!db.menuPlans[date])db.menuPlans[date]={};return db.menuPlans[date]}
function openMenuPlanner(anchor=todayISO()){
  const monday=mondayOf(anchor);
  showModal(`<div class="toolbar"><div><div class="kicker">PROGRAMACIÓN SEMANAL</div><h2>Menús</h2></div><button class="btn secondary" onclick="closeModal()">Cerrar</button></div>
  <div class="toolbar"><button class="btn secondary" onclick="shiftPlanner('${monday}',-7)">← Semana anterior</button><span class="pill">${monday} · ${addDays(monday,6)}</span><button class="btn secondary" onclick="shiftPlanner('${monday}',7)">Semana siguiente →</button></div>
  <p class="muted">Programa las comidas antes de cada día. Después puedes pasarlas al registro diario con un toque y modificar cantidades si hace falta.</p>
  <div id="plannerWeek">${renderPlannerWeek(monday)}</div>`);
}
function shiftPlanner(monday,days){openMenuPlanner(addDays(monday,days))}
function renderPlannerWeek(monday){
  return Array.from({length:7},(_,i)=>{
    let date=addDays(monday,i),pd=planDay(date);
    return `<section class="card" style="margin-top:12px">
      <div class="toolbar">
        <div><b>${new Date(date+'T12:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'short'})}</b></div>
        <div class="actions"><button class="btn blue" onclick="applyPlanToDay('${date}')">Usar este menú</button><button class="btn secondary" onclick="copyPlanDay('${date}')">Copiar</button></div>
      </div>
      ${MEALS.map(meal=>{
        let items=(pd[meal]||[]);
        return `<div class="meal-card"><div class="meal-head"><h3>${meal}</h3><button class="btn secondary" onclick="addPlanItem('${date}','${meal}')">+ Añadir</button></div>
        ${items.length?items.map(x=>`<div class="food-row"><div><div class="food-name">${esc(x.name)}</div><div class="food-meta">${fmt(x.qty)} ${esc(x.unit||'g')} · ${Math.round(num(x.kcal))} kcal · P ${fmt(x.protein)} · HC ${fmt(x.carbs)} · G ${fmt(x.fat)}</div></div><div class="actions"><button class="btn secondary" onclick="editPlanItem('${date}','${meal}','${x.id}')">Editar</button><button class="btn danger" onclick="deletePlanItem('${date}','${meal}','${x.id}')">×</button></div></div>`).join(''):'<div class="muted small">Sin programar</div>'}
        </div>`
      }).join('')}
      <div class="actions"><button class="btn secondary" onclick="duplicatePlanDay('${date}')">Duplicar a otro día</button><button class="btn secondary" onclick="pastePlanDay('${date}')">Pegar menú</button><button class="btn danger" onclick="clearPlanDay('${date}')">Vaciar día</button></div>
    </section>`
  }).join('')
}
function addPlanItem(date,meal){openPlanItemEditor(date,meal,null)}
function editPlanItem(date,meal,id){
  let item=(planDay(date)[meal]||[]).find(x=>x.id===id);openPlanItemEditor(date,meal,item)
}
function openPlanItemEditor(date,meal,item){
  showModal(`<div class="toolbar"><h2>${item?'Editar':'Añadir'} · ${meal}</h2><button class="btn secondary" onclick="openMenuPlanner('${date}')">Atrás</button></div>
  <label>Alimento</label><input id="pName" value="${esc(item?.name||'')}" placeholder="Ej. pollo">
  <div class="grid2"><div><label>Cantidad</label><input id="pQty" type="number" step=".1" value="${item?.qty??''}"></div><div><label>Unidad</label><select id="pUnit">${['g','ml','unidad','ración'].map(x=>`<option ${item?.unit===x?'selected':''}>${x}</option>`).join('')}</select></div></div>
  <div class="grid4"><div><label>kcal</label><input id="pKcal" type="number" step=".1" value="${item?.kcal??''}"></div><div><label>Proteína</label><input id="pProtein" type="number" step=".1" value="${item?.protein??''}"></div><div><label>Hidratos</label><input id="pCarbs" type="number" step=".1" value="${item?.carbs??''}"></div><div><label>Grasa</label><input id="pFat" type="number" step=".1" value="${item?.fat??''}"></div></div>
  <label>Buscar en mi base de alimentos</label><div class="search-row"><input id="pSearch" placeholder="Buscar"><button class="btn secondary" onclick="searchFoodForPlan()">Buscar</button></div><div id="pResults"></div>
  <div class="actions"><button class="btn primary" onclick="savePlanItem('${date}','${meal}','${item?.id||''}')">Guardar</button></div>`);
}
function searchFoodForPlan(){
  let q=pSearch.value.trim().toLowerCase();let res=db.foods.filter(f=>f.name.toLowerCase().includes(q)||String(f.brand||'').toLowerCase().includes(q)).slice(0,8);
  pResults.innerHTML=res.length?res.map(f=>`<div class="food-row"><div><b>${esc(f.name)}</b><div class="food-meta">${esc(f.brand||'')} · ${Math.round(num(f.kcal))} kcal / ${fmt(f.serving||100)} ${esc(f.unit||'g')}</div></div><button class="btn blue" onclick="useFoodForPlan('${f.id}')">Usar</button></div>`).join(''):'<div class="empty">Sin coincidencias.</div>'
}
function useFoodForPlan(id){
  let f=db.foods.find(x=>x.id===id);if(!f)return;
  pName.value=f.name;pQty.value=f.serving||100;pUnit.value=f.unit||'g';pKcal.value=f.kcal;pProtein.value=f.protein;pCarbs.value=f.carbs;pFat.value=f.fat
}
function savePlanItem(date,meal,id){
  let pd=planDay(date);pd[meal]=pd[meal]||[];
  let data={id:id||uid(),name:pName.value.trim(),qty:num(pQty.value),unit:pUnit.value,kcal:num(pKcal.value),protein:num(pProtein.value),carbs:num(pCarbs.value),fat:num(pFat.value)};
  if(!data.name)return alert('Indica el alimento.');
  if(id)pd[meal]=pd[meal].map(x=>x.id===id?data:x);else pd[meal].push(data);
  save();openMenuPlanner(date)
}
function deletePlanItem(date,meal,id){let pd=planDay(date);pd[meal]=(pd[meal]||[]).filter(x=>x.id!==id);save();openMenuPlanner(date)}
function clearPlanDay(date){if(confirm('¿Vaciar toda la programación de este día?')){db.menuPlans[date]={};save();openMenuPlanner(date)}}
function applyPlanToDay(date){
  let pd=planDay(date),d=day(date),items=[];
  MEALS.forEach(meal=>(pd[meal]||[]).forEach(x=>items.push({...x,id:uid(),meal,omitted:false})));
  if(!items.length)return alert('Ese día no tiene menú programado.');
  if(d.entries.length&&!confirm('Ya hay alimentos registrados ese día. ¿Añadir también los programados?'))return;
  d.entries.push(...items);save();alert('Menú añadido al registro del día.');openMenuPlanner(date)
}
function duplicatePlanDay(date){
  let target=prompt('Fecha de destino (AAAA-MM-DD):',addDays(date,1));if(!target)return;
  db.menuPlans[target]=JSON.parse(JSON.stringify(planDay(date)));
  Object.values(db.menuPlans[target]).flat().forEach(x=>x.id=uid());
  save();openMenuPlanner(date)
}
function copyPlanDay(date){
  window.__copiedMenuPlan=JSON.parse(JSON.stringify(planDay(date)));alert('Menú del día copiado. En cualquier otro día usa “Pegar menú”.');
}

function pastePlanDay(date){
  if(!window.__copiedMenuPlan)return alert('Primero copia el menú de otro día.');
  db.menuPlans[date]=JSON.parse(JSON.stringify(window.__copiedMenuPlan));
  Object.values(db.menuPlans[date]).flat().forEach(x=>x.id=uid());
  save();openMenuPlanner(date)
}

function renderMeasurements(){
  setTitle('Medidas');let date=todayISO();
  content().innerHTML=`
  <section class="card"><div class="kicker">REGISTRAR HOY</div><h2>Mediciones</h2>
    <label>Fecha</label><input id="mDate" type="date" value="${date}">
    <div class="grid2"><div><label>Peso (kg)</label><input id="mWeight" type="number" step=".1"></div><div><label>Cintura (cm)</label><input id="mWaist" type="number" step=".1"></div></div>
    <div class="grid2"><div><label>Grasa corporal (%)</label><input id="mFat" type="number" step=".1"></div><div><label>Masa muscular (kg)</label><input id="mMuscle" type="number" step=".1"></div></div>
    <div class="grid4"><div><label>Sueño 1–5</label><input id="mSleep" type="number" min="1" max="5"></div><div><label>Hambre 1–5</label><input id="mHunger" type="number" min="1" max="5"></div><div><label>Energía 1–5</label><input id="mEnergy" type="number" min="1" max="5"></div><div><label>Pasos</label><input id="mSteps" type="number"></div></div>
    <label>Notas</label><textarea id="mNotes"></textarea>
    <div class="actions"><button class="btn primary" onclick="saveMeasurement()">Guardar</button></div>
  </section>
  <section class="card"><h2>Historial</h2><div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Peso</th><th>Cintura</th><th>Grasa</th><th>Músculo</th><th></th></tr></thead><tbody>${measurementRows()}</tbody></table></div></section>`;
}
function measurementRows(){
  let r=[...db.measurements].sort((a,b)=>b.date.localeCompare(a.date));
  return r.length?r.map(m=>`<tr><td>${m.date}</td><td>${fmt(m.weight)}</td><td>${fmt(m.waist)}</td><td>${fmt(m.bodyFat)}</td><td>${fmt(m.muscle)}</td><td><button class="btn danger" onclick="deleteMeasurement('${m.id}')">×</button></td></tr>`).join(''):'<tr><td colspan="6" class="muted">Sin mediciones.</td></tr>'
}
function saveMeasurement(){
  let date=mDate.value,data={id:uid(),date,weight:num(mWeight.value)||'',waist:num(mWaist.value)||'',bodyFat:num(mFat.value)||'',muscle:num(mMuscle.value)||'',sleep:num(mSleep.value)||'',hunger:num(mHunger.value)||'',energy:num(mEnergy.value)||'',steps:num(mSteps.value)||'',notes:mNotes.value.trim()};
  if(!data.weight&&!data.waist&&!data.bodyFat&&!data.muscle&&!data.sleep&&!data.hunger&&!data.energy&&!data.steps)return alert('Introduce al menos un dato.');
  db.measurements=db.measurements.filter(x=>x.date!==date);db.measurements.push(data);save();render()
}
function deleteMeasurement(id){if(confirm('¿Eliminar esta medición?')){db.measurements=db.measurements.filter(x=>x.id!==id);save();render()}}

function renderProgress(){
  setTitle('Progreso');let rows=[...db.measurements].sort((a,b)=>a.date.localeCompare(b.date)),last=rows.at(-1),first=rows[0];
  content().innerHTML=`
  <section class="card"><div class="kicker">EVOLUCIÓN</div><h2>Progreso corporal</h2>
    ${rows.length?`<div class="grid4"><div class="stat"><b>${fmt(last.weight)}</b><span>peso actual</span></div><div class="stat"><b>${fmt(last.waist)}</b><span>cintura actual</span></div><div class="stat"><b>${fmt(last.bodyFat)}</b><span>grasa %</span></div><div class="stat"><b>${fmt(last.muscle)}</b><span>músculo kg</span></div></div>`:'<div class="empty">Registra medidas para empezar.</div>'}
  </section>
  <section class="card"><h2>Peso</h2>${chartSVG(rows,'weight','kg')}</section>
  <section class="card"><h2>Cintura</h2>${chartSVG(rows,'waist','cm')}</section>
  <section class="card"><h2>Grasa corporal</h2>${chartSVG(rows,'bodyFat','%')}</section>
  <section class="card"><h2>Masa muscular</h2>${chartSVG(rows,'muscle','kg')}</section>`;
}
function chartSVG(rows,key,unit){
  let pts=rows.map((r,i)=>({v:num(r[key]),i,date:r.date})).filter(x=>x.v>0);
  if(pts.length<2)return '<div class="empty">Añade al menos dos registros para ver el gráfico.</div>';
  let w=700,h=210,p=28,min=Math.min(...pts.map(x=>x.v)),max=Math.max(...pts.map(x=>x.v));if(max===min){max+=1;min-=1}
  let coord=pts.map((x,j)=>({x:p+j*(w-2*p)/(pts.length-1),y:h-p-(x.v-min)*(h-2*p)/(max-min),...x}));
  let path=coord.map((c,i)=>(i?'L':'M')+c.x.toFixed(1)+' '+c.y.toFixed(1)).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img"><line x1="${p}" y1="${h-p}" x2="${w-p}" y2="${h-p}" stroke="#26344f"/><line x1="${p}" y1="${p}" x2="${p}" y2="${h-p}" stroke="#26344f"/><path d="${path}" fill="none" stroke="#21c766" stroke-width="4"/>${coord.map(c=>`<circle cx="${c.x}" cy="${c.y}" r="5" fill="#53c7ff"><title>${c.date}: ${fmt(c.v)} ${unit}</title></circle>`).join('')}<text x="${p}" y="18" fill="#9aa7bd" font-size="12">${fmt(max)} ${unit}</text><text x="${p}" y="${h-5}" fill="#9aa7bd" font-size="12">${pts[0].date}</text><text x="${w-p}" y="${h-5}" fill="#9aa7bd" font-size="12" text-anchor="end">${pts.at(-1).date}</text></svg>`
}

function renderBackup(){
  setTitle('Backup');
  content().innerHTML=`
  <section class="card"><h2>Objetivos diarios</h2><p class="muted">Puedes ajustarlos sin tocar el código.</p>
    <div class="grid4"><div><label>kcal</label><input id="sKcal" type="number" value="${db.settings.kcal||''}"></div><div><label>Proteína g</label><input id="sProtein" type="number" value="${db.settings.protein||''}"></div><div><label>Hidratos g</label><input id="sCarbs" type="number" value="${db.settings.carbs||''}"></div><div><label>Grasas g</label><input id="sFat" type="number" value="${db.settings.fat||''}"></div></div>
    <div class="actions"><button class="btn primary" onclick="saveSettings()">Guardar objetivos</button></div>
  </section>
  <section class="card"><h2>Copia de seguridad</h2><p class="muted">Exporta todos los datos de nutrición y mediciones. La importación también acepta el formato antiguo de JC Training y descarta expresamente los datos de entrenamiento.</p>
    <div class="actions"><button class="btn secondary" onclick="exportBackup()">Exportar copia</button><label class="btn secondary">Importar<input id="importFile" class="hidden" type="file" accept=".json" onchange="importBackup(this.files[0])"></label></div>
  </section>
  <section class="card"><h2>Estado</h2><div class="grid4"><div class="stat"><b>${db.foods.length}</b><span>alimentos</span></div><div class="stat"><b>${Object.keys(db.daily).length}</b><span>días con comidas</span></div><div class="stat"><b>${db.measurements.length}</b><span>mediciones</span></div><div class="stat"><b>0</b><span>entrenamientos</span></div></div>
    <div class="notice" style="margin-top:14px">Esta versión no contiene pantalla, temporizador, historial ni datos funcionales de entrenamiento.</div>
    <div class="actions"><button class="btn danger" onclick="clearAll()">Borrar todos los datos</button></div>
  </section>`;
}
function saveSettings(){db.settings={kcal:num(sKcal.value),protein:num(sProtein.value),carbs:num(sCarbs.value),fat:num(sFat.value)};save();alert('Objetivos guardados.');render()}
function exportBackup(){
  let out={app:'JC Nutrition',version:'2.0-no-training',exportedAt:new Date().toISOString(),data:db};
  let blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='JC_Nutrition_backup_'+todayISO()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
async function importBackup(file){
  if(!file)return;
  try{
    let j=JSON.parse(await file.text());
    if(j.data&&j.app==='JC Nutrition'){db=Object.assign(emptyState(),j.data);save();alert('Copia importada.');render();return}
    if(j.storage&&typeof j.storage==='object'){
      let imported=0;
      for(let [k,v] of Object.entries(j.storage)){
        if(k.startsWith('workout')||k.startsWith('sessionSummary')||k==='workoutHistory')continue;
        if(k.startsWith('meals:')){
          let date=k.split(':')[1];try{let flags=JSON.parse(v);let d=day(date);MEALS.forEach((m,i)=>{if(flags[i])d.completedMeals[m]=true});imported++}catch{}
        }
      }
      save();alert('Backup antiguo leído. Se han ignorado todos los datos de entrenamiento. Elementos de nutrición compatibles importados: '+imported+'.');render();return
    }
    throw new Error('Formato no reconocido');
  }catch(e){alert('No se pudo importar: '+e.message)}
}
function clearAll(){if(confirm('Esto borrará toda la información de JC Nutrition de este dispositivo. ¿Continuar?')){db=emptyState();save();render()}}

function showModal(html){modalCard.innerHTML=html;modal.classList.remove('hidden')}
function closeModal(){modal.classList.add('hidden');modalCard.innerHTML=''}
function go(v){currentView=v;render()}
document.querySelectorAll('.bottom-nav button').forEach(b=>b.onclick=()=>go(b.dataset.view));
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn.classList.remove('hidden')});
installBtn.onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.classList.add('hidden')}};

if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
render();
