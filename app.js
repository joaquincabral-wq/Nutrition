window.JC_NUTRITION_VERSION='8.3';

const DAYS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

const BASE_MEALS={
 lunes:[['Desayuno',['60 g avena','30 g whey','100 g arándanos','300 ml bebida de almendras sin azúcar']],['Comida',['250 g pechuga de pollo','75 g arroz en crudo','300 g verdura','10 g AOVE','150 g melón']],['Merienda',['250 g queso fresco batido 0%','150 g melocotón','15 g pistachos']],['Cena',['250 g merluza','200 g patata en crudo','300 g verdura o ensalada','10 g AOVE']]],
 martes:[['Desayuno',['3 huevos','150 ml claras de huevo','55 g Crema de arroz ProCao','100 g arándanos','250 ml bebida de almendras sin azúcar']],['Comida',['250 g ternera magra','75 g arroz en crudo','300 g verdura','5 g AOVE','150 g melón']],['Merienda',['250 g queso fresco batido 0%','150 g melocotón']],['Cena',['300 g bacalao','200 g patata en crudo','300 g verdura','10 g AOVE']]],
 miércoles:[['Desayuno',['60 g avena','30 g whey','10 g cacahuete en polvo','100 g arándanos','300 ml bebida de almendras sin azúcar']],['Comida',['250 g pechuga de pollo o pavo','85 g arroz en crudo','300 g verdura','10 g AOVE','150 g fruta']],['Merienda',['250 g queso fresco batido 0%','150 g fruta','15 g pistachos']],['Cena',['250 g dorada','250 g patata en crudo','300 g ensalada o verdura','5 g AOVE']]],
 jueves:[['Desayuno',['3 huevos','150 ml claras de huevo','55 g Crema de arroz ProCao','100 g fruta','250 ml bebida de almendras sin azúcar']],['Comida',['250 g pechuga de pollo','75 g arroz en crudo','300 g verdura','10 g AOVE','150 g fruta']],['Merienda',['250 g queso fresco batido 0%','150 g fruta']],['Cena',['250 g merluza','200 g patata en crudo','300 g verdura','10 g AOVE']]],
 viernes:[['Desayuno',['60 g avena','30 g whey','10 g cacahuete en polvo','100 g arándanos','300 ml bebida de almendras sin azúcar']],['Comida',['250 g ternera magra','85 g arroz en crudo','300 g verdura','5 g AOVE','150 g fruta']],['Merienda',['250 g queso fresco batido 0%','150 g fruta','15 g pistachos']],['Cena',['300 g pescado blanco','250 g patata en crudo','300 g verdura','10 g AOVE']]],
 sábado:[['Desayuno',['2 huevos','150 ml claras de huevo','60 g aguacate','150 g fruta']],['Comida',['250 g pechuga de pollo o pavo','60 g arroz en crudo','300 g verdura','10 g AOVE','150 g fruta']],['Merienda',['250 g queso fresco batido 0%','150 g fruta']],['Cena',['250 g pescado','150 g patata en crudo','300 g ensalada','10 g AOVE']]],
 domingo:[['Desayuno',['2 huevos','90 ml claras de huevo','60 g aguacate','150 g fruta']],['Comida',['250 g carne magra','200 g patata en crudo','300 g verdura','5 g AOVE','150 g fruta']],['Merienda',['250 g queso fresco batido 0%','150 g fruta']],['Cena',['250 g pescado blanco','150 g patata en crudo','300 g ensalada','10 g AOVE']]]
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
 ['pescado',['pescado'],110,20,0,3],
 ['activia',['activia natural edulcorado','activia'],39,4.0,4.8,0.4],
 ['salvado_avena',['salvado de avena','salvado'],246,17.3,66.2,7.0],
 ['fresas',['fresas','fresa'],32,0.7,7.7,0.3]
];


const SMART_FOODS=[
 {name:'Pollo',cat:'proteina',kcal:120,p:23,c:0,f:2.6},
 {name:'Pavo plancha',cat:'proteina',kcal:115,p:24,c:0,f:1.5},
 {name:'Cinta de lomo',cat:'proteina',kcal:150,p:22,c:0,f:6},
 {name:'Ternera magra',cat:'proteina',kcal:170,p:24,c:0,f:8},
 {name:'Merluza',cat:'proteina',kcal:86,p:18.5,c:0,f:1.8},
 {name:'Bacalao',cat:'proteina',kcal:82,p:18,c:0,f:.7},
 {name:'Dorada',cat:'proteina',kcal:115,p:20,c:0,f:4},
 {name:'Salmón',cat:'proteina',kcal:208,p:20,c:0,f:13},
 {name:'Atún fresco',cat:'proteina',kcal:144,p:23,c:0,f:5},
 {name:'Gambas',cat:'proteina',kcal:99,p:24,c:.2,f:.3},
 {name:'Arroz en crudo',cat:'hidrato',kcal:360,p:7,c:80,f:.7},
 {name:'Patata en crudo',cat:'hidrato',kcal:77,p:2,c:17,f:.1},
 {name:'Batata en crudo',cat:'hidrato',kcal:86,p:1.6,c:20,f:.1},
 {name:'Avena',cat:'hidrato',kcal:389,p:16.9,c:66.3,f:6.9},
 {name:'Melocotón',cat:'fruta',kcal:39,p:.9,c:9.5,f:.3},
 {name:'Sandía',cat:'fruta',kcal:30,p:.6,c:7.6,f:.2},
 {name:'Arándanos',cat:'fruta',kcal:57,p:.7,c:14.5,f:.3},
 {name:'Frambuesas',cat:'fruta',kcal:52,p:1.2,c:12,f:.7},
 {name:'Moras',cat:'fruta',kcal:43,p:1.4,c:10,f:.5},
 {name:'Plátano',cat:'fruta',kcal:89,p:1.1,c:23,f:.3},
 {name:'Ciruelas',cat:'fruta',kcal:46,p:.7,c:11,f:.3},
 {name:'Calabacín',cat:'verdura',kcal:17,p:1.2,c:3.1,f:.3},
 {name:'Berenjena',cat:'verdura',kcal:25,p:1,c:6,f:.2},
 {name:'Brócoli',cat:'verdura',kcal:34,p:2.8,c:7,f:.4},
 {name:'Coliflor',cat:'verdura',kcal:25,p:1.9,c:5,f:.3},
 {name:'Copos de avena',cat:'hidrato',kcal:389,p:16.9,c:66.3,f:6.9},
 {name:'Salvado de avena',cat:'hidrato',kcal:246,p:17.3,c:66.2,f:7.0},
 {name:'Queso fresco batido 0%',cat:'lacteo',kcal:46,p:8.0,c:4.0,f:0.2},
 {name:'Activia natural edulcorado',cat:'lacteo',kcal:39,p:4.0,c:4.8,f:0.4},
 {name:'Tomate natural',cat:'verdura',kcal:18,p:0.9,c:3.9,f:0.2},
 {name:'Tomate cherry',cat:'verdura',kcal:18,p:0.9,c:3.9,f:0.2},
 {name:'Lechuga',cat:'verdura',kcal:15,p:1.4,c:2.9,f:0.2},
 {name:'Pepino',cat:'verdura',kcal:15,p:0.7,c:3.6,f:0.1},
 {name:'Espárragos verdes',cat:'verdura',kcal:20,p:2.2,c:3.9,f:0.1},
 {name:'Pimiento',cat:'verdura',kcal:31,p:1.0,c:6.0,f:0.3},
 {name:'Champiñones',cat:'verdura',kcal:22,p:3.1,c:3.3,f:0.3},
 {name:'Judías verdes',cat:'verdura',kcal:31,p:1.8,c:7.0,f:0.2},
 {name:'Cebolla',cat:'verdura',kcal:40,p:1.1,c:9.3,f:0.1},
 {name:'Espinacas',cat:'verdura',kcal:23,p:2.9,c:3.6,f:0.4},
 {name:'Zanahoria',cat:'verdura',kcal:41,p:0.9,c:9.6,f:0.2},
 {name:'Melón',cat:'fruta',kcal:34,p:0.8,c:8.2,f:0.2},
 {name:'Naranja',cat:'fruta',kcal:47,p:0.9,c:11.8,f:0.1},
 {name:'Manzana',cat:'fruta',kcal:52,p:0.3,c:13.8,f:0.2},
 {name:'Pera',cat:'fruta',kcal:57,p:0.4,c:15.2,f:0.1},
 {name:'Kiwi',cat:'fruta',kcal:61,p:1.1,c:14.7,f:0.5},
 {name:'Pechuga de pollo',cat:'proteina',kcal:120,p:23,c:0,f:2.6},
 {name:'Pechuga de pavo',cat:'proteina',kcal:115,p:24,c:0,f:1.5},
 {name:'Claras de huevo',cat:'proteina',kcal:46,p:10.5,c:0.7,f:0.2},
 {name:'Pasta en crudo',cat:'hidrato',kcal:350,p:12,c:72,f:1.5},
 {name:'Bebida de almendras sin azúcar',cat:'lacteo',kcal:13,p:0.4,c:0.2,f:1.1},
 {name:'Fresas',cat:'fruta',kcal:32,p:0.7,c:7.7,f:0.3},
 {name:'AOVE',cat:'grasa',kcal:884,p:0,c:0,f:100},
 {name:'Crema de arroz ProCao',cat:'hidrato',kcal:352,p:8.8,c:74,f:1.5}
];

