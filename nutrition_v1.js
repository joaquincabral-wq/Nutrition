
// JC Nutrition V1 — nutrition/body-progress only, based on stable JC Training V11.
(function(){
  'use strict';

  const oldRenderToday = window.renderToday;
  const oldRenderHistory = window.renderHistory;

  function localDateLabel(){
    return new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});
  }

  function cleanToday(){
    const content = document.getElementById('content');
    if(!content) return;

    // Remove training hero and training section only.
    [...content.querySelectorAll(':scope > .section')].forEach(section => {
      const title = section.querySelector('.section-title h2')?.textContent?.trim().toLowerCase() || '';
      if(title === 'entrenamiento') section.remove();
      if(section.querySelector('.card.hero')) section.remove();
    });

    // Add a nutrition-first hero.
    if(!content.querySelector('.jn-hero')){
      const hero = document.createElement('section');
      hero.className = 'section jn-hero';
      hero.innerHTML = `
        <div class="card hero">
          <div class="eyebrow">${localDateLabel().toUpperCase()}</div>
          <h2>Plan de alimentación</h2>
          <p>Comidas, equivalencias, macros y progreso corporal.</p>
        </div>`;
      content.insertAdjacentElement('afterbegin', hero);
    }

    // Any training-only floating widgets from older versions stay hidden via CSS.
  }

  window.renderToday = function(){
    oldRenderToday();
    cleanToday();
  };

  // Re-purpose History as Backup/Ajustes and hide workout history.
  window.renderHistory = function(){
    oldRenderHistory();
    const content = document.getElementById('content');
    if(!content) return;

    [...content.querySelectorAll(':scope > .section')].forEach(section => {
      if(!section.querySelector('#backupPanelV71') && !section.classList.contains('jn-settings')){
        const txt = section.textContent || '';
        if(/Entrenamientos|Mediciones recientes/i.test(txt)) section.remove();
      }
    });

    if(!content.querySelector('.jn-settings')){
      const info = document.createElement('section');
      info.className='section jn-settings';
      info.innerHTML=`<div class="card"><div class="section-title"><h2>Ajustes</h2><span>JC Nutrition V1</span></div>
        <p class="note">El entrenamiento se gestiona en Garmin. JC Nutrition conserva únicamente alimentación, progreso corporal y copias de seguridad.</p></div>`;
      content.insertAdjacentElement('afterbegin',info);
    }
  };

  // Rename pages/navigation without altering underlying stable functions.
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    if(btn.dataset.view==='training') btn.remove();
    if(btn.dataset.view==='history') btn.textContent='Backup';
  });

  // Remove any orphan training timer UI from DOM.
  ['timerOverlay','timerMini'].forEach(id=>document.getElementById(id)?.remove());

  // Product naming.
  document.title='JC Nutrition';
  document.querySelectorAll('.eyebrow').forEach(e=>{
    if((e.textContent||'').trim()==='JC TRAINING') e.textContent='JC NUTRITION';
  });

  window.JC_NUTRITION_VERSION='1.0';

  // Re-render current view after overlay installation.
  try { render(); } catch(e) { console.error(e); }
})();
