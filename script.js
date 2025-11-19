// ===============================
// Estado global y utilidades
// ===============================

const STORAGE_KEY = "peerhive_demo_state";
const THEME_KEY = "peerhive_theme";

const DEMO_USERS = [
  {
    id: "u-admin",
    name: "Admin Demo",
    email: "admin@demo.com",
    password: "admin",
    role: "admin",
    subjects: [],
  },
  {
    id: "u-asesor",
    name: "Asesor Demo",
    email: "asesor@demo.com",
    password: "asesor",
    role: "advisor",
    subjects: ["Algoritmia"],
  },
  {
    id: "u-estudiante",
    name: "Estudiante Demo",
    email: "estudiante@demo.com",
    password: "estudiante",
    role: "student",
    subjects: [],
  },
];

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      users: DEMO_USERS,
      currentUserId: null,
      requests: [],
      sessions: [], // {id, requestId, studentId, advisorId, datetimeISO, status, teamsLink}
      reports: [],
    };
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.users || !parsed.users.length) parsed.users = DEMO_USERS;
    if (!parsed.sessions) parsed.sessions = [];
    return parsed;
  } catch {
    return {
      users: DEMO_USERS,
      currentUserId: null,
      requests: [],
      sessions: [],
      reports: [],
    };
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix = "id") {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

function getCurrentUser() {
  return state.users.find((u) => u.id === state.currentUserId) || null;
}

function findUserByEmail(email) {
  return state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Simula la generación de un enlace de Microsoft Teams.
 * En producción, aquí se llamaría a Microsoft Graph API /onlineMeetings.
 */
function generateTeamsLink(session) {
  const base = "https://teams.microsoft.com/l/meetup-join";
  // ID ficticio pero estable por sesión
  return `${base}/${encodeURIComponent(session.id)}?context=peerhive-demo`;
}

/* ======== Tema (claro / oscuro estilo Teams) ======== */

function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  const icon = toggle.querySelector("i");
  const label = toggle.querySelector("span");

  if (theme === "dark") {
    icon.className = "fa-regular fa-sun";
    label.textContent = "Claro";
  } else {
    icon.className = "fa-regular fa-moon";
    label.textContent = "Oscuro";
  }
}

// ===============================
// UI helpers
// ===============================

function showToast(message, type = "info") {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
  });
}

function switchView(viewId) {
  document.querySelectorAll(".view").forEach((v) => {
    v.hidden = v.id !== viewId;
  });
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    const target = btn.getAttribute("data-view");
    if (!target) return;
    btn.classList.toggle("active", target === viewId);
  });
}

// ===============================
// LOGIN
// ===============================

const formLogin = document.getElementById("form-login");
const topbarUser = document.getElementById("topbar-user");
const avatarInitials = document.getElementById("avatar-initials");
const userNameEl = document.getElementById("user-name");
const userEmailEl = document.getElementById("user-email");
const userRoleEl = document.getElementById("user-role");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    showToast("Correo o contraseña incorrectos", "error");
    return;
  }

  state.currentUserId = user.id;
  saveState();
  hydrateUserUI();
  refreshAll();
  switchView("view-dashboard");
  showToast(`Bienvenido, ${user.name}`, "success");
});

function hydrateUserUI() {
  const user = getCurrentUser();
  if (!user) {
    topbarUser.hidden = true;
    return;
  }
  topbarUser.hidden = false;
  const initials = (user.name || user.email)
    .split(" ")
    .map((x) => x[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  avatarInitials.textContent = initials;
  userNameEl.textContent = user.name;
  userEmailEl.textContent = user.email;
  userRoleEl.textContent =
    user.role === "admin"
      ? "Administrador"
      : user.role === "advisor"
      ? "Asesor"
      : "Estudiante";

  document.querySelectorAll(".nav-admin-only").forEach((btn) => {
    btn.style.display = user.role === "admin" ? "grid" : "none";
  });
}

// ===============================
// NAV LATERAL
// ===============================

document.querySelectorAll(".nav-btn[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const viewId = btn.getAttribute("data-view");
    const user = getCurrentUser();

    if (!user && viewId !== "view-login") {
      showToast("Primero inicia sesión", "info");
      switchView("view-login");
      return;
    }

    if (viewId === "view-advisor" && user.role !== "advisor") {
      showToast("Solo los asesores pueden ver este panel", "warning");
      return;
    }

    if (viewId === "view-reports" && user.role !== "admin") {
      showToast("Solo el administrador puede ver reportes", "warning");
      return;
    }

    switchView(viewId);
  });
});