function customFoods(){return load('customFoodsV8',[]);}
function classifyFood(name,kcal,p,c,f){
 const n=String(name||'').toLowerCase();
 if(/fruta|fresa|arándan|arandan|melocot|sandía|sandia|plátano|platano|ciruela|melón|melon|naranja|manzana|pera|kiwi|framb|mora/.test(n))return'fruta';
 if(/lechuga|tomate|pepino|espárr|esparr|pimiento|champi|judía|judia|cebolla|espinaca|zanahoria|brócoli|brocoli|coliflor|calabac|berenjena|verdura/.test(n))return'verdura';
 if(/yogur|queso|kéfir|kefir|leche|lácteo|lacteo|almendra/.test(n))return'lacteo';
 if(f>=45&&c<20&&p<20)return'grasa';
 if(p>=18&&p>=c*.8)return'proteina';
 if(c>=30&&c>=p*1.5)return'hidrato';
 if(kcal<=70&&c>=5&&f<5)return'fruta';
 return'mixto';
}
function normalizedCustomFood(x){
 const ref=Number(x.refQty)||100, factor=100/ref;
 if(x.normalized!==false && !x.refQty)return {...x,refQty:100,refUnit:x.unit||'g'};
 return {...x,kcal:Number(x.labelKcal??x.kcal)*factor,p:Number(x.labelP??x.p)*factor,c:Number(x.labelC??x.c)*factor,f:Number(x.labelF??x.f)*factor,unit:x.refUnit||x.unit||'g'};
}

const RODILLA_FOODS=[
 {name:'Rodilla · Pollo curry',cat:'rodilla',unitKcal:155,unitP:7,unitC:15,unitF:7,estimate:true},
 {name:'Rodilla · Pollo mostaza',cat:'rodilla',unitKcal:145,unitP:8,unitC:15,unitF:6,estimate:true},
 {name:'Rodilla · Vegetal',cat:'rodilla',unitKcal:130,unitP:4,unitC:15,unitF:6,estimate:true},
 {name:'Rodilla · Queso, nueces y Oporto',cat:'rodilla',unitKcal:170,unitP:5,unitC:15,unitF:10,estimate:true},
 {name:'Rodilla · Queso azul y rúcula',cat:'rodilla',unitKcal:150,unitP:5,unitC:15,unitF:8,estimate:true},
 {name:'Rodilla · Ahumados',cat:'rodilla',unitKcal:145,unitP:6,unitC:15,unitF:7,estimate:true},
 {name:'Rodilla · Atún con tomate',cat:'rodilla',unitKcal:140,unitP:7,unitC:15,unitF:6,estimate:true}
];

function allFoodCatalog(){return [...RODILLA_FOODS,...SMART_FOODS,...customFoods().map(normalizedCustomFood)];}
function smartFoodFromText(text){
 const t=String(text).toLowerCase();
 const exact=allFoodCatalog().find(x=>t.includes(String(x.name).toLowerCase()));
 if(exact)return exact;
 const rules=[
  ['Fresas',['fresas','fresa']],
  ['Bebida de almendras sin azúcar',['bebida de almendras','almendras sin azúcar']],
  ['Tomate cherry',['tomate cherry','cherry']],
  ['Tomate natural',['tomate natural','tomate']],
  ['Lechuga',['lechuga']],
  ['Pepino',['pepino']],
  ['Espárragos verdes',['espárragos','esparragos']],
  ['Pimiento',['pimiento']],
  ['Champiñones',['champiñ']],
  ['Judías verdes',['judías verdes','judias verdes']],
  ['Cebolla',['cebolla']],
  ['Espinacas',['espinaca']],
  ['Zanahoria',['zanahoria']],
  ['Melón',['melón','melon']],
  ['Naranja',['naranja']],
  ['Manzana',['manzana']],
  ['Pera',['pera']],
  ['Kiwi',['kiwi']],
  ['Pechuga de pollo',['pechuga de pollo']],
  ['Pechuga de pavo',['pechuga de pavo']],
  ['Claras de huevo',['claras']],
  ['Pasta en crudo',['pasta']],
  ['Queso fresco batido 0%',['queso fresco batido']],
  ['Activia natural edulcorado',['activia']],
  ['Copos de avena',['copos de avena','copos']],
  ['Salvado de avena',['salvado de avena','salvado']],
  ['Pollo',['pollo']],['Pavo plancha',['pavo']],['Cinta de lomo',['lomo']],
  ['Ternera magra',['ternera','carne magra']],['Merluza',['merluza','pescado blanco']],
  ['Bacalao',['bacalao']],['Dorada',['dorada']],['Salmón',['salmón','salmon']],
  ['Atún fresco',['atún','atun']],['Gambas',['gambas','langostinos']],
  ['Arroz en crudo',['arroz']],['Patata en crudo',['patata']],['Batata en crudo',['batata']],
  ['Avena',['avena']],['Melocotón',['melocot']],['Sandía',['sandía','sandia']],
  ['Arándanos',['arándan','arandan']],['Frambuesas',['framb']],['Moras',['moras']],
  ['Plátano',['plátano','platano']],['Ciruelas',['ciruela']],['Calabacín',['calabac']],
  ['Berenjena',['berenjena']],['Brócoli',['brócoli','brocoli']],['Coliflor',['coliflor']]
 ];
 for(const [name,keys] of rules){
  if(keys.some(k=>t.includes(k))) return allFoodCatalog().find(x=>x.name===name);
 }
 return null;
}

function equivalentQty(originalText,target){
 const src=smartFoodFromText(originalText), qty=parseQty(originalText);
 if(!src||!target||qty==null) return null;
 let q=qty;
 if(src.cat==='proteina'&&target.cat==='proteina') q=qty*(src.p/target.p);
 else if(src.cat==='hidrato'&&target.cat==='hidrato') q=qty*(src.c/target.c);
 else if(src.cat==='fruta'&&target.cat==='fruta') q=qty*(src.c/target.c);
 else if(src.cat==='verdura'&&target.cat==='verdura') q=qty;
 else if(src.cat==='lacteo'&&target.cat==='lacteo') q=qty*(src.kcal/target.kcal);
 else q=qty*(src.kcal/target.kcal);
 return Math.max(5,Math.round(q/5)*5);
}

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
 const un=String(text).match(/([0-9]+(?:[.,][0-9]+)?)\s*(unidad|unidades)/i);
 if(un)return +un[1].replace(',','.');
 const u=String(text).match(/^([0-9]+)\s+huevos?/i);
 if(u)return +u[1]*60;
 return null;
}
function foodDef(text){
 const t=String(text).toLowerCase();
 const db=DB.find(x=>x[1].some(p=>t.includes(p)));
 if(db) return db;
 const exact=allFoodCatalog().find(x=>t.includes(String(x.name).toLowerCase()));
 const smart=exact||smartFoodFromText(text);
 return smart ? [smart.name,[smart.name.toLowerCase()],smart.kcal,smart.p,smart.c,smart.f] : null;
}
function macros(text){
 const q=parseQty(text);
 if(q==null)return {kcal:0,p:0,c:0,f:0,known:false};
 const smart=smartFoodFromText(text);
 if(smart&&smart.cat==='rodilla'){
   return {kcal:smart.unitKcal*q,p:smart.unitP*q,c:smart.unitC*q,f:smart.unitF*q,known:true,estimated:true};
 }
 const def=foodDef(text);
 if(!def)return {kcal:0,p:0,c:0,f:0,known:false};
 const factor=q/100;
 return {kcal:def[2]*factor,p:def[3]*factor,c:def[4]*factor,f:def[5]*factor,known:true};
}
function add(a,b){return {kcal:a.kcal+b.kcal,p:a.p+b.p,c:a.c+b.c,f:a.f+b.f}}
function migrateBasePlanV6(){
 if(localStorage.getItem('jcNutritionBasePlanVersion')==='6') return;
 const month=localISO().slice(0,7);
 const plans=load('v9Plans',{});
 if(!plans[month]) plans[month]={};
 plans[month].meals=JSON.parse(JSON.stringify(BASE_MEALS));
 save('v9Plans',plans);
 localStorage.setItem('jcNutritionBasePlanVersion','6');
}

function migrateBasePlanV8(){
 if(localStorage.getItem('jcNutritionBasePlanVersion')==='8')return;
 const month=localISO().slice(0,7),plans=load('v9Plans',{});if(!plans[month])plans[month]={};plans[month].meals=JSON.parse(JSON.stringify(BASE_MEALS));save('v9Plans',plans);localStorage.setItem('jcNutritionBasePlanVersion','8');
}
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

