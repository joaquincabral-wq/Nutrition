// JC Training V4.1: mediciones simplificadas + ilustraciones específicas por ejercicio.

function saveBodyMetrics(){
  const old = load(metricsKey(),[]);
  const existing = old.find(x=>x.date===isoDate()) || {};
  const rec = {
    ...existing,
    date: isoDate(),
    weight: el('mWeight')?.value || '',
    waist: el('mWaist')?.value || '',
    bodyFat: el('mBodyFat')?.value || '',
    muscleMass: el('mMuscleMass')?.value || ''
  };
  const arr = old.filter(x=>x.date!==rec.date);
  arr.push(rec); arr.sort((a,b)=>a.date.localeCompare(b.date));
  save(metricsKey(),arr); renderMeasurements();
}

function bodyDelta(metrics, field, unit=''){
  const pts=metrics.filter(m=>numVal(m[field])!==null);
  if(!pts.length) return '—';
  const first=numVal(pts[0][field]), last=numVal(pts.at(-1)[field]);
  const d=last-first;
  return `${d>0?'+':''}${d.toFixed(1)}${unit}`;
}

renderMeasurements=function(){
  const metrics=load(metricsKey(),[]), today=metrics.find(m=>m.date===isoDate())||{};
  const selected=load('bodyChartField','waist');
  const metricOptions=[['weight','Peso'],['waist','Cintura'],['bodyFat','Grasa %'],['muscleMass','Masa muscular']];
  const latest=metrics.filter(m=>['weight','waist','bodyFat','muscleMass'].some(k=>numVal(m[k])!==null)).at(-1)||{};
  el('content').innerHTML=`
  <section class="section"><div class="card body-main-card">
    <div class="section-title"><h2>Mediciones corporales</h2><span>${isoDate()}</span></div>
    <p class="note body-note">Peso y cintura son los indicadores principales. Grasa y masa muscular se usan como tendencia orientativa de la báscula.</p>
    <div class="measure-grid measure-grid-4">
      <label class="measure-primary"><span class="small-label">Peso (kg)</span><input id="mWeight" class="input" inputmode="decimal" value="${today.weight||''}" placeholder="88,3"></label>
      <label class="measure-primary"><span class="small-label">Cintura (cm)</span><input id="mWaist" class="input" inputmode="decimal" value="${today.waist||''}" placeholder="97,0"></label>
      <label><span class="small-label">Grasa corporal (%)</span><input id="mBodyFat" class="input" inputmode="decimal" value="${today.bodyFat||''}" placeholder="17,4"></label>
      <label><span class="small-label">Masa muscular (kg)</span><input id="mMuscleMass" class="input" inputmode="decimal" value="${today.muscleMass||''}" placeholder="69,3"></label>
    </div>
    <button id="saveBodyMetrics" class="primary-btn" style="width:100%;margin-top:12px">Guardar mediciones</button>
  </div></section>
  <section class="section"><div class="section-title"><h2>Desde el inicio</h2><span>${metrics.length} registros</span></div>
    <div class="body-kpis">
      <div class="kpi-primary"><b>${bodyDelta(metrics,'weight',' kg')}</b><span>Peso</span></div>
      <div class="kpi-primary"><b>${bodyDelta(metrics,'waist',' cm')}</b><span>Cintura</span></div>
      <div><b>${bodyDelta(metrics,'bodyFat',' pp')}</b><span>Grasa</span></div>
      <div><b>${bodyDelta(metrics,'muscleMass',' kg')}</b><span>Músculo</span></div>
    </div>
  </section>
  <section class="section"><div class="section-title"><h2>Evolución corporal</h2><select id="bodyMetricSelect" class="input" style="width:auto">${metricOptions.map(([k,l])=>`<option value="${k}" ${k===selected?'selected':''}>${l}</option>`).join('')}</select></div><div id="bodyChart">${genericChart(metrics,selected,metricOptions.find(x=>x[0]===selected)?.[1]||selected)}</div></section>
  <section class="section"><div class="grid-2"><button id="exportBtnBody" class="secondary-btn">Exportar copia</button><label class="secondary-btn" style="text-align:center">Importar<input id="importFileBody" type="file" accept="application/json" hidden></label></div></section>`;
  el('saveBodyMetrics').onclick=saveBodyMetrics;
  el('bodyMetricSelect').onchange=e=>{save('bodyChartField',e.target.value);renderMeasurements();};
  el('exportBtnBody').onclick=exportData; el('importFileBody').onchange=importData;
};