document.getElementById("btn-logout").addEventListener("click", () => {
  state.currentUserId = null;
  saveState();
  hydrateUserUI();
  switchView("view-login");
  showToast("Sesión cerrada", "info");
});

// ===============================
// DASHBOARD
// ===============================

function getMyRequests() {
  const user = getCurrentUser();
  if (!user) return [];
  if (user.role === "student") {
    return state.requests.filter((r) => r.studentId === user.id);
  }
  if (user.role === "advisor") {
    return state.requests.filter(
      (r) => r.advisorId === user.id || !r.advisorId
    );
  }
  return state.requests;
}

function getMySessions() {
  const user = getCurrentUser();
  if (!user) return [];
  if (user.role === "student") {
    return state.sessions.filter((s) => s.studentId === user.id);
  }
  if (user.role === "advisor") {
    return state.sessions.filter((s) => s.advisorId === user.id);
  }
  return state.sessions;
}

function renderDashboardSummary() {
  const user = getCurrentUser();
  const cardRequests = document.getElementById("card-requests");
  const cardSessions = document.getElementById("card-sessions");
  const cardRole = document.getElementById("card-role");
  const statsList = document.getElementById("system-stats");

  if (!user) {
    cardRequests.innerHTML = "<p class='small muted'>Inicia sesión.</p>";
    cardSessions.innerHTML = "";
    cardRole.innerHTML = "";
    statsList.innerHTML = "";
    return;
  }

  const myReqs = getMyRequests();
  const mySessions = getMySessions();
  const pending = myReqs.filter((r) => r.status === "pendiente").length;
  const scheduled = mySessions.filter((s) => s.status === "agendada").length;

  cardRequests.innerHTML = `
    <h3>Solicitudes</h3>
    <p class="small muted">Total: ${myReqs.length}</p>
    <p class="small">Pendientes: <b>${pending}</b></p>
  `;

  cardSessions.innerHTML = `
    <h3>Sesiones</h3>
    <p class="small muted">Total: ${mySessions.length}</p>
    <p class="small">Agendadas: <b>${scheduled}</b></p>
  `;

  cardRole.innerHTML = `
    <h3>Rol actual</h3>
    <p class="small">${userRoleEl.textContent}</p>
  `;

  statsList.innerHTML = `
    <li>Usuarios registrados: <b>${state.users.length}</b></li>
    <li>Solicitudes totales: <b>${state.requests.length}</b></li>
    <li>Sesiones totales: <b>${state.sessions.length}</b></li>
  `;

  const upcomingContainer = document.getElementById("upcoming-sessions");
  upcomingContainer.innerHTML = "";
  const now = new Date();
  const upcoming = mySessions
    .filter((s) => new Date(s.datetimeISO) >= now)
    .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
    .slice(0, 5);

  if (!upcoming.length) {
    upcomingContainer.innerHTML =
      "<p class='small muted'>No tienes sesiones próximas.</p>";
  } else {
    upcoming.forEach((s) => {
      const req = state.requests.find((r) => r.id === s.requestId);
      const date = new Date(s.datetimeISO);
      const item = document.createElement("div");
      item.className = "list-item";
      item.innerHTML = `
        <div class="list-header">
          <span>${req?.subject || "Sesión"}</span>
          <span class="badge status-${s.status}">${s.status}</span>
        </div>
        <p class="small muted">
          ${date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
          })} ·
          ${date.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      `;
      upcomingContainer.appendChild(item);
    });
  }
}

// ===============================
// SOLICITUDES
// ===============================

const formRequest = document.getElementById("form-request");
formRequest.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user || user.role !== "student") {
    showToast("Solo los estudiantes pueden crear solicitudes", "warning");
    return;
  }

  const subject = document.getElementById("req-subject").value.trim();
  const topic = document.getElementById("req-topic").value.trim();
  const datetime = document.getElementById("req-datetime").value;
  const notes = document.getElementById("req-notes").value.trim();

  if (!subject || !topic || !datetime) {
    showToast("Completa todos los campos obligatorios", "error");
    return;
  }

  const req = {
    id: uid("req"),
    studentId: user.id,
    subject,
    topic,
    datetimeISO: datetime,
    notes,
    status: "pendiente",
    advisorId: null,
  };

  state.requests.push(req);
  saveState();
  formRequest.reset();
  refreshAll();
  showToast("Solicitud creada", "success");
});