function freeMeals(date){return load(`freeMeals:${date}`,{});}
function dayExtras(date){return load(`dayExtras:${date}`,[]);}
function extrasTotals(date){
 let total={kcal:0,p:0,c:0,f:0};
 dayExtras(date).forEach(x=>{total=add(total,macros(`${x.qty} ${x.unit||'g'} ${x.name}`));});
 return total;
}
function planOnlyTotals(day,date){
 let total={kcal:0,p:0,c:0,f:0};
 const plan=planForDay(day),free=freeMeals(date);
 plan.forEach((m,mi)=>{
   if(free[mi]) return;
   m[1].forEach((f,fi)=>{if(!omitted(date,mi,fi))total=add(total,macros(currentText(date,mi,fi,f)))});
   addedFoods(date,mi).forEach(x=>total=add(total,macros(x)));
 });
 return total;
}
function extrasFrequent(){
 return load('extrasFrequent',[]);
}
function rememberExtra(name){
 const arr=extrasFrequent();
 const hit=arr.find(x=>x.name===name);
 if(hit) hit.count=(hit.count||0)+1; else arr.push({name,count:1});
 arr.sort((a,b)=>(b.count||0)-(a.count||0));
 save('extrasFrequent',arr.slice(0,12));
}
function renderExtrasBlock(day,date){
 const extras=dayExtras(date),et=extrasTotals(date),pt=planOnlyTotals(day,date);
 const total=add(pt,et);
 const frequent=extrasFrequent().slice(0,5);
 return `<section class="section"><div class="section-title"><h2>Extras</h2><span>fuera del plan</span></div>
 <div class="card">
   <div class="extras-summary"><b>Plan: ${Math.round(pt.kcal)} kcal</b><span>Extras: +${Math.round(et.kcal)} kcal</span><strong>Total: ${Math.round(total.kcal)} kcal</strong></div>
   ${extras.length?`<div class="food-list">${extras.map((x,i)=>{const m=macros(`${x.qty} ${x.unit||'g'} ${x.name}`);return `<div class="food"><div><strong>${x.qty} ${x.unit||'g'} ${x.name}</strong>${m.known?`<small>≈ ${Math.round(m.kcal)} kcal · P ${Math.round(m.p)} · HC ${Math.round(m.c)} · G ${Math.round(m.f)}${m.estimated?' · estimado':''}</small>`:''}</div><button class="tiny danger" data-extra-remove="${i}">Quitar</button></div>`}).join('')}</div>`:'<p class="note">Sin extras registrados hoy.</p>'}
   <button class="primary" id="addExtraBtn" type="button" style="width:100%;margin-top:10px">+ Añadir extra</button>
   ${extras.length?`<button class="secondary" id="rebalanceExtrasBtn" type="button" style="width:100%;margin-top:8px">⚖ Reajustar resto del día</button>`:''}
   ${frequent.length?`<div class="extras-frequent"><small>Frecuentes:</small>${frequent.map(x=>`<button class="tiny" data-extra-frequent="${x.name}">${x.name}</button>`).join('')}</div>`:''}
 </div></section>`;
}
function closeExtraModal(){document.getElementById('extra-modal')?.remove();}
function openExtraModal(day,date,preset=''){
 closeExtraModal();
 const catalog=allFoodCatalog();
 const selected=catalog.find(x=>x.name===preset)?.name||catalog[0]?.name||'';
 const modal=document.createElement('div');
 modal.id='extra-modal';modal.className='modal';
 modal.innerHTML=`<div class="sheet">
  <div class="section-title"><h2>Añadir extra</h2><button id="exClose" class="tiny">Cerrar</button></div>
  <label class="field"><span>Alimento</span><select id="exFood" class="input">${foodOptions(catalog,selected)}</select></label>
  <div class="row">
   <label class="field"><span>Cantidad</span><input id="exQty" class="input" type="number" inputmode="decimal" value="100"></label>
   <label class="field"><span>Unidad</span><select id="exUnit" class="input"><option value="g">g</option><option value="ml">ml</option><option value="unidad">unidad</option></select></label>
  </div>
  <div id="exMacros" class="card" style="background:#0a1423"></div>
  <button id="exRodillaMix" class="secondary" type="button" style="width:100%;margin:8px 0">🥪 Añadir surtido Rodilla</button>
  <div class="row"><button id="exSave" class="primary">Añadir</button><button id="exCancel" class="secondary">Cancelar</button></div>
 </div>`;
 document.body.appendChild(modal);
 const food=document.getElementById('exFood'),qty=document.getElementById('exQty'),unit=document.getElementById('exUnit'),box=document.getElementById('exMacros');
 function refresh(){
   const selectedFood=allFoodCatalog().find(x=>x.name===food.value);
   if(selectedFood?.cat==='rodilla'){
     unit.value='unidad';
     if(!qty.dataset.touched) qty.value='1';
   }
   const m=macros(`${Number(qty.value)||0} ${unit.value} ${food.value}`);
   box.innerHTML=m.known?`<strong>≈ ${Math.round(m.kcal)} kcal${m.estimated?' · estimado':''}</strong><p class="note">P ${Math.round(m.p*10)/10} · HC ${Math.round(m.c*10)/10} · G ${Math.round(m.f*10)/10}${m.estimated?'<br>Valores orientativos por unidad; Rodilla no publica macros completos por sabor en la fuente oficial consultada.':''}</p>`:'<strong>Macros no disponibles</strong>';
 }
 food.onchange=()=>{qty.dataset.touched='';refresh();};qty.oninput=()=>{qty.dataset.touched='1';refresh();};unit.onchange=refresh;refresh();
 document.getElementById('exClose').onclick=closeExtraModal;document.getElementById('exCancel').onclick=closeExtraModal;document.getElementById('exRodillaMix').onclick=()=>openRodillaMixModal(day,date);
 document.getElementById('exSave').onclick=()=>{
   const q=Number(qty.value);if(!food.value||!Number.isFinite(q)||q<=0){alert('Introduce una cantidad válida.');return;}
   const arr=dayExtras(date);arr.push({name:food.value,qty:q,unit:unit.value});save(`dayExtras:${date}`,arr);rememberExtra(food.value);closeExtraModal();render();setTimeout(()=>openRebalanceModal(day,date),80);
 };
}

function openRodillaMixModal(day,date){
 closeExtraModal();
 const modal=document.createElement('div');
 modal.id='extra-modal';modal.className='modal';
 modal.innerHTML=`<div class="sheet">
   <div class="section-title"><h2>Surtido Rodilla</h2><button id="rxClose" class="tiny">Cerrar</button></div>
   <p class="note">Indica cuántas unidades has tomado de cada sabor. Los valores son estimados.</p>
   ${RODILLA_FOODS.map((x,i)=>`<div class="rodilla-row"><span>${x.name.replace('Rodilla · ','')}</span><input class="input rodillaQty" data-i="${i}" type="number" min="0" step="1" value="1"></div>`).join('')}
   <div id="rxTotal" class="card" style="background:#0a1423;margin-top:12px"></div>
   <div class="row"><button id="rxSave" class="primary">Añadir surtido</button><button id="rxCancel" class="secondary">Cancelar</button></div>
 </div>`;
 document.body.appendChild(modal);
 const inputs=[...modal.querySelectorAll('.rodillaQty')],box=document.getElementById('rxTotal');
 function recalc(){
   let t={kcal:0,p:0,c:0,f:0},units=0;
   inputs.forEach(inp=>{
     const q=Number(inp.value)||0,f=RODILLA_FOODS[Number(inp.dataset.i)];
     if(q>0){units+=q;t.kcal+=f.unitKcal*q;t.p+=f.unitP*q;t.c+=f.unitC*q;t.f+=f.unitF*q;}
   });
   box.innerHTML=`<strong>${units} unidades · ≈ ${Math.round(t.kcal)} kcal</strong><p class="note">P ${Math.round(t.p)} · HC ${Math.round(t.c)} · G ${Math.round(t.f)} · estimado</p>`;
 }
 inputs.forEach(x=>x.oninput=recalc);recalc();
 document.getElementById('rxClose').onclick=closeExtraModal;document.getElementById('rxCancel').onclick=closeExtraModal;
 document.getElementById('rxSave').onclick=()=>{
   const arr=dayExtras(date);
   inputs.forEach(inp=>{
     const q=Number(inp.value)||0,f=RODILLA_FOODS[Number(inp.dataset.i)];
     if(q>0){arr.push({name:f.name,qty:q,unit:'unidad'});rememberExtra(f.name);}
   });
   save(`dayExtras:${date}`,arr);closeExtraModal();render();setTimeout(()=>openRebalanceModal(day,date),80);
 };
}

function toggleFreeMeal(date,mi){
 const f=freeMeals(date);
 if(f[mi]) delete f[mi]; else f[mi]=true;
 save(`freeMeals:${date}`,f);
 render();
}


