// JC Training V9 — planes mensuales editables + grupo de verduras/hortalizas.
(function(){
'use strict';
const V9_KEY='v9Plans';
const clone=x=>JSON.parse(JSON.stringify(x));
const monthNow=()=>isoDate().slice(0,7);
function plans(){return load(V9_KEY,{})||{};}
function putPlans(p){save(V9_KEY,p);}
function snapshot(){return {training:clone(TRAINING),meals:clone(MEALS)};}
function ensureMonth(m){const p=plans();if(!p[m]){p[m]=snapshot();putPlans(p);}return p[m];}
function replaceObject(target,src){Object.keys(target).forEach(k=>delete target[k]);Object.entries(clone(src)).forEach(([k,v])=>target[k]=v);}
function applyMonth(m=monthNow()){const p=plans();if(p[m]){replaceObject(TRAINING,p[m].training);replaceObject(MEALS,p[m].meals);}}
// Semilla: la versión que el usuario ya tenía al instalar V9.
ensureMonth(monthNow()); applyMonth();

// Verduras/hortalizas: equivalencias aproximadas por energía y cantidad editable.
Object.assign(FOOD_DB,{
  vegetables:{label:'Verduras variadas',patterns:['verduras','verdura'],group:'vegetable',eq:30,state:'parte comestible'},
  salad:{label:'Ensalada / hortalizas',patterns:['ensalada','hortalizas','hortaliza'],group:'vegetable',eq:20,state:'parte comestible'},
  broccoli:{label:'Brócoli',patterns:['brocoli','brócoli'],group:'vegetable',eq:34,state:'parte comestible'},
  cauliflower:{label:'Coliflor',patterns:['coliflor'],group:'vegetable',eq:25,state:'parte comestible'},
  zucchini:{label:'Calabacín',patterns:['calabacin','calabacín'],group:'vegetable',eq:17,state:'parte comestible'},
  asparagus:{label:'Espárragos',patterns:['esparragos','espárragos'],group:'vegetable',eq:20,state:'parte comestible'},
  greenbeans:{label:'Judías verdes',patterns:['judias verdes','judías verdes'],group:'vegetable',eq:31,state:'parte comestible'}
});
GROUP_OPTIONS.vegetable=['vegetables','salad','broccoli','cauliflower','zucchini','asparagus','greenbeans'];
// Nutrición para que los macros sigan calculándose tras una sustitución vegetal.
V6_NUTRITION.push(
 {key:'hortalizas',patterns:['hortalizas','hortaliza'],mode:'100g',kcal:20,p:1,c:3,f:.2,label:'Ensalada / hortalizas'},
 {key:'broccoli',patterns:['brocoli','brócoli'],mode:'100g',kcal:34,p:2.8,c:6.6,f:.4,label:'Brócoli'},
 {key:'cauliflower',patterns:['coliflor'],mode:'100g',kcal:25,p:1.9,c:5,f:.3,label:'Coliflor'},
 {key:'zucchini',patterns:['calabacin','calabacín'],mode:'100g',kcal:17,p:1.2,c:3.1,f:.3,label:'Calabacín'},
 {key:'asparagus',patterns:['esparragos','espárragos'],mode:'100g',kcal:20,p:2.2,c:3.9,f:.1,label:'Espárragos'},
 {key:'greenbeans',patterns:['judias verdes','judías verdes'],mode:'100g',kcal:31,p:1.8,c:7,f:.2,label:'Judías verdes'}
);

function planButton(){return '<button class="secondary-btn v9-plan-btn" data-v9-open>Gestionar planes mensuales</button>';}
const prevTraining=renderTraining; renderTraining=function(){prevTraining();el('content').insertAdjacentHTML('afterbegin',`<section class="section"><div class="card"><strong>Plan mensual activo: ${monthNow()}</strong><p class="v9-note">Puedes preparar octubre, noviembre y los meses siguientes sin tocar GitHub ni Netlify.</p>${planButton()}</div></section>`);bindOpen();};
const prevMeals=renderMeals; renderMeals=function(){prevMeals();el('content').insertAdjacentHTML('afterbegin',`<section class="section"><div class="card"><strong>Plan mensual activo: ${monthNow()}</strong><p class="v9-note">Edita alimentos y cantidades del plan base o prepara otro mes.</p>${planButton()}</div></section>`);bindOpen();};
function bindOpen(){document.querySelectorAll('[data-v9-open]').forEach(b=>b.onclick=()=>openPlans(monthNow()));}

function openPlans(month){ensureMonth(month);state.view='v9plans';renderV9(month,'training');}
function dayKeys(plan){return Object.keys(plan.training);}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function renderV9(month,tab){const p=ensureMonth(month);document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));el('pageTitle').textContent='Planes';
 el('content').innerHTML=`<section class="section"><div class="card"><div class="v9-plan-head"><label><span class="small-label">Mes que quieres editar</span><input id="v9Month" class="input" type="month" value="${month}"></label><button id="v9Duplicate" class="secondary-btn">Duplicar mes anterior</button></div><p class="v9-note">Cada mes conserva su propio plan. Cambiar un mes futuro no modifica el historial ni los registros anteriores.</p></div><div class="v9-tabs"><button id="v9TabTraining" class="${tab==='training'?'primary-btn':'secondary-btn'}">Entreno</button><button id="v9TabMeals" class="${tab==='meals'?'primary-btn':'secondary-btn'}">Comidas</button></div><div id="v9Editor">${tab==='training'?trainingEditor(p):mealsEditor(p)}</div><button id="v9Save" class="primary-btn" style="width:100%;margin:14px 0 8px">Guardar plan de ${month}</button><button id="v9Back" class="secondary-btn" style="width:100%">Volver</button></section>`;
 el('v9Month').onchange=e=>renderV9(e.target.value,tab);el('v9TabTraining').onclick=()=>renderV9(month,'training');el('v9TabMeals').onclick=()=>renderV9(month,'meals');
 el('v9Duplicate').onclick=()=>duplicatePrevious(month,tab);el('v9Save').onclick=()=>saveEditor(month,tab);el('v9Back').onclick=()=>{state.view=tab==='training'?'training':'meals';render();}; bindEditorActions(month,tab);
}
function trainingEditor(p){return dayKeys(p).map(day=>{const d=p.training[day];return `<details class="card v9-edit-card"><summary>${day.toUpperCase()} · ${esc(d.name)}</summary><label class="v9-field"><span>Nombre</span><input class="input" data-v9-tname="${day}" value="${esc(d.name)}"></label><label class="v9-field"><span>Enfoque</span><input class="input" data-v9-tfocus="${day}" value="${esc(d.focus)}"></label><div data-v9-exercises="${day}">${d.exercises.map((x,i)=>exerciseRow(day,i,x)).join('')}</div><button class="secondary-btn" data-v9-addex="${day}" style="margin-top:10px">+ Añadir ejercicio</button></details>`}).join('');}
function exerciseRow(day,i,x){return `<div class="v9-ex-grid" data-v9-exrow="${day}|${i}"><input class="input" data-f="name" value="${esc(x[0])}" placeholder="Ejercicio"><input class="input" data-f="sets" value="${esc(x[1])}" placeholder="Series"><input class="input" data-f="reps" value="${esc(x[2])}" placeholder="Reps"><input class="input" data-f="rest" value="${esc(x[3])}" placeholder="Descanso"><input class="input" data-f="rir" value="${esc(x[4])}" placeholder="RIR"><button class="secondary-btn v9-danger" data-v9-delex="${day}|${i}">Eliminar</button></div>`;}
function mealsEditor(p){return Object.keys(p.meals).map(day=>`<details class="card v9-edit-card"><summary>${day.toUpperCase()}</summary>${p.meals[day].map((m,mi)=>`<div style="margin-top:14px"><label class="v9-field"><span>Comida</span><input class="input" data-v9-mname="${day}|${mi}" value="${esc(m[0])}"></label><div data-v9-foods="${day}|${mi}">${m[1].map((f,fi)=>foodRow(day,mi,fi,f)).join('')}</div><button class="secondary-btn" data-v9-addfood="${day}|${mi}" style="margin-top:8px">+ Añadir alimento</button></div>`).join('')}</details>`).join('');}
function foodRow(day,mi,fi,f){return `<div class="v9-food-edit" data-v9-foodrow="${day}|${mi}|${fi}"><input class="input" value="${esc(f)}" placeholder="Ej. 250 g merluza"><button class="secondary-btn v9-danger" data-v9-delfood="${day}|${mi}|${fi}">×</button></div>`;}
function readTraining(p){dayKeys(p).forEach(day=>{p.training[day].name=document.querySelector(`[data-v9-tname="${day}"]`)?.value.trim()||p.training[day].name;p.training[day].focus=document.querySelector(`[data-v9-tfocus="${day}"]`)?.value.trim()||'';const rows=[...document.querySelectorAll(`[data-v9-exrow^="${day}|"]`)];p.training[day].exercises=rows.map(r=>[r.querySelector('[data-f=name]').value.trim(),+r.querySelector('[data-f=sets]').value||0,r.querySelector('[data-f=reps]').value.trim(),+r.querySelector('[data-f=rest]').value||0,r.querySelector('[data-f=rir]').value.trim()]).filter(x=>x[0]);});}
function readMeals(p){Object.keys(p.meals).forEach(day=>p.meals[day].forEach((m,mi)=>{m[0]=document.querySelector(`[data-v9-mname="${day}|${mi}"]`)?.value.trim()||m[0];m[1]=[...document.querySelectorAll(`[data-v9-foodrow^="${day}|${mi}|"] input`)].map(x=>x.value.trim()).filter(Boolean);}));}
function saveEditor(month,tab){const all=plans(),p=all[month]||ensureMonth(month);tab==='training'?readTraining(p):readMeals(p);all[month]=p;putPlans(all);if(month===monthNow())applyMonth(month);alert(`Plan de ${month} guardado.`);renderV9(month,tab);}
function previousMonth(m){const [y,mo]=m.split('-').map(Number),d=new Date(y,mo-2,1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}
function duplicatePrevious(month,tab){const prev=previousMonth(month),all=plans();if(!all[prev])return alert(`No existe un plan guardado para ${prev}.`);if(all[month]&&!confirm(`¿Sustituir el plan de ${month} por una copia de ${prev}?`))return;all[month]=clone(all[prev]);putPlans(all);renderV9(month,tab);}
function bindEditorActions(month,tab){document.querySelectorAll('[data-v9-addex]').forEach(b=>b.onclick=()=>{const all=plans(),p=all[month];readTraining(p);p.training[b.dataset.v9Addex].exercises.push(['Nuevo ejercicio',3,'10',90,'RIR 1–2']);all[month]=p;putPlans(all);renderV9(month,tab);});document.querySelectorAll('[data-v9-delex]').forEach(b=>b.onclick=()=>{const [day,i]=b.dataset.v9Delex.split('|');const all=plans(),p=all[month];readTraining(p);p.training[day].exercises.splice(+i,1);all[month]=p;putPlans(all);renderV9(month,tab);});document.querySelectorAll('[data-v9-addfood]').forEach(b=>b.onclick=()=>{const [day,mi]=b.dataset.v9Addfood.split('|');const all=plans(),p=all[month];readMeals(p);p.meals[day][+mi][1].push('Nuevo alimento');all[month]=p;putPlans(all);renderV9(month,tab);});document.querySelectorAll('[data-v9-delfood]').forEach(b=>b.onclick=()=>{const [day,mi,fi]=b.dataset.v9Delfood.split('|');const all=plans(),p=all[month];readMeals(p);p.meals[day][+mi][1].splice(+fi,1);all[month]=p;putPlans(all);renderV9(month,tab);});}

// Routing: conserva la vista especial del editor.
const v9PrevRender=render;render=function(){if(state.view==='v9plans')return renderV9(monthNow(),'training');applyMonth();return v9PrevRender();};
// Backup V9: V7.1 exporta todo localStorage; actualizamos solo la versión visible del archivo.
window.JC_TRAINING_VERSION='9';
// API interna expuesta para extensiones posteriores (V10+).
Object.assign(window,{v9PlansGet:plans,v9PlansPut:putPlans,v9ApplyMonth:applyMonth,v9MonthNow:monthNow,v9ReadMeals:readMeals,v9Render:renderV9,v9BindEditorActions:bindEditorActions});
render();
})();