// ---------- ILUSTRACIONES ESPECÍFICAS DE EJERCICIOS ----------
function exKind(name){
  const n=nrm(name);
  if(n.includes('press inclinado')) return 'inclinePress';
  if(n.includes('press plano')) return 'flatPress';
  if(n.includes('press convergente')) return 'machinePress';
  if(n.includes('press militar')) return 'overheadPress';
  if(n.includes('elevacion lateral')||n.includes('elevación lateral')) return 'lateralRaise';
  if(n.includes('triceps') && n.includes('overhead')) return 'overheadTri';
  if(n.includes('triceps')||n.includes('tríceps')) return 'pushdown';
  if(n.includes('jalon unilateral')||n.includes('jalón unilateral')) return 'oneArmPulldown';
  if(n.includes('jalon')||n.includes('jalón')) return 'pulldown';
  if(n.includes('remo')) return 'row';
  if(n.includes('reverse pec')) return 'reverseFly';
  if(n.includes('curl inclinado')) return 'inclineCurl';
  if(n.includes('curl predicador')) return 'preacherCurl';
  if(n.includes('curl martillo')) return 'hammerCurl';
  if(n.includes('hack squat')) return 'hack';
  if(n.includes('prensa')) return 'legPress';
  if(n.includes('femoral')) return 'legCurl';
  if(n.includes('hip thrust')) return 'hipThrust';
  if(n.includes('bulgara')||n.includes('búlgara')) return 'splitSquat';
  if(n.includes('extension cuadriceps')||n.includes('extensión cuádriceps')) return 'legExtension';
  if(n.includes('abductores')) return 'abductor';
  if(n.includes('gemelo sentado')) return 'seatedCalf';
  if(n.includes('gemelo')) return 'calf';
  if(n.includes('crunch')) return 'crunch';
  if(n.includes('rueda')) return 'abWheel';
  if(n.includes('aperturas')) return 'cableFly';
  if(n.includes('cardio')) return 'cardio';
  return 'generic';
}
function svgPerson(x=70,y=30,pose='stand'){
  if(pose==='bench') return `<circle cx="${x}" cy="${y}" r="8"/><path d="M${x+6} ${y+6} L${x+38} ${y+22} L${x+70} ${y+36} M${x+38} ${y+22} L${x+28} ${y+47} M${x+70} ${y+36} L${x+88} ${y+52}"/>`;
  if(pose==='seated') return `<circle cx="${x}" cy="${y}" r="8"/><path d="M${x} ${y+8} L${x} ${y+40} L${x+25} ${y+55} M${x} ${y+23} L${x+22} ${y+18} M${x+25} ${y+55} L${x+44} ${y+55}"/>`;
  if(pose==='kneel') return `<circle cx="${x}" cy="${y}" r="8"/><path d="M${x} ${y+8} L${x} ${y+40} M${x} ${y+22} L${x+24} ${y+10} M${x} ${y+40} L${x-12} ${y+58} L${x+5} ${y+62}"/>`;
  return `<circle cx="${x}" cy="${y}" r="8"/><path d="M${x} ${y+8} L${x} ${y+42} M${x} ${y+20} L${x-20} ${y+34} M${x} ${y+20} L${x+20} ${y+34} M${x} ${y+42} L${x-16} ${y+68} M${x} ${y+42} L${x+16} ${y+68}"/>`;
}
function specificExerciseSvg(name,muscles){
  const k=exKind(name); let scene='';
  const arrow=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} L${x2} ${y2}" class="ex-arrow" marker-end="url(#ah)"/>`;
  switch(k){
    case 'inclinePress': scene=`<path d="M35 88 L115 55" class="equip"/>${svgPerson(55,45,'bench')}<path d="M82 55 L82 25 M102 65 L110 35" class="limb-accent"/>${arrow(82,50,82,28)}`;break;
    case 'flatPress': scene=`<path d="M30 82 H125" class="equip"/>${svgPerson(50,44,'bench')}<path d="M78 55 L78 28 M98 64 L100 37" class="limb-accent"/>${arrow(88,55,88,30)}`;break;
    case 'machinePress': scene=`${svgPerson(58,35,'seated')}<path d="M92 54 H135 M135 40 V72" class="equip"/>${arrow(94,54,130,54)}`;break;
    case 'overheadPress': scene=`${svgPerson(70,35,'seated')}<path d="M52 48 L52 18 M88 48 L88 18" class="limb-accent"/>${arrow(70,45,70,16)}`;break;
    case 'lateralRaise': scene=`${svgPerson(70,30,'stand')}<path d="M70 50 L35 34 M70 50 L105 34" class="limb-accent"/>${arrow(45,55,34,35)}${arrow(95,55,106,35)}`;break;
    case 'pushdown': scene=`${svgPerson(70,28,'stand')}<path d="M102 14 V42 M102 42 L82 58" class="equip"/>${arrow(84,45,84,72)}`;break;
    case 'overheadTri': scene=`${svgPerson(70,30,'stand')}<path d="M70 48 L84 20 L98 40" class="limb-accent"/>${arrow(90,44,100,24)}`;break;
    case 'pulldown': scene=`${svgPerson(70,35,'seated')}<path d="M35 18 H108 M70 20 V50" class="equip"/>${arrow(70,22,70,54)}`;break;
    case 'oneArmPulldown': scene=`${svgPerson(65,35,'kneel')}<path d="M110 14 V34 L88 48" class="equip"/>${arrow(91,34,78,58)}`;break;
    case 'row': scene=`${svgPerson(65,35,'seated')}<path d="M105 48 H140" class="equip"/>${arrow(135,48,92,48)}`;break;
    case 'reverseFly': scene=`${svgPerson(70,35,'seated')}<path d="M70 54 L35 40 M70 54 L105 40" class="limb-accent"/>${arrow(60,52,34,40)}${arrow(80,52,106,40)}`;break;
    case 'inclineCurl': scene=`<path d="M40 88 L95 55" class="equip"/>${svgPerson(58,43,'bench')}<path d="M80 60 L70 78" class="limb-accent"/>${arrow(72,78,82,57)}`;break;
    case 'preacherCurl': scene=`${svgPerson(58,35,'seated')}<path d="M72 58 L100 48 L112 70" class="equip"/>${arrow(88,68,88,49)}`;break;
    case 'hammerCurl': scene=`${svgPerson(70,30,'stand')}<path d="M50 52 L50 72 M90 52 L90 72" class="limb-accent"/>${arrow(50,72,50,48)}${arrow(90,72,90,48)}`;break;
    case 'hack': scene=`<path d="M42 92 L105 26" class="equip"/>${svgPerson(70,36,'stand')}<path d="M70 72 L55 82 M70 72 L86 82" class="limb-accent"/>${arrow(108,76,90,52)}`;break;
    case 'legPress': scene=`<path d="M35 92 L90 60 M105 22 L138 60" class="equip"/>${svgPerson(55,48,'bench')}<path d="M82 72 L112 52" class="limb-accent"/>${arrow(95,63,120,45)}`;break;
    case 'legCurl': scene=`${svgPerson(58,35,'seated')}<path d="M80 72 H115" class="equip"/>${arrow(105,72,93,55)}`;break;
    case 'hipThrust': scene=`<path d="M28 72 H70 M95 88 H130" class="equip"/><circle cx="58" cy="54" r="8"/><path d="M65 60 L90 70 L112 70 M90 70 L85 90 M112 70 L120 90"/>${arrow(88,82,88,60)}`;break;
    case 'splitSquat': scene=`${svgPerson(70,28,'stand')}<path d="M70 70 L45 90 M70 70 L98 82" class="limb-accent"/><path d="M96 82 H125" class="equip"/>${arrow(70,48,70,66)}`;break;
    case 'legExtension': scene=`${svgPerson(58,35,'seated')}<path d="M80 72 H118" class="limb-accent"/>${arrow(95,73,118,60)}`;break;
    case 'abductor': scene=`${svgPerson(65,35,'seated')}<path d="M65 72 L42 82 M65 72 L88 82" class="limb-accent"/>${arrow(56,74,40,84)}${arrow(74,74,90,84)}`;break;
    case 'seatedCalf': scene=`${svgPerson(58,35,'seated')}<path d="M78 74 L108 74" class="limb-accent"/>${arrow(108,76,108,64)}`;break;
    case 'calf': scene=`${svgPerson(70,30,'stand')}<path d="M55 98 H90" class="equip"/>${arrow(70,95,70,78)}`;break;
    case 'crunch': scene=`${svgPerson(65,35,'kneel')}<path d="M105 12 V34 L78 42" class="equip"/>${arrow(70,36,62,64)}`;break;
    case 'abWheel': scene=`<circle cx="105" cy="78" r="11" class="equip-fill"/><circle cx="55" cy="50" r="8"/><path d="M62 56 L82 66 L102 76 M82 66 L65 88"/>${arrow(78,64,105,76)}`;break;
    case 'cableFly': scene=`${svgPerson(70,30,'stand')}<path d="M25 20 V80 M115 20 V80" class="equip"/><path d="M70 50 L40 42 M70 50 L100 42" class="limb-accent"/>${arrow(42,42,62,50)}${arrow(98,42,78,50)}`;break;
    case 'cardio': scene=`${svgPerson(70,30,'stand')}<path d="M48 92 H98" class="equip"/>${arrow(45,98,100,98)}`;break;
    default: scene=`${svgPerson(70,30,'stand')}${arrow(105,54,135,54)}`;
  }
  return `<div class="exercise-visual exercise-image" aria-label="Ilustración de ${name}"><svg viewBox="0 0 360 126" role="img"><defs><marker id="ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" class="arrow-head"/></marker></defs><rect x="1" y="1" width="358" height="124" rx="18" class="visual-bg"/><g class="figure">${scene}</g><text x="160" y="38" class="visual-title">${name}</text><text x="160" y="62" class="visual-sub">${muscles||'Técnica y control'}</text><text x="160" y="88" class="visual-note">Ilustración técnica · flecha = dirección principal</text></svg></div>`;
}
exerciseVisual=function(name,muscles){ return specificExerciseSvg(name,muscles); };

render();