function v85Kind(text){
 const t=String(text).toLowerCase();
 if(/aove|aceite|pistacho|nuec|aguacate/.test(t)) return 'fat';
 if(/arroz|patata|batata|pasta|avena|crema de arroz|pan|wasa/.test(t)) return 'carb';
 if(/melocot|manzana|pera|plátano|platano|arándan|arandan|fresa|framb|mora|sandía|sandia|melón|melon|naranja|kiwi|ciruela/.test(t)) return 'fruit';
 if(/pollo|pavo|ternera|lomo|merluza|bacalao|dorada|salm|atún|atun|gamba|huevo|claras|queso fresco batido|activia|whey/.test(t)) return 'protein';
 if(/verdura|ensalada|tomate|lechuga|pepino|calabac|berenjena|brócoli|brocoli|coliflor|espárrag|esparrag|pimiento|champi|judía|judia|cebolla|espinaca|zanahoria/.test(t)) return 'veg';
 return 'other';
}
function v85ReplaceQty(text,newQty){
 const m=String(text).match(/([0-9]+(?:[.,][0-9]+)?)\s*(g|ml)/i);
 if(!m)return text;
 return String(text).replace(m[0],`${Math.max(0,Math.round(newQty))} ${m[2]}`);
}
function v85Proposal(day,date){
 const goal=v7Targets()[v7Type(day,date)];
 const done=load(`meals:${date}`,{}),free=freeMeals(date),plan=planForDay(day);
 let projected=dayTotals(day,date);
 const actions=[];
 let need=Math.max(0,projected.kcal-goal.kcal);
 if(need<=Math.max(50,goal.kcal*.03)) return {goal,before:projected,after:projected,actions:[],message:'El día ya está suficientemente cerca del objetivo. No hace falta reajustar.'};

 const items=[];
 plan.forEach((meal,mi)=>{
   if(done[mi]||free[mi])return;
   meal[1].forEach((orig,fi)=>{
     if(omitted(date,mi,fi))return;
     const text=currentText(date,mi,fi,orig),m=macros(text),q=parseQty(text),kind=v85Kind(text);
     if(!m.known||q==null||kind==='veg'||kind==='other')return;
     items.push({meal:meal[0],mi,fi,text,m,q,kind});
   });
 });

 const priority={fat:1,carb:2,fruit:3,protein:4};
 items.sort((a,b)=>priority[a.kind]-priority[b.kind] || b.m.kcal-a.m.kcal);

 function addOmit(it){
   actions.push({type:'omit',mi:it.mi,fi:it.fi,meal:it.meal,from:it.text,to:'Omitir'});
   projected={kcal:projected.kcal-it.m.kcal,p:projected.p-it.m.p,c:projected.c-it.m.c,f:projected.f-it.m.f};
   need=Math.max(0,projected.kcal-goal.kcal);
 }
 function addReduce(it,newQ){
   const ratio=newQ/it.q;
   const nm={kcal:it.m.kcal*ratio,p:it.m.p*ratio,c:it.m.c*ratio,f:it.m.f*ratio};
   actions.push({type:'replace',mi:it.mi,fi:it.fi,meal:it.meal,from:it.text,to:v85ReplaceQty(it.text,newQ)});
   projected={kcal:projected.kcal-it.m.kcal+nm.kcal,p:projected.p-it.m.p+nm.p,c:projected.c-it.m.c+nm.c,f:projected.f-it.m.f+nm.f};
   need=Math.max(0,projected.kcal-goal.kcal);
 }

 // 1. Remove discretionary fats first.
 for(const it of items.filter(x=>x.kind==='fat')){
   if(need<=50)break;
   addOmit(it);
 }

 // 2. Reduce dense carbohydrates, preserving at least 25% of the portion.
 for(const it of items.filter(x=>x.kind==='carb')){
   if(need<=50)break;
   const kcalPerUnit=it.m.kcal/it.q;
   const reducible=it.q*.75;
   const cut=Math.min(reducible, need/Math.max(.01,kcalPerUnit));
   const newQ=Math.max(it.q*.25,it.q-cut);
   if(newQ<it.q-4)addReduce(it,newQ);
 }

 // 3. Fruit only if still necessary; preserve at least half.
 for(const it of items.filter(x=>x.kind==='fruit')){
   if(need<=50)break;
   const kcalPerUnit=it.m.kcal/it.q;
   const reducible=it.q*.5;
   const cut=Math.min(reducible, need/Math.max(.01,kcalPerUnit));
   const newQ=Math.max(it.q*.5,it.q-cut);
   if(newQ<it.q-4)addReduce(it,newQ);
 }

 // 4. Protein is the last lever and should not push projected protein below target-10 g.
 for(const it of items.filter(x=>x.kind==='protein')){
   if(need<=50)break;
   const allowedP=Math.max(0,projected.p-(goal.p-10));
   if(allowedP<=0||it.m.p<=0)continue;
   const maxFraction=Math.min(.5,allowedP/it.m.p);
   const maxCutQ=it.q*maxFraction;
   const kcalPerUnit=it.m.kcal/it.q;
   const cut=Math.min(maxCutQ,need/Math.max(.01,kcalPerUnit));
   const newQ=it.q-cut;
   if(newQ<it.q-4)addReduce(it,newQ);
 }

 const message=need>100
   ? `Aun aplicando un reajuste prudente quedarías aproximadamente ${Math.round(need)} kcal por encima. No recomiendo recortar más de forma agresiva.`
   : 'La propuesta deja el resto del día razonablemente ajustado sin tocar lo ya consumido.';
 return {goal,before:dayTotals(day,date),after:projected,actions,message};
}
function closeV85Modal(){document.getElementById('v85-modal')?.remove();}
function openRebalanceModal(day,date){
 closeV85Modal();
 const p=v85Proposal(day,date);
 const modal=document.createElement('div');modal.id='v85-modal';modal.className='modal';
 const list=p.actions.length?p.actions.map(a=>`<div class="v85-action"><b>${a.meal}</b><span>${a.from}</span><strong>→ ${a.to}</strong></div>`).join(''):'<p class="note">No hay ajustes necesarios.</p>';
 modal.innerHTML=`<div class="sheet">
  <div class="section-title"><h2>Reajustar resto del día</h2><button id="v85Close" class="tiny">Cerrar</button></div>
  <p class="note">Solo se modifican comidas pendientes. Nunca cambia alimentos de comidas ya marcadas como realizadas.</p>
  <div class="card v85-summary">
   <b>Antes: ${Math.round(p.before.kcal)} kcal · ${Math.round(p.before.p)} P · ${Math.round(p.before.c)} HC · ${Math.round(p.before.f)} G</b>
   <span>Objetivo: ${p.goal.kcal} kcal · ${p.goal.p} P · ${p.goal.c} HC · ${p.goal.f} G</span>
   <strong>Propuesta: ${Math.round(p.after.kcal)} kcal · ${Math.round(p.after.p)} P · ${Math.round(p.after.c)} HC · ${Math.round(p.after.f)} G</strong>
  </div>
  <div class="card">${list}</div>
  <p class="note">${p.message}</p>
  <div class="row"><button id="v85Apply" class="primary" ${p.actions.length?'':'disabled'}>Aplicar reajuste</button><button id="v85Keep" class="secondary">Mantener menú</button></div>
 </div>`;
 document.body.appendChild(modal);
 document.getElementById('v85Close').onclick=closeV85Modal;
 document.getElementById('v85Keep').onclick=closeV85Modal;
 document.getElementById('v85Apply').onclick=()=>{
   if(!p.actions.length)return;
   if(!confirm('¿Aplicar estos cambios a las comidas pendientes de hoy?'))return;
   const subs=load(`mealSubs:${date}`,{}),om=load(`v6MealOmit:${date}`,{});
   p.actions.forEach(a=>{
     const key=`${a.mi}:${a.fi}`;
     if(a.type==='omit')om[key]=true;
     else subs[key]={replacement:a.to,mode:'extras-rebalance'};
   });
   save(`mealSubs:${date}`,subs);save(`v6MealOmit:${date}`,om);
   closeV85Modal();render();
 };
}

function dayTotals(day,date){
 return add(planOnlyTotals(day,date),extrasTotals(date));
}
function consumedTotals(day,date){
 let total={kcal:0,p:0,c:0,f:0};
 const done=load(`meals:${date}`,{}),plan=planForDay(day),free=freeMeals(date);
 plan.forEach((m,mi)=>{
  if(done[mi] && !free[mi]){
   m[1].forEach((f,fi)=>{if(!omitted(date,mi,fi))total=add(total,macros(currentText(date,mi,fi,f)))});
   addedFoods(date,mi).forEach(x=>total=add(total,macros(x)));
  }
 });
 total=add(total,extrasTotals(date));
 return total;
}
function pct(v,t){return t?Math.min(100,v/t*100):0}
function setPage(title){document.getElementById('pageTitle').textContent=title;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view))}
function macroBlock(day,date){
 const type=v7Type(day,date),goal=v7Targets()[type],cons=consumedTotals(day,date);
 const left=k=>Math.max(0,goal[k]-cons[k]);
 return `<section class="section"><div class="section-title"><h2>Consumido hasta ahora</h2><span>comidas marcadas ✓</span></div><div class="card">
  <div class="kpi-grid"><div class="kpi"><b>${money(cons.kcal)}</b><span>kcal consumidas</span></div><div class="kpi"><b>${money(left('kcal'))}</b><span>kcal pendientes</span></div><div class="kpi"><b>${money(goal.kcal)}</b><span>objetivo</span></div></div>
  <div class="v7remain"><b>Consumido:</b><br>${Math.round(cons.kcal)} kcal · ${Math.round(cons.p)} P · ${Math.round(cons.c)} HC · ${Math.round(cons.f)} G</div>
  <div class="v7remain"><b>Pendiente según objetivo:</b><br>${Math.round(left('kcal'))} kcal · ${Math.round(left('p'))} P · ${Math.round(left('c'))} HC · ${Math.round(left('f'))} G</div>
  <p class="note">Lo pendiente es margen respecto al objetivo, no una obligación de consumirlo íntegramente.</p>
 </div></section>`;
}
function bar(label,v,t,u){return `<div class="macro-row"><div class="macro-head"><span>${label}</span><strong>${Math.round(v)} / ${Math.round(t)} ${u}</strong></div><div class="track"><i style="width:${pct(v,t)}%"></i></div></div>`}
function mealCard(day,date,m,mi,editable=true){
 const done=!!load(`meals:${date}`,{})[mi],isFree=!!freeMeals(date)[mi];
 const foods=m[1].map((orig,fi)=>{
  const text=currentText(date,mi,fi,orig),isO=omitted(date,mi,fi),mac=macros(text);
  return `<div class="food ${isO?'omitted':''}"><div><strong>${text}</strong>${mac.known?`<small>≈ ${Math.round(mac.kcal)} kcal · P ${Math.round(mac.p)} · HC ${Math.round(mac.c)} · G ${Math.round(mac.f)}</small>`:''}</div>${editable?`<div class="food-actions"><button class="tiny" data-edit="${mi}:${fi}">Cambiar</button><button class="tiny" data-omit="${mi}:${fi}">${isO?'Restaurar':'Omitir'}</button></div>`:''}</div>`;
 }).join('');
 const adds=addedFoods(date,mi).map((x,i)=>{
  const am=macros(x);
  return `<div class="food"><div><strong>${x}</strong>${am.known?`<small>≈ ${Math.round(am.kcal)} kcal · P ${Math.round(am.p)} · HC ${Math.round(am.c)} · G ${Math.round(am.f)}</small>`:'<small>Macros no disponibles</small>'}<small>Añadido</small></div>${editable?`<button class="tiny danger" data-rmadd="${mi}:${i}">Quitar</button>`:''}</div>`;
 }).join('');
 return `<div class="card meal-card ${done?'v7done':''} ${isFree?'meal-free':''}" data-meal-index="${mi}" data-meal-done="${done?1:0}">
 <div class="meal-head"><strong>${isFree?'🍽️ '+m[0]+' · COMIDA LIBRE':m[0]}</strong>${editable?`<button class="check ${done?'done':''}" data-done="${mi}">${done?'✓':'○'}</button>`:''}</div>
 ${isFree?`<p class="note">La comida prevista no se contabiliza. Puedes registrar lo que tomes en Extras si quieres estimar el día.</p><button class="secondary" data-free-meal="${mi}" style="width:100%">Restaurar comida prevista</button>`:`<details ${done?'':'open'}><summary class="note">Ver alimentos</summary><div class="food-list">${foods}${adds}</div>${editable?`<div class="row"><button class="secondary" data-add="${mi}" style="width:100%;margin-top:10px">+ Añadir alimento</button><button class="secondary" data-free-meal="${mi}" style="width:100%;margin-top:10px">🍽️ Marcar como comida libre</button></div>`:''}</details>`}
 </div>`;
}

