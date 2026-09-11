// JC Training V4.2: secuencias técnicas más claras por ejercicio.
// Cargado después de V4.1; solo sustituye la ilustración de la ficha técnica.

function seqBody(cx, cy, pose='stand', phase=0){
  const s=[];
  if(pose==='bench'){
    s.push(`<circle cx="${cx}" cy="${cy}" r="6"/>`);
    s.push(`<path d="M${cx+5} ${cy+5} L${cx+29} ${cy+17} L${cx+51} ${cy+29}"/>`);
    s.push(`<path d="M${cx+29} ${cy+17} L${cx+18} ${cy+37} M${cx+51} ${cy+29} L${cx+68} ${cy+42}"/>`);
  } else if(pose==='seated'){
    s.push(`<circle cx="${cx}" cy="${cy}" r="6"/>`);
    s.push(`<path d="M${cx} ${cy+6} L${cx} ${cy+31} L${cx+19} ${cy+43} M${cx+19} ${cy+43} L${cx+35} ${cy+43}"/>`);
  } else if(pose==='kneel'){
    s.push(`<circle cx="${cx}" cy="${cy}" r="6"/>`);
    s.push(`<path d="M${cx} ${cy+6} L${cx} ${cy+31} M${cx} ${cy+31} L${cx-10} ${cy+45} L${cx+4} ${cy+48}"/>`);
  } else if(pose==='split'){
    s.push(`<circle cx="${cx}" cy="${cy}" r="6"/>`);
    s.push(`<path d="M${cx} ${cy+6} L${cx} ${cy+30} M${cx} ${cy+30} L${cx-16} ${cy+50} M${cx} ${cy+30} L${cx+24} ${cy+42}"/>`);
  } else {
    s.push(`<circle cx="${cx}" cy="${cy}" r="6"/>`);
    s.push(`<path d="M${cx} ${cy+6} L${cx} ${cy+30} M${cx} ${cy+30} L${cx-12} ${cy+51} M${cx} ${cy+30} L${cx+12} ${cy+51}"/>`);
  }
  return s.join('');
}
function line(x1,y1,x2,y2,cls='seq-limb'){ return `<path d="M${x1} ${y1} L${x2} ${y2}" class="${cls}"/>`; }
function equip(d){ return `<path d="${d}" class="seq-equip"/>`; }
function arrow(x1,y1,x2,y2){ return `<path d="M${x1} ${y1} L${x2} ${y2}" class="seq-arrow" marker-end="url(#seqArrow)"/>`; }

