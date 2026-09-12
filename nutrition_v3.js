
// JC Nutrition V3 — nutrition-only shell, loaded last.
(function(){
  'use strict';

  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  const baseToday = window.renderToday;
  const baseMeals = window.renderMeals;
  const baseMeasurements = window.renderMeasurements;

  function setTitle(t){
    const n = document.getElementById('pageTitle');
    if(n) n.textContent = t;
  }

  function cleanToday(){
    const content = document.getElementById('content');
    if(!content) return;

    // Remove every known workout/session surface, not just the "Entrenamiento" section.
    const killSelectors = [
      '.v103-session-section','.v103-sticky','.v104-sticky','.v11-session-end',
      '.v104-extras-section','.v103-extras-section','.workout-card',
      '[data-workout-section]','.training-summary'
    ];
    killSelectors.forEach(sel => $$(sel,content).forEach(n=>n.remove()));

    // Remove sections whose title or content identifies them as training.
    $$(':scope > .section',content).forEach(section=>{
      const h = $('.section-title h2',section)?.textContent?.trim().toLowerCase() || '';
      const txt = (section.textContent || '').toLowerCase();
      if(
        h === 'entrenamiento' ||
        h === 'sesión de hoy' ||
        /cronómetro general|iniciar entrenamiento|añadir ejercicio|¿con qué termino\?/.test(txt)
      ){
        section.remove();
      }
    });

    // Remove old training hero if present.
    $$(':scope > .section',content).forEach(section=>{
      if(section.querySelector('.card.hero') && /push|pull|legs|upper|lower|rir|series/i.test(section.textContent||'')){
        section.remove();
      }
    });

    // Add one clean Nutrition hero if absent.
    if(!content.querySelector('.jn3-hero')){
      const date = new Date().toLocaleDateString('es-ES',{
        weekday:'long',day:'numeric',month:'long'
      });
      const hero = document.createElement('section');
      hero.className = 'section jn3-hero';
      hero.innerHTML = `
        <div class="card hero">
          <div class="eyebrow">${date.toUpperCase()}</div>
          <h2>Plan de alimentación</h2>
          <p>Comidas, macros y progreso corporal.</p>
        </div>`;
      content.insertAdjacentElement('afterbegin',hero);
    }
  }

  window.renderToday = function(){
    baseToday();
    cleanToday();
  };

  // Body-only progress. No exercise/carga data.
  window.renderProgress = function(){
    const metrics = load(metricsKey(),[]);
    const valid = metrics.filter(m =>
      m && (m.weight || m.waist || m.bodyFat || m.muscleMass)
    );
    const latest = valid.at(-1) || {};
    const first = valid[0] || {};

    function delta(field,suffix){
      const a=parseFloat(String(first[field]??'').replace(',','.'));
      const b=parseFloat(String(latest[field]??'').replace(',','.'));
      if(!Number.isFinite(a)||!Number.isFinite(b)) return '—';
      const d=b-a;
      return `${d>0?'+':''}${d.toFixed(1)}${suffix}`;
    }

    const content=document.getElementById('content');
    content.innerHTML = `
      <section class="section">
        <div class="card">
          <div class="section-title"><h2>Progreso corporal</h2><span>${valid.length} registros</span></div>
          <div class="metric-summary">
            <div><b>${latest.weight||'—'}</b><span>kg último peso</span></div>
            <div><b>${latest.waist||'—'}</b><span>cm cintura</span></div>
            <div><b>${latest.bodyFat||'—'}</b><span>% grasa</span></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-title"><h2>Desde el inicio</h2><span>tendencia</span></div>
        <div class="body-kpis">
          <div class="kpi-primary"><b>${delta('weight',' kg')}</b><span>Peso</span></div>
          <div class="kpi-primary"><b>${delta('waist',' cm')}</b><span>Cintura</span></div>
          <div><b>${delta('bodyFat',' pp')}</b><span>Grasa</span></div>
          <div><b>${delta('muscleMass',' kg')}</b><span>Músculo</span></div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="section-title"><h2>Registros recientes</h2><span>${Math.min(valid.length,10)}</span></div>
          ${valid.length ? valid.slice().reverse().slice(0,10).map(m=>`
            <div class="history-item">
              <strong>${m.date||''}${m.time?` · ${m.time}`:''}</strong>
              <p>
                ${m.weight?`${m.weight} kg`:''}
                ${m.waist?` · ${m.waist} cm cintura`:''}
                ${m.bodyFat?` · ${m.bodyFat}% grasa`:''}
                ${m.muscleMass?` · ${m.muscleMass} kg músculo`:''}
              </p>
            </div>`).join('') :
            '<p class="note">Todavía no hay mediciones registradas.</p>'
          }
        </div>
      </section>`;
  };

  // Backup uses the app's own mature export/import functions.
  window.renderBackupNutrition = function(){
    const content=document.getElementById('content');
    content.innerHTML = `
      <section class="section">
        <div class="card">
          <div class="section-title"><h2>Backup</h2><span>JC Nutrition V3</span></div>
          <p class="note">Importa tu copia de JC Training o exporta una copia actual.</p>
          <div class="jn3-backup-actions">
            <label class="primary-btn jn3-file-btn">
              Importar backup
              <input id="jn3Import" type="file" accept=".json,application/json" hidden>
            </label>
            <button id="jn3Export" class="secondary-btn" type="button">Exportar backup</button>
          </div>
          <p id="jn3Status" class="note">El importador usa el mismo formato de backup de la app original.</p>
        </div>
      </section>`;

    const input=document.getElementById('jn3Import');
    const exp=document.getElementById('jn3Export');
    input.onchange = e => {
      const file=e.target.files?.[0];
      if(!file) return;
      // Use original importData so old JC Training backups remain compatible.
      const dt=new DataTransfer();
      dt.items.add(file);
      const fake={target:{files:dt.files}};
      Promise.resolve(importData(fake)).catch(err=>{
        console.error(err);
        alert('No se pudo importar el backup.');
      });
    };
    exp.onclick = () => exportData();
  };

  // Replace nav nodes so all old click listeners disappear.
  const nav=document.querySelector('.bottom-nav');
  if(nav){
    nav.innerHTML = `
      <button data-view="today" class="nav-btn">Hoy</button>
      <button data-view="meals" class="nav-btn">Comidas</button>
      <button data-view="measurements" class="nav-btn">Medidas</button>
      <button data-view="progress" class="nav-btn">Progreso</button>
      <button data-view="backup" class="nav-btn">Backup</button>`;
  }

  window.render = function(){
    const allowed=['today','meals','measurements','progress','backup'];
    if(!allowed.includes(state.view)) state.view='today';

    $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view));

    if(state.view==='today'){
      setTitle('Hoy');
      window.renderToday();
    }else if(state.view==='meals'){
      setTitle('Comidas');
      baseMeals();
    }else if(state.view==='measurements'){
      setTitle('Medidas');
      baseMeasurements();
    }else if(state.view==='progress'){
      setTitle('Progreso');
      window.renderProgress();
    }else if(state.view==='backup'){
      setTitle('Backup');
      window.renderBackupNutrition();
    }
  };

  $$('.nav-btn').forEach(btn=>{
    btn.onclick=()=>{
      state.view=btn.dataset.view;
      window.render();
    };
  });

  // Remove workout timer DOM permanently.
  document.getElementById('timerOverlay')?.remove();
  document.getElementById('timerMini')?.remove();

  document.title='JC Nutrition';
  window.JC_NUTRITION_VERSION='3.0';
  state.view='today';
  window.render();
})();
