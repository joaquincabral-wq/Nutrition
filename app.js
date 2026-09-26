window.JC_NUTRITION_VERSION='9.9.0';

const DAYS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

const BASE_MEALS={
 lunes:[['Desayuno postentreno',['2 huevos','100 ml claras de huevo','60 g avena','250 ml bebida de almendras sin azúcar','100 g arándanos']],['Media mañana',['80 g pechuga de pavo','40 g pan integral','100 g kiwi']],['Comida',['180 g pechuga de pollo','65 g arroz en crudo','300 g verdura','15 g AOVE']],['Merienda',['150 g queso fresco batido 0%','20 g crema de arroz ProCao','150 g melocotón']],['Cena',['200 g merluza','200 g patata','300 g verdura o ensalada','20 g AOVE']]],
 martes:[['Desayuno postentreno',['2 huevos','100 ml claras de huevo','70 g avena','250 ml bebida de almendras sin azúcar','100 g arándanos']],['Media mañana',['80 g pechuga de pavo','50 g pan integral','100 g kiwi']],['Comida',['180 g pechuga de pollo','75 g arroz en crudo','300 g verdura','15 g AOVE']],['Merienda',['150 g queso fresco batido 0%','30 g crema de arroz ProCao','150 g melocotón']],['Cena',['200 g bacalao','250 g patata','300 g verdura','20 g AOVE']]],
 miércoles:[['Desayuno postentreno',['2 huevos','100 ml claras de huevo','70 g avena','250 ml bebida de almendras sin azúcar','100 g arándanos']],['Media mañana',['80 g pechuga de pavo','50 g pan integral','100 g kiwi']],['Comida',['180 g pechuga de pollo','75 g arroz en crudo','300 g verdura','15 g AOVE']],['Merienda',['150 g queso fresco batido 0%','30 g crema de arroz ProCao','150 g melocotón']],['Cena',['200 g merluza','250 g patata','300 g verdura','20 g AOVE']]],
 jueves:[['Desayuno postentreno',['2 huevos','100 ml claras de huevo','60 g avena','250 ml bebida de almendras sin azúcar','100 g arándanos']],['Media mañana',['80 g pechuga de pavo','40 g pan integral','100 g kiwi']],['Comida',['180 g pechuga de pollo','65 g arroz en crudo','300 g verdura','15 g AOVE']],['Merienda',['150 g queso fresco batido 0%','20 g crema de arroz ProCao','150 g melocotón']],['Cena',['200 g bacalao','200 g patata','300 g verdura','20 g AOVE']]],
 viernes:[['Desayuno postentreno',['2 huevos','100 ml claras de huevo','70 g avena','250 ml bebida de almendras sin azúcar','100 g arándanos']],['Media mañana',['80 g pechuga de pavo','50 g pan integral','100 g kiwi']],['Comida',['180 g pechuga de pollo','75 g arroz en crudo','300 g verdura','15 g AOVE']],['Merienda',['150 g queso fresco batido 0%','30 g crema de arroz ProCao','150 g melocotón']],['Cena',['200 g merluza','250 g patata','300 g verdura','20 g AOVE']]],
 sábado:[['Desayuno',['2 huevos','150 ml claras de huevo','60 g aguacate','150 g fruta']],['Comida',['250 g pechuga de pollo','50 g arroz en crudo','300 g verdura','20 g AOVE']],['Merienda',['250 g queso fresco batido 0%','150 g fruta','20 g pistachos']],['Cena',['300 g pescado','150 g patata','300 g ensalada','25 g AOVE']]],
 domingo:[['Desayuno',['2 huevos','150 ml claras de huevo','60 g aguacate','150 g fruta']],['Comida',['275 g pechuga de pollo','40 g arroz en crudo','300 g verdura','20 g AOVE']],['Merienda',['250 g queso fresco batido 0%','150 g fruta','20 g nueces']],['Cena',['300 g pescado blanco','100 g patata','300 g ensalada','30 g AOVE']]]
};

const DB=[
 ['avena',['avena'],389,16.9,66.3,6.9],
 ['whey',['whey','proteina en polvo','proteína en polvo'],363.3,89,0.33,1.33],
 ['arandanos',['arándanos','arandanos'],57,.7,14.5,.3],
 ['bebida_almendras',['bebida de almendras'],15,.5,.3,1.1],
 ['pollo',['pollo','pollo/pavo'],120,23,0,2.6],
 ['pavo',['pavo'],115,24,0,1.5],
 ['arroz',['arroz'],360,7,80,.7],
 ['pan_integral',['pan integral'],262,12,44,3.3],
 ['verduras',['verduras','verdura'],30,2,5,.3],
 ['aove',['aove','aceite'],884,0,0,100],
 ['melon',['melón','melon'],34,.8,8.2,.2],
 ['qfb',['queso fresco batido'],46,8,4,.2],
 ['cottage',['queso cottage','cottage'],93,13,1.6,4],
 ['wasa',['wasa','pan wasa'],336,9,62,1.5],
 ['lomo_pavo',['lomo de pavo'],215,40,.7,5.8],
 ['jamon_curado',['jamón curado','jamon curado','jamón','jamon'],251,33.3,.5,12.8],
 ['cecina',['cecina'],259,39,.8,12],
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
 ['kiwi',['kiwi'],61,1.1,14.7,.5],
 ['dorada',['dorada'],115,20,0,4],
 ['ensalada',['ensalada'],20,1,3,.2],
 ['aguacate',['aguacate'],160,2,8.5,14.7],
 ['pescado',['pescado'],110,20,0,3],
 ['activia',['activia natural edulcorado','activia'],39,4.0,4.8,0.4],
 ['salvado_avena',['salvado de avena','salvado'],246,17.3,66.2,7.0],
 ['fresas',['fresas','fresa'],32,0.7,7.7,0.3],
 ['almendras',['almendras', 'almendra'],579,21.2,21.6,49.9],
 ['nueces',['nueces', 'nuez'],654,15.2,13.7,65.2],
 ['anacardos',['anacardos', 'anacardo'],553,18.2,30.2,43.8],
 ['avellanas',['avellanas', 'avellana'],628,15.0,16.7,60.8]
];