function phaseScene(kind, phase){
  // phase: 0 inicio, 1 recorrido, 2 final. Los ejercicios simples pueden ocultar la fase 1.
  const p=phase;
  switch(kind){
    case 'inclinePress': {
      const handY=[70,52,33][p];
      return `${equip('M13 92 L70 58')}${seqBody(33,48,'bench')}${line(52,62,52,handY)}${line(67,69,69,handY+3)}${arrow(85,72,85,34)}`;
    }
    case 'flatPress': {
      const handY=[68,50,31][p];
      return `${equip('M12 86 H86')}${seqBody(30,47,'bench')}${line(52,61,52,handY)}${line(65,68,67,handY+3)}${arrow(87,69,87,33)}`;
    }
    case 'machinePress': {
      const hx=[58,72,88][p];
      return `${seqBody(30,38,'seated')}${equip('M92 47 H104 M104 32 V66')}${line(30,56,hx,50)}${arrow(58,77,92,77)}`;
    }
    case 'overheadPress': {
      const hy=[60,43,22][p];
      return `${seqBody(49,38,'seated')}${line(39,55,39,hy)}${line(59,55,59,hy)}${arrow(84,61,84,23)}`;
    }
    case 'lateralRaise': {
      const y=[65,50,38][p], dx=[12,22,34][p];
      return `${seqBody(49,32,'stand')}${line(49,49,49-dx,y)}${line(49,49,49+dx,y)}${arrow(84,65,96,39)}`;
    }
    case 'pushdown': {
      const hy=[50,63,79][p];
      return `${seqBody(39,29,'stand')}${equip('M91 12 V42 L67 50')}${line(39,49,64,hy)}${arrow(86,47,86,80)}`;
    }
    case 'overheadTri': {
      const hx=[58,68,78][p], hy=[49,34,18][p];
      return `${seqBody(42,31,'stand')}${line(42,48,55,28)}${line(55,28,hx,hy)}${arrow(86,50,96,20)}`;
    }
    case 'pulldown': {
      const barY=[22,39,54][p];
      return `${seqBody(49,38,'seated')}${equip('M18 16 H82')}${line(49,55,28,barY)}${line(49,55,70,barY)}${arrow(90,22,90,56)}`;
    }
    case 'oneArmPulldown': {
      const hx=[82,69,55][p], hy=[23,39,55][p];
      return `${seqBody(35,39,'kneel')}${equip('M88 13 V22')}${line(35,55,hx,hy)}${arrow(88,24,61,58)}`;
    }
    case 'row': {
      const hx=[88,70,51][p];
      return `${seqBody(35,39,'seated')}${equip('M92 51 H105')}${line(35,56,hx,51)}${arrow(91,77,51,77)}`;
    }
    case 'reverseFly': {
      const dx=[10,23,36][p], y=[53,45,38][p];
      return `${seqBody(49,39,'seated')}${line(49,55,49-dx,y)}${line(49,55,49+dx,y)}${arrow(65,75,95,41)}`;
    }
    case 'inclineCurl': {
      const ex=[63,60,54][p], ey=[79,65,50][p];
      return `${equip('M16 91 L67 58')}${seqBody(34,48,'bench')}${line(54,64,ex,ey)}${arrow(82,79,82,48)}`;
    }
    case 'preacherCurl': {
      const hy=[76,61,47][p];
      return `${seqBody(31,39,'seated')}${equip('M46 62 L78 49 L88 76')}${line(48,60,66,hy)}${arrow(89,76,89,47)}`;
    }
    case 'hammerCurl': {
      const hy=[77,62,48][p];
      return `${seqBody(49,31,'stand')}${line(34,51,34,hy)}${line(64,51,64,hy)}${arrow(88,78,88,48)}`;
    }
    case 'hack': {
      const drop=[0,9,18][p];
      return `${equip('M18 94 L82 27')}${seqBody(48,31+drop,'stand')}${line(48,61+drop,35,78+drop)}${line(48,61+drop,61,78+drop)}${arrow(91,78,91,47)}`;
    }
    case 'legPress': {
      const fx=[73,82,92][p], fy=[70,60,49][p];
      return `${equip('M14 94 L57 64 M86 20 L105 53')}${seqBody(30,49,'bench')}${line(50,70,fx,fy)}${arrow(72,78,99,49)}`;
    }
    case 'legCurl': {
      const fx=[83,73,63][p], fy=[72,63,52][p];
      return `${seqBody(32,39,'seated')}${equip('M57 74 H91')}${line(51,69,fx,fy)}${arrow(93,73,69,50)}`;
    }
    case 'hipThrust': {
      const hipY=[78,66,55][p];
      return `${equip('M12 70 H42 M78 92 H104')}<circle cx="36" cy="52" r="6"/><path d="M42 57 L58 ${hipY} L84 ${hipY}"/><path d="M58 ${hipY} L52 91 M84 ${hipY} L91 91"/>${arrow(62,83,62,55)}`;
    }
    case 'splitSquat': {
      const drop=[0,9,17][p];
      return `${seqBody(49,27+drop,'split')}${equip('M71 80 H99')}${arrow(88,43,88,72)}`;
    }
    case 'legExtension': {
      const ex=[70,82,94][p], ey=[75,66,54][p];
      return `${seqBody(31,39,'seated')}${line(50,70,ex,ey)}${arrow(76,76,98,53)}`;
    }
    case 'abductor': {
      const dx=[13,23,34][p];
      return `${seqBody(49,39,'seated')}${line(49,69,49-dx,82)}${line(49,69,49+dx,82)}${arrow(64,74,93,85)}`;
    }
    case 'seatedCalf': {
      const footY=[78,72,65][p];
      return `${seqBody(31,39,'seated')}${line(49,70,76,footY)}${equip('M55 58 H81')}${arrow(90,78,90,62)}`;
    }
    case 'calf': {
      const lift=[0,-5,-10][p];
      return `${seqBody(49,30+lift,'stand')}${equip('M29 91 H70')}${arrow(88,90,88,68)}`;
    }
    case 'crunch': {
      const bend=[0,7,14][p];
      return `${seqBody(43,35+bend,'kneel')}${equip('M92 12 V28 L65 42')}${arrow(84,34,67,66)}`;
    }
    case 'abWheel': {
      const headX=[42,54,68][p], wheelX=[62,79,95][p];
      return `<circle cx="${headX}" cy="48" r="6"/><path d="M${headX+6} 53 L${headX+20} 63 L${wheelX-2} 75 M${headX+20} 63 L${headX+5} 88"/><circle cx="${wheelX}" cy="78" r="8" class="seq-wheel"/>${arrow(62,94,98,94)}`;
    }
    case 'cableFly': {
      const dx=[32,20,8][p];
      return `${seqBody(49,31,'stand')}${equip('M10 17 V82 M88 17 V82')}${line(49,51,49-dx,42)}${line(49,51,49+dx,42)}${arrow(21,89,48,89)}${arrow(77,89,50,89)}`;
    }
    case 'cardio': return `${seqBody(49,31,'stand')}${equip('M25 92 H78')}${arrow(25,99,78,99)}`;
    default: return `${seqBody(49,31,'stand')}${arrow(73,54,98,54)}`;
  }
}

