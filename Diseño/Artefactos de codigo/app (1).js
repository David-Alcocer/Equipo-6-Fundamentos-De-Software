// ========= Datos simulados y utilidades =========
const STATE = {
  users: JSON.parse(localStorage.getItem('ph_users')||'[]'),
  tickets: JSON.parse(localStorage.getItem('ph_tickets')||'[]'),
  sessions: JSON.parse(localStorage.getItem('ph_sessions')||'[]'),
  messages: JSON.parse(localStorage.getItem('ph_messages')||'[]'),
  directMessages: JSON.parse(localStorage.getItem('ph_direct_msgs')||'[]'), // {contactId, authorEmail, text, at}
  reports: JSON.parse(localStorage.getItem('ph_reports')||'[]'),
  reportMessages: JSON.parse(localStorage.getItem('ph_report_msgs')||'[]'),
  meetings: JSON.parse(localStorage.getItem('ph_meetings')||'{}'),
  meetingMeta: JSON.parse(localStorage.getItem('ph_meeting_meta')||'{}'),
  horas: JSON.parse(localStorage.getItem('ph_horas')||'{}'),
  logs: JSON.parse(localStorage.getItem('ph_logs')||'[]'),
  current: JSON.parse(localStorage.getItem('ph_current')||'null')
};
const domainOK = (email)=>{
  email = (email||'').toLowerCase().trim();
  const student = /^a\\d{8}@alumnos\\.uady\\.mx$/i.test(email);
  const teacherVirtual = /^[a-z]+(\\.[a-z]+)+@uady\\.virtual\\.mx$/i.test(email);
  const staff = /^[a-z0-9._%+-]+@uady\\.mx$/i.test(email);
  const admin = /^admin@admin\\.uady\\.mx$/i.test(email);
  return student || teacherVirtual || staff || admin;
};
function save(){
  localStorage.setItem('ph_users', JSON.stringify(STATE.users));
  localStorage.setItem('ph_tickets', JSON.stringify(STATE.tickets));
  localStorage.setItem('ph_sessions', JSON.stringify(STATE.sessions));
  localStorage.setItem('ph_messages', JSON.stringify(STATE.messages));
  localStorage.setItem('ph_direct_msgs', JSON.stringify(STATE.directMessages));
  localStorage.setItem('ph_reports', JSON.stringify(STATE.reports));
  localStorage.setItem('ph_report_msgs', JSON.stringify(STATE.reportMessages));
  localStorage.setItem('ph_meetings', JSON.stringify(STATE.meetings));
  localStorage.setItem('ph_meeting_meta', JSON.stringify(STATE.meetingMeta));
  localStorage.setItem('ph_horas', JSON.stringify(STATE.horas));
  localStorage.setItem('ph_logs', JSON.stringify(STATE.logs));
  localStorage.setItem('ph_current', JSON.stringify(STATE.current));
}
function toast(msg){const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200)}
async function sha256(txt){const enc=new TextEncoder().encode(txt); const buf=await crypto.subtle.digest('SHA-256', enc); return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')}
function fmt(dt){const d=new Date(dt); return d.toLocaleString()}

// ========= Navegación lateral =========
const secIds=['auth','access','crea','dash_as','chat','reports','calls','calendar','admin','settings'];
const sidebar=document.getElementById('sidebar');
sidebar.addEventListener('click', (e)=>{
  const btn=e.target.closest('.sb-btn'); if(!btn){ creandoReunion=false; return; } [...sidebar.children].forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const sec=btn.getAttribute('data-sec'); showSection(sec);
});
function showSection(sec){
  secIds.forEach(id=>{const el=document.getElementById(id); if(!el) return; el.hidden=true});
  const el=document.getElementById(sec); if(el) el.hidden=false;
  if(sec==='access'){ 
    const u=currentUser();
    const acc=document.getElementById('access_account');
    const auth=document.getElementById('access_auth');
    if(u){ if(acc){ acc.hidden=false; document.getElementById('acc_name').textContent=u.name||'Mi cuenta'; document.getElementById('acc_mail').textContent=u.email; } if(auth){ auth.hidden=true; } }
    else { if(acc){ acc.hidden=true; } if(auth){ auth.hidden=false; } }
  }
  if(sec==='chat'){ renderChatList(); renderContacts(); renderChat(); }
  if(sec==='reports'){ renderReports(); }
  if(sec==='calls'){
  renderCalls();
  renderMyMeetingsPanel();
  loadTeamsApiTable();
  const _btn = document.getElementById('btn_crear_reunion');
  if(_btn){ _btn.onclick = crearReunionTeams; }
}
  if(sec==='calendar'){ initCalendarOnce(); renderCalendar(); }
  if(sec==='admin'){ renderAdmin(); }
  if(sec==='auth'){
  renderTicketsStudent();
  renderStudentSessions();
  renderCalendarHome();
}
  if(sec==='crea'){ renderCrea(); }
}

// ========= Autenticación =========
document.getElementById('btn_logout_access')?.addEventListener('click', ()=>{ logout(); showSection('access'); });
document.getElementById('btn_change_account')?.addEventListener('click', ()=>{ STATE.current=null; save(); showSection('access'); toast('Cambia de cuenta'); });

btn_verify.onclick = ()=>{ const em = reg_email.value.trim(); if(domainOK(em)) toast('Correo institucional válido'); else toast('Usa tu correo institucional válido') }
btn_register.onclick = async ()=>{
  const name=reg_name.value.trim(), email=reg_email.value.trim(), pass=reg_pass.value; const role=reg_role.value, degree=reg_degree.value, sem=reg_sem.value;
  if(!name||!email||!pass){toast('Completa los campos');return}
  if(!domainOK(email)){toast('Correo no institucional');return}
  if(STATE.users.some(u=>u.email===email)){toast('Ya registrado');return}
  const normRole = (role==='estudiante') ? 'aprendiz' : role;
  const user={name,email,pass:await sha256(pass),role:normRole,status: normRole==='asesor'?'pendiente':'activo', degree, sem};
  STATE.users.push(user); save(); toast('Registro exitoso');
}
btn_login.onclick = async ()=>{
  const email=log_email.value.trim(), pass=await sha256(log_pass.value); const u=STATE.users.find(u=>u.email===email && u.pass===pass);
  if(!u){toast('Credenciales inválidas');return}
  if(u.role==='asesor' && u.status!=='activo'){toast('Cuenta de asesor pendiente de validación'); return}
  STATE.current={email:u.email}; save(); toast('Sesión iniciada'); showSection('auth');
}
btn_recover.onclick = ()=>{ const em=rec_email.value.trim(); if(!domainOK(em)){toast('Solo con correo institucional');return} toast('Se envió un enlace de recuperación (simulado)') }
function logout(){STATE.current=null; save(); showSection('access'); toast('Sesión cerrada')}

// ========= Generación de ticket (panel CREA) =========
function abbrMateria(m){
  const key = (m||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
  const map={
    'algoritmia':'ALG',
    'fundamentos de ing software':'FIS',
    'programacion estructurada':'PES',
    'programacion orientada a objetos':'POO',
    'teoria de la computacion':'TDC'
  };
  return map[key] || (m||'').slice(0,3).toUpperCase();
}
function nextSeq(key){ const store=JSON.parse(localStorage.getItem('ph_seq')||'{}'); store[key]=(store[key]||0)+1; localStorage.setItem('ph_seq', JSON.stringify(store)); return store[key]; }
function genTicketId(materia){ const d=new Date(); const y=d.getFullYear(); const m=(d.getMonth()+1).toString().padStart(2,'0'); const ab=abbrMateria(materia); const key=`${y}${m}-${ab}`; const seq=nextSeq(key).toString().padStart(4,'0'); return `${y}-${m}-${ab}-${seq}`; }

const crDesc=document.getElementById('cr_desc'); const crCnt=document.getElementById('cr_cnt');
if(crDesc){ crDesc.addEventListener('input', ()=>{ crCnt.textContent=crDesc.value.length; }); }
const crBtn=document.getElementById('cr_create_ticket');
crBtn && (crBtn.onclick=()=>{
  const me=currentUser(); if(!me){ toast('Inicia sesión en 🔐 Acceso'); showSection('access'); return; }
  const activos=STATE.tickets.filter(t=>t.creador===me.email && (t.estado==='creado'||t.estado==='aceptado'));
  if(activos.length>=3){ toast('Límite 3 solicitudes activas'); return; }
  const materia=cr_materia.value, fecha=cr_fecha.value, eta=cr_eta.value, desc=cr_desc.value.trim();
  if(!materia||!fecha||!eta||!desc){ toast('Completa todos los campos'); return; }
  const id=genTicketId(materia);
  const t={id, creador:me.email, asesor:null, materia, tema:desc.slice(0,40), fechaISO:fecha, eta, desc, estado:'creado'};
  STATE.tickets.push(t); save(); renderCrea(); renderTicketsStudent(); toast('Solicitud creada');
  cr_materia.value=''; cr_fecha.value=''; cr_eta.value=''; cr_desc.value=''; crCnt.textContent='0';
});

function renderCrea(){ const me=currentUser(); const list=document.getElementById('cr_list'); if(!list||!me) return; list.innerHTML='';
  STATE.tickets.filter(t=>t.creador===me.email).sort((a,b)=>b.id.localeCompare(a.id)).forEach(t=>{
    const li=document.createElement('div'); li.className='list-item';
    li.innerHTML=`<div class='row' style='justify-content:space-between'><div><b>${t.id}</b><br><small class='muted'>${t.materia} · ${fmt(t.fechaISO)} · ${t.eta}</small></div><div class='status'>${t.estado}</div></div>`; list.appendChild(li);
  });
}

// ========= Estudiante: inicio =========
function renderTicketsStudent(){ const box=document.getElementById('mis_solicitudes'); if(!box) return; box.innerHTML=''; const me=currentUser();
  if(!me) { box.innerHTML='<div class="muted">Inicia sesión para ver tus solicitudes.</div>'; return; }
  const mine=STATE.tickets.filter(t=>t.creador===me.email).sort((a,b)=>a.fechaISO.localeCompare(b.fechaISO));
  mine.forEach(t=>{
    const div=document.createElement('div'); div.className='list-item';
    div.innerHTML=`<div class="row" style="justify-content:space-between"><div>
      <b>${t.id}</b><br><small class="muted">${t.materia} · ${fmt(t.fechaISO)} · ${t.eta}</small></div>
      <div class="status">${t.estado}</div></div>
      <div class="right" style="margin-top:6px">
        <button class="btn ghost" onclick="openChatTicket('${t.id}')">chat</button>
        <button class="btn bad" onclick="cancelTicket('${t.id}')" ${t.estado!=='creado'?'disabled':''}>cancelar</button>
      </div>`; box.appendChild(div);
  })
}
function renderStudentSessions(){ const box=document.getElementById('mis_sesiones'); if(!box) return; box.innerHTML=''; const me=currentUser(); if(!me) return;
  const mine=STATE.sessions.filter(s=>s.aprendiz===me.email);
  mine.forEach(s=>{ const t=STATE.tickets.find(tt=>tt.id===s.ticketId); const li=document.createElement('div'); li.className='list-item'; li.innerHTML=`<b>${t.id}</b> · ${t.materia} <small class='muted'>${fmt(t.fechaISO)} · ${t.eta}</small>`; box.appendChild(li); })
}
function cancelTicket(id){
  const me=currentUser();
  const t=STATE.tickets.find(x=>x.id===id);
  if(!t) return;

  if(!canCancel(me, t)){
    if(t.estado==='aceptado' && !withinCancelWindow(t)){
      toast('Fuera de tiempo: solo se puede cancelar hasta 1 día antes');
    } else {
      toast('No autorizado para cancelar esta solicitud');
    }
    return;
  }

  if(!confirm('¿Seguro que deseas cancelar esta solicitud?')) return;

  t.estado='cancelado';
  save();
  renderTicketsStudent();
  if(typeof renderAsesor==='function') renderAsesor();
  toast('Solicitud cancelada');
}

// ========= Chat: contactos y por ticket =========
let currentChat={type:null, id:null, title:null};
function openChatTicket(id){ currentChat={type:'ticket', id, title:null}; showSection('chat'); renderChat(); }
function openChatContact(id, name){ currentChat={type:'contact', id, title:name}; showSection('chat'); renderChat(); }
function renderContacts(){ const list=document.getElementById('contact_list'); if(!list) return; list.innerHTML='';
  const contacts=[{id:'c1',name:'Leonardo Ariel San Martín'},{id:'c2',name:'Rodrigo Salazar'}];
  contacts.forEach(c=>{ const li=document.createElement('div'); li.className='list-item'; li.textContent=c.name; li.onclick=()=>openChatContact(c.id,c.name); list.appendChild(li); });
}
function renderChat(){
  const header=document.getElementById('chat_header'); const btnv=document.getElementById('btn_videollamada');
  const thr=document.getElementById('chat_thread'); if(!thr) return; thr.innerHTML='';
  if(!currentChat.id){ header.textContent='Selecciona una conversación'; if(btnv) btnv.disabled=true; return }
  if(currentChat.type==='ticket'){
    const t=STATE.tickets.find(x=>x.id===currentChat.id);
    header.textContent = `${t.materia} – ${t.tema}`;
    if(btnv){
      const me = currentUser();
      const s = STATE.sessions.find(s=>s.ticketId===t.id);
      const hasLink = s && STATE.meetings[s.id];
      // Asesor: puede crear si está aceptado. Estudiante: solo si hay enlace.
      btnv.disabled = isStudent(me) ? !(t.estado==='aceptado' && hasLink) : (t.estado!=='aceptado');
    }
    STATE.messages.filter(m=>m.ticketId===t.id).forEach(m=>{ const d=document.createElement('div'); d.className='msg '+(m.authorEmail===STATE.current.email?'me':'them'); d.innerHTML = `${m.text}<small>${new Date(m.at).toLocaleTimeString()}</small>`; thr.appendChild(d); });
  }else{
    header.textContent=currentChat.title;
    STATE.directMessages.filter(m=>m.contactId===currentChat.id).forEach(m=>{ const d=document.createElement('div'); d.className='msg '+(m.authorEmail===STATE.current.email?'me':'them'); d.innerHTML=`${m.text}<small>${new Date(m.at).toLocaleTimeString()}</small>`; thr.appendChild(d); });
    if(btnv) btnv.disabled=true;
  }
  thr.scrollTop=thr.scrollHeight;
  renderChatList();
}
function renderChatList(){ const list=document.getElementById('chat_list'); if(!list) return; list.innerHTML=''; const q=(chat_search?.value||'').toLowerCase(); const me=currentUser();
  const isAs = me?.role==='asesor';
  const pool = isAs ? STATE.tickets.filter(t=>t.asesor===me.email && t.estado!=='cancelado') : STATE.tickets.filter(t=>t.creador===me.email);
  pool.filter(t=> (t.materia+t.tema).toLowerCase().includes(q)).forEach(t=>{
    const li=document.createElement('div'); li.className='list-item '+(currentChat.id===t.id && currentChat.type==='ticket'?'active':''); li.innerHTML=`<div><b>${t.id}</b><br><small class='muted'>${t.materia}</small></div>`; li.onclick=()=>{currentChat={type:'ticket',id:t.id,title:null}; renderChat()}; list.appendChild(li);
  })
}
function sendMsg(){
  const txt=document.getElementById('chat_input').value.trim(); if(!txt || !currentChat.id) return;
  if(currentChat.type==='ticket'){ STATE.messages.push({ticketId:currentChat.id, authorEmail:STATE.current.email, text:txt, at:Date.now()}); }
  else { STATE.directMessages.push({contactId:currentChat.id, authorEmail:STATE.current.email, text:txt, at:Date.now()}); }
  save(); document.getElementById('chat_input').value=''; renderChat();
}
document.getElementById('btn_videollamada')?.addEventListener('click', ()=>{
  if(currentChat.type!=='ticket') return;
  const me = currentUser();
  const t = STATE.tickets.find(x=>x.id===currentChat.id); if(!t) return;
  let s = STATE.sessions.find(s=>s.ticketId===t.id);
  if(!s && isAdvisor(me)){ s = crearSesion(t.id, true); } // crea sesión si falta (asesor)
  if(!s){ toast('Aún no hay sesión para este ticket'); return; }

  if(!STATE.meetings[s.id]){
    if(isAdvisor(me)){
      STATE.meetings[s.id]=genTeamsLink(s.id); save();
      toast('Enlace de Teams creado');
    }else{
      toast('Espera a que el asesor cree el enlace de Teams');
      return;
    }
  }
  window.open(STATE.meetings[s.id], '_blank');
});

// ========= Reportes =========
function renderReports(){ const list=document.getElementById('report_list'); if(!list) return; list.innerHTML=''; const me=currentUser();
  STATE.reports.filter(r=>r.creator===me?.email).forEach(r=>{ const li=document.createElement('div'); li.className='list-item'; li.innerHTML=`<b>${r.title}</b><br><small class='muted'>${r.id}</small>`; li.onclick=()=>openReport(r.id); list.appendChild(li); });
}
let currentReportId=null;
function crearReporte(){ const title=prompt('Título del reporte:'); if(!title) return; const me=currentUser(); const r={id:'R'+Date.now(), title, creator:me.email}; STATE.reports.push(r); save(); renderReports(); openReport(r.id); }
function openReport(id){ currentReportId=id; const r=STATE.reports.find(x=>x.id===id); document.getElementById('report_header').textContent=r.title; renderReportThread(); }
function renderReportThread(){ const thr=document.getElementById('report_thread'); thr.innerHTML=''; STATE.reportMessages.filter(m=>m.reportId===currentReportId).forEach(m=>{ const d=document.createElement('div'); d.className='msg '+(m.authorEmail===STATE.current.email?'me':'them'); d.innerHTML=`${m.text}<small>${new Date(m.at).toLocaleTimeString()}</small>`; thr.appendChild(d); }); thr.scrollTop=thr.scrollHeight; }
function sendReportMsg(){ if(!currentReportId) return; const txt=report_input.value.trim(); if(!txt) return; STATE.reportMessages.push({reportId:currentReportId, authorEmail:STATE.current.email, text:txt, at:Date.now()}); save(); report_input.value=''; renderReportThread(); }

// ========= Asesor =========
function renderAsesor(){ 
  const box=document.getElementById('as_solicitudes'); if(!box) return; box.innerHTML=''; 
  const me=currentUser();
  STATE.tickets
    .filter(t=> t.estado==='creado' || (t.asesor===me.email && t.estado!=='cancelado'))
    .forEach(t=>{
      const canAcc = canAccept(me, t);
      const div=document.createElement('div'); div.className='list-item';
      div.innerHTML=`
        <div class='row' style='justify-content:space-between'>
          <div><b>${t.id}</b><br><small class='muted'>${t.materia} · ${fmt(t.fechaISO)} · ${t.eta}</small></div>
          <div class='status'>${t.estado}</div>
        </div>
        <div class='right' style='gap:8px; margin-top:6px'>
          <button class='btn ok' onclick="aceptar('${t.id}')" ${canAcc ? '' : 'disabled'} title="${canAcc?'Aceptar solicitud':'Solo solicitudes en estado creado'}">aceptar</button>
          <button class='btn bad' onclick="rechazar('${t.id}')" ${(t.estado==='creado' && isAdvisor(me)) ? '' : 'disabled'}>rechazar</button>
          <button class='btn ghost' title='Agregar a sesiones' onclick="crearSesion('${t.id}')" ${t.estado!=='aceptado'?'disabled':''}>agregar</button>
        </div>`;
      box.appendChild(div);
    }); 
  renderSesiones(); 
  renderReporte(); 
}
function aceptar(id){
  const me=currentUser();
  const t=STATE.tickets.find(x=>x.id===id);
  if(!t){ return; }
  if(!canAccept(me, t)){
    toast('No autorizado: solo asesores aceptan solicitudes en estado creado');
    return;
  }
  t.estado='aceptado';
  t.asesor=me.email;
  // Crear sesión automáticamente al aceptar
  let s = STATE.sessions.find(x=>x.ticketId===t.id);
  if(!s){
    s = crearSesion(t.id, true); // silent render
  }
  // Mensaje automático
  STATE.messages.push({ticketId:t.id, authorEmail:me.email, text:`Se aceptó tu solicitud: ${t.id}`, at:Date.now()});
  save();
  // Refrescar vistas relevantes
  if(typeof renderAsesor==='function') renderAsesor();
  if(typeof renderStudentSessions==='function') renderStudentSessions();
  if(typeof renderTicketsStudent==='function') renderTicketsStudent();
  toast('Solicitud aceptada y sesión agendada');
}
function rechazar(id){ const t=STATE.tickets.find(x=>x.id===id); t.estado='rechazado'; save(); renderAsesor(); toast('Solicitud rechazada') }
function crearSesion(ticketId, silent){ const t=STATE.tickets.find(x=>x.id===ticketId); if(!t) return; let s=STATE.sessions.find(x=>x.ticketId===ticketId); if(s) return s; s={id:'S'+Date.now(), ticketId, asesor:t.asesor, aprendiz:t.creador, startA:null, startE:null, endA:null, endE:null, durMin:0}; STATE.sessions.push(s); save(); !silent && renderSesiones(); !silent && toast('Sesión creada'); return s; }
function renderSesiones(){ const me=currentUser(); const box=document.getElementById('as_sesiones'); if(!box) return; box.innerHTML=''; STATE.sessions.filter(s=>s.asesor===me.email).forEach(s=>{ const t=STATE.tickets.find(t=>t.id===s.ticketId); const div=document.createElement('div'); div.className='card'; const bothStart = s.startA && s.startE; const bothEnd = s.endA && s.endE; const meet=STATE.meetings[s.id];
    div.innerHTML=`<div class='row' style='justify-content:space-between'>
      <div><b>${t.id}</b> – ${t.materia} <br><small class='muted'>${fmt(t.fechaISO)} · ${t.eta}</small></div>
      <div class='status'>${bothEnd? 'cerrada' : (bothStart? 'en curso':'pendiente')}</div>
    </div>
    <div class='row' style='gap:8px; margin-top:8px'>
      <button class='btn ok' onclick="checkIn('${s.id}','A')" ${s.startA?'disabled':''}>check-in (asesor)</button>
      <button class='btn ok' onclick="checkIn('${s.id}','E')" ${s.startE?'disabled':''}>check-in (estudiante)</button>
      <button class='btn warn' onclick="checkOut('${s.id}','A')" ${!s.startA||s.endA?'disabled':''}>check-out (asesor)</button>
      <button class='btn warn' onclick="checkOut('${s.id}','E')" ${!s.startE||s.endE?'disabled':''}>check-out (estudiante)</button>
      <button class='btn' onclick="openTeams('${s.id}')">${meet?'Abrir Teams':'Crear Teams'}</button>
      <button class='btn ghost' onclick="exportICS('${s.id}')">ICS</button>
    </div>
    <div class='muted'>Duración confirmada: ${s.durMin} min${meet?` · <a href='${meet}' target='_blank'>enlace</a>`:''}</div>`; box.appendChild(div); }); }

function checkIn(id, who){ const s=STATE.sessions.find(x=>x.id===id); s['start'+who]=(new Date()).toISOString(); save(); renderSesiones() }
function checkOut(id, who){ const s=STATE.sessions.find(x=>x.id===id); s['end'+who]=(new Date()).toISOString(); if(s.endA && s.endE){ const start = Math.max(new Date(s.startA||s.startE), new Date(s.startE||s.startA)); const end = Math.min(new Date(s.endA), new Date(s.endE)); const min = Math.max(0, Math.round((end-start)/60000)); s.durMin=min; STATE.horas[s.asesor] = (STATE.horas[s.asesor]||0) + min; toast('Sesión cerrada y horas registradas') } save(); renderSesiones(); renderReporte(); }

function renderReporte(){ const me=currentUser(); const box=document.getElementById('reporte_box'); if(!box) return; const totalMin=STATE.horas[me.email]||0; const h=Math.floor(totalMin/60), m=totalMin%60; box.innerHTML = `<div class='card'><div class='title'>Horas totales</div><div style='font-size:42px; font-weight:800'>${h}:${m.toString().padStart(2,'0')} h</div><div class='muted'>Horas mínimas para un crédito: 8h</div></div>`; }
function exportHorasCSV(){ const me=currentUser(); const rows=[['Matricula','Asesor','Duración (min)','Fecha']]; STATE.sessions.filter(s=>s.asesor===me.email && s.durMin>0).forEach(s=>{ rows.push(['N/A', me.email, s.durMin, fmt(s.endA||s.endE)])}); const csv=rows.map(r=>r.join(',')).join('\\n'); const blob=new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='reporte_horas.csv'; a.click(); }
function exportICS(sessionId){ const s=STATE.sessions.find(x=>x.id===sessionId); const t=STATE.tickets.find(t=>t.id===s.ticketId); const dtStart=new Date(t.fechaISO).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z'; const dtEnd=new Date(new Date(t.fechaISO).getTime()+60*60000).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z'; const ics=`BEGIN:VCALENDAR\\nVERSION:2.0\\nBEGIN:VEVENT\\nUID:${s.id}@peerhive\\nDTSTART:${dtStart}\\nDTEND:${dtEnd}\\nSUMMARY:Asesoría ${t.materia} – ${t.tema}\\nEND:VEVENT\\nEND:VCALENDAR`; const blob=new Blob([ics],{type:'text/calendar'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${s.id}.ics`; a.click(); }

// ========= Teams =========
// Helpers de reuniones (idempotentes y reutilizables)
function validTeamsUrl(url){
  try{
    const u = new URL(url);
    return u.hostname.endsWith('teams.microsoft.com') || u.protocol==='msteams:';
  }catch{ return false; }
}
function ensureMeetingMeta(sessionId){
  const meta = STATE.meetingMeta[sessionId]||{};
  STATE.meetingMeta[sessionId] = { title: meta.title || 'Reunión PeerHive', createdAt: meta.createdAt || Date.now() };
}
function setMeeting(sessionId, joinUrl){
  if(!validTeamsUrl(joinUrl)) { console.warn('URL de Teams inválida', joinUrl); return false; }
  STATE.meetings[sessionId]=joinUrl;
  ensureMeetingMeta(sessionId);
  save();
  return true;
}
function removeMeeting(sessionId){
  delete STATE.meetings[sessionId];
  delete STATE.meetingMeta[sessionId];
  save();
}
function genTeamsLink(id){
  const topic=encodeURIComponent('PeerHive Sesión '+id);
  return `https://teams.microsoft.com/l/meetup-join/19%3Ameeting_${id}%40thread.v2/0?context=%7B%22topic%22%3A%22${topic}%22%7D`;
}
function openTeams(sessionId){
  if(!STATE.meetings[sessionId]){
    const url = genTeamsLink(sessionId);
    if(setMeeting(sessionId,url)) toast('Enlace de Teams creado');
  }
  window.open(STATE.meetings[sessionId],'_blank');
}

function renderMyMeetingsPanel(){
  const list = document.getElementById('lista-reuniones'); if(!list) return;
  list.innerHTML='';
  const me = currentUser(); if(!me) return;
  const mine = (me.role==='asesor')
    ? STATE.sessions.filter(s=>s.asesor===me.email && STATE.meetings[s.id])
    : STATE.sessions.filter(s=>s.aprendiz===me.email && STATE.meetings[s.id]);
  mine.sort((a,b)=> (STATE.meetingMeta[b.id]?.createdAt||0) - (STATE.meetingMeta[a.id]?.createdAt||0));
  mine.forEach(s=>{
    const url = STATE.meetings[s.id];
    const meta = STATE.meetingMeta[s.id] || {};
    const title = meta.title || 'Reunión PeerHive';
    const fecha = new Date(meta.createdAt || Date.now()).toLocaleString();
    const item = document.createElement('div');
    item.className = 'reunion-item';
    item.dataset.sid = s.id;
    item.innerHTML = `<div><b>${title}</b><br><small>${fecha}</small></div>
      <div class="row" style="gap:6px">
        <a class="btn ghost sm" href="${url}" target="_blank" rel="noopener">Unirse</a>
        <button class="btn sm" onclick="renameMeeting('${s.id}')">Renombrar</button>
        <button class="btn ghost sm" onclick="copy('${s.id}')">Copiar</button>
        <button class="btn ghost sm" onclick="downloadICS('${s.id}')">ICS</button>
        <button class="btn bad sm" onclick="deleteMeeting('${s.id}')">Eliminar</button>
      </div>`;
    list.appendChild(item);
  });
}
function renameMeeting(sessionId){
  const meta = STATE.meetingMeta[sessionId] || {};
  const nuevo = prompt('Nuevo título para la reunión:', meta.title || 'Reunión PeerHive');
  if(!nuevo) return;
  STATE.meetingMeta[sessionId] = { ...(meta||{}), title: nuevo, createdAt: meta.createdAt || Date.now() };
  save(); renderMyMeetingsPanel(); renderCalls();
}
function deleteMeeting(sessionId){
  if(!confirm('¿Eliminar esta reunión?')) return;
  const s = STATE.sessions.find(x=>x.id===sessionId);
  removeMeeting(sessionId);
  if(s && !s.ticketId){
    STATE.sessions = STATE.sessions.filter(x=>x.id!==sessionId);
  }
  save(); renderMyMeetingsPanel(); renderCalls();
}
function downloadICS(sessionId){
  const url = STATE.meetings[sessionId]; if(!url) return;
  const meta = STATE.meetingMeta[sessionId] || {};
  const title = (meta.title || 'Reunión PeerHive').replace(/[\\n\\r]/g,'');
  const dtStart = new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  const dtEnd = new Date(Date.now()+60*60000).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  const ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
    'UID:'+sessionId+'@peerhive',
    'DTSTART:'+dtStart,
    'DTEND:'+dtEnd,
    'SUMMARY:'+title,
    'URL:'+url,
    'DESCRIPTION=Enlace de Teams: '+url,
    'BEGIN:VALARM','TRIGGER:-PT15M','ACTION:DISPLAY','DESCRIPTION:Recordatorio','END:VALARM','END:VEVENT','END:VCALENDAR'
  ].join('\\n');
  const blob=new Blob([ics],{type:'text/calendar'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download= sessionId+'.ics'; a.click();
}

function renderCalls(){ const box=document.getElementById('calls_list'); if(!box) return; box.innerHTML=''; const me=currentUser(); if(!me) return; const mine = me?.role==='asesor' ? STATE.sessions.filter(s=>s.asesor===me.email) : STATE.sessions.filter(s=>s.aprendiz===me.email);
  mine.forEach(s=>{ const t=STATE.tickets.find(tt=>tt.id===s.ticketId); const link=STATE.meetings[s.id]; const div=document.createElement('div'); div.className='card'; div.innerHTML=`<div class='row' style='justify-content:space-between'><div>${t?`<b>${t.id}</b> – ${t.materia}<br><small class='muted'>${fmt(t.fechaISO)}</small>`:`<b>Ad-hoc</b><br><small class='muted'>Sin ticket</small>`}</div><div class='status'>${link?'con enlace':'sin enlace'}</div></div><div class='row' style='gap:8px; margin-top:8px'><button class='btn' onclick="openTeams('${s.id}')">${link?'Abrir Teams':'Crear enlace Teams'}</button><button class='btn ghost' onclick="copy('${s.id}')">copiar enlace</button></div>`; box.appendChild(div) }) }
function copy(id){ const link=STATE.meetings[id]; if(!link){toast('Primero crea el enlace'); return} navigator.clipboard.writeText(link); toast('Enlace copiado') }
function loadTeamsApiTable(){ const rows=[
  {m:'Obtener el contexto de usuario', d:'Información contextual para contenido en pestaña.', o:'teamsJS'},
  {m:'Obtener participante', d:'Info de participantes por id de reunión y participante.', o:'Bot Framework'},
  {m:'Enviar notificación en la reunión', d:'Bot notifica acciones del usuario (notificación en reunión).', o:'Bot Framework'},
  {m:'Obtener detalles de la reunión', d:'Metadatos estáticos de reunión.', o:'Bot Framework'},
  {m:'Enviar subtítulos en tiempo real', d:'Subtítulos en tiempo real en reunión en curso.', o:'teamsJS'},
  {m:'Compartir contenido de la aplicación en la fase', d:'Compartir partes de la app en fase de reunión.', o:'teamsJS'},
  {m:'Recepción de eventos de reunión en tiempo real', d:'Inicio/fin, unión/salida de participantes.', o:'Bot Framework'},
  {m:'Obtener el estado de audio entrante', d:'Obtener estado de audio entrante del usuario.', o:'teamsJS'},
  {m:'Alternar audio entrante', d:'Silenciar/activar audio entrante.', o:'teamsJS'}
]; const body=document.getElementById('teams_api_rows'); if(!body) return; body.innerHTML=''; rows.forEach(r=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${r.m}</td><td>${r.d}</td><td>${r.o}</td>`; body.appendChild(tr); }); }

// ========= Admin =========
function isInstitutional(email){
  email=(email||'').toLowerCase();
  return /^a\\d{8}@alumnos\\.uady\\.mx$/.test(email) || /^[a-z]+(\\.[a-z]+)+@uady\\.virtual\\.mx$/.test(email) || /^[a-z0-9._%+-]+@uady\\.mx$/.test(email) || /^admin@admin\\.uady\\.mx$/.test(email);
}

function isAdmin(u){ return u && u.role==='admin'; }
function renderAdmin(){ const u=currentUser(); if(!isAdmin(u)){ const sec=document.getElementById('admin'); if(sec) sec.innerHTML='<div class="title">Acceso restringido</div>'; return; }
  const list=document.getElementById('admin_users'); list.innerHTML='';
  STATE.users.forEach(user=>{
    const li=document.createElement('div'); li.className='list-item';
    li.innerHTML=`<div class='row' style='justify-content:space-between'>
      <div><b>${user.name||'Sin nombre'}</b><br><small class='muted'>${user.email}</small></div>
      <div class='status'>${user.role} ${user.role==='asesor'?'('+user.status+')':''}</div>
    </div>
    <div class='right' style='gap:8px; margin-top:6px'>
      <button class='btn' onclick="grantAsesor('${user.email}')" ${!isInstitutional(user.email)?'disabled':''}>otorgar asesor</button>
      <button class='btn bad' onclick="revokeAsesor('${user.email}')" ${!isInstitutional(user.email)?'disabled':''}>revocar asesor</button>
      <button class='btn ghost' onclick="activarAsesor('${user.email}')">activar asesor</button>
      <button class='btn warn' onclick="pendienteAsesor('${user.email}')">marcar pendiente</button>
    </div>`; list.appendChild(li);
  });
  const rep=document.getElementById('admin_reports'); rep.innerHTML='';
  STATE.reports.forEach(r=>{ const li=document.createElement('div'); li.className='list-item'; const msgs=STATE.reportMessages.filter(m=>m.reportId===r.id).length; li.innerHTML=`<b>${r.title}</b> <small class='muted'>(${msgs} mensajes) – ${r.creator}</small>`; rep.appendChild(li); });
  const csv=document.getElementById('csv_input'); if(csv) csv.onchange=handleCSV;
  renderLogs();
}
function grantAsesor(email){ const u=STATE.users.find(x=>x.email===email); if(!u) return; u.role='asesor'; u.status='pendiente'; save(); renderAdmin(); toast('Rol asesor otorgado (pendiente)') }
function revokeAsesor(email){ const u=STATE.users.find(x=>x.email===email); if(!u) return; if(u.role==='asesor'){ u.role='aprendiz'; u.status='activo'; } save(); renderAdmin(); toast('Rol asesor revocado') }
function activarAsesor(email){ const u=STATE.users.find(x=>x.email===email); if(!u) return; if(u.role==='asesor'){ u.status='activo'; } save(); renderAdmin(); toast('Asesor activado') }
function pendienteAsesor(email){ const u=STATE.users.find(x=>x.email===email); if(!u) return; if(u.role==='asesor'){ u.status='pendiente'; } save(); renderAdmin(); toast('Asesor marcado pendiente') }
function verifyCSVHeaders(rows){
  if(!rows||!rows.length) return false;
  const headers=rows[0].map(h=>h.trim().toLowerCase());
  const hasMeeting=headers.some(h=>/meeting|reunion|id.*reunion/.test(h));
  const hasParticipant=headers.some(h=>/participant|asistente|id.*particip/.test(h));
  const hasJoin=headers.some(h=>/join|entrada|ingreso/.test(h));
  const hasLeave=headers.some(h=>/leave|salida|egreso/.test(h));
  return hasMeeting && hasParticipant && (hasJoin||hasLeave);
}
function handleCSV(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    const text=reader.result.trim();
    const rows=text.split(/\\r?\\n/).map(r=>r.split(','));
    STATE.logs=rows; save(); renderLogs(); toast(verifyCSVHeaders(rows)?'CSV verificado':'CSV cargado (estructura no reconocida)');
  };
  reader.readAsText(file);
}
function renderLogs(){
  const prev=document.getElementById('csv_preview'); if(!prev) return; prev.innerHTML='';
  if(!STATE.logs.length){ prev.innerHTML='<div class="muted">Sin logs cargados</div>'; return; }
  const table=document.createElement('table'); table.className='table';
  table.innerHTML='<thead><tr>'+STATE.logs[0].map(h=>`<th>${h}</th>`).join('')+'</tr></thead>';
  const tb=document.createElement('tbody');
  STATE.logs.slice(1,Math.min(STATE.logs.length,30)).forEach(r=>{ const tr=document.createElement('tr'); tr.innerHTML=r.map(c=>`<td>${c}</td>`).join(''); tb.appendChild(tr); });
  table.appendChild(tb); prev.appendChild(table);
}

// ========= Helpers =========
function currentUser(){ if(!STATE.current) return null; return STATE.users.find(u=>u.email===STATE.current.email) }

// --- AUTH: Helpers de autorización y reglas de negocio ---
function isOwner(u, t){ return !!u && !!t && t.creador === u.email; }
function isAdvisor(u){ return u?.role === 'asesor'; }
function isStudent(u){ return u?.role === 'aprendiz' || u?.role === 'estudiante'; }
function isAssignedAdvisor(u, t){ return isAdvisor(u) && !!t && t.asesor === u.email; }

// Puede cancelar como máximo 1 día antes del horario pactado
function withinCancelWindow(t){
  if(!t?.fechaISO) return false;
  const ms = new Date(t.fechaISO).getTime() - Date.now();
  return ms >= 24*60*60*1000; // >= 1 día
}

function canAccept(u, t){
  // Solo asesores y solo solicitudes en estado 'creado'
  return isAdvisor(u) && t?.estado === 'creado';
}

function canCancel(u, t){
  if(!t) return false;
  if(t.estado === 'creado'){
    // Solo quien creó la solicitud puede cancelarla
    return isOwner(u, t);
  }
  if(t.estado === 'aceptado'){
    // Si ya fue aceptada: creador o asesor asignado, y máximo 1 día antes
    return (isOwner(u, t) || isAssignedAdvisor(u, t)) && withinCancelWindow(t);
  }
  return false; // rechazado/cancelado/etc.
}

function renderApp(){
  const u=currentUser();
  // Mostrar "Admin" en sidebar solo si es admin
  const adminBtn = [...document.querySelectorAll('.sb-btn')].find(b=>b.getAttribute('data-sec')==='admin');
  if(adminBtn) adminBtn.style.display = (u && isAdmin(u)) ? 'grid' : 'none';
  showSection('auth');
  if(u){
    renderTicketsStudent(); renderStudentSessions(); renderCrea();
    if(u.role==='asesor'){ renderAsesor(); }
    if(u.role==='admin'){ renderAdmin(); }
  }
}
renderApp();

// cuentas demo
(async()=>{
  if(!STATE.users.find(u=>u.email==='asesor@uady.mx')){
    STATE.users.push({name:'Asesor Demo', email:'asesor@uady.mx', pass:await sha256('demo'), role:'asesor', status:'activo'});
  }
  if(!STATE.users.find(u=>u.email==='estudiante@alumnos.uady.mx')){
    STATE.users.push({name:'Estudiante Demo', email:'estudiante@alumnos.uady.mx', pass:await sha256('demo'), role:'aprendiz', status:'activo'});
  }
  if(!STATE.users.find(u=>u.email==='admin@admin.uady.mx')){
    STATE.users.push({name:'Admin', email:'admin@admin.uady.mx', pass:await sha256('admin'), role:'admin', status:'activo'});
  }
  save();
})();

let currentAdminReportId=null;
function openAdminReport(id){
  currentAdminReportId=id;
  const r=STATE.reports.find(x=>x.id===id);
  const head=document.getElementById('admin_report_header');
  if(head) head.textContent = r ? `${r.title} — ${r.creator}` : 'Reporte';
  renderAdminReportThread();
}
function renderAdminReportThread(){
  const thr=document.getElementById('admin_report_thread'); if(!thr) return; thr.innerHTML='';
  STATE.reportMessages.filter(m=>m.reportId===currentAdminReportId).forEach(m=>{
    const d=document.createElement('div'); d.className='msg '+(m.authorEmail===STATE.current?.email?'me':'them');
    d.innerHTML = `${m.text}<small>${new Date(m.at).toLocaleTimeString()}</small>`;
    thr.appendChild(d);
  });
  thr.scrollTop = thr.scrollHeight;
}
document.getElementById('admin_report_send')?.addEventListener('click', ()=>{
  const u=currentUser(); if(!u || u.role!=='admin' || !currentAdminReportId) return;
  const inp=document.getElementById('admin_report_input'); const txt=inp?.value?.trim(); if(!txt) return;
  STATE.reportMessages.push({reportId:currentAdminReportId, authorEmail:u.email, text:txt, at:Date.now()});
  save(); inp.value=''; renderAdminReportThread();
});


// ========= Panel de Videollamadas (simulación backend) =========
const btnCrearReunion = document.getElementById('btn_crear_reunion');
btnCrearReunion?.addEventListener('click', crearReunionTeams);

let creandoReunion = false;
async function crearReunionTeams(){
  if(creandoReunion) return; // evita dobles clics
  creandoReunion = true;

  const btn = document.getElementById('btn_crear_reunion');
  if(!document.getElementById('btn_crear_reunion')){ creandoReunion=false; return; }
  const me = currentUser();
  if(!me){ alert('Inicia sesión para crear una reunión.'); creandoReunion=false; return; }

  if(!btn){ creandoReunion=false; return; }
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Cargando...';
  try{
    // Simular POST /api/crear-reunion-teams a nuestro backend (no expone claves)
    const resp = await simularBackendCrearReunion();
    if(!resp || !resp.success || !validTeamsUrl(resp.joinUrl)) throw new Error('Fallo en la creación de la reunión');
    // Crea sesión ad-hoc y vincula URL
    const sessionId = crearSesionAdhocPara(me);
    setMeeting(sessionId, resp.joinUrl);
    agregarReunionALista(sessionId);
    toast('Reunión creada');
  }catch(err){
    alert('No fue posible crear la reunión. Inténtalo de nuevo.');
    console.error(err);
  }finally{
    btn.disabled = false;
    btn.textContent = original;
    creandoReunion = false;
  }
}

function simularBackendCrearReunion(){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      // 95% éxito simulado
      const ok = Math.random() < 0.95;
      if(ok){
        resolve({ success:true, joinUrl:'https://teams.microsoft.com/l/meetup-join/simulado/'+(Date.now()) });
      }else{
        resolve({ success:false });
      }
    }, 800);
  });
}

function crearSesionAdhocPara(user){
  const sId = 'S'+Date.now();
  const sess = { id:sId, ticketId:null, asesor: user.role==='asesor'? user.email : null, aprendiz: user.role!=='asesor'? user.email : null, startA:null, startE:null, endA:null, endE:null, durMin:0 };
  STATE.sessions.push(sess);
  ensureMeetingMeta(sId);
  save();
  return sId;
}

function agregarReunionALista(sessionId){
  const list = document.getElementById('lista-reuniones');
  if(list){
    const item = document.createElement('div');
    item.className = 'reunion-item';
    const fecha = new Date(STATE.meetingMeta[sessionId]?.createdAt || Date.now()).toLocaleString();
    item.innerHTML = `
      <div>
        <b>${STATE.meetingMeta[sessionId]?.title || 'Reunión PeerHive'}</b><br>
        <small>${fecha}</small>
      </div>
      <div class="row" style="gap:6px">
        <a class="btn ghost sm" href="${STATE.meetings[sessionId]}" target="_blank" rel="noopener">Unirse ahora</a>
        <button class="btn ghost sm" onclick="copy('${sessionId}')">Copiar</button>
        <button class="btn sm" onclick="renameMeeting('${sessionId}')">Renombrar</button>
        <button class="btn bad sm" onclick="deleteMeeting('${sessionId}')">Eliminar</button>
      </div>
    `;
    list.prepend(item);
  }
  // Refrescar listados globales
  renderCalls(); 
  if (typeof renderMyMeetingsPanel === 'function') renderMyMeetingsPanel();
}


// ========= Calendario (visual + Outlook) =========

// --- Calendario en panel de inicio (próximos 7 días) ---
function renderCalendarHome(){
  const grid = document.getElementById('home_cal_grid');
  const label = document.getElementById('home_cal_label');
  if(!grid || !label) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const horizon = new Date(today); horizon.setDate(today.getDate()+6);
  label.textContent = `${today.toLocaleDateString()} — ${horizon.toLocaleDateString()}`;
  grid.innerHTML = '';

  // Build 7 days cells
  const days = [];
  for(let i=0;i<7;i++){ const d=new Date(today); d.setDate(today.getDate()+i); days.push(d); }
  const events = userSessions().map(sessionToEvent).filter(ev => {
    const d = new Date(ev.start); d.setHours(0,0,0,0);
    return d>=today && d<=horizon;
  });

  days.forEach(d=>{
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    const head = document.createElement('div');
    head.className = 'day';
    head.textContent = d.toLocaleDateString(undefined,{weekday:'short', day:'2-digit'});
    cell.appendChild(head);
    events.filter(ev=>ev.start.toDateString()===d.toDateString()).forEach(ev=>{
      const el = document.createElement('div');
      el.className = 'cal-event';
      el.textContent = `${ev.start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} · ${ev.title}`;
      el.onclick = ()=> showSection('calendar'); // atajo: abre calendario principal
      cell.appendChild(el);
    });
    grid.appendChild(cell);
  });
}

let CAL = { year: new Date().getFullYear(), month: new Date().getMonth(), inited:false };

function initCalendarOnce(){
  if(CAL.inited) return;
  CAL.inited = true;
  document.getElementById('cal_prev')?.addEventListener('click', ()=>{ shiftMonth(-1); });
  document.getElementById('cal_next')?.addEventListener('click', ()=>{ shiftMonth(1); });
  document.getElementById('cal_today')?.addEventListener('click', ()=>{ const d=new Date(); CAL.year=d.getFullYear(); CAL.month=d.getMonth(); renderCalendar(); });
  document.getElementById('cal_export_month')?.addEventListener('click', exportMonthICS);
}

function shiftMonth(delta){
  CAL.month += delta;
  if(CAL.month<0){ CAL.month=11; CAL.year--; }
  if(CAL.month>11){ CAL.month=0; CAL.year++; }
  renderCalendar();
}

function userSessions(){
  const me=currentUser(); if(!me) return [];
  return (isAdvisor(me)) ? STATE.sessions.filter(s=>s.asesor===me.email) : STATE.sessions.filter(s=>s.aprendiz===me.email);
}

function sessionToEvent(s){
  const t = s.ticketId ? STATE.tickets.find(tt=>tt.id===s.ticketId) : null;
  const startISO = t?.fechaISO || new Date().toISOString();
  const start = new Date(startISO);
  const end = new Date(start.getTime()+60*60000);
  return {
    id: s.id,
    title: t ? `Asesoría ${t.materia}` : 'Asesoría ad-hoc',
    desc: t ? t.tema : 'Sesión sin ticket',
    start, end,
    meeting: STATE.meetings[s.id] || null,
    ticketId: t?.id || null
  };
}

function getMonthMatrix(year, month){
  // build 6 weeks grid
  const first = new Date(year, month, 1);
  const start = new Date(first); start.setDate(first.getDate() - ((first.getDay()+6)%7)); // Monday-based
  const cells=[];
  for(let i=0;i<42;i++){
    const d=new Date(start); d.setDate(start.getDate()+i);
    cells.push(d);
  }
  return cells;
}

function renderCalendar(){
  const label=document.getElementById('cal_label');
  const grid=document.getElementById('calendar_grid');
  const panel=document.getElementById('cal_event_panel');
  if(!grid) return;
  label.textContent = new Date(CAL.year, CAL.month, 1).toLocaleDateString(undefined,{month:'long', year:'numeric'});

  const sessions = userSessions().map(sessionToEvent);
  grid.innerHTML='';
  const cells = getMonthMatrix(CAL.year, CAL.month);
  cells.forEach(d=>{
    const cell=document.createElement('div'); cell.className='calendar-cell'+(d.getMonth()!==CAL.month?' muted':'');
    const day=document.createElement('div'); day.className='day'; day.textContent=d.getDate(); cell.appendChild(day);
    // events that start this day
    sessions.filter(ev => ev.start.toDateString()===d.toDateString()).forEach(ev=>{
      const el=document.createElement('div'); el.className='cal-event';
      el.textContent = `${ev.start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} · ${ev.title}`;
      el.onclick=()=>showEventPanel(ev);
      cell.appendChild(el);
    });
    grid.appendChild(cell);
  });
  panel.hidden=true;
}

function showEventPanel(ev){
  const panel=document.getElementById('cal_event_panel'); if(!panel) return;
  const startISO = ev.start.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  const endISO = ev.end.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  const outlook = outlookDeeplink(ev.title, ev.desc, ev.start, ev.end, ev.meeting || '');

  panel.hidden=false;
  panel.innerHTML = `
    <div class="title">${ev.title}</div>
    <div class="muted">${ev.start.toLocaleString()} — ${ev.end.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
    ${ev.ticketId ? `<div class="muted">Ticket: <b>${ev.ticketId}</b></div>`:''}
    ${ev.meeting ? `<div class="muted">Enlace: <a href="${ev.meeting}" target="_blank" rel="noopener">abrir</a></div>`:''}
    <div class="row" style="gap:8px; margin-top:8px">
      ${ev.meeting? `<a class="btn" href="${ev.meeting}" target="_blank" rel="noopener">Unirse</a>`:''}
      <button class="btn ghost" onclick="exportICSFor('${ev.id}')">Descargar .ics</button>
      <a class="btn ghost" href="${outlook}" target="_blank" rel="noopener">Añadir en Outlook</a>
      <button class="btn ghost" onclick="copyEventLink('${ev.id}')">Copiar enlace</button>
    </div>
  `;
}

function exportICSFor(sessionId){
  const s=STATE.sessions.find(x=>x.id===sessionId); if(!s) return;
  exportICS(sessionId);
}

function copyEventLink(sessionId){
  const url=STATE.meetings[sessionId]; if(!url){ toast('Este evento no tiene enlace de reunión'); return; }
  navigator.clipboard.writeText(url); toast('Enlace copiado');
}

function exportMonthICS(){
  const me=currentUser(); if(!me) return;
  const events = userSessions().map(sessionToEvent).filter(ev=>ev.start.getMonth()===CAL.month && ev.start.getFullYear()===CAL.year);
  if(!events.length){ toast('Sin sesiones este mes'); return; }
  const lines=['BEGIN:VCALENDAR','VERSION:2.0'];
  events.forEach(ev=>{
    const dtStart=ev.start.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    const dtEnd=ev.end.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    lines.push('BEGIN:VEVENT');
    lines.push('UID:'+ev.id+'@peerhive');
    lines.push('DTSTART:'+dtStart);
    lines.push('DTEND:'+dtEnd);
    lines.push('SUMMARY:'+ev.title.replace(/\\n|\\r/g,''));
    if(ev.meeting){
      lines.push('URL:'+ev.meeting);
      lines.push('DESCRIPTION=Enlace: '+ev.meeting);
    }else if(ev.desc){
      lines.push('DESCRIPTION='+ev.desc.replace(/\\n|\\r/g,''));
    }
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT15M');
    lines.push('ACTION:DISPLAY');
    lines.push('DESCRIPTION:Recordatorio');
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  const blob=new Blob([lines.join('\\n')],{type:'text/calendar'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`cal-${CAL.year}-${(CAL.month+1).toString().padStart(2,'0')}.ics`; a.click();
}

function outlookDeeplink(title, desc, start, end, url){
  // Compose deeplink for Outlook on the web (compose new calendar event)
  function enc(s){ return encodeURIComponent(s||''); }
  const base='https://outlook.office.com/calendar/0/deeplink/compose';
  const allDay = false;
  const body = [desc||'', url?('\\n\\nReunión: '+url):''].join('');
  const params = [
    'subject='+enc(title||'Evento'),
    'body='+enc(body),
    'startdt='+enc(start.toISOString()),
    'enddt='+enc(end.toISOString()),
    'allday='+String(allDay)
  ].join('&');
  return base+'?'+params;
}

// ========= Inicio =========
