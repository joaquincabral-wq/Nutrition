// JC Training V10.6 — interfaz compacta de comidas.
(function(){
'use strict';
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)], KEY='v106MealAccordion';
function getState(){return load(KEY,{})||{}} function putState(x){save(KEY,x)}
function compactToday(){
 const content=q('#content');if(!content)return;
 const sec=qa('.section',content).find(s=>q('.section-title h2',s)?.textContent?.trim().toLowerCase()==='comidas');if(!sec)return;
 const cards=qa(':scope > .card',sec).filter(c=>q('.meal-title',c));
 cards.forEach(card=>{const done=q('.check-btn',card)?.classList.contains('done');card.classList.toggle('v106-meal-done',!!done);if(done&&!q('.v106-meal-toggle',card)){const b=document.createElement('button');b.className='secondary-btn v106-meal-toggle';b.textContent='Ver';b.onclick=e=>{e.preventDefault();e.stopPropagation();card.classList.toggle('v106-meal-open');b.textContent=card.classList.contains('v106-meal-open')?'Ocultar':'Ver'};q('.meal-title',card)?.appendChild(b)}});
 const mid=q('.v105-mid',content);if(mid&&cards[0])cards[0].insertAdjacentElement('afterend',mid);
 const sub=q('.section-title span',sec);if(sub)sub.textContent='media mañana opcional';
}
function accordionMeals(){
 const content=q('#content');if(!content)return;qa('.v105-mid',content).forEach(x=>x.remove());const days=qa('.v7-day-section',content);if(!days.length)return;
 let st=getState();if(!Object.keys(st).length){days.forEach(s=>{const d=q('h2',s)?.textContent?.trim().toLowerCase();if(d)st[d]=d===dayKey()});putState(st)}
 const apply=(section,open)=>{section.classList.toggle('v106-day-collapsed',!open);const b=q('.v106-day-toggle',section);if(b){b.textContent=open?'Contraer':'Ampliar';b.setAttribute('aria-expanded',String(open))}};
 days.forEach(section=>{const head=q('.section-title',section),h=q('h2',head);if(!head||!h)return;const day=h.textContent.trim().toLowerCase();section.dataset.v106Day=day;let b=q('.v106-day-toggle',head);if(!b){b=document.createElement('button');b.className='secondary-btn v106-day-toggle';b.type='button';head.appendChild(b)}apply(section,st[day]!==false);const toggle=()=>{const x=getState(),open=section.classList.contains('v106-day-collapsed');x[day]=open;putState(x);apply(section,open)};b.onclick=e=>{e.preventDefault();e.stopPropagation();toggle()};head.classList.add('v106-clickable');head.onclick=e=>{if(!e.target.closest('button'))toggle()}});
 const controls=document.createElement('section');controls.id='v106MealControls';controls.className='section v106-controls';controls.innerHTML='<div class="v106-control-row"><button class="secondary-btn" id="v106ExpandAll">Expandir todos</button><button class="secondary-btn" id="v106CollapseAll">Contraer todos</button></div>';days[0].parentNode.insertBefore(controls,days[0]);
 const all=open=>{const x=getState();days.forEach(s=>{x[s.dataset.v106Day]=open;apply(s,open)});putState(x)};q('#v106ExpandAll').onclick=()=>all(true);q('#v106CollapseAll').onclick=()=>all(false);
}
const oldToday=window.renderToday;window.renderToday=function(){oldToday();compactToday()};
const oldMeals=window.renderMeals;window.renderMeals=function(){oldMeals();accordionMeals()};
window.JC_TRAINING_VERSION='10.6';render();
})();
