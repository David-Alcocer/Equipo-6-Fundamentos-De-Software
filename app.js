// =====================
// LOGIN / REGISTRO
// =====================
(function authScripts(){
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");

  if (showRegister) {
    showRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.add("hidden");
      registerForm.classList.remove("hidden");
    });
  }
  if (showLogin) {
    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const pass = document.getElementById("loginPassword").value.trim();
      if (!email || !pass) return alert("Completa todos los campos.");
      if (!email.endsWith("@alumnos.uady.mx")) return alert("Usa tu correo institucional (@alumnos.uady.mx).");
      // Simulación de login OK
      localStorage.setItem("peerhive_user", JSON.stringify({ email }));
      window.location.href = "dashboard.html";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("regEmail").value.trim();
      if (!email.endsWith("@alumnos.uady.mx")) return alert("Correo institucional requerido (@alumnos.uady.mx)");
      alert("Registro simulado. Ahora inicia sesión.");
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    });
  }
})();

// =====================
// DASHBOARD INTERACTIVO
// =====================
(function dashboardScripts(){
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const toast = (msg, ms=3000) => {
    const t = $("#toast"); if(!t) return;
    t.textContent = msg; t.classList.remove("hidden");
    setTimeout(()=> t.classList.add("hidden"), ms);
  };

  // Botón logout
  const logoutBtn = $("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("peerhive_user");
      alert("Cerraste sesión correctamente.");
      window.location.href = "index.html";
    });
  }

  // ---- Navegación entre vistas (sin recargar)
  const menuLinks = $$(".menu a");
  const views = $$(".view");
  function showView(name){
    views.forEach(v => v.id === `view-${name}` ? v.classList.add("show") : v.classList.remove("show"));
    menuLinks.forEach(a => a.dataset.view === name ? a.classList.add("active") : a.classList.remove("active"));
    // pequeña animación del main
    const main = document.querySelector(".main-content");
    main.classList.remove("fade-in");
    void main.offsetWidth; // reflow
    main.classList.add("fade-in");
  }
  menuLinks.forEach(a => a.addEventListener("click", (e)=>{
    e.preventDefault();
    const view = a.dataset.view;
    showView(view);
  }));

  // Mostrar vista inicial
  if (views.length) showView("inicio");

  // ======================
  // Estado (maqueta local)
  // ======================
  const DB = {
    get(){ try{ return JSON.parse(localStorage.getItem("ph_state")||"{}"); }catch(e){ return {}; } },
    set(obj){ localStorage.setItem("ph_state", JSON.stringify(obj)); }
  };
  // Seed inicial
  if (!localStorage.getItem("ph_state")) {
    DB.set({
      tickets: [],
      agendas: [],
      sesiones: [],
      chats: [],
      horasConfirmadas: 0
    });
  }

  // ======= ASESORÍAS =======
  const formCreateTicket = $("#formCreateTicket");
  const tablaTickets = $("#tablaTickets tbody");
  const ticketParaSesion = $("#ticketParaSesion");

  function renderTickets(){
    const s = DB.get();
    tablaTickets.innerHTML = "";
    let i = 1;
    s.tickets.forEach(t=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i++}</td>
        <td>${t.materia}</td>
        <td>${t.tema}</td>
        <td><span class="pill">${t.estado}</span></td>
        <td class="actions">
          ${t.estado === "pendiente" ? `<button class="btn-secondary btn-sm" data-act="cancel" data-id="${t.id}">Cancelar</button>
          <button class="btn-primary btn-sm" data-act="accept" data-id="${t.id}">Aceptar</button>` : `<button class="btn-secondary btn-sm" data-act="view" data-id="${t.id}">Ver</button>`}
        </td>`;
      tablaTickets.appendChild(tr);
    });

    // llenar select para agendar
    ticketParaSesion.innerHTML = `<option value="">— Selecciona ticket aceptado —</option>`;
    (s.tickets||[]).filter(t=>t.estado==="aceptada").forEach(t=>{
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.materia} — ${t.tema}`;
      ticketParaSesion.appendChild(opt);
    });

    // acciones
    tablaTickets.querySelectorAll("button").forEach(b=>{
      b.addEventListener("click", ()=>{
        const id = b.dataset.id;
        const s = DB.get();
        const t = s.tickets.find(x=>x.id===id);
        if (!t) return;
        const act = b.dataset.act;
        if (act==="cancel") { t.estado="cancelado"; toast("Solicitud cancelada"); }
        if (act==="accept") { t.estado="aceptada"; toast("Solicitud aceptada"); }
        DB.set(s); renderTickets(); renderAgenda(); renderSesiones();
      });
    });
  }

  if (formCreateTicket) {
    formCreateTicket.addEventListener("submit", (e)=>{
      e.preventDefault();
      const materia = $("#materia").value.trim();
      const tema = $("#tema").value.trim();
      const plazo = $("#plazo").value;
      if (!materia || !tema) return toast("Completa materia y tema");
      const s = DB.get();
      s.tickets.push({ id:"T"+Date.now(), materia, tema, plazo, estado:"pendiente" });
      DB.set(s);
      formCreateTicket.reset();
      toast("Solicitud creada");
      renderTickets();
    });
  }

  // ======= AGENDAR & SESIONES =======
  const formSchedule = $("#formSchedule");
  const tablaAgenda = $("#tablaAgenda tbody");
  const tablaSesiones = $("#tablaSesiones tbody");
  const btnCheckIn = $("#btnCheckIn");
  const btnCheckOut = $("#btnCheckOut");
  const timerDisplay = $("#timerDisplay");
  let activeSessionId = null, tick=null, startMs=null;

  function renderAgenda(){
    const s = DB.get();
    tablaAgenda.innerHTML = "";
    (s.agendas||[]).forEach(a=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${(s.tickets.find(t=>t.id===a.ticketId)||{}).materia||"—"}</td>
        <td>${new Date(a.inicio).toLocaleString()}</td>
        <td>${a.duracion}m</td>
        <td><button class="btn-secondary btn-sm" data-id="${a.id}" data-act="createSession">→</button></td>`;
      tablaAgenda.appendChild(tr);
    });
    tablaAgenda.querySelectorAll("button").forEach(b=> b.addEventListener("click", ()=>{
      const id = b.dataset.id;
      const s = DB.get();
      const a = s.agendas.find(x=>x.id===id);
      if(!a) return;
      s.sesiones.push({ id:"S"+Date.now(), inicio:a.inicio, dur:a.duracion, estado:"programada", checkIn:null, checkOut:null, confEst:false, confAsesor:false });
      DB.set(s);
      toast("Sesión creada");
      renderSesiones();
    }));
  }

  function renderSesiones(){
    const s = DB.get();
    tablaSesiones.innerHTML = "";
    let i=1;
    (s.sesiones||[]).forEach(ss=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i++}</td>
      <td>${new Date(ss.inicio).toLocaleString()}</td>
      <td>${ss.dur}m</td>
      <td>${ss.estado}</td>
      <td>
        <button class="btn-primary btn-sm" data-id="${ss.id}" data-act="start">Iniciar</button>
        <button class="btn-secondary btn-sm" data-id="${ss.id}" data-act="end">Finalizar</button>
      </td>`;
      tablaSesiones.appendChild(tr);
    });
    tablaSesiones.querySelectorAll("button").forEach(b=> b.addEventListener("click", ()=>{
      const id=b.dataset.id, act=b.dataset.act;
      if (act==="start") startSession(id);
      if (act==="end") endSession(id);
    }));
  }

  if (formSchedule) {
    formSchedule.addEventListener("submit", (e)=>{
      e.preventDefault();
      const ticketId = $("#ticketParaSesion").value;
      const inicio = $("#fechaHora").value;
      const dur = +($("#duracion").value||60);
      if (!ticketId) return toast("Selecciona un ticket aceptado");
      if (!inicio) return toast("Selecciona fecha y hora");
      const s = DB.get();
      s.agendas.push({ id:"A"+Date.now(), ticketId, inicio, duracion:dur });
      DB.set(s);
      formSchedule.reset();
      toast("Sesión agendada");
      renderAgenda();
    });
  }

  function startSession(id){
    const s = DB.get();
    const ss = s.sesiones.find(x=>x.id===id);
    if (!ss) return;
    if (activeSessionId) return toast("Ya hay una sesión activa");
    ss.estado = "activa";
    ss.checkIn = new Date().toISOString();
    DB.set(s);
    activeSessionId = id;
    startMs = Date.now();
    tick = setInterval(()=>{
      const diff = Date.now() - startMs;
      const h = String(Math.floor(diff/3600000)).padStart(2,"0");
      const m = String(Math.floor((diff%3600000)/60000)).padStart(2,"0");
      const sec = String(Math.floor((diff%60000)/1000)).padStart(2,"0");
      if (timerDisplay) timerDisplay.textContent = `${h}:${m}:${sec}`;
    }, 500);
    toast("Check-In (simulado)");
    renderSesiones();
  }

  function endSession(id){
    const s = DB.get();
    const ss = s.sesiones.find(x=>x.id===id);
    if (!ss || !ss.checkIn) return toast("No hay sesión activa para finalizar");
    ss.checkOut = new Date().toISOString();
    ss.estado = "finalizada";
    ss.confAsesor = true;
    // Confirmación del estudiante (simulada)
    setTimeout(()=>{
      ss.confEst = true;
      // Sumar horas confirmadas
      const mins = Math.round((new Date(ss.checkOut) - new Date(ss.checkIn))/60000);
      s.horasConfirmadas = (s.horasConfirmadas||0) + mins/60;
      DB.set(s);
      renderReporte();
      toast("Sesión confirmada por el estudiante (simulado)");
    }, 600);

    DB.set(s);
    clearInterval(tick); tick=null; activeSessionId=null; startMs=null;
    if (timerDisplay) timerDisplay.textContent = "00:00:00";
    renderSesiones();
  }

  // ======= CHAT =======
  const formChat = $("#formChat");
  const chatBox = $("#chatBox");
  function renderChat(){
    const s = DB.get();
    chatBox.innerHTML = "";
    (s.chats||[]).forEach(c=>{
      const div = document.createElement("div");
      div.className = "msg";
      div.innerHTML = `<div class="msg-meta">${new Date(c.ts).toLocaleString()}</div>
      <div class="msg-bubble">${c.text || ""}${c.file?`<div class="file">Archivo: ${c.file.name} (${Math.round(c.file.size/1024)} KB)</div>`:""}</div>`;
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  if (formChat) {
    formChat.addEventListener("submit", (e)=>{
      e.preventDefault();
      const msg = $("#chatMsg").value.trim();
      const file = $("#chatFile").files[0];
      if (!msg && !file) return;
      if (file && file.size > 5*1024*1024) return toast("Archivo demasiado grande (max 5MB)");
      const s = DB.get();
      s.chats.push({ id:"C"+Date.now(), text:msg, file: file ? { name:file.name, size:file.size } : null, ts:new Date().toISOString() });
      DB.set(s);
      $("#chatMsg").value = ""; $("#chatFile").value = "";
      renderChat();
    });
  }

  // ======= CRÉDITOS / REPORTE =======
  const totalHoras = $("#totalHoras");
  const totalCreditos = $("#totalCreditos");
  const tablaReporte = $("#tablaReporte tbody");
  const btnImprimir = $("#btnImprimir");
  const btnCSV = $("#btnCSV");

  function renderReporte(){
    const s = DB.get();
    const sesiones = (s.sesiones||[]).filter(ss => ss.checkIn && ss.checkOut);
    tablaReporte.innerHTML = "";
    sesiones.forEach(ss=>{
      const mins = Math.round((new Date(ss.checkOut)-new Date(ss.checkIn))/60000);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${new Date(ss.checkIn).toLocaleString()}</td>
        <td>${new Date(ss.checkOut).toLocaleString()}</td>
        <td>${mins}</td>
        <td>${(ss.confAsesor && ss.confEst) ? "Sí" : "No"}</td>`;
      tablaReporte.appendChild(tr);
    });
    const horas = (DB.get().horasConfirmadas||0);
    if (totalHoras) totalHoras.textContent = horas.toFixed(2);
    if (totalCreditos) totalCreditos.textContent = Math.floor(horas/16);
  }

  if (btnImprimir) btnImprimir.addEventListener("click", ()=> window.print());
  if (btnCSV) btnCSV.addEventListener("click", ()=>{
    const s = DB.get();
    const rows = (s.sesiones||[]).filter(ss=>ss.checkIn && ss.checkOut).map(ss=>{
      const mins = Math.round((new Date(ss.checkOut)-new Date(ss.checkIn))/60000);
      return [ss.checkIn, ss.checkOut, mins, (ss.confAsesor && ss.confEst) ? "Sí":"No"];
    });
    let csv = "Inicio,Fin,Dur(min),Confirmado\n"+rows.map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download="reporte_peerhive.csv"; a.click();
    URL.revokeObjectURL(url);
  });

  // Render inicial de secciones
  if (tablaTickets)   renderTickets();
  if (tablaAgenda)    renderAgenda();
  if (tablaSesiones)  renderSesiones();
  if (chatBox)        renderChat();
  if (tablaReporte)   renderReporte();
})();