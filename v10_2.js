// JC Training V10.2: multiple body measurements per day with editable time.

(function(){
  function metricSortValue(m){
    const date = m?.date || '0000-00-00';
    const time = /^\d{2}:\d{2}$/.test(m?.time || '') ? m.time : '00:00';
    return `${date}T${time}`;
  }

  function sortedMetrics(){
    return load(metricsKey(),[]).slice().sort((a,b)=>metricSortValue(a).localeCompare(metricSortValue(b)));
  }

  function nowTime(){
    const d=new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // Override chart helper so every intraday record is retained and ordered by date + time.
  genericChart=function(metrics,field,label){
    const pts=metrics.slice().sort((a,b)=>metricSortValue(a).localeCompare(metricSortValue(b))).filter(m=>numVal(m[field])!==null).slice(-24);
    if(pts.length<2) return `<div class="card"><p class="note">Añade al menos dos registros de ${label.toLowerCase()} para ver la evolución.</p></div>`;
    const vals=pts.map(p=>numVal(p[field])), min=Math.min(...vals),max=Math.max(...vals),w=600,h=170,pad=22,range=(max-min)||1;
    const coords=vals.map((v,i)=>[pad+i*(w-2*pad)/(vals.length-1),h-pad-(v-min)*(h-2*pad)/range]);
    const first=pts[0], last=pts.at(-1);
    const firstLabel=`${first.date}${first.time?` ${first.time}`:''}`;
    const lastLabel=`${last.date}${last.time?` ${last.time}`:''}`;
    return `<div class="chart"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline fill="none" stroke="#38bdf8" stroke-width="4" points="${coords.map(c=>c.join(',')).join(' ')}"/>${coords.map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="4" fill="#22c55e"/>`).join('')}</svg></div><div class="chart-legend">${firstLabel}: ${vals[0].toFixed(1)} · ${lastLabel}: ${vals.at(-1).toFixed(1)} · Cambio ${(vals.at(-1)-vals[0]).toFixed(1)}</div>`;
  };

  bodyDelta=function(metrics, field, unit=''){
    const pts=metrics.slice().sort((a,b)=>metricSortValue(a).localeCompare(metricSortValue(b))).filter(m=>numVal(m[field])!==null);
    if(!pts.length) return '—';
    const first=numVal(pts[0][field]), last=numVal(pts.at(-1)[field]);
    const d=last-first;
    return `${d>0?'+':''}${d.toFixed(1)}${unit}`;
  };

  saveBodyMetrics=function(){
    const date=el('mDate')?.value || isoDate();
    const time=el('mTime')?.value || nowTime();
    const rec={
      date,
      time,
      weight: el('mWeight')?.value || '',
      waist: el('mWaist')?.value || '',
      bodyFat: el('mBodyFat')?.value || '',
      muscleMass: el('mMuscleMass')?.value || ''
    };
    if(!['weight','waist','bodyFat','muscleMass'].some(k=>String(rec[k]).trim()!=='')){
      alert('Introduce al menos una medición antes de guardar.');
      return;
    }
    const old=load(metricsKey(),[]);
    // Same exact date + time is treated as the same measurement and is updated.
    const arr=old.filter(x=>!(x.date===rec.date && (x.time||'00:00')===(rec.time||'00:00')));
    arr.push(rec);
    arr.sort((a,b)=>metricSortValue(a).localeCompare(metricSortValue(b)));
    save(metricsKey(),arr);
    renderMeasurements();
  };

  renderMeasurements=function(){
    const metrics=sortedMetrics();
    const selected=load('bodyChartField','waist');
    const metricOptions=[['weight','Peso'],['waist','Cintura'],['bodyFat','Grasa %'],['muscleMass','Masa muscular']];
    const recent=metrics.slice().reverse().slice(0,12);
    el('content').innerHTML=`
    <section class="section"><div class="card body-main-card">
      <div class="section-title"><h2>Mediciones corporales</h2><span>fecha + hora</span></div>
      <p class="note body-note">Puedes guardar varias mediciones el mismo día. La hora se rellena automáticamente, pero puedes cambiarla antes de guardar.</p>
      <div class="measure-datetime-grid">
        <label><span class="small-label">Fecha</span><input id="mDate" class="input" type="date" value="${isoDate()}"></label>
        <label><span class="small-label">Hora</span><input id="mTime" class="input" type="time" value="${nowTime()}"></label>
      </div>
      <div class="measure-grid measure-grid-4" style="margin-top:10px">
        <label class="measure-primary"><span class="small-label">Peso (kg)</span><input id="mWeight" class="input" inputmode="decimal" placeholder="88,3"></label>
        <label class="measure-primary"><span class="small-label">Cintura (cm)</span><input id="mWaist" class="input" inputmode="decimal" placeholder="97,0"></label>
        <label><span class="small-label">Grasa corporal (%)</span><input id="mBodyFat" class="input" inputmode="decimal" placeholder="17,4"></label>
        <label><span class="small-label">Masa muscular (kg)</span><input id="mMuscleMass" class="input" inputmode="decimal" placeholder="69,3"></label>
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
    <section class="section"><div class="section-title"><h2>Registros recientes</h2><span>${recent.length}${metrics.length>recent.length?` de ${metrics.length}`:''}</span></div>
      ${recent.length?`<div class="measurement-history">${recent.map(m=>`<div class="history-item measurement-row"><div><strong>${esc(m.date)}${m.time?` · ${esc(m.time)}`:' · sin hora'}</strong><p>${m.weight?`${esc(m.weight)} kg`:''}${m.waist?`${m.weight?' · ':''}${esc(m.waist)} cm cintura`:''}${m.bodyFat?` · ${esc(m.bodyFat)}% grasa`:''}${m.muscleMass?` · ${esc(m.muscleMass)} kg músculo`:''}</p></div></div>`).join('')}</div>`:'<div class="card"><p class="note">Sin mediciones.</p></div>'}
    </section>
    <section class="section"><div class="grid-2"><button id="exportBtnBody" class="secondary-btn">Exportar copia</button><label class="secondary-btn" style="text-align:center">Importar<input id="importFileBody" type="file" accept="application/json" hidden></label></div></section>`;
    el('saveBodyMetrics').onclick=saveBodyMetrics;
    el('bodyMetricSelect').onchange=e=>{save('bodyChartField',e.target.value);renderMeasurements();};
    el('exportBtnBody').onclick=exportData;
    el('importFileBody').onchange=importData;
  };

  // Add the time to the measurements shown in History without disturbing V3/V7.1 wrappers.
  const previousRenderHistoryV102=renderHistory;
  renderHistory=function(){
    previousRenderHistoryV102();
    const sections=[...document.querySelectorAll('#content .section')];
    const sec=sections.find(s=>s.querySelector('.section-title h2')?.textContent.trim()==='Mediciones recientes');
    if(!sec) return;
    const metrics=sortedMetrics().slice().reverse().slice(0,10);
    const title=sec.querySelector('.section-title');
    sec.innerHTML=`${title?title.outerHTML:'<div class="section-title"><h2>Mediciones recientes</h2><span></span></div>'}${metrics.map(m=>`<div class="history-item"><strong>${esc(m.date)}${m.time?` · ${esc(m.time)}`:' · sin hora'}</strong><p>${m.weight?esc(m.weight)+' kg':''}${m.waist?' · '+esc(m.waist)+' cm cintura':''}</p></div>`).join('') || '<div class="card"><p class="note">Sin mediciones.</p></div>'}`;
  };

  // If Measurements is open when this update loads, redraw immediately.
  const active=document.querySelector('.nav-btn.active');
  if(active?.dataset.view==='measurements') renderMeasurements();
})();