const SMART_FOODS=[
 {name:'Huevo entero',cat:'proteina',kcal:143,p:12.6,c:.7,f:9.5,role:'protein_cook'},
 {name:'Fruta',cat:'fruta',kcal:50,p:.6,c:12,f:.2},
 {name:'Verdura',cat:'verdura',kcal:30,p:2,c:5,f:.3},
 {name:'Ensalada',cat:'verdura',kcal:20,p:1,c:3,f:.2},
 {name:'Cacahuete en polvo',cat:'grasa',kcal:380,p:46,c:35,f:12,role:'fat_topping'},
 {name:'Pollo',cat:'proteina',kcal:120,p:23,c:0,f:2.6,role:'protein_main'},
 {name:'Pavo plancha',cat:'proteina',kcal:115,p:24,c:0,f:1.5,role:'protein_main'},
 {name:'Cinta de lomo',cat:'proteina',kcal:150,p:22,c:0,f:6,role:'protein_main'},
 {name:'Ternera magra',cat:'proteina',kcal:170,p:24,c:0,f:8,role:'protein_main'},
 {name:'Merluza',cat:'proteina',kcal:86,p:18.5,c:0,f:1.8,role:'protein_main'},
 {name:'Bacalao',cat:'proteina',kcal:82,p:18,c:0,f:.7,role:'protein_main'},
 {name:'Dorada',cat:'proteina',kcal:115,p:20,c:0,f:4,role:'protein_main'},
 {name:'Salmón',cat:'proteina',kcal:208,p:20,c:0,f:13,role:'protein_main'},
 {name:'Atún fresco',cat:'proteina',kcal:144,p:23,c:0,f:5,role:'protein_main'},
 {name:'Gambas',cat:'proteina',kcal:99,p:24,c:.2,f:.3,role:'protein_main'},
 {name:'Arroz en crudo',cat:'hidrato',kcal:360,p:7,c:80,f:.7,role:'carb_meal'},
 {name:'Patata en crudo',cat:'hidrato',kcal:77,p:2,c:17,f:.1,role:'carb_meal'},
 {name:'Batata en crudo',cat:'hidrato',kcal:86,p:1.6,c:20,f:.1,role:'carb_meal'},
 {name:'Avena',cat:'hidrato',kcal:389,p:16.9,c:66.3,f:6.9,role:'carb_breakfast'},
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
 {name:'Copos de avena',cat:'hidrato',kcal:389,p:16.9,c:66.3,f:6.9,role:'carb_breakfast'},
 {name:'Salvado de avena',cat:'hidrato',kcal:246,p:17.3,c:66.2,f:7.0,role:'carb_breakfast'},
 {name:'Queso fresco batido 0%',cat:'lacteo',kcal:46,p:8.0,c:4.0,f:0.2,role:'protein_cold'},
 {name:'Queso cottage',cat:'lacteo',kcal:93,p:13,c:1.6,f:4,role:'protein_cold'},
 {name:'Activia natural edulcorado',cat:'lacteo',kcal:39,p:4.0,c:4.8,f:0.4,role:'dairy_snack'},
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
 {name:'Pechuga de pollo',cat:'proteina',kcal:120,p:23,c:0,f:2.6,role:'protein_main'},
 {name:'Pechuga de pavo',cat:'proteina',kcal:115,p:24,c:0,f:1.5,role:'protein_cold'},
 {name:'Claras de huevo',cat:'proteina',kcal:46,p:10.5,c:0.7,f:0.2,role:'protein_cook'},
 {name:'Pasta en crudo',cat:'hidrato',kcal:350,p:12,c:72,f:1.5,role:'carb_meal'},
 {name:'Bebida de almendras sin azúcar',cat:'lacteo',kcal:13,p:0.4,c:0.2,f:1.1,role:'beverage'},
 {name:'Fresas',cat:'fruta',kcal:32,p:0.7,c:7.7,f:0.3},
 {name:'AOVE',cat:'grasa',kcal:884,p:0,c:0,f:100},
 {name:'Crema de arroz ProCao',cat:'hidrato',kcal:352,p:8.8,c:74,f:1.5,role:'carb_breakfast_snack'},
 {name:'Proteína en polvo',cat:'proteina',kcal:363.3,p:89,c:.33,f:1.33,role:'protein_powder'},
 {name:'Pan Wasa Original',cat:'hidrato',kcal:336,p:9,c:62,f:1.5,role:'carb_snack',pieceGrams:11.4},
 {name:'Pan integral',cat:'hidrato',kcal:262,p:12,c:44,f:3.3,role:'carb_snack'},
 {name:'Lomo de pavo Mercadona',cat:'proteina',kcal:215,p:40,c:.7,f:5.8,role:'protein_cold'},
 {name:'Jamón curado 14 meses',cat:'proteina',kcal:251,p:33.3,c:.5,f:12.8,role:'protein_cold'},
 {name:'Cecina de vacuno',cat:'proteina',kcal:259,p:39,c:.8,f:12,role:'protein_cold'},
 {name:'Pistachos',cat:'grasa',kcal:562,p:20.3,c:27.5,f:45.4},
 {name:'Almendras',cat:'grasa',kcal:579,p:21.2,c:21.6,f:49.9},
 {name:'Nueces',cat:'grasa',kcal:654,p:15.2,c:13.7,f:65.2},
 {name:'Anacardos',cat:'grasa',kcal:553,p:18.2,c:30.2,f:43.8},
 {name:'Avellanas',cat:'grasa',kcal:628,p:15.0,c:16.7,f:60.8},
 {name:'Aguacate',cat:'grasa',kcal:160,p:2.0,c:8.5,f:14.7}
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
  ['Pistachos',['pistachos','pistacho']],
  ['Almendras',['almendras','almendra']],
  ['Nueces',['nueces','nuez']],
  ['Anacardos',['anacardos','anacardo']],
  ['Avellanas',['avellanas','avellana']],
  ['AOVE',['aove','aceite de oliva']],
  ['Aguacate',['aguacate']],
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
  ['Pan integral',['pan integral']],
  ['Pan Wasa Original',['pan wasa','wasa']],
  ['Lomo de pavo Mercadona',['lomo de pavo']],
  ['Jamón curado 14 meses',['jamón curado','jamon curado']],
  ['Cecina de vacuno',['cecina']],
  ['Huevo entero',['huevos','huevo']],
  ['Fruta',[' fruta']],
  ['Verdura',['verdura']],
  ['Ensalada',['ensalada']],
  ['Cacahuete en polvo',['cacahuete en polvo']],
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
 else if(src.cat==='grasa'&&target.cat==='grasa') q=qty*(src.kcal/target.kcal);
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
 // Prefer the most specific alias. This prevents "claras de huevo" from
 // being classified as whole egg simply because it also contains "huevo".
 const matches=DB.filter(x=>x[1].some(p=>t.includes(p)));
 const db=matches.sort((a,b)=>Math.max(...b[1].filter(p=>t.includes(p)).map(p=>p.length))-Math.max(...a[1].filter(p=>t.includes(p)).map(p=>p.length)))[0];
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
function migratePlan19V98(){
 if(localStorage.getItem('jcNutritionPlan19Version')==='9.9.0')return;
 const month=localISO().slice(0,7),plans=load('v9Plans',{}),date=localISO();
 if(!plans[month])plans[month]={};
 plans[month].meals=JSON.parse(JSON.stringify(BASE_MEALS));
 save('v9Plans',plans);
 save('v7Targets',JSON.parse(JSON.stringify(V7_DEFAULT_TARGETS)));
 // Limpia solo ajustes del menu de hoy; conserva historico, medidas, comidas marcadas y Extras.
 ['mealSubs:','v6MealOmit:','v6MealRedis:','v10MealAdds:','freeMeals:','skippedMeals:'].forEach(k=>localStorage.removeItem(k+date));
 localStorage.setItem('jcNutritionBasePlanVersion','8');
 localStorage.setItem('jcNutritionPlan19Version','9.9.0');
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
function skippedMeals(date){return load(`skippedMeals:${date}`,{});}
function toggleSkippedMeal(date,mi){
 const x=skippedMeals(date);
 if(x[mi]) delete x[mi]; else x[mi]=true;
 save(`skippedMeals:${date}`,x);
 render();
}
function dayExtras(date){return load(`dayExtras:${date}`,[]);}
function extrasTotals(date){
 let total={kcal:0,p:0,c:0,f:0};
 dayExtras(date).forEach(x=>{total=add(total,macros(`${x.qty} ${x.unit||'g'} ${x.name}`));});
 return total;
}
function planOnlyTotals(day,date){
 let total={kcal:0,p:0,c:0,f:0};
 const plan=planForDay(day),free=freeMeals(date),skipped=skippedMeals(date);
 plan.forEach((m,mi)=>{
   if(free[mi]||skipped[mi]) return;
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
   <button class="secondary" id="rebalanceExtrasBtn" type="button" style="width:100%;margin-top:8px">⚖ Recalcular resto del día</button>
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
 if(/pollo|pavo|ternera|lomo|merluza|bacalao|dorada|salm|atún|atun|gamba|huevo|claras|queso fresco batido|cottage|activia|whey|proteína en polvo|proteina en polvo|cecina|jamón|jamon/.test(t)) return 'protein';
 if(/verdura|ensalada|tomate|lechuga|pepino|calabac|berenjena|brócoli|brocoli|coliflor|espárrag|esparrag|pimiento|champi|judía|judia|cebolla|espinaca|zanahoria/.test(t)) return 'veg';
 return 'other';
}
function v85ReplaceQty(text,newQty){
 const m=String(text).match(/([0-9]+(?:[.,][0-9]+)?)\s*(g|ml)/i);
 if(!m)return text;
 return String(text).replace(m[0],`${Math.max(0,Math.round(newQty))} ${m[2]}`);
}

function v87CurrentState(day,date){
 const goal=v7Targets()[v7Type(day,date)];
 const done=load(`meals:${date}`,{}),free=freeMeals(date),skipped=skippedMeals(date),plan=planForDay(day);
 const projected=dayTotals(day,date);
 const items=[];
 plan.forEach((meal,mi)=>{
   if(done[mi]||free[mi]||skipped[mi])return;
   meal[1].forEach((orig,fi)=>{
     if(omitted(date,mi,fi))return;
     const text=currentText(date,mi,fi,orig),m=macros(text),q=parseQty(text),kind=v85Kind(text);
     if(!m.known||q==null||kind==='veg'||kind==='other')return;
     items.push({meal:meal[0],mi,fi,text,m,q,kind});
   });
 });
 return {goal,projected,items};
}
function v87Clone(x){return JSON.parse(JSON.stringify(x));}
function v87ApplyToProjection(proj,it,newQ){
 const ratio=newQ/it.q,nm={kcal:it.m.kcal*ratio,p:it.m.p*ratio,c:it.m.c*ratio,f:it.m.f*ratio};
 return {kcal:proj.kcal-it.m.kcal+nm.kcal,p:proj.p-it.m.p+nm.p,c:proj.c-it.m.c+nm.c,f:proj.f-it.m.f+nm.f};
}
function v87ProposalScore(x,t){
 return Math.abs(x.kcal-t.kcal)/Math.max(100,t.kcal)*2
  +Math.abs(x.p-t.p)/Math.max(20,t.p)
  +Math.abs(x.c-t.c)/Math.max(20,t.c)
  +Math.abs(x.f-t.f)/Math.max(10,t.f)*1.2;
}
function v87BuildOptions(day,date){
 const st=v87CurrentState(day,date),goal=st.goal,before=st.projected,items=st.items;
 const tol=Math.max(60,goal.kcal*.035);
 const options=[];

 function mk(title,desc,actions,after){
   options.push({title,desc,actions,after,score:v87ProposalScore(after,goal)});
 }

 // OPTION 1: minimal intervention, one change only.
 {
   const candidates=[];
   for(const it of items){
     const unitKcal=it.m.kcal/it.q;
     if(unitKcal<=0)continue;
     const delta=before.kcal-goal.kcal;
     if(Math.abs(delta)<=tol) continue;
     if(delta>0){
       const stepMap={fat:5,carb:10,fruit:25,protein:25};
       const step=stepMap[it.kind]||10;
       const targetCut=Math.min(it.q*.5, Math.max(step, Math.round((delta/unitKcal)/step)*step));
       const nq=Math.max(it.q*.5,it.q-targetCut);
       if(nq<it.q-1){
         const after=v87ApplyToProjection(before,it,nq);
         candidates.push({after,actions:[{type:'replace',mi:it.mi,fi:it.fi,meal:it.meal,from:it.text,to:v85ReplaceQty(it.text,nq)}],score:v87ProposalScore(after,goal)});
       }
     }else{
       const stepMap={fat:5,carb:10,fruit:25,protein:25};
       const step=stepMap[it.kind]||10;
       const need=-delta;
       const inc=Math.max(step,Math.round((need/unitKcal)/step)*step);
       const maxFactor=it.kind==='fat'?1.5:it.kind==='fruit'?1.5:1.75;
       const nq=Math.min(it.q*maxFactor,it.q+inc);
       if(nq>it.q+1){
         const after=v87ApplyToProjection(before,it,nq);
         candidates.push({after,actions:[{type:'replace',mi:it.mi,fi:it.fi,meal:it.meal,from:it.text,to:v85ReplaceQty(it.text,nq)}],score:v87ProposalScore(after,goal)});
       }
     }
   }
   candidates.sort((a,b)=>a.score-b.score);
   if(candidates[0]) mk('Opción 1 · Cambio mínimo','Toca una sola cantidad.',candidates[0].actions,candidates[0].after);
 }

 // OPTION 2: distribute between at most two foods.
 {
   const sorted=[...items].sort((a,b)=>{
     const pr={fat:1,carb:2,fruit:3,protein:4};
     return pr[a.kind]-pr[b.kind] || b.m.kcal-a.m.kcal;
   });
   let proj={...before},actions=[];
   for(const it of sorted){
     if(actions.length>=2)break;
     const delta=proj.kcal-goal.kcal;
     if(Math.abs(delta)<=tol)break;
     const unitKcal=it.m.kcal/it.q;if(unitKcal<=0)continue;
     if(delta>0){
       const fraction=Math.min(.35,Math.max(.08,(delta/Math.max(1,it.m.kcal))/2));
       const nq=Math.max(it.q*.5,it.q*(1-fraction));
       if(nq<it.q-1){
         actions.push({type:'replace',mi:it.mi,fi:it.fi,meal:it.meal,from:it.text,to:v85ReplaceQty(it.text,nq)});
         proj=v87ApplyToProjection(proj,it,nq);
       }
     }else{
       const need=-delta;
       const addQ=Math.min(it.q*.35,need/unitKcal/2);
       const nq=it.q+Math.max(0,addQ);
       if(nq>it.q+1){
         actions.push({type:'replace',mi:it.mi,fi:it.fi,meal:it.meal,from:it.text,to:v85ReplaceQty(it.text,nq)});
         proj=v87ApplyToProjection(proj,it,nq);
       }
     }
   }
   if(actions.length) mk('Opción 2 · Repartido','Reparte el ajuste entre dos alimentos.',actions,proj);
 }

 // OPTION 3: prioritize macro balance, especially protein.
 {
   let proj={...before},actions=[];
   const proteinItems=items.filter(x=>x.kind==='protein');
   const carbItems=items.filter(x=>x.kind==='carb');
   const fatItems=items.filter(x=>x.kind==='fat');
   const fruitItems=items.filter(x=>x.kind==='fruit');

   // First address protein gap if meaningful.
   if(proj.p<goal.p-10 && proteinItems.length){
     const it=proteinItems[0],needP=goal.p-proj.p;
     const addQ=Math.min(it.q*.5, needP/Math.max(.01,it.m.p/it.q));
     if(addQ>4){
       const nq=it.q+addQ;
       actions.push({type:'replace',mi:it.mi,fi:it.fi,meal:it.meal,from:it.text,to:v85ReplaceQty(it.text,nq)});
       proj=v87ApplyToProjection(proj,it,nq);
     }
   }

   let delta=proj.kcal-goal.kcal;
   const pool=delta>0?[...fatItems,...carbItems,...fruitItems,...proteinItems]:[...carbItems,...proteinItems,...fruitItems,...fatItems];
   for(const it of pool){
     if(actions.length>=3)break;
     delta=proj.kcal-goal.kcal;
     if(Math.abs(delta)<=tol)break;
     const unitKcal=it.m.kcal/it.q;if(unitKcal<=0)continue;
     if(delta>0){
       const maxCut=it.kind==='protein'?it.q*.25:it.q*.4;
       const cut=Math.min(maxCut,delta/unitKcal);
       const nq=it.q-cut;
       if(nq>0 && nq<it.q-1){
         actions.push({type:'replace',mi:it.mi,fi:it.fi,meal:it.meal,from:it.text,to:v85ReplaceQty(it.text,nq)});
         proj=v87ApplyToProjection(proj,it,nq);
       }
     }else{
       const addQ=Math.min(it.q*.35,(-delta)/unitKcal);
       const nq=it.q+addQ;
       if(nq>it.q+1){
         actions.push({type:'replace',mi:it.mi,fi:it.fi,meal:it.meal,from:it.text,to:v85ReplaceQty(it.text,nq)});
         proj=v87ApplyToProjection(proj,it,nq);
       }
     }
   }
   if(actions.length) mk('Opción 3 · Mejor reparto de macros','Prioriza proteína y el equilibrio global.',actions,proj);
 }

 options.sort((a,b)=>a.score-b.score);
 return {goal,before,options:options.slice(0,3)};
}

function v85Proposal(day,date){
 const x=v87BuildOptions(day,date);
 const best=x.options[0];
 return best?{goal:x.goal,before:x.before,after:best.after,actions:best.actions,message:best.desc}:{goal:x.goal,before:x.before,after:x.before,actions:[],message:'No veo un ajuste útil que merezca la pena aplicar.'};
}

function closeV85Modal(){document.getElementById('v85-modal')?.remove();}
function openRebalanceModal(day,date){
 closeV85Modal();
 const pack=v87BuildOptions(day,date);
 const modal=document.createElement('div');modal.id='v85-modal';modal.className='modal';
 const cards=pack.options.length?pack.options.map((o,idx)=>`
   <div class="card v87-option">
    <div class="section-title"><h3>${o.title}</h3><span>${Math.round(o.after.kcal)} kcal</span></div>
    <p class="note">${o.desc}</p>
    ${o.actions.map(a=>`<div class="v85-action"><b>${a.meal}</b><span>${a.from}</span><strong>→ ${a.to}</strong></div>`).join('')}
    <div class="v87-result">Resultado: ${Math.round(o.after.kcal)} kcal · ${Math.round(o.after.p)} P · ${Math.round(o.after.c)} HC · ${Math.round(o.after.f)} G</div>
    <button class="primary v87ApplyOption" data-opt="${idx}" style="width:100%;margin-top:10px">Aplicar esta opción</button>
   </div>`).join(''):`<div class="card"><p class="note">No veo un ajuste útil que merezca la pena aplicar ahora mismo.</p></div>`;
 modal.innerHTML=`<div class="sheet">
   <div class="section-title"><h2>Recalcular resto del día</h2><button id="v85Close" class="tiny">Cerrar</button></div>
   <p class="note">Puedes recalcular tantas veces como quieras. Solo se modifican comidas pendientes; lo realizado y lo saltado quedan bloqueados.</p>
   <div class="card v85-summary">
    <b>Estado actual: ${Math.round(pack.before.kcal)} kcal · ${Math.round(pack.before.p)} P · ${Math.round(pack.before.c)} HC · ${Math.round(pack.before.f)} G</b>
    <span>Objetivo: ${pack.goal.kcal} kcal · ${pack.goal.p} P · ${pack.goal.c} HC · ${pack.goal.f} G</span>
   </div>
   ${cards}
   <button id="v85Keep" class="secondary" style="width:100%">Mantener menú</button>
 </div>`;
 document.body.appendChild(modal);
 document.getElementById('v85Close').onclick=closeV85Modal;
 document.getElementById('v85Keep').onclick=closeV85Modal;
 document.querySelectorAll('.v87ApplyOption').forEach(btn=>btn.onclick=()=>{
   const o=pack.options[Number(btn.dataset.opt)]; if(!o)return;
   if(!confirm('¿Aplicar esta propuesta a las comidas pendientes?'))return;
   const subs=load(`mealSubs:${date}`,{}),om=load(`v6MealOmit:${date}`,{});
   o.actions.forEach(a=>{
     const key=`${a.mi}:${a.fi}`;
     if(a.type==='omit')om[key]=true;
     else subs[key]={replacement:a.to,mode:'dynamic-rebalance'};
   });
   save(`mealSubs:${date}`,subs);save(`v6MealOmit:${date}`,om);
   closeV85Modal();render();
 });
}

function dayTotals(day,date){
 return add(planOnlyTotals(day,date),extrasTotals(date));
}
function consumedTotals(day,date){
 let total={kcal:0,p:0,c:0,f:0};
 const done=load(`meals:${date}`,{}),plan=planForDay(day),free=freeMeals(date),skipped=skippedMeals(date);
 plan.forEach((m,mi)=>{
  if(done[mi] && !free[mi] && !skipped[mi]){
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
  ${bar('Proteína consumida',cons.p,goal.p,'g')}${bar('Hidratos consumidos',cons.c,goal.c,'g')}${bar('Grasas consumidas',cons.f,goal.f,'g')}
  <p class="note">Lo pendiente es margen respecto al objetivo, no una obligación de consumirlo íntegramente.</p>
 </div></section>`;
}
function bar(label,v,t,u){return `<div class="macro-row"><div class="macro-head"><span>${label}</span><strong>${Math.round(v)} / ${Math.round(t)} ${u}</strong></div><div class="track"><i style="width:${pct(v,t)}%"></i></div></div>`}
function mealCard(day,date,m,mi,editable=true){
 const done=!!load(`meals:${date}`,{})[mi],isFree=!!freeMeals(date)[mi],isSkipped=!!skippedMeals(date)[mi];
 const foods=m[1].map((orig,fi)=>{
  const text=currentText(date,mi,fi,orig),isO=omitted(date,mi,fi),mac=macros(text);
  return `<div class="food ${isO?'omitted':''}"><div><strong>${text}</strong>${mac.known?`<small>≈ ${Math.round(mac.kcal)} kcal · P ${Math.round(mac.p)} · HC ${Math.round(mac.c)} · G ${Math.round(mac.f)}</small>`:''}</div>${editable?`<div class="food-actions"><button class="tiny" data-edit="${mi}:${fi}">Cambiar</button><button class="tiny" data-omit="${mi}:${fi}">${isO?'Restaurar':'Omitir'}</button></div>`:''}</div>`;
 }).join('');
 const adds=addedFoods(date,mi).map((x,i)=>{
  const am=macros(x);
  return `<div class="food"><div><strong>${x}</strong>${am.known?`<small>≈ ${Math.round(am.kcal)} kcal · P ${Math.round(am.p)} · HC ${Math.round(am.c)} · G ${Math.round(am.f)}</small>`:'<small>Macros no disponibles</small>'}<small>Añadido</small></div>${editable?`<button class="tiny danger" data-rmadd="${mi}:${i}">Quitar</button>`:''}</div>`;
 }).join('');
 const stateLabel=isSkipped?'⏭️ '+m[0]+' · SALTADA':isFree?'🍽️ '+m[0]+' · COMIDA LIBRE':m[0];
 return `<div class="card meal-card ${done?'v7done':''} ${isFree?'meal-free':''} ${isSkipped?'meal-skipped':''}" data-meal-index="${mi}" data-meal-done="${done?1:0}" data-meal-skipped="${isSkipped?1:0}">
 <div class="meal-head"><strong>${stateLabel}</strong>${editable&&!isSkipped?`<button class="check ${done?'done':''}" data-done="${mi}">${done?'✓':'○'}</button>`:''}</div>
 ${isSkipped?`<p class="note">Esta comida no se contabiliza en el plan del día.</p><button class="secondary" data-skip-meal="${mi}" style="width:100%">Restaurar comida</button>`:
 isFree?`<p class="note">La comida prevista no se contabiliza. Puedes registrar lo que tomes en Extras para estimar el día.</p><div class="row"><button class="secondary" data-free-meal="${mi}" style="width:100%">Restaurar comida prevista</button><button class="secondary" data-skip-meal="${mi}" style="width:100%">⏭️ Saltar comida</button></div>`:
 `<details ${done?'':'open'}><summary class="note">Ver alimentos</summary><div class="food-list">${foods}${adds}</div>${editable?`<div class="row"><button class="secondary" data-add="${mi}" style="width:100%;margin-top:10px">+ Añadir alimento</button><button class="secondary" data-free-meal="${mi}" style="width:100%;margin-top:10px">🍽️ Marcar como comida libre</button><button class="secondary" data-skip-meal="${mi}" style="width:100%;margin-top:10px">⏭️ Saltar comida</button></div>`:''}</details>`}
 </div>`;
}

function closeFoodModal(){
 document.getElementById('food-change-modal')?.remove();
}
function foodOptions(list,selected=''){
 return list.map(x=>`<option value="${x.name}" ${x.name===selected?'selected':''}>${x.name}</option>`).join('');
}
function mealContextLabel(day,mi){
 const plan=planForDay(day);
 return String(plan?.[mi]?.[0]||'').toLowerCase();
}
function changeOptionsForContext(src,mealLabel,currentText){
 const catalog=allFoodCatalog().filter(x=>x.cat!=='rodilla');
 if(!src) return catalog;
 const label=String(mealLabel||'').toLowerCase();
 const text=String(currentText||'').toLowerCase();
 const isSnack=label.includes('media mañana')||label.includes('merienda');
 const isBreakfast=label.includes('desayuno');
 const isMain=label.includes('comida')||label.includes('cena');

 if(src.cat==='fruta') return catalog.filter(x=>x.cat==='fruta');
 if(src.cat==='verdura') return catalog.filter(x=>x.cat==='verdura');
 if(src.cat==='grasa') return catalog.filter(x=>x.cat==='grasa');

 if(src.cat==='hidrato') {
  if(isSnack) return catalog.filter(x=>x.cat==='hidrato'&&['carb_snack','carb_breakfast_snack'].includes(x.role));
  if(isBreakfast) return catalog.filter(x=>x.cat==='hidrato'&&['carb_breakfast','carb_breakfast_snack','carb_snack'].includes(x.role));
  if(isMain) return catalog.filter(x=>x.cat==='hidrato'&&['carb_meal','carb_snack'].includes(x.role));
  return catalog.filter(x=>x.cat==='hidrato');
 }

 if(src.cat==='lacteo') {
  if(src.role==='beverage'||text.includes('bebida de almendras')) return catalog.filter(x=>x.role==='beverage');
  if(isSnack) return catalog.filter(x=>['protein_cold','dairy_snack'].includes(x.role));
  return catalog.filter(x=>x.cat==='lacteo');
 }

 if(src.cat==='proteina') {
  if(isSnack) return catalog.filter(x=>['protein_cold','protein_powder'].includes(x.role));
  if(isBreakfast) return catalog.filter(x=>['protein_cold','protein_powder','protein_cook'].includes(x.role)||['Pollo','Pavo plancha','Pechuga de pollo'].includes(x.name));
  if(isMain) return catalog.filter(x=>x.role==='protein_main'||x.role==='protein_cook');
  return catalog.filter(x=>x.cat==='proteina');
 }
 return catalog.filter(x=>x.cat===src.cat);
}
function openFoodChangeModal(day,date,mi,fi,currentText){
 closeFoodModal();
 const src=smartFoodFromText(currentText);
 const catalog=allFoodCatalog();
 const mealLabel=mealContextLabel(day,mi);
 const options=changeOptionsForContext(src,mealLabel,currentText);
 const targetDefault=options.find(x=>x.name!==src?.name)||options[0];
 const suggested=src&&targetDefault?equivalentQty(currentText,targetDefault):(parseQty(currentText)||'');

 const modal=document.createElement('div');
 modal.id='food-change-modal';
 modal.className='modal';
 modal.innerHTML=`<div class="sheet">
  <div class="section-title"><h2>Cambiar alimento</h2><button id="fmClose" class="tiny">Cerrar</button></div>
  <p class="note">Original: <strong>${currentText}</strong></p><p class="note">Opciones filtradas para ${mealLabel||'esta comida'} y el mismo grupo nutricional.</p>
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
  const pieces=target?.pieceGrams&&q?Math.max(1,Math.round(q/target.pieceGrams)):null;
  const pieceNote=pieces?` · ≈ ${pieces} rebanada${pieces===1?'':'s'}`:'';
  const suggestion=q?`<strong>Equivalencia sugerida: ${q} ${unit.value} de ${target.name}${pieceNote}</strong>`:'<strong>Sin equivalencia automática fiable.</strong>';
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
  render();setTimeout(()=>openRebalanceModal(day,date),90);setTimeout(()=>openRebalanceModal(day,date),90);
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
 document.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>{const d=load(`meals:${date}`,{}),i=b.dataset.done;d[i]=!d[i];save(`meals:${date}`,d);render();setTimeout(()=>openRebalanceModal(day,date),90)});
 document.querySelectorAll('[data-omit]').forEach(b=>b.onclick=()=>{const [mi,fi]=b.dataset.omit.split(':'),k=`v6MealOmit:${date}`,d=load(k,{}),id=`${mi}:${fi}`;d[id]?delete d[id]:d[id]=true;save(k,d);render();setTimeout(()=>openRebalanceModal(day,date),90)});
 document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const [mi,fi]=b.dataset.edit.split(':').map(Number),plan=planForDay(day),orig=plan[mi][1][fi],cur=currentText(date,mi,fi,orig);openFoodChangeModal(day,date,mi,fi,cur)});
 document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{openFoodAddModal(day,date,Number(b.dataset.add))});
 document.querySelectorAll('[data-rmadd]').forEach(b=>b.onclick=()=>{const [mi,i]=b.dataset.rmadd.split(':'),k=`v10MealAdds:${date}`,d=load(k,{});(d[mi]||[]).splice(+i,1);save(k,d);render();setTimeout(()=>openRebalanceModal(day,date),90)});

 document.querySelectorAll('[data-free-meal]').forEach(b=>b.onclick=()=>{toggleFreeMeal(date,Number(b.dataset.freeMeal));setTimeout(()=>openRebalanceModal(day,date),90);});
 document.querySelectorAll('[data-skip-meal]').forEach(b=>b.onclick=()=>{
   const mi=Number(b.dataset.skipMeal);
   const d=load(`meals:${date}`,{});if(d[mi]){delete d[mi];save(`meals:${date}`,d);}
   const f=freeMeals(date);if(f[mi]){delete f[mi];save(`freeMeals:${date}`,f);}
   const x=skippedMeals(date);if(x[mi])delete x[mi];else x[mi]=true;save(`skippedMeals:${date}`,x);
   render();setTimeout(()=>openRebalanceModal(day,date),90);
 });
}
function resetDayMenu(day,date){
 if(!confirm('Se perderán los cambios manuales de alimentos y cantidades de este día. ¿Restaurar menú original?')) return;
 localStorage.removeItem('mealSubs:'+date);
 localStorage.removeItem('v6MealOmit:'+date);
 localStorage.removeItem('v6MealRedis:'+date);
 localStorage.removeItem('v10MealAdds:'+date);
 localStorage.removeItem('skippedMeals:'+date);
 const month=date.slice(0,7),plans=load('v9Plans',{});
 if(!plans[month]) plans[month]={};
 if(!plans[month].meals) plans[month].meals={};
 plans[month].meals[day]=JSON.parse(JSON.stringify(BASE_MEALS[day]));
 save('v9Plans',plans);
 render();
}

const V7_DEFAULT_TARGETS={training:{kcal:2300,p:180,c:240,f:70},training_high:{kcal:2450,p:180,c:275,f:70},cardio:{kcal:2200,p:180,c:190,f:80},rest:{kcal:2150,p:180,c:170,f:83}};
function v7Targets(){const saved=load('v7Targets',{});return {...JSON.parse(JSON.stringify(V7_DEFAULT_TARGETS)),...saved};}
function v7DefaultType(day){day=String(day).toLowerCase();if(['martes','miércoles','viernes'].includes(day))return'training_high';return ['lunes','jueves'].includes(day)?'training':'rest';}
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
 const type=v7Type(day,date),t=v7Targets()[type],cons=consumedTotals(day,date),plan=dayTotals(day,date),ad=v82Advice(day,date);
 const progressClass=(v,t)=>v>t?'warn':'ok';
 const row=(n,k,u)=>`<div class="v7row ${progressClass(cons[k],t[k])}"><span>${n}</span><b>${Math.round(cons[k])} / ${t[k]} ${u}</b></div>`;
 const planStates=['kcal','p','c','f'].map(k=>v7Status(plan[k],t[k],k));
 const planOverall=planStates.includes('bad')?'bad':planStates.includes('warn')?'warn':'ok';
 const planMsg=planOverall==='ok'?'Plan previsto bien ajustado':planOverall==='warn'?'Plan previsto con algun desvio':'Plan previsto a revisar';
 const label=type==='training_high'?'fuerza · HC alto':type==='training'?'fuerza':type==='cardio'?'cardio/LISS':'descanso';
 window.__v82Advice=ad.action;
 return `<section class="section"><div class="section-title"><h2>Objetivo del dia</h2><span>${label}</span></div><div class="card v7panel">
 <label class="field"><span>Tipo de dia</span><select id="v7DayType" class="input"><option value="training"${type==='training'?' selected':''}>Fuerza</option><option value="training_high"${type==='training_high'?' selected':''}>Fuerza · HC alto</option><option value="cardio"${type==='cardio'?' selected':''}>Cardio / LISS</option><option value="rest"${type==='rest'?' selected':''}>Descanso</option></select></label>
 <p class="note">Cada fila muestra <strong>consumido / objetivo</strong>. Solo suma comidas marcadas como realizadas y Extras registrados.</p>
 ${row('Calorias','kcal','kcal')}${row('Proteina','p','g')}${row('Hidratos','c','g')}${row('Grasas','f','g')}
 <div class="v81summary ${planOverall}"><strong>${planMsg}</strong><div class="note" style="margin-top:6px">Plan completo: ${Math.round(plan.kcal)} kcal · P ${Math.round(plan.p)} · HC ${Math.round(plan.c)} · G ${Math.round(plan.f)}</div></div>
 <div class="v82advice">${ad.html}${ad.action?'<button id="v82Apply" class="primary" type="button">Aplicar ajuste</button>':''}</div>
 <button id="v7EditTargets" class="secondary" type="button">Editar objetivos</button></div></section>`;
}
function v7EditTargets(day,date){const all=v7Targets(),type=v7Type(day,date),t=all[type];const q=(x,v)=>prompt(x,String(v));const a=[q('Calorías objetivo',t.kcal),q('Proteína objetivo (g)',t.p),q('Hidratos objetivo (g)',t.c),q('Grasas objetivo (g)',t.f)];if(a.some(x=>x===null))return;const n=a.map(Number);if(n.some(x=>!Number.isFinite(x)||x<0)){alert('Introduce valores válidos.');return;}all[type]={kcal:n[0],p:n[1],c:n[2],f:n[3]};save('v7Targets',all);render();}
function v73StickyBar(day,date){
 const type=v7Type(day,date),t=v7Targets()[type],cons=consumedTotals(day,date);
 return `<div class="v73sticky" id="v73Sticky"><span>🔥 ${Math.round(cons.kcal)}/${t.kcal}</span><span>P ${Math.round(cons.p)}/${t.p}</span><span>HC ${Math.round(cons.c)}/${t.c}</span><span>G ${Math.round(cons.f)}/${t.f}</span></div>`;
}
function renderToday(){
 const d=new Date(),day=dayKey(d),date=localISO(d),plan=planForDay(day),done=load(`meals:${date}`,{}),skipped=skippedMeals(date);const ordered=plan.map((m,i)=>({m,i,done:!!done[i],skipped:!!skipped[i]})).sort((a,b)=>((a.done?2:a.skipped?1:0)-(b.done?2:b.skipped?1:0)));
 document.getElementById('content').innerHTML=`<section class="section"><div class="card hero"><div class="eyebrow">${d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}).toUpperCase()}</div><h2>Plan de alimentación</h2><p>Comidas, macros, medidas y progreso corporal.</p></div></section>${v7ObjectivePanel(day,date)}${v73StickyBar(day,date)}${macroBlock(day,date)}${renderExtrasBlock(day,date)}<section class="section"><div class="section-title"><h2>Comidas de hoy</h2><span>${plan.length} comidas</span></div><div class="card compact-tools"><strong>⚖ Equivalencias inteligentes</strong><p class="note">Al pulsar Cambiar, la app propone una cantidad equivalente y recalcula automáticamente los macros del día.</p><button class="secondary" id="reset-day-menu">↺ Restaurar menú original</button></div><div id="v7TodayMeals">${ordered.map(x=>mealCard(day,date,x.m,x.i,true)).join('')}</div></section>`;
 bindMealActions(day,date);const rb=document.getElementById('reset-day-menu');if(rb)rb.onclick=()=>resetDayMenu(day,date);const dt=document.getElementById('v7DayType');if(dt)dt.onchange=()=>{const x=load('v7DayTypes',{});x[date]=dt.value;save('v7DayTypes',x);render();};const et=document.getElementById('v7EditTargets');if(et)et.onclick=()=>v7EditTargets(day,date);const ap=document.getElementById('v82Apply');if(ap)ap.onclick=()=>window.__v82Advice&&v82ApplyAdvice(date,window.__v82Advice);const ex=document.getElementById('addExtraBtn');if(ex)ex.onclick=()=>openExtraModal(day,date);const rx=document.getElementById('rebalanceExtrasBtn');if(rx)rx.onclick=()=>openRebalanceModal(day,date);document.querySelectorAll('[data-extra-remove]').forEach(b=>b.onclick=()=>{const a=dayExtras(date);a.splice(Number(b.dataset.extraRemove),1);save(`dayExtras:${date}`,a);render();setTimeout(()=>openRebalanceModal(day,date),90);});document.querySelectorAll('[data-extra-frequent]').forEach(b=>b.onclick=()=>openExtraModal(day,date,b.dataset.extraFrequent));
}
function renderMeals(){
 const days=['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
 const day=state.selectedDay,date=nextDate(day),plan=planForDay(day),tot=dayTotals(day,date);
 document.getElementById('content').innerHTML=`<section class="section"><div class="day-tabs">${days.map(d=>`<button class="${d===day?'primary':'secondary'}" data-day="${d}">${d}</button>`).join('')}</div></section><section class="section"><div class="section-title"><h2>${day.toUpperCase()}</h2><span>${date}</span></div><div class="card"><strong>≈ ${Math.round(tot.kcal)} kcal planificadas</strong><p class="note">P ${Math.round(tot.p)} g · HC ${Math.round(tot.c)} g · G ${Math.round(tot.f)} g</p><button class="secondary" id="reset-day-menu">↺ Restaurar menú original</button></div></section>${macroBlock(day,date)}<section class="section">${plan.map((m,i)=>mealCard(day,date,m,i,true)).join('')}</section>`;
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
 document.getElementById('content').innerHTML=`<section class="section"><div class="card"><div class="section-title"><h2>Backup</h2><span>V9.9</span></div><p class="note">Importa un JSON de la antigua JC Training o exporta los datos actuales.</p><div class="backup-actions"><button id="importBtn" class="primary">Importar backup</button><input id="importFile" type="file" accept=".json,application/json" hidden><button id="exportBtn" class="secondary">Exportar backup</button></div><p id="backupStatus" class="note"></p></div></section>`;
 importBtn.onclick=()=>importFile.click();
 importFile.onchange=()=>importBackup(importFile.files?.[0]);
 exportBtn.onclick=exportBackup;
}
function exportBackup(){
 const storage={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);storage[k]=localStorage.getItem(k)}
 const blob=new Blob([JSON.stringify({app:'JC Nutrition CLEAN',version:'9.9.0',exportedAt:new Date().toISOString(),storage},null,2)],{type:'application/json'});
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
migratePlan19V98();
render();