function closeFoodModal(){
 document.getElementById('food-change-modal')?.remove();
}
function foodOptions(list,selected=''){
 return list.map(x=>`<option value="${x.name}" ${x.name===selected?'selected':''}>${x.name}</option>`).join('');
}
function openFoodChangeModal(day,date,mi,fi,currentText){
 closeFoodModal();
 const src=smartFoodFromText(currentText);
 const catalog=allFoodCatalog();
 const options=src?catalog.filter(x=>x.cat===src.cat):catalog;
 const targetDefault=options.find(x=>x.name!==src?.name)||options[0];
 const suggested=src&&targetDefault?equivalentQty(currentText,targetDefault):(parseQty(currentText)||'');

 const modal=document.createElement('div');
 modal.id='food-change-modal';
 modal.className='modal';
 modal.innerHTML=`<div class="sheet">
  <div class="section-title"><h2>Cambiar alimento</h2><button id="fmClose" class="tiny">Cerrar</button></div>
  <p class="note">Original: <strong>${currentText}</strong></p>
  <label class="field"><span>Alimento nuevo</span><select id="fmFood" class="input">${foodOptions(options,targetDefault?.name)}</select></label>
  <div class="row">
   <label class="field"><span>Cantidad</span><input id="fmQty" class="input" type="number" inputmode="decimal" value="${suggested||''}"></label>
   <label class="field"><span>Unidad</span><select id="fmUnit" class="input"><option value="g">g</option><option value="ml">ml</option></select></label>
  </div>
  <div id="fmEq" class="card" style="background:#0a1423"></div>
  <div class="row"><button id="fmSave" class="primary">Guardar cambio</button><button id="fmCancel" class="secondary">Cancelar</button></div>
 </div>`;
 document.body.appendChild(modal);

 const food=document.getElementById('fmFood');
 const qty=document.getElementById('fmQty');
 const unit=document.getElementById('fmUnit');
 const eq=document.getElementById('fmEq');

 function refresh(){
  const target=allFoodCatalog().find(x=>x.name===food.value);
  const q=target?equivalentQty(currentText,target):null;
  if(q&&!qty.dataset.manual) qty.value=q;
  const amount=Number(qty.value);
  const original=macros(currentText);
  const replacement=target&&Number.isFinite(amount)?{kcal:target.kcal*amount/100,p:target.p*amount/100,c:target.c*amount/100,f:target.f*amount/100}:null;
  const suggestion=q?`<strong>Equivalencia sugerida: ${q} ${unit.value} de ${target.name}</strong>`:'<strong>Sin equivalencia automática fiable.</strong>';
  if(replacement){
   eq.innerHTML=`${suggestion}<div class="macro-compare"><div><span>Original</span><strong>${Math.round(original.kcal)} kcal</strong><small>P ${original.p.toFixed(1)} · HC ${original.c.toFixed(1)} · G ${original.f.toFixed(1)}</small></div><div><span>Sustitución</span><strong>${Math.round(replacement.kcal)} kcal</strong><small>P ${replacement.p.toFixed(1)} · HC ${replacement.c.toFixed(1)} · G ${replacement.f.toFixed(1)}</small></div></div><p class="note">La comparación se actualiza al cambiar la cantidad.</p>`;
  }else eq.innerHTML=`${suggestion}<p class="note">Introduce la cantidad manualmente.</p>`;
 }
 qty.oninput=()=>{qty.dataset.manual='1';refresh()};
 food.onchange=()=>{qty.dataset.manual='';refresh()};
 unit.onchange=refresh;
 refresh();

 document.getElementById('fmClose').onclick=closeFoodModal;
 document.getElementById('fmCancel').onclick=closeFoodModal;
 document.getElementById('fmSave').onclick=()=>{
  const q=Number(qty.value);
  if(!food.value||!Number.isFinite(q)||q<=0){alert('Introduce una cantidad válida.');return;}
  const d=load(`mealSubs:${date}`,{});
  d[`${mi}:${fi}`]={replacement:`${q} ${unit.value} ${food.value}`,mode:'fields'};
  save(`mealSubs:${date}`,d);
  closeFoodModal();
  render();
 };
}
function openFoodAddModal(day,date,mi){
 closeFoodModal();
 const modal=document.createElement('div');
 modal.id='food-change-modal';
 modal.className='modal';
 modal.innerHTML=`<div class="sheet">
  <div class="section-title"><h2>Añadir alimento</h2><button id="fmClose" class="tiny">Cerrar</button></div>
  <label class="field"><span>Alimento</span><select id="fmFood" class="input">${foodOptions(allFoodCatalog())}</select></label>
  <div class="row">
   <label class="field"><span>Cantidad</span><input id="fmQty" class="input" type="number" inputmode="decimal" value="100"></label>
   <label class="field"><span>Unidad</span><select id="fmUnit" class="input"><option value="g">g</option><option value="ml">ml</option></select></label>
  </div>
  <div id="fmAddMacros" class="card" style="background:#0a1423"></div>
  <div class="row"><button id="fmSave" class="primary">Añadir</button><button id="fmCancel" class="secondary">Cancelar</button></div>
 </div>`;
 document.body.appendChild(modal);
 const addFood=document.getElementById('fmFood');
 const addQty=document.getElementById('fmQty');
 const addUnit=document.getElementById('fmUnit');
 const addMacros=document.getElementById('fmAddMacros');
 function refreshAddMacros(){
   const q=Number(addQty.value);
   const txt=`${Number.isFinite(q)?q:0} ${addUnit.value} ${addFood.value}`;
   const m=macros(txt);
   addMacros.innerHTML=m.known
     ? `<strong>≈ ${Math.round(m.kcal)} kcal</strong><p class="note">P ${Math.round(m.p*10)/10} g · HC ${Math.round(m.c*10)/10} g · G ${Math.round(m.f*10)/10} g</p>`
     : '<strong>Macros no disponibles</strong>';
 }
 addFood.onchange=refreshAddMacros;
 addQty.oninput=refreshAddMacros;
 addUnit.onchange=refreshAddMacros;
 refreshAddMacros();
 document.getElementById('fmClose').onclick=closeFoodModal;
 document.getElementById('fmCancel').onclick=closeFoodModal;
 document.getElementById('fmSave').onclick=()=>{
  const food=document.getElementById('fmFood').value;
  const qty=Number(document.getElementById('fmQty').value);
  const unit=document.getElementById('fmUnit').value;
  if(!food||!Number.isFinite(qty)||qty<=0){alert('Introduce una cantidad válida.');return;}
  const d=load(`v10MealAdds:${date}`,{});
  (d[String(mi)]||(d[String(mi)]=[])).push(`${qty} ${unit} ${food}`);
  save(`v10MealAdds:${date}`,d);
  closeFoodModal();
  render();
 };
}

function bindMealActions(day,date){
 document.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>{const d=load(`meals:${date}`,{}),i=b.dataset.done;d[i]=!d[i];save(`meals:${date}`,d);render()});
 document.querySelectorAll('[data-omit]').forEach(b=>b.onclick=()=>{const [mi,fi]=b.dataset.omit.split(':'),k=`v6MealOmit:${date}`,d=load(k,{}),id=`${mi}:${fi}`;d[id]?delete d[id]:d[id]=true;save(k,d);render()});
 document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const [mi,fi]=b.dataset.edit.split(':').map(Number),plan=planForDay(day),orig=plan[mi][1][fi],cur=currentText(date,mi,fi,orig);openFoodChangeModal(day,date,mi,fi,cur)});
 document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{openFoodAddModal(day,date,Number(b.dataset.add))});
 document.querySelectorAll('[data-rmadd]').forEach(b=>b.onclick=()=>{const [mi,i]=b.dataset.rmadd.split(':'),k=`v10MealAdds:${date}`,d=load(k,{});(d[mi]||[]).splice(+i,1);save(k,d);render()});

 document.querySelectorAll('[data-free-meal]').forEach(b=>b.onclick=()=>toggleFreeMeal(date,Number(b.dataset.freeMeal)));
}
function resetDayMenu(day,date){
 if(!confirm('Se perderán los cambios manuales de alimentos y cantidades de este día. ¿Restaurar menú original?')) return;
 localStorage.removeItem('mealSubs:'+date);
 localStorage.removeItem('v6MealOmit:'+date);
 localStorage.removeItem('v6MealRedis:'+date);
 localStorage.removeItem('v10MealAdds:'+date);
 const month=date.slice(0,7),plans=load('v9Plans',{});
 if(!plans[month]) plans[month]={};
 if(!plans[month].meals) plans[month].meals={};
 plans[month].meals[day]=JSON.parse(JSON.stringify(BASE_MEALS[day]));
 save('v9Plans',plans);
 render();
}