function renderRequestsLists() {
  const user = getCurrentUser();
  const myContainer = document.getElementById("list-my-requests");
  const allContainer = document.getElementById("list-all-requests");

  myContainer.innerHTML = "";
  allContainer.innerHTML = "";

  if (!user) {
    myContainer.innerHTML = "<p class='small muted'>Inicia sesión.</p>";
    allContainer.innerHTML = "";
    return;
  }

  const myReqs = state.requests.filter((r) => r.studentId === user.id);
  if (!myReqs.length) {
    myContainer.innerHTML =
      "<p class='small muted'>No has creado solicitudes aún.</p>";
  } else {
    myReqs.forEach((r) => {
      const date = new Date(r.datetimeISO);
      const item = document.createElement("div");
      item.className = "list-item";
      const canCancel = r.status === "pendiente";
      item.innerHTML = `
        <div class="list-header">
          <span>${r.subject}</span>
          <span class="badge status-${r.status}">${r.status}</span>
        </div>
        <p class="small muted">
          ${r.topic}<br>
          ${date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
          })} ·
          ${date.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        ${
          canCancel
            ? `<div class="row-right mt-8">
                <button class="btn secondary btn-cancel-req" data-id="${r.id}">
                  Cancelar
                </button>
              </div>`
            : ""
        }
      `;
      myContainer.appendChild(item);
    });

    myContainer
      .querySelectorAll(".btn-cancel-req")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          cancelRequest(btn.getAttribute("data-id"))
        )
      );
  }

  if (user.role === "student") {
    allContainer.innerHTML =
      "<p class='small muted'>Vista solo para asesores y administrador.</p>";
    return;
  }

  if (!state.requests.length) {
    allContainer.innerHTML = "<p class='small muted'>No hay solicitudes.</p>";
    return;
  }

  state.requests
    .slice()
    .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
    .forEach((r) => {
      const date = new Date(r.datetimeISO);
      const student = state.users.find((u) => u.id === r.studentId);
      const isAdvisable =
        r.status === "pendiente" &&
        (user.role === "admin" ||
          user.role === "advisor" ||
          !r.advisorId ||
          r.advisorId === user.id);

      const item = document.createElement("div");
      item.className = "list-item";
      item.innerHTML = `
        <div class="list-header">
          <span>${r.subject}</span>
          <span class="badge status-${r.status}">${r.status}</span>
        </div>
        <p class="small muted">
          ${r.topic}<br>
          Estudiante: ${student?.name || "N/A"}<br>
          ${date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
          })} ·
          ${date.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        ${
          isAdvisable
            ? `<div class="row-right mt-8">
                <button class="btn primary btn-accept-req" data-id="${r.id}">
                  Aceptar
                </button>
              </div>`
            : ""
        }
      `;
      allContainer.appendChild(item);
    });

  allContainer
    .querySelectorAll(".btn-accept-req")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        acceptRequest(btn.getAttribute("data-id"))
      )
    );
}

function cancelRequest(id) {
  const req = state.requests.find((r) => r.id === id);
  if (!req || req.status !== "pendiente") return;
  req.status = "cancelada";
  saveState();
  refreshAll();
  showToast("Solicitud cancelada", "info");
}

function acceptRequest(id) {
  const user = getCurrentUser();
  if (!user || (user.role !== "advisor" && user.role !== "admin")) {
    showToast("Solo asesor o admin pueden aceptar solicitudes", "warning");
    return;
  }
  const req = state.requests.find((r) => r.id === id);
  if (!req || req.status !== "pendiente") return;

  req.status = "agendada";
  req.advisorId = user.id;

  const sessionBase = {
    id: uid("ses"),
    requestId: req.id,
    studentId: req.studentId,
    advisorId: req.advisorId,
    datetimeISO: req.datetimeISO,
    status: "agendada",
  };
  const session = {
    ...sessionBase,
    teamsLink: generateTeamsLink(sessionBase),
  };

  state.sessions.push(session);
  saveState();
  refreshAll();
  showToast("Solicitud aceptada y sesión agendada", "success");
}

// ===============================
// CALENDARIO
// ===============================

let calendar = null;

function initCalendar() {
  const calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek", // tipo Teams
    locale: "es",
    height: "100%",
    slotMinTime: "08:00:00",
    slotMaxTime: "22:00:00",
    allDaySlot: false,
    expandRows: true,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
  });
  calendar.render();
}

function refreshCalendar() {
  if (!calendar) return;
  const user = getCurrentUser();
  calendar.removeAllEvents();
  if (!user) return;

  const mySessions = getMySessions();

  mySessions.forEach((s) => {
    const req = state.requests.find((r) => r.id === s.requestId);
    calendar.addEvent({
      id: s.id,
      title: req ? `${req.subject} (${req.topic})` : "Sesión PeerHive",
      start: s.datetimeISO,
      allDay: false,
    });
  });
}