function phaseCount(kind){
  return ['pushdown','overheadTri','inclineCurl','preacherCurl','hammerCurl','legCurl','legExtension','abductor','seatedCalf','calf','crunch','abWheel','cableFly'].includes(kind) ? 2 : 3;
}

function sequenceExerciseVisual(name, muscles){
  const kind=exKind(name), count=phaseCount(kind);
  const phases=count===2?[0,2]:[0,1,2];
  const labels=count===2?['INICIO','FINAL']:['INICIO','RECORRIDO','FINAL'];
  const panelW=count===2?166:108;
  const gap=count===2?10:6;
  const panels=phases.map((ph,idx)=>{
    const x=8+idx*(panelW+gap);
    return `<g transform="translate(${x},50)"><rect x="0" y="0" width="${panelW}" height="112" rx="14" class="seq-panel"/><text x="${panelW/2}" y="17" text-anchor="middle" class="seq-phase-label">${labels[idx]}</text><g transform="translate(${(panelW-108)/2},15)">${phaseScene(kind,ph)}</g>${idx<phases.length-1?`<text x="${panelW+gap/2}" y="67" text-anchor="middle" class="seq-next">›</text>`:''}</g>`;
  }).join('');
  return `<div class="exercise-sequence" aria-label="Secuencia técnica de ${name}">
    <div class="seq-head"><div><strong>${name}</strong><span>${muscles||'Técnica y control'}</span></div><span class="seq-badge">${count} fases</span></div>
    <svg viewBox="0 0 360 174" role="img" aria-label="Inicio, recorrido y final de ${name}"><defs><marker id="seqArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" class="seq-arrow-head"/></marker></defs>${panels}</svg>
    <div class="seq-legend"><span><i class="legend-blue"></i>Extremidad en movimiento</span><span><i class="legend-green"></i>Dirección</span></div>
    <div class="seq-tip">Compara las posiciones y usa las claves técnicas de debajo. El dibujo es una guía de recorrido, no una referencia anatómica exacta.</div>
  </div>`;
}

exerciseVisual=function(name,muscles){ return sequenceExerciseVisual(name,muscles); };
render();
