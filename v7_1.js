// JC Training V7.1 — copia de seguridad completa del almacenamiento local.
(function(){
  const previousRenderHistory = window.renderHistory;

  function collectBackup(){
    const storage = {};
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      storage[key]=localStorage.getItem(key);
    }
    return {
      app:'JC Training',
      version:'7.1',
      exportedAt:new Date().toISOString(),
      origin:location.origin,
      storage
    };
  }

  function exportBackup(){
    const data=collectBackup();
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    const stamp=new Date().toISOString().slice(0,10);
    a.href=url; a.download=`JC_Training_backup_${stamp}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    const status=document.getElementById('backupStatus');
    if(status) status.textContent='Copia exportada. Guarda el archivo .json en un lugar seguro.';
  }

  async function importBackup(file){
    if(!file) return;
    try{
      const parsed=JSON.parse(await file.text());
      if(!parsed || parsed.app!=='JC Training' || !parsed.storage || typeof parsed.storage!=='object') throw new Error('Formato no válido');
      if(!confirm('Esto restaurará los datos guardados de JC Training con los de esta copia. ¿Continuar?')) return;
      Object.entries(parsed.storage).forEach(([k,v])=>localStorage.setItem(k,v));
      alert('Copia restaurada correctamente. JC Training se recargará ahora.');
      location.reload();
    }catch(err){
      alert('No se ha podido importar la copia. Comprueba que sea un backup JSON de JC Training.');
    }
  }

  function addBackupPanel(){
    const content=document.getElementById('content');
    if(!content || document.getElementById('backupPanelV71')) return;
    const section=document.createElement('section');
    section.className='section'; section.id='backupPanelV71';
    section.innerHTML=`<div class="section-title"><h2>Copia de seguridad</h2><span>V7.1</span></div>
      <div class="card backup-card"><p>Exporta todos los datos locales de JC Training antes de cambiar de alojamiento, navegador o dispositivo.</p>
      <div class="backup-actions"><button id="exportBackupV71" class="primary-btn">Exportar backup</button><label class="secondary-btn backup-import">Importar backup<input id="importBackupV71" type="file" accept="application/json" hidden></label></div>
      <p id="backupStatus" class="note">El archivo se descarga en formato JSON. No contiene la aplicación; contiene tus datos guardados.</p></div>`;
    content.appendChild(section);
    document.getElementById('exportBackupV71').onclick=exportBackup;
    document.getElementById('importBackupV71').onchange=e=>importBackup(e.target.files?.[0]);
  }

  if(typeof previousRenderHistory==='function'){
    window.renderHistory=function(){ previousRenderHistory(); addBackupPanel(); };
  }
  // Si Historial ya estaba abierto al cargar la actualización, añádelo también.
  setTimeout(()=>{
    const active=document.querySelector('.nav-btn.active');
    if(active?.dataset.view==='history') addBackupPanel();
  },100);
})();