function renderSessionsList() {
  const user = getCurrentUser();
  const container = document.getElementById("list-sessions");
  container.innerHTML = "";

  if (!user) {
    container.innerHTML = "<p class='small muted'>Inicia sesión.</p>";
    return;
  }

  const mySessions = getMySessions();
  if (!mySessions.length) {
    container.innerHTML = "<p class='small muted'>Sin sesiones.</p>";
    return;
  }

  mySessions
    .slice()
    .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
    .forEach((s) => {
      const req = state.requests.find((r) => r.id === s.requestId);
      const date = new Date(s.datetimeISO);
      const canCancel = canCancelSession(s);
      const item = document.createElement("div");
      item.className = "list-item";
      item.innerHTML = `
        <div class="list-header">
          <span>${req?.subject || "Sesión"}</span>
          <span class="badge status-${s.status}">${s.status}</span>
        </div>
        <p class="small muted">
          ${req?.topic || ""}<br>
          ${date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
          })} ·
          ${date.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div class="row-right mt-8">
          ${
            s.teamsLink
              ? `<a href="${s.teamsLink}" target="_blank" rel="noopener" class="btn secondary">
                   Unirse en Teams
                 </a>`
              : ""
          }
          <button
            class="btn danger btn-cancel-session"
            data-id="${s.id}"
            ${canCancel ? "" : "disabled"}
          >
            Cancelar
          </button>
        </div>
      `;
      container.appendChild(item);
    });

  container
    .querySelectorAll(".btn-cancel-session")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        cancelSession(btn.getAttribute("data-id"))
      )
    );
}

function canCancelSession(session) {
  const now = new Date();
  const date = new Date(session.datetimeISO);
  const diff = date.getTime() - now.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  return diff > oneDay;
}

function cancelSession(id) {
  const session = state.sessions.find((s) => s.id === id);
  if (!session) return;
  if (!canCancelSession(session)) {
    showToast(
      "No puedes cancelar una sesión con menos de 1 día de anticipación",
      "warning"
    );
    return;
  }
  session.status = "cancelada";
  const req = state.requests.find((r) => r.id === session.requestId);
  if (req) req.status = "cancelada";
  saveState();
  refreshAll();
  showToast("Sesión cancelada", "info");
}

// ===============================
// PANEL ASESOR
// ===============================

const formSubjects = document.getElementById("form-subjects");

formSubjects.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user || user.role !== "advisor") {
    showToast("Solo un asesor puede guardar materias", "warning");
    return;
  }
  const selected = Array.from(
    formSubjects.querySelectorAll("input[type=checkbox]:checked")
  ).map((c) => c.value);
  user.subjects = selected;
  saveState();
  showToast("Materias actualizadas", "success");
});

function hydrateAdvisorSubjects() {
  const user = getCurrentUser();
  if (!user || user.role !== "advisor") {
    formSubjects
      .querySelectorAll("input[type=checkbox]")
      .forEach((c) => (c.checked = false));
    return;
  }
  const set = new Set(user.subjects || []);
  formSubjects
    .querySelectorAll("input[type=checkbox]")
    .forEach((c) => (c.checked = set.has(c.value)));
}