const V7_DEFAULT_TARGETS={training:{kcal:2300,p:180,c:245,f:65},cardio:{kcal:2200,p:180,c:210,f:70},rest:{kcal:2100,p:180,c:175,f:75}};
function v7Targets(){const saved=load('v7Targets',{});return {...JSON.parse(JSON.stringify(V7_DEFAULT_TARGETS)),...saved};}
function v7DefaultType(day){return ['lunes','martes','miércoles','jueves','viernes'].includes(String(day).toLowerCase())?'training':'rest';}
function v7Type(day,date){return load('v7DayTypes',{})[date]||v7DefaultType(day);}
function v7Status(v,t,k){if(!t)return'warn';const r=v/t;if(k==='kcal'){if(r>=.95&&r<=1.05)return'ok';if(r>=.90&&r<=1.10)return'warn';return'bad';}if(k==='p'){if(v>=t-10&&v<=t+25)return'ok';if(v>=t-25&&v<=t+40)return'warn';return'bad';}if(k==='c'||k==='f'){if(r>=.90&&r<=1.10)return'ok';if(r>=.80&&r<=1.20)return'warn';return'bad';}return'ok';}
function v82Delta(v,t,k){const d=Math.round(v-t);return d===0?'=':`${d>0?'↑':'↓'}${Math.abs(d)}${k==='kcal'?'':' g'}`;}
function v82Score(x,t){return Math.abs(x.kcal-t.kcal)/Math.max(100,t.kcal)*2+Math.abs(x.p-t.p)/Math.max(20,t.p)+Math.abs(x.c-t.c)/Math.max(20,t.c)+Math.abs(x.f-t.f)/Math.max(10,t.f)*1.2;}
function v82Advice(day,date){
 const t=v7Targets()[v7Type(day,date)],plan=dayTotals(day,date),done=load(`meals:${date}`,{}),meals=planForDay(day),before=v82Score(plan,t),cands=[];
 const free=freeMeals(date),et=extrasTotals(date);if(Object.keys(free).length||et.kcal>350)return {html:'<strong>Consejo:</strong> Día con comida libre o extras importantes. Mantén el resto del plan normal; no compenses de forma agresiva.',action:null};
 meals.forEach((m,mi)=>{if(done[mi]||free[mi])return;m[1].forEach((orig,fi)=>{if(omitted(date,mi,fi))return;const text=currentText(date,mi,fi,orig),q=parseQty(text),fd=smartFoodFromText(text);if(!q||!fd)return;const steps=fd.cat==='grasa'?[5,10]:fd.cat==='hidrato'?[10,20,30,40,50]:fd.cat==='proteina'?[20,30,40,50]:[25,50,75];for(const delta of steps){for(const sign of [-1,1]){const nq=q+sign*delta;if(nq<=0||nq<q*.35)continue;const old=macros(text),neu={kcal:fd.kcal*nq/100,p:fd.p*nq/100,c:fd.c*nq/100,f:fd.f*nq/100},np={kcal:plan.kcal-old.kcal+neu.kcal,p:plan.p-old.p+neu.p,c:plan.c-old.c+neu.c,f:plan.f-old.f+neu.f};const score=v82Score(np,t);if(score<before*.88)cands.push({score,mi,fi,old:q,nq,fd,text,np,meal:m[0]});}}});});
 cands.sort((a,b)=>a.score-b.score);const best=cands[0];
 const states=['kcal','p','c','f'].map(k=>v7Status(plan[k],t[k],k));
 if(states.every(x=>x==='ok'))return {html:'<strong>Consejo:</strong> No necesitas ajustar nada. El plan está suficientemente cerca de tus objetivos.',action:null};
 if(!best)return {html:'<strong>Consejo:</strong> Hay alguna desviación, pero no veo un ajuste simple y útil en las comidas pendientes. Mejor no forzar cambios pequeños.',action:null};
 const dir=best.nq>best.old?'sube':'baja';
 return {html:`<strong>Ajuste recomendado:</strong> ${dir} ${best.fd.name} de ${Math.round(best.old)} a ${Math.round(best.nq)} g en ${best.meal}.`,action:best};
}
function v82ApplyAdvice(date,a){const d=load(`mealSubs:${date}`,{});d[`${a.mi}:${a.fi}`]={replacement:`${Math.round(a.nq)} g ${a.fd.name}`,mode:'advice'};save(`mealSubs:${date}`,d);render();}
function v7ObjectivePanel(day,date){
 const type=v7Type(day,date),t=v7Targets()[type],plan=dayTotals(day,date),ad=v82Advice(day,date);
 const row=(n,k,u)=>`<div class="v7row ${v7Status(plan[k],t[k],k)}"><span>${n}</span><b>${Math.round(plan[k])} / ${t[k]} ${u} <em>${v82Delta(plan[k],t[k],k)}</em></b></div>`;
 const states=['kcal','p','c','f'].map(k=>v7Status(plan[k],t[k],k));
 const overall=states.includes('bad')?'bad':states.includes('warn')?'warn':'ok';
 const msg=overall==='ok'?'Plan bien ajustado':overall==='warn'?'Plan aceptable, con algún desvío':'Plan a revisar';
 const label=type==='training'?'fuerza':type==='cardio'?'cardio/LISS':'descanso';
 window.__v82Advice=ad.action;
 return `<section class="section"><div class="section-title"><h2>Plan del día</h2><span>${label}</span></div><div class="card v7panel">
 <label class="field"><span>Tipo de día</span><select id="v7DayType" class="input"><option value="training"${type==='training'?' selected':''}>Fuerza</option><option value="cardio"${type==='cardio'?' selected':''}>Cardio / LISS</option><option value="rest"${type==='rest'?' selected':''}>Descanso</option></select></label>
 <p class="note">Color = importancia de la desviación. ↑/↓ = si estás por encima o por debajo del objetivo. Los colores valoran el plan completo, no lo que llevas comido.</p>
 ${row('Calorías','kcal','kcal')}${row('Proteína','p','g')}${row('Hidratos','c','g')}${row('Grasas','f','g')}
 <div class="v81summary ${overall}"><strong>${msg}</strong></div>
 <div class="v82advice">${ad.html}${ad.action?'<button id="v82Apply" class="primary" type="button">Aplicar ajuste</button>':''}</div>
 <button id="v7EditTargets" class="secondary" type="button">Editar objetivos</button></div></section>`;
}
function v7EditTargets(day,date){const all=v7Targets(),type=v7Type(day,date),t=all[type];const q=(x,v)=>prompt(x,String(v));const a=[q('Calorías objetivo',t.kcal),q('Proteína objetivo (g)',t.p),q('Hidratos objetivo (g)',t.c),q('Grasas objetivo (g)',t.f)];if(a.some(x=>x===null))return;const n=a.map(Number);if(n.some(x=>!Number.isFinite(x)||x<0)){alert('Introduce valores válidos.');return;}all[type]={kcal:n[0],p:n[1],c:n[2],f:n[3]};save('v7Targets',all);render();}
function v73StickyBar(day,date){
 const type=v7Type(day,date),t=v7Targets()[type],plan=dayTotals(day,date);const cls=k=>v7Status(plan[k],t[k],k);
 return `<div class="v73sticky" id="v73Sticky"><span class="${cls('kcal')}">🔥 ${Math.round(plan.kcal)}/${t.kcal} ${v82Delta(plan.kcal,t.kcal,'kcal')}</span><span class="${cls('p')}">P ${Math.round(plan.p)}/${t.p} ${v82Delta(plan.p,t.p,'p')}</span><span class="${cls('c')}">HC ${Math.round(plan.c)}/${t.c} ${v82Delta(plan.c,t.c,'c')}</span><span class="${cls('f')}">G ${Math.round(plan.f)}/${t.f} ${v82Delta(plan.f,t.f,'f')}</span></div>`;
}
function renderToday(){
 const d=new Date(),day=dayKey(d),date=localISO(d),plan=planForDay(day),done=load(`meals:${date}`,{});const ordered=plan.map((m,i)=>({m,i,done:!!done[i]})).sort((a,b)=>Number(a.done)-Number(b.done));
 document.getElementById('content').innerHTML=`<section class="section"><div class="card hero"><div class="eyebrow">${d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}).toUpperCase()}</div><h2>Plan de alimentación</h2><p>Comidas, macros, medidas y progreso corporal.</p></div></section>${v7ObjectivePanel(day,date)}${v73StickyBar(day,date)}${macroBlock(day,date)}${renderExtrasBlock(day,date)}<section class="section"><div class="section-title"><h2>Comidas de hoy</h2><span>${plan.length} comidas</span></div><div class="card compact-tools"><strong>⚖ Equivalencias inteligentes</strong><p class="note">Al pulsar Cambiar, la app propone una cantidad equivalente y recalcula automáticamente los macros del día.</p><button class="secondary" id="reset-day-menu">↺ Restaurar menú original</button></div><div id="v7TodayMeals">${ordered.map(x=>mealCard(day,date,x.m,x.i,true)).join('')}</div></section>`;
 bindMealActions(day,date);const rb=document.getElementById('reset-day-menu');if(rb)rb.onclick=()=>resetDayMenu(day,date);const dt=document.getElementById('v7DayType');if(dt)dt.onchange=()=>{const x=load('v7DayTypes',{});x[date]=dt.value;save('v7DayTypes',x);render();};const et=document.getElementById('v7EditTargets');if(et)et.onclick=()=>v7EditTargets(day,date);const ap=document.getElementById('v82Apply');if(ap)ap.onclick=()=>window.__v82Advice&&v82ApplyAdvice(date,window.__v82Advice);const ex=document.getElementById('addExtraBtn');if(ex)ex.onclick=()=>openExtraModal(day,date);const rx=document.getElementById('rebalanceExtrasBtn');if(rx)rx.onclick=()=>openRebalanceModal(day,date);document.querySelectorAll('[data-extra-remove]').forEach(b=>b.onclick=()=>{const a=dayExtras(date);a.splice(Number(b.dataset.extraRemove),1);save(`dayExtras:${date}`,a);render();});document.querySelectorAll('[data-extra-frequent]').forEach(b=>b.onclick=()=>openExtraModal(day,date,b.dataset.extraFrequent));
}
function renderMeals(){
 const days=['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
 const day=state.selectedDay,date=nextDate(day),plan=planForDay(day),tot=dayTotals(day,date);
 document.getElementById('content').innerHTML=`<section class="section"><div class="day-tabs">${days.map(d=>`<button class="${d===day?'primary':'secondary'}" data-day="${d}">${d}</button>`).join('')}</div></section><section class="section"><div class="section-title"><h2>${day.toUpperCase()}</h2><span>${date}</span></div><div class="card"><strong>≈ ${Math.round(tot.kcal)} kcal</strong><p class="note">P ${Math.round(tot.p)} g · HC ${Math.round(tot.c)} g · G ${Math.round(tot.f)} g</p><button class="secondary" id="reset-day-menu">↺ Restaurar menú original</button></div>${plan.map((m,i)=>mealCard(day,date,m,i,true)).join('')}</section>`;
 document.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{state.selectedDay=b.dataset.day;render()});
 bindMealActions(day,date);
 const rb=document.getElementById('reset-day-menu'); if(rb) rb.onclick=()=>resetDayMenu(day,date);
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
function renderFoods(){
 const items=customFoods();
 document.getElementById('content').innerHTML=`<section class="section"><div class="card hero"><div class="eyebrow">ALIMENTOS</div><h2>Mi base de datos</h2><p>Copia los valores tal como aparecen en la etiqueta. La app normaliza los datos y clasifica el alimento automáticamente.</p></div></section>
 <section class="section"><div class="card"><div class="section-title"><h2>Nuevo alimento</h2><span>según etiqueta</span></div>
 <label class="field"><span>Nombre</span><input id="cfName" class="input" placeholder="Ej. Yogur natural"></label>
 <div class="row"><label class="field"><span>Cantidad de referencia</span><input id="cfRefQty" class="input" type="number" step="0.1" value="100"></label><label class="field"><span>Unidad</span><select id="cfUnit" class="input"><option value="g">g</option><option value="ml">ml</option></select></label></div>
 <p class="note">Ej.: si la etiqueta indica valores por 50 g, escribe 50 g. Si los indica por 250 ml, escribe 250 ml.</p>
 <div class="row"><label class="field"><span>kcal</span><input id="cfKcal" class="input" type="number" step="0.1"></label><label class="field"><span>Proteína g</span><input id="cfP" class="input" type="number" step="0.1"></label></div>
 <div class="row"><label class="field"><span>Hidratos g</span><input id="cfC" class="input" type="number" step="0.1"></label><label class="field"><span>Grasas g</span><input id="cfF" class="input" type="number" step="0.1"></label></div>
 <input id="cfEdit" type="hidden"><button id="cfSave" class="primary" style="width:100%">Guardar alimento</button></div></section>
 <section class="section"><div class="section-title"><h2>Mis alimentos</h2><span>${items.length}</span></div><div class="card">${items.length?items.map((x,i)=>{const q=Number(x.refQty)||100,u=x.refUnit||x.unit||'g',lk=x.labelKcal??x.kcal,lp=x.labelP??x.p,lc=x.labelC??x.c,lf=x.labelF??x.f,n=normalizedCustomFood(x);return `<div class="food"><div><strong>${x.name}</strong><small>${lk} kcal · P ${lp} · HC ${lc} · G ${lf} / ${q} ${u}</small><small>Clasificación automática: ${n.cat||classifyFood(n.name,n.kcal,n.p,n.c,n.f)}</small></div><div class="food-actions"><button class="tiny" data-cfedit="${i}">Editar</button><button class="tiny danger" data-cfdel="${i}">Eliminar</button></div></div>`}).join(''):'<p class="note">Aún no has añadido alimentos personalizados.</p>'}</div></section>`;
 document.getElementById('cfSave').onclick=()=>{const name=cfName.value.trim(),refQty=Number(cfRefQty.value),vals=[cfKcal,cfP,cfC,cfF].map(e=>Number(e.value));if(!name||!Number.isFinite(refQty)||refQty<=0||vals.some(v=>!Number.isFinite(v)||v<0)){alert('Completa nombre, referencia, kcal y macros con valores válidos.');return;}const factor=100/refQty,cat=classifyFood(name,vals[0]*factor,vals[1]*factor,vals[2]*factor,vals[3]*factor);const a=customFoods(),obj={name,cat,refQty,refUnit:cfUnit.value,labelKcal:vals[0],labelP:vals[1],labelC:vals[2],labelF:vals[3],kcal:vals[0]*factor,p:vals[1]*factor,c:vals[2]*factor,f:vals[3]*factor,unit:cfUnit.value,normalized:true};const ix=cfEdit.value===''?-1:Number(cfEdit.value);if(ix>=0)a[ix]=obj;else a.push(obj);save('customFoodsV8',a);render();};
 document.querySelectorAll('[data-cfedit]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.cfedit),x=customFoods()[i];cfName.value=x.name;cfRefQty.value=Number(x.refQty)||100;cfUnit.value=x.refUnit||x.unit||'g';cfKcal.value=x.labelKcal??x.kcal;cfP.value=x.labelP??x.p;cfC.value=x.labelC??x.c;cfF.value=x.labelF??x.f;cfEdit.value=i;window.scrollTo({top:0,behavior:'smooth'});});
 document.querySelectorAll('[data-cfdel]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.cfdel),a=customFoods();if(confirm(`¿Eliminar ${a[i].name}?`)){a.splice(i,1);save('customFoodsV8',a);render();}});
}
function renderBackup(){
 document.getElementById('content').innerHTML=`<section class="section"><div class="card"><div class="section-title"><h2>Backup</h2><span>V8.1</span></div><p class="note">Importa un JSON de la antigua JC Training o exporta los datos actuales.</p><div class="backup-actions"><button id="importBtn" class="primary">Importar backup</button><input id="importFile" type="file" accept=".json,application/json" hidden><button id="exportBtn" class="secondary">Exportar backup</button></div><p id="backupStatus" class="note"></p></div></section>`;
 importBtn.onclick=()=>importFile.click();
 importFile.onchange=()=>importBackup(importFile.files?.[0]);
 exportBtn.onclick=exportBackup;
}
function exportBackup(){
 const storage={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);storage[k]=localStorage.getItem(k)}
 const blob=new Blob([JSON.stringify({app:'JC Nutrition CLEAN',version:'8.1',exportedAt:new Date().toISOString(),storage},null,2)],{type:'application/json'});
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

const SCALE_FOODS = [
  {name:'Arroz', rawToCooked:2.8, kcal:360,p:7,c:80,f:.7},
  {name:'Pasta', rawToCooked:2.4, kcal:350,p:12,c:72,f:1.5},
  {name:'Patata', rawToCooked:.87, kcal:77,p:2,c:17,f:.1},
  {name:'Batata', rawToCooked:.88, kcal:86,p:1.6,c:20,f:.1},
  {name:'Pollo', rawToCooked:.76, kcal:120,p:23,c:0,f:2.6},
  {name:'Pavo', rawToCooked:.76, kcal:115,p:24,c:0,f:1.5},
  {name:'Ternera magra', rawToCooked:.75, kcal:170,p:24,c:0,f:8},
  {name:'Cinta de lomo', rawToCooked:.76, kcal:150,p:22,c:0,f:6},
  {name:'Merluza', rawToCooked:.84, kcal:86,p:18.5,c:0,f:1.8},
  {name:'Bacalao', rawToCooked:.84, kcal:82,p:18,c:0,f:.7},
  {name:'Dorada', rawToCooked:.82, kcal:115,p:20,c:0,f:4},
  {name:'Salmón', rawToCooked:.80, kcal:208,p:20,c:0,f:13},
  {name:'Atún fresco', rawToCooked:.82, kcal:144,p:23,c:0,f:5},
  {name:'Fresas',rawToCooked:1.0,kcal:32,p:0.7,c:7.7,f:0.3}
];

function scaleOptions(selected=''){
  return SCALE_FOODS.map(f=>`<option value="${f.name}" ${f.name===selected?'selected':''}>${f.name}</option>`).join('');
}
function equivalenceFoods(){
 const base=[...SCALE_FOODS,{name:'Copos de avena',kcal:389,p:16.9,c:66.3,f:6.9,unit:'g'},{name:'Crema de arroz ProCao',kcal:352,p:8.8,c:74,f:1.5,unit:'g'}];
 const seen=new Set();return [...base,...customFoods().map(normalizedCustomFood)].filter(x=>{const k=x.name.toLowerCase();if(seen.has(k))return false;seen.add(k);return true;});
}
function eqOptions(selected=''){return equivalenceFoods().map(f=>`<option value="${f.name}" ${f.name===selected?'selected':''}>${f.name}</option>`).join('');}
function convertRawCooked(){
  const food=SCALE_FOODS.find(f=>f.name===document.getElementById('scFood').value);
  const qty=parseFloat(document.getElementById('scQty').value);
  const dir=document.getElementById('scDir').value;
  const out=document.getElementById('scResult');
  if(!food||!Number.isFinite(qty)){out.textContent='Introduce una cantidad válida.';return;}

  let result=qty, note='';
  if(dir==='rawToCooked'){
    result=qty*food.rawToCooked;
    note='Estimación orientativa. La cocción real puede variar por agua, tiempo y método.';
  }else if(dir==='cookedToRaw'){
    result=qty/food.rawToCooked;
    note='Estimación orientativa. La cocción real puede variar por agua, tiempo y método.';
  }else{
    const proteinFoods=['Pollo','Pavo','Ternera magra','Cinta de lomo','Merluza','Bacalao','Dorada','Salmón','Atún fresco'];
    const thawFactor=proteinFoods.includes(food.name)?0.95:1.00;
    if(dir==='frozenToThawed'){
      result=qty*thawFactor;
      note=proteinFoods.includes(food.name)
        ? 'Estimación con una merma orientativa del 5% al descongelar. Si hay glaseado o hielo adherido, usa el peso neto/escurrido real.'
        : 'Sin glaseado se considera aproximadamente 1:1. El peso real puede variar por pérdida de agua.';
    }else if(dir==='thawedToFrozen'){
      result=qty/thawFactor;
      note=proteinFoods.includes(food.name)
        ? 'Estimación inversa suponiendo una merma aproximada del 5% al descongelar.'
        : 'Sin glaseado se considera aproximadamente 1:1.';
    }
  }
  out.innerHTML=`<strong>${Math.round(result)} g</strong><br><span class="note">${note}</span>`;
}
function equivalentAmount(){
  const foods=equivalenceFoods();
  const a=foods.find(f=>f.name===document.getElementById('eqA').value);
  const b=foods.find(f=>f.name===document.getElementById('eqB').value);
  const qty=parseFloat(document.getElementById('eqQty').value);
  const criterion=document.getElementById('eqCriterion').value;
  const out=document.getElementById('eqResult');
  if(!a||!b||!Number.isFinite(qty)){out.textContent='Completa los campos.';return;}
  let va,vb,label;
  if(criterion==='protein'){va=a.p;vb=b.p;label='proteína';}
  else if(criterion==='carbs'){va=a.c;vb=b.c;label='hidratos';}
  else {va=a.kcal;vb=b.kcal;label='calorías';}
  if(!vb){out.textContent=`${b.name} no es adecuado para equivalencia por ${label}.`;return;}
  const target=qty*(va/vb);
  out.innerHTML=`<strong>${Math.round(target)} ${b.unit||'g'} de ${b.name}</strong><br><span class="note">Equivalencia aproximada por ${label}.</span>`;
}

function fruitFoods(){return allFoodCatalog().filter(x=>x.cat==='fruta');}
function fruitOptions(selected=''){
 return fruitFoods().map(f=>`<option value="${f.name}" ${f.name===selected?'selected':''}>${f.name}</option>`).join('');
}
function fruitEquivalent(){
 const fruits=fruitFoods();
 const a=fruits.find(f=>f.name===document.getElementById('frA').value);
 const b=fruits.find(f=>f.name===document.getElementById('frB').value);
 const qty=Number(document.getElementById('frQty').value);
 const criterion=document.getElementById('frCriterion').value;
 const out=document.getElementById('frResult');
 if(!a||!b||!Number.isFinite(qty)||qty<=0){out.textContent='Completa los campos.';return;}
 const va=criterion==='carbs'?a.c:a.kcal, vb=criterion==='carbs'?b.c:b.kcal;
 const target=qty*(va/vb);
 const am={kcal:a.kcal*qty/100,p:a.p*qty/100,c:a.c*qty/100,f:a.f*qty/100};
 const bm={kcal:b.kcal*target/100,p:b.p*target/100,c:b.c*target/100,f:b.f*target/100};
 out.innerHTML=`<strong>${Math.round(qty)} g de ${a.name} ≈ ${Math.round(target)} g de ${b.name}</strong><div class="macro-compare"><div><span>${a.name}</span><strong>${Math.round(am.kcal)} kcal</strong><small>P ${am.p.toFixed(1)} · HC ${am.c.toFixed(1)} · G ${am.f.toFixed(1)}</small></div><div><span>${b.name}</span><strong>${Math.round(bm.kcal)} kcal</strong><small>P ${bm.p.toFixed(1)} · HC ${bm.c.toFixed(1)} · G ${bm.f.toFixed(1)}</small></div></div><p class="note">Equivalencia aproximada por ${criterion==='carbs'?'hidratos':'calorías'}.</p>`;
}

function renderScale(){
 document.getElementById('content').innerHTML=`
 <section class="section"><div class="card hero"><div class="eyebrow">BÁSCULA</div><h2>Crudo ↔ cocinado</h2><p>Conversión orientativa según el alimento y la cocción habitual.</p></div></section>
 <section class="section"><div class="card"><div class="section-title"><h2>Conversor</h2><span>estimación</span></div>
 <label class="field"><span>Alimento</span><select id="scFood" class="input">${scaleOptions('Arroz')}</select></label>
 <div class="row"><label class="field"><span>Cantidad</span><input id="scQty" class="input" type="number" inputmode="decimal" value="75"></label>
 <label class="field"><span>Dirección</span><select id="scDir" class="input"><option value="rawToCooked">Crudo → cocinado</option><option value="cookedToRaw">Cocinado → crudo</option><option value="frozenToThawed">Congelado → descongelado</option><option value="thawedToFrozen">Descongelado → congelado</option></select></label></div>
 <button id="scCalc" class="primary" style="width:100%">Calcular</button>
 <div id="scResult" class="card" style="margin-top:12px;background:#0a1423"></div></div></section>
 <section class="section"><div class="card"><div class="section-title"><h2>Equivalencias</h2><span>entre alimentos</span></div>
 <div class="row"><label class="field"><span>Alimento A</span><select id="eqA" class="input">${eqOptions('Arroz')}</select></label>
 <label class="field"><span>Cantidad A</span><input id="eqQty" class="input" type="number" value="75"></label></div>
 <div class="row"><label class="field"><span>Alimento B</span><select id="eqB" class="input">${eqOptions('Patata')}</select></label>
 <label class="field"><span>Criterio</span><select id="eqCriterion" class="input"><option value="calories">Calorías</option><option value="protein">Proteína</option><option value="carbs">Hidratos</option></select></label></div>
 <button id="eqCalc" class="primary" style="width:100%">Calcular equivalencia</button>
 <div id="eqResult" class="card" style="margin-top:12px;background:#0a1423"></div></div></section>
 <section class="section"><div class="card"><div class="section-title"><h2>Equivalencias de fruta</h2><span>gramos y macros</span></div>
 <div class="row"><label class="field"><span>Fruta A</span><select id="frA" class="input">${fruitOptions('Melocotón')}</select></label><label class="field"><span>Gramos A</span><input id="frQty" class="input" type="number" value="150"></label></div>
 <div class="row"><label class="field"><span>Fruta B</span><select id="frB" class="input">${fruitOptions('Manzana')}</select></label><label class="field"><span>Criterio</span><select id="frCriterion" class="input"><option value="calories">Calorías</option><option value="carbs">Hidratos</option></select></label></div>
 <button id="frCalc" class="primary" style="width:100%">Calcular fruta equivalente</button><div id="frResult" class="card" style="margin-top:12px;background:#0a1423"></div></div></section>`;
 document.getElementById('scCalc').onclick=convertRawCooked;
 document.getElementById('eqCalc').onclick=equivalentAmount;
 document.getElementById('frCalc').onclick=fruitEquivalent;
 ['frA','frB','frQty','frCriterion'].forEach(id=>document.getElementById(id).onchange=fruitEquivalent);
 convertRawCooked();
 equivalentAmount();
 fruitEquivalent();
}

function render(){
 setPage(state.view==='today'?'Hoy':state.view==='meals'?'Comidas':state.view==='scale'?'Báscula':state.view==='foods'?'Alimentos':state.view==='measurements'?'Medidas':state.view==='progress'?'Progreso':'Backup');
 if(state.view==='today')renderToday();
 if(state.view==='meals')renderMeals();
 if(state.view==='scale')renderScale();
 if(state.view==='foods')renderFoods();
 if(state.view==='measurements')renderMeasurements();
 if(state.view==='progress')renderProgress();
 if(state.view==='backup')renderBackup();
}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>{state.view=b.dataset.view;render()});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
migrateBasePlanV6();
migrateBasePlanV8();
render();