function renderAdvisorPanel() {
  const user = getCurrentUser();
  const reqContainer = document.getElementById("list-advisor-requests");
  const sessContainer = document.getElementById("list-advisor-sessions");

  reqContainer.innerHTML = "";
  sessContainer.innerHTML = "";

  if (!user || user.role !== "advisor") {
    reqContainer.innerHTML =
      "<p class='small muted'>Debes iniciar sesión como asesor.</p>";
    sessContainer.innerHTML = "";
    return;
  }

  const reqs = state.requests.filter(
    (r) =>
      r.status === "pendiente" &&
      (!r.advisorId || r.advisorId === user.id)
  );

  if (!reqs.length) {
    reqContainer.innerHTML =
      "<p class='small muted'>No tienes solicitudes pendientes.</p>";
  } else {
    reqs.forEach((r) => {
      const date = new Date(r.datetimeISO);
      const student = state.users.find((u) => u.id === r.studentId);
      const item = document.createElement("div");
      item.className = "list-item";
      item.innerHTML = `
        <div class="list-header">
          <span>${r.subject}</span>
          <span class="badge status-${r.status}">${r.status}</span>
        </div>
        <p class="small muted">
          ${r.topic}<br>
          Estudiante: ${student?.name || "N/A"}<br>
          ${date.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
          })} ·
          ${date.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div class="row-right mt-8">
          <button class="btn primary btn-accept-req-adv" data-id="${r.id}">
            Aceptar
          </button>
        </div>
      `;
      reqContainer.appendChild(item);
    });

    reqContainer
      .querySelectorAll(".btn-accept-req-adv")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          acceptRequest(btn.getAttribute("data-id"))
        )
      );
  }

  const mySessions = state.sessions.filter((s) => s.advisorId === user.id);
  if (!mySessions.length) {
    sessContainer.innerHTML =
      "<p class='small muted'>Aún no tienes sesiones agendadas.</p>";
  } else {
    mySessions
      .slice()
      .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
      .forEach((s) => {
        const req = state.requests.find((r) => r.id === s.requestId);
        const date = new Date(s.datetimeISO);
        const canCancel = canCancelSession(s);
        const item = document.createElement("div");
        item.className = "list-item";
        item.innerHTML = `
          <div class="list-header">
            <span>${req?.subject || "Sesión"}</span>
            <span class="badge status-${s.status}">${s.status}</span>
          </div>
          <p class="small muted">
            ${req?.topic || ""}<br>
            ${date.toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "short",
            })} ·
            ${date.toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <div class="row-right mt-8">
            ${
              s.teamsLink
                ? `<a href="${s.teamsLink}" target="_blank" rel="noopener" class="btn secondary">
                     Unirse en Teams
                   </a>`
                : ""
            }
            <button
              class="btn danger btn-cancel-session-adv"
              data-id="${s.id}"
              ${canCancel ? "" : "disabled"}
            >
              Cancelar
            </button>
          </div>
        `;
        sessContainer.appendChild(item);
      });

    sessContainer
      .querySelectorAll(".btn-cancel-session-adv")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          cancelSession(btn.getAttribute("data-id"))
        )
      );
  }
}

// ===============================
// REPORTES + CONTACTOS
// ===============================

function renderReports() {
  const user = getCurrentUser();
  const reportsList = document.getElementById("reports-list");
  reportsList.innerHTML = "";

  if (!user || user.role !== "admin") {
    reportsList.innerHTML =
      "<p class='small muted'>Solo el administrador puede ver esta sección.</p>";
    return;
  }

  const totalStudents = state.users.filter((u) => u.role === "student").length;
  const totalAdvisors = state.users.filter((u) => u.role === "advisor").length;

  reportsList.innerHTML = `
    <div class="list-item">
      <div class="list-header">
        <span>Resumen de la plataforma</span>
      </div>
      <p class="small">
        Usuarios totales: <b>${state.users.length}</b><br>
        Estudiantes: <b>${totalStudents}</b><br>
        Asesores: <b>${totalAdvisors}</b><br>
        Solicitudes: <b>${state.requests.length}</b><br>
        Sesiones: <b>${state.sessions.length}</b>
      </p>
    </div>
  `;
}

const contactSearch = document.getElementById("contact-search");
const contactList = document.getElementById("contact-list");

contactSearch?.addEventListener("input", () => renderContacts());

function renderContacts() {
  const user = getCurrentUser();
  if (!contactList) return;
  contactList.innerHTML = "";

  if (!user || user.role !== "admin") {
    contactList.innerHTML =
      "<p class='small muted'>Solo el administrador puede usar el buscador.</p>";
    return;
  }

  const q = (contactSearch.value || "").trim().toLowerCase();
  const users = state.users.filter((u) => {
    const str = `${u.name} ${u.email} ${u.role}`.toLowerCase();
    return str.includes(q);
  });

  if (!users.length) {
    contactList.innerHTML =
      "<p class='small muted'>No se encontraron usuarios.</p>";
    return;
  }

  users.forEach((u) => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div class="list-header">
        <span>${u.name}</span>
        <span class="badge">${u.role}</span>
      </div>
      <p class="small muted">${u.email}</p>
    `;
    contactList.appendChild(item);
  });
}

// ===============================
// REFRESH GLOBAL
// ===============================

function refreshAll() {
  hydrateUserUI();
  renderDashboardSummary();
  renderRequestsLists();
  renderSessionsList();
  renderAdvisorPanel();
  hydrateAdvisorSubjects();
  renderReports();
  renderContacts();
  refreshCalendar();
}

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // Tema
  applyTheme(loadTheme());
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme || loadTheme();
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  hydrateUserUI();
  initCalendar();
  refreshAll();

  if (getCurrentUser()) {
    switchView("view-dashboard");
  } else {
    switchView("view-login");
  }
});