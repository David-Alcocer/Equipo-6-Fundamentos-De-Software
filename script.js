// ===============================
// Estado global y utilidades MEJORADAS
// ===============================

const STORAGE_KEY = "peerhive_demo_state_v6";
const THEME_KEY = "peerhive_theme";

const TEAMS_CHANNEL_URL =
  "https://teams.microsoft.com/l/channel/19%3Aebad70e158df4074bc32a462198fdef7%40thread.tacv2/Sesiones%20de%20PeerHive?groupId=4aa306ac-74b2-4fe4-83eb-98fb1956bcc1&tenantId=2b83ac9e-2448-45df-9319-48d86236a5ea&ngc=true";

// Función de hash básica para seguridad en demo
function hashPassword(password) {
  return btoa(password + '_peerhive_salt_demo_v2');
}

const DEMO_USERS = [
  {
    id: "u-admin",
    name: "Admin Demo",
    email: "admin@demo.com",
    password: hashPassword("admin"),
    role: "admin",
    subjects: [],
    isAdvisorApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "u-asesor",
    name: "Asesor Demo",
    email: "asesor@demo.com",
    password: hashPassword("asesor"),
    role: "advisor",
    subjects: ["Algoritmia", "Programación Orientada a Objetos"],
    isAdvisorApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "u-estudiante",
    name: "Estudiante Demo",
    email: "estudiante@demo.com",
    password: hashPassword("estudiante"),
    role: "student",
    subjects: [],
    isAdvisorApproved: false,
    createdAt: new Date().toISOString()
  },
];

// Clase para gestión robusta del estado
class AppState {
  constructor() {
    this._state = this.loadState();
  }

  loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        users: DEMO_USERS,
        currentUserId: null,
        requests: [],
        sessions: [],
        reports: [],
        chats: [],
        lastUpdate: new Date().toISOString()
      };
    }

    try {
      const parsed = JSON.parse(raw);
      
      // Validar y normalizar estructura
      if (!parsed.users || !Array.isArray(parsed.users)) {
        parsed.users = DEMO_USERS;
      }
      
      if (!parsed.requests || !Array.isArray(parsed.requests)) {
        parsed.requests = [];
      }
      
      if (!parsed.sessions || !Array.isArray(parsed.sessions)) {
        parsed.sessions = [];
      }
      
      if (!parsed.chats || !Array.isArray(parsed.chats)) {
        parsed.chats = [];
      }

      // Normalizar campos nuevos en usuarios existentes
      parsed.users.forEach(u => {
        if (u.role === 'advisor' && typeof u.isAdvisorApproved !== 'boolean') {
          u.isAdvisorApproved = true;
        }
        // Asegurar que todos los usuarios tengan array de subjects
        if (!u.subjects) u.subjects = [];
        // Asegurar fecha de creación
        if (!u.createdAt) u.createdAt = new Date().toISOString();
      });

      parsed.lastUpdate = parsed.lastUpdate || new Date().toISOString();
      
      return parsed;
    } catch (error) {
      console.error('Error loading state:', error);
      return {
        users: DEMO_USERS,
        currentUserId: null,
        requests: [],
        sessions: [],
        reports: [],
        chats: [],
        lastUpdate: new Date().toISOString()
      };
    }
  }

  saveState() {
    try {
      this._state.lastUpdate = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
    } catch (error) {
      console.error('Error saving state:', error);
      showToast('Error al guardar los datos', 'error');
    }
  }

  get state() {
    return this._state;
  }

  setState(updates) {
    this._state = { ...this._state, ...updates };
    this.saveState();
  }

  // Getters específicos
  get users() { return this._state.users; }
  get currentUserId() { return this._state.currentUserId; }
  get requests() { return this._state.requests; }
  get sessions() { return this._state.sessions; }
  get chats() { return this._state.chats; }

  set currentUserId(id) {
    this._state.currentUserId = id;
    this.saveState();
  }
}

// Instancia global del estado
const appState = new AppState();
let state = appState.state; // Referencia para compatibilidad
let currentChatId = null;
let currentAuthTab = 'login';

// Utilidades mejoradas
function uid(prefix = "id") {
  return prefix + "_" + Math.random().toString(36).slice(2, 9) + "_" + Date.now().toString(36);
}

function getCurrentUser() {
  return state.users.find(u => u.id === state.currentUserId) || null;
}

function findUserByEmail(email) {
  return state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function verifyPassword(input, stored) {
  return hashPassword(input) === stored;
}

function generateTeamsChannelLink() {
  return TEAMS_CHANNEL_URL;
}

// ===============================
// Gestión de Tema MEJORADA
// ===============================

function loadTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    
    // Detección de preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  } catch (error) {
    return 'dark';
  }
}

function applyTheme(theme) {
  try {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);

    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const icon = toggle.querySelector('i');
    const label = toggle.querySelector('span');

    if (theme === 'dark') {
      icon.className = 'fa-regular fa-sun';
      label.textContent = 'Claro';
    } else {
      icon.className = 'fa-regular fa-moon';
      label.textContent = 'Oscuro';
    }
  } catch (error) {
    console.error('Error applying theme:', error);
  }
}

// ===============================
// UI helpers MEJORADOS
// ===============================

function showToast(message, type = 'info') {
  try {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error('Error showing toast:', error);
    // Fallback básico
    alert(message);
  }
}

function switchView(viewId) {
  try {
    document.querySelectorAll('.view').forEach(v => {
      v.hidden = v.id !== viewId;
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      const target = btn.getAttribute('data-view');
      if (!target) return;
      btn.classList.toggle('active', target === viewId);
    });

    // Renderizado específico por vista
    const viewRenderers = {
      'view-dashboard': renderDashboard,
      'view-requests': renderRequests,
      'view-calendar': renderCalendarEvents,
      'view-advisor': renderAdvisorPanel,
      'view-chat': () => { renderChatList(); renderChatMessages(); },
      'view-settings': hydrateSettings,
      'view-reports': renderReports
    };

    if (viewRenderers[viewId]) {
      viewRenderers[viewId]();
    }
  } catch (error) {
    console.error('Error switching view:', error);
    showToast('Error al cambiar de vista', 'error');
  }
}

// Gestión de estados de loading en botones
function setButtonLoading(button, isLoading) {
  if (!button) return;
  
  if (isLoading) {
    button.disabled = true;
    button.classList.add('loading');
  } else {
    button.disabled = false;
    button.classList.remove('loading');
  }
}

// Debounce para mejor performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Función de escape HTML para seguridad básica
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ===============================
// GESTIÓN DE AUTENTICACIÓN MEJORADA
// ===============================

// Inicializar pantalla de auth
function initAuthScreen() {
  // Mostrar pantalla de auth al inicio
  document.getElementById('auth-screen').style.display = 'flex';
  document.querySelector('.app').style.display = 'none';
  
  setupAuthTabs();
  setupDemoAccounts();
  setupRoleSelection();
  setupFileUpload();
  setupPasswordStrength();
}

// Configurar pestañas de auth
function setupAuthTabs() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      switchAuthTab(targetTab);
    });
  });
}

function switchAuthTab(tabName) {
  // Actualizar pestañas activas
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
  });
  
  document.querySelectorAll('.auth-content').forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}-tab`);
  });
  
  currentAuthTab = tabName;
}

// Configurar cuentas demo
function setupDemoAccounts() {
  document.querySelectorAll('.demo-account-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email');
      const password = btn.getAttribute('data-password');
      
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = password;
      
      // Enfocar en el formulario de login
      switchAuthTab('login');
      
      showToast(`Cuenta demo cargada: ${email.split('@')[0]}`, 'info');
    });
  });
}

// Configurar selección de rol
function setupRoleSelection() {
  document.querySelectorAll('input[name="signup-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const isAdvisor = e.target.value === 'advisor';
      document.getElementById('signup-advisor-extra').style.display = 
        isAdvisor ? 'block' : 'none';
    });
  });
}

// Configurar upload de archivos
function setupFileUpload() {
  const uploadArea = document.getElementById('kardex-upload-area');
  const fileInput = document.getElementById('signup-kardex');
  const preview = document.getElementById('kardex-preview');

  if (!uploadArea || !fileInput) return;

  uploadArea.addEventListener('click', () => fileInput.click());
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelection(e.dataTransfer.files[0]);
    }
  });
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFileSelection(e.target.files[0]);
    }
  });
}

function handleFileSelection(file) {
  if (file.type !== 'application/pdf') {
    showToast('Solo se permiten archivos PDF', 'error');
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    showToast('El archivo debe ser menor a 2MB', 'error');
    return;
  }
  
  const preview = document.getElementById('kardex-preview');
  preview.innerHTML = `
    <i class="fa-solid fa-file-pdf"></i>
    <div>
      <strong>${file.name}</strong>
      <div>${(file.size / 1024 / 1024).toFixed(2)} MB</div>
    </div>
    <button type="button" class="remove-file" onclick="removeKardexFile()">
      <i class="fa-solid fa-times"></i>
    </button>
  `;
  preview.style.display = 'flex';
}

function removeKardexFile() {
  document.getElementById('signup-kardex').value = '';
  document.getElementById('kardex-preview').style.display = 'none';
}

// Configurar indicador de fuerza de contraseña
function setupPasswordStrength() {
  const passwordInput = document.getElementById('signup-password');
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text');
  
  if (!passwordInput || !strengthBar) return;
  
  passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    
    strengthBar.style.setProperty('--strength-width', `${strength.score * 25}%`);
    strengthBar.style.setProperty('--strength-color', strength.color);
    strengthText.textContent = strength.text;
    strengthText.style.color = strength.color;
  });
}

function calculatePasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
  if (password.match(/\d/)) score++;
  if (password.match(/[^a-zA-Z\d]/)) score++;
  
  const strengths = [
    { score: 0, color: '#ef4444', text: 'Muy débil' },
    { score: 1, color: '#f59e0b', text: 'Débil' },
    { score: 2, color: '#eab308', text: 'Regular' },
    { score: 3, color: '#84cc16', text: 'Fuerte' },
    { score: 4, color: '#22c55e', text: 'Muy fuerte' }
  ];
  
  return strengths[Math.min(score, 4)];
}

// ===============================
// LOGIN MEJORADO
// ===============================

const formLogin = document.getElementById('form-login');
const loginSubmitBtn = document.getElementById('login-submit-btn');

formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = loginSubmitBtn;
  setButtonLoading(submitBtn, true);

  try {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
      showToast('Completa todos los campos', 'warning');
      return;
    }

    const user = findUserByEmail(email);
    if (!user || !verifyPassword(password, user.password)) {
      showToast('Credenciales inválidas', 'error');
      return;
    }

    if (user.role === 'advisor' && user.isAdvisorApproved === false) {
      showToast('Tu cuenta de asesor está en revisión. Te notificaremos cuando sea aprobada.', 'info');
      return;
    }

    // Simular proceso async
    await new Promise(resolve => setTimeout(resolve, 800));

    appState.currentUserId = user.id;
    showMainApp();
    showToast(`¡Bienvenido de vuelta, ${user.name}!`, 'success');
    
  } catch (error) {
    console.error('Login error:', error);
    showToast('Error al iniciar sesión', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});

// ===============================
// REGISTRO UADY MEJORADO
// ===============================

const formSignup = document.getElementById('form-signup');
const signupSubmitBtn = document.getElementById('signup-submit-btn');

formSignup?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = signupSubmitBtn;
  setButtonLoading(submitBtn, true);

  try {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const type = document.querySelector('input[name="signup-type"]:checked').value;

    if (!name || !email || !password) {
      showToast('Completa todos los campos de registro', 'warning');
      return;
    }

    // Validar formato UADY
    const uadyPattern = /^a\d{8}@alumnos\.uady\.mx$/i;
    if (!uadyPattern.test(email)) {
      showToast('El correo debe ser institucional UADY (a########@alumnos.uady.mx)', 'error');
      return;
    }

    if (findUserByEmail(email)) {
      showToast('Ya existe un usuario con ese correo', 'error');
      return;
    }

    let advisorSubject = null;
    let advisorKardex = null;
    let role = 'student';
    let isAdvisorApproved = false;

    if (type === 'advisor') {
      advisorSubject = document.getElementById('signup-subject').value.trim();
      const kardexFile = document.getElementById('signup-kardex').files[0];

      if (!advisorSubject) {
        showToast('Indica la materia que deseas asesorar', 'warning');
        return;
      }

      if (!kardexFile) {
        showToast('Debes adjuntar tu kardex en PDF para registrarte como asesor', 'warning');
        return;
      }

      if (kardexFile.type !== 'application/pdf') {
        showToast('El kardex debe ser un archivo PDF', 'error');
        return;
      }

      if (kardexFile.size > 2 * 1024 * 1024) {
        showToast('El kardex debe pesar máximo 2 MB', 'error');
        return;
      }

      role = 'advisor';
      isAdvisorApproved = false;

      // Procesar kardex
      advisorKardex = await processKardexFile(kardexFile);
    }

    // Crear usuario
    await createUserAfterSignup({
      name, email, password, role, advisorSubject, advisorKardex, isAdvisorApproved
    });

  } catch (error) {
    console.error('Signup error:', error);
    showToast(error.message || 'Error en el registro', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});

async function processKardexFile(file) {
  return new Promise((resolve, reject) => {
    // Para archivos grandes, solo metadata
    if (file.size > 500000) {
      resolve({
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        size: file.size,
        status: 'uploaded'
      });
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          dataUrl: reader.result,
          size: file.size,
          status: 'processed'
        });
      };
      reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
      reader.readAsDataURL(file);
    }
  });
}

async function createUserAfterSignup(userData) {
  // Simular proceso async
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newUser = {
    id: uid('u'),
    name: userData.name,
    email: userData.email,
    password: hashPassword(userData.password),
    role: userData.role,
    subjects: [],
    advisorSubject: userData.advisorSubject || null,
    advisorKardex: userData.advisorKardex || null,
    isAdvisorApproved: userData.role === 'advisor' ? userData.isAdvisorApproved : false,
    createdAt: new Date().toISOString()
  };

  state.users.push(newUser);
  appState.saveState();
  formSignup.reset();
  document.getElementById('signup-advisor-extra').style.display = 'none';
  removeKardexFile();
  updateSystemStats();
  renderContacts();

  if (userData.role === 'advisor') {
    showToast('Registro enviado. Tu solicitud para ser asesor está en revisión.', 'success');
    // Cambiar a pestaña de login
    switchAuthTab('login');
  } else {
    showToast('Estudiante registrado exitosamente. Ahora puedes iniciar sesión.', 'success');
    switchAuthTab('login');
  }
}

// ===============================
// MOSTRAR APLICACIÓN PRINCIPAL
// ===============================

function showMainApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.querySelector('.app').style.display = 'grid';
  
  const user = getCurrentUser();
  if (user) {
    updateTopbarUser();
    switchView('view-dashboard');
    renderDashboard();
    renderRequests();
    renderAdvisorPanel();
    renderCalendarEvents();
  }
}

// ===============================
// TOPBAR + NAV MEJORADO
// ===============================

const topbarUser = document.getElementById('topbar-user');
const avatarInitials = document.getElementById('avatar-initials');
const userNameEl = document.getElementById('user-name');
const userEmailEl = document.getElementById('user-email');
const userRoleEl = document.getElementById('user-role');
const btnLogout = document.getElementById('btn-logout');
const systemStats = document.getElementById('system-stats');

function updateTopbarUser() {
  try {
    const user = getCurrentUser();
    if (!user) {
      topbarUser.hidden = true;
      document.querySelectorAll('.nav-admin-only').forEach(btn => {
        btn.style.display = 'none';
      });
      return;
    }

    topbarUser.hidden = false;
    userNameEl.textContent = user.name;
    userEmailEl.textContent = user.email;
    userRoleEl.textContent = user.role === 'admin' ? 'Administrador' : 
                            user.role === 'advisor' ? 'Asesor' : 'Estudiante';

    const initials = (user.name || user.email)
      .split(' ')
      .map(p => p[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase();

    avatarInitials.textContent = initials;

    document.querySelectorAll('.nav-admin-only').forEach(btn => {
      btn.style.display = user.role === 'admin' ? 'grid' : 'none';
    });
  } catch (error) {
    console.error('Error updating topbar:', error);
  }
}

function updateSystemStats() {
  if (!systemStats) return;
  
  try {
    const totalUsers = state.users.length;
    const totalRequests = state.requests.length;
    const totalSessions = state.sessions.length;
    const pendingAdvisors = state.users.filter(u => 
      u.role === 'advisor' && !u.isAdvisorApproved
    ).length;

    systemStats.innerHTML = `
      <li>Total usuarios: <b>${totalUsers}</b></li>
      <li>Solicitudes registradas: <b>${totalRequests}</b></li>
      <li>Sesiones agendadas: <b>${totalSessions}</b></li>
      ${pendingAdvisors > 0 ? `<li>Asesores pendientes: <b>${pendingAdvisors}</b></li>` : ''}
    `;
  } catch (error) {
    console.error('Error updating system stats:', error);
  }
}

// Logout
btnLogout?.addEventListener('click', () => {
  appState.currentUserId = null;
  currentChatId = null;
  document.querySelector('.app').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  updateSystemStats();
  showToast('Sesión cerrada', 'info');
});

// ===============================
// SOLICITUDES MEJORADO
// ===============================

const formRequest = document.getElementById('form-request');
const listMyRequests = document.getElementById('list-my-requests');
const listAllRequests = document.getElementById('list-all-requests');
const requestSubmitBtn = document.getElementById('request-submit-btn');

formRequest?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = requestSubmitBtn;
  setButtonLoading(submitBtn, true);

  try {
    const user = getCurrentUser();
    if (!user || (user.role !== 'student' && user.role !== 'admin')) {
      showToast('Solo estudiantes o administrador pueden crear solicitudes', 'error');
      return;
    }

    const subject = document.getElementById('req-subject').value.trim();
    const topic = document.getElementById('req-topic').value.trim();
    const datetimeISO = document.getElementById('req-datetime').value;
    const notes = document.getElementById('req-notes').value.trim();

    if (!subject || !topic || !datetimeISO) {
      showToast('Completa los campos requeridos', 'warning');
      return;
    }

    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(datetimeISO);
    if (selectedDate < new Date()) {
      showToast('La fecha y hora deben ser futuras', 'error');
      return;
    }

    // Simular proceso async
    await new Promise(resolve => setTimeout(resolve, 800));

    const request = {
      id: uid('req'),
      studentId: user.id,
      subject,
      topic,
      datetimeISO,
      notes,
      status: 'pendiente',
      advisorId: null,
      createdAt: new Date().toISOString()
    };

    state.requests.push(request);
    appState.saveState();
    formRequest.reset();
    showToast('Solicitud creada exitosamente', 'success');
    
    // Renderizado específico en lugar de completo
    renderRequests();
    renderDashboard();
    
  } catch (error) {
    console.error('Error creating request:', error);
    showToast('Error al crear la solicitud', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});

function renderRequests() {
  const user = getCurrentUser();
  if (!user) return;

  try {
    // Mis solicitudes
    if (listMyRequests) {
      listMyRequests.innerHTML = '';
      const myReqs = (user.role === 'student' || user.role === 'admin') 
        ? state.requests.filter(r => r.studentId === user.id)
        : [];

      if (!myReqs.length) {
        listMyRequests.innerHTML = '<div class="muted small">Aún no tienes solicitudes.</div>';
      } else {
        myReqs
          .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
          .forEach(req => {
            const li = document.createElement('div');
            li.className = 'list-item';
            li.innerHTML = `
              <div class="list-header">
                <span><b>${escapeHtml(req.subject)}</b> · ${escapeHtml(req.topic)}</span>
                <span class="badge status-${req.status}">
                  ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
              <div class="mt-8 small">
                ${new Date(req.datetimeISO).toLocaleString()}
              </div>
              ${req.notes ? `<div class="mt-8 small muted">${escapeHtml(req.notes)}</div>` : ''}
            `;
            listMyRequests.appendChild(li);
          });
      }
    }

    // Todas las solicitudes (asesor/admin)
    if (listAllRequests) {
      listAllRequests.innerHTML = '';
      if (user.role === 'advisor' || user.role === 'admin') {
        if (!state.requests.length) {
          listAllRequests.innerHTML = '<div class="muted small">Aún no hay solicitudes.</div>';
        } else {
          state.requests
            .slice()
            .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
            .forEach(req => {
              const student = state.users.find(u => u.id === req.studentId);
              const advisor = req.advisorId && state.users.find(u => u.id === req.advisorId);

              const li = document.createElement('div');
              li.className = 'list-item';

              li.innerHTML = `
                <div class="list-header">
                  <span><b>${escapeHtml(req.subject)}</b> · ${escapeHtml(req.topic)}</span>
                  <span class="badge status-${req.status}">
                    ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
                <div class="mt-8 small">
                  ${new Date(req.datetimeISO).toLocaleString()}
                </div>
                <div class="mt-8 small muted">
                  Estudiante: ${student ? escapeHtml(student.name) : 'Desconocido'}
                </div>
                <div class="mt-8 small muted">
                  Asesor: ${advisor ? escapeHtml(advisor.name) : 'Sin asignar'}
                </div>
              `;

              if (req.status === 'pendiente' && (user.role === 'advisor' || user.role === 'admin')) {
                const btn = document.createElement('button');
                btn.textContent = 'Aceptar y agendar';
                btn.className = 'btn primary mt-8';
                btn.addEventListener('click', () => {
                  assignRequestToAdvisor(req.id, user.id);
                });
                li.appendChild(btn);
              }

              listAllRequests.appendChild(li);
            });
        }
      } else {
        listAllRequests.innerHTML = '<div class="muted small">Esta sección es para asesores y administrador.</div>';
      }
    }

    renderAdvisorPanel();
  } catch (error) {
    console.error('Error rendering requests:', error);
  }
}

// Asignar solicitud -> sesión + chat
async function assignRequestToAdvisor(requestId, advisorId) {
  try {
    const req = state.requests.find(r => r.id === requestId);
    if (!req) {
      showToast('Solicitud no encontrada', 'error');
      return;
    }

    if (req.status !== 'pendiente') {
      showToast('Esta solicitud ya fue procesada', 'warning');
      return;
    }

    // Simular proceso async
    await new Promise(resolve => setTimeout(resolve, 1000));

    const session = {
      id: uid('ses'),
      requestId: req.id,
      studentId: req.studentId,
      advisorId,
      datetimeISO: req.datetimeISO,
      status: 'agendada',
      teamsLink: generateTeamsChannelLink(),
      createdAt: new Date().toISOString()
    };

    state.sessions.push(session);

    // Actualizar solicitud
    req.status = 'agendada';
    req.advisorId = advisorId;

    // Crear chat
    if (!state.chats) state.chats = [];
    const chat = {
      id: uid('chat'),
      sessionId: session.id,
      studentId: req.studentId,
      advisorId: advisorId,
      messages: [],
      createdAt: new Date().toISOString()
    };
    state.chats.push(chat);
    currentChatId = chat.id;

    appState.saveState();
    showToast('Solicitud asignada, sesión agendada y chat creado', 'success');
    
    // Renderizado específico
    renderRequests();
    renderAdvisorPanel();
    renderCalendarEvents();
    renderChatList();
    renderChatMessages();
    
    switchView('view-chat');
  } catch (error) {
    console.error('Error assigning request:', error);
    showToast('Error al procesar la solicitud', 'error');
  }
}

// ===============================
// PANEL ASESOR MEJORADO
// ===============================

const formSubjects = document.getElementById('form-subjects');
const listAdvisorRequests = document.getElementById('list-advisor-requests');
const listAdvisorSessions = document.getElementById('list-advisor-sessions');
const subjectsSubmitBtn = document.getElementById('subjects-submit-btn');

formSubjects?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = subjectsSubmitBtn;
  setButtonLoading(submitBtn, true);

  try {
    const user = getCurrentUser();
    if (!user || (user.role !== 'advisor' && user.role !== 'admin')) {
      showToast('Solo asesores o admin pueden configurar materias', 'error');
      return;
    }

    const checks = formSubjects.querySelectorAll('input[type=checkbox]');
    user.subjects = Array.from(checks)
      .filter(c => c.checked)
      .map(c => c.value);

    // Simular proceso async
    await new Promise(resolve => setTimeout(resolve, 800));

    appState.saveState();
    showToast('Materias guardadas exitosamente', 'success');
    renderAdvisorPanel();
  } catch (error) {
    console.error('Error saving subjects:', error);
    showToast('Error al guardar las materias', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});

function renderAdvisorPanel() {
  const user = getCurrentUser();
  if (!user || (user.role !== 'advisor' && user.role !== 'admin')) {
    if (listAdvisorRequests) {
      listAdvisorRequests.innerHTML = '<div class="muted small">Disponible solo para asesores y admin.</div>';
    }
    if (listAdvisorSessions) {
      listAdvisorSessions.innerHTML = '<div class="muted small">Disponible solo para asesores y admin.</div>';
    }
    return;
  }

  try {
    // Marcar checkboxes según subjects
    const checks = formSubjects?.querySelectorAll('input[type=checkbox]');
    checks?.forEach(c => {
      c.checked = (user.subjects || []).includes(c.value);
    });

    // Solicitudes relevantes
    if (listAdvisorRequests) {
      listAdvisorRequests.innerHTML = '';
      const mySubjects = user.subjects || [];

      const relevantRequests = user.role === 'admin' 
        ? state.requests
        : state.requests.filter(r => {
            const subjectMatch = mySubjects.length ? mySubjects.includes(r.subject) : true;
            const noAdvisor = !r.advisorId;
            return subjectMatch && (noAdvisor || r.advisorId === user.id);
          });

      if (!relevantRequests.length) {
        listAdvisorRequests.innerHTML = '<div class="muted small">No hay solicitudes pendientes.</div>';
      } else {
        relevantRequests
          .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
          .forEach(req => {
            const student = state.users.find(u => u.id === req.studentId);
            const li = document.createElement('div');
            li.className = 'list-item';
            li.innerHTML = `
              <div class="list-header">
                <span><b>${escapeHtml(req.subject)}</b> · ${escapeHtml(req.topic)}</span>
                <span class="badge status-${req.status}">
                  ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
              <div class="mt-8 small">
                ${new Date(req.datetimeISO).toLocaleString()}
              </div>
              <div class="mt-8 small muted">
                Estudiante: ${student ? escapeHtml(student.name) : 'Desconocido'}
              </div>
            `;

            if (req.status === 'pendiente') {
              const btn = document.createElement('button');
              btn.textContent = 'Aceptar y agendar';
              btn.className = 'btn primary mt-8';
              btn.addEventListener('click', () => {
                assignRequestToAdvisor(req.id, user.id);
              });
              li.appendChild(btn);
            }

            listAdvisorRequests.appendChild(li);
          });
      }
    }

    // Sesiones
    if (listAdvisorSessions) {
      listAdvisorSessions.innerHTML = '';
      const mySessions = user.role === 'admin' 
        ? state.sessions
        : state.sessions.filter(s => s.advisorId === user.id);

      if (!mySessions.length) {
        listAdvisorSessions.innerHTML = '<div class="muted small">Aún no tienes sesiones.</div>';
      } else {
        mySessions
          .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
          .forEach(ses => {
            const student = state.users.find(u => u.id === ses.studentId);
            const li = document.createElement('div');
            li.className = 'list-item';
            li.innerHTML = `
              <div class="list-header">
                <span><b>${new Date(ses.datetimeISO).toLocaleString()}</b></span>
                <span class="badge status-${ses.status}">
                  ${ses.status.charAt(0).toUpperCase() + ses.status.slice(1)}
                </span>
              </div>
              <div class="mt-8 small muted">
                Estudiante: ${student ? escapeHtml(student.name) : 'Desconocido'}
              </div>
              <div class="mt-8 small">
                <a href="${ses.teamsLink}" target="_blank" rel="noopener noreferrer">
                  Abrir canal de Teams (Sesiones de PeerHive)
                </a>
              </div>
            `;
            listAdvisorSessions.appendChild(li);
          });
      }
    }
  } catch (error) {
    console.error('Error rendering advisor panel:', error);
  }
}

// ===============================
// CALENDARIO MEJORADO
// ===============================

const listSessions = document.getElementById('list-sessions');
let calendar;

function initCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  try {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'es',
      height: '100%',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth',
      },
      eventClick: function(info) {
        const sesId = info.event.extendedProps.sessionId;
        const ses = state.sessions.find(s => s.id === sesId);
        if (!ses) return;
        const student = state.users.find(u => u.id === ses.studentId);
        const advisor = state.users.find(u => u.id === ses.advisorId);

        Swal.fire({
          title: 'Sesión agendada',
          html: `
            <p><b>Fecha y hora:</b> ${new Date(ses.datetimeISO).toLocaleString()}</p>
            <p><b>Estudiante:</b> ${student ? escapeHtml(student.name) : 'Desconocido'}</p>
            <p><b>Asesor:</b> ${advisor ? escapeHtml(advisor.name) : 'Desconocido'}</p>
            <p><b>Canal de Teams:</b><br>
              <a href="${ses.teamsLink}" target="_blank" rel="noopener noreferrer">${ses.teamsLink}</a>
            </p>
          `,
          icon: 'info',
        });
      },
    });

    calendar.render();
    renderCalendarEvents();
  } catch (error) {
    console.error('Error initializing calendar:', error);
  }
}

function getVisibleSessionsForUser() {
  const user = getCurrentUser();
  if (!user) return [];

  if (user.role === 'student') {
    return state.sessions.filter(s => s.studentId === user.id);
  }
  if (user.role === 'advisor') {
    return state.sessions.filter(s => s.advisorId === user.id);
  }
  // admin ve todo
  return state.sessions;
}

function renderCalendarEvents() {
  if (!calendar) return;

  const user = getCurrentUser();
  if (!user) return;

  try {
    const visibleSessions = getVisibleSessionsForUser();

    calendar.removeAllEvents();

    visibleSessions.forEach(ses => {
      const req = state.requests.find(r => r.id === ses.requestId);
      const title = req ? `${req.subject} · ${req.topic}` : 'Sesión de asesoría';

      calendar.addEvent({
        title: escapeHtml(title),
        start: ses.datetimeISO,
        end: new Date(new Date(ses.datetimeISO).getTime() + 60 * 60 * 1000),
        sessionId: ses.id,
      });
    });

    if (listSessions) {
      listSessions.innerHTML = '';
      if (!visibleSessions.length) {
        listSessions.innerHTML = '<div class="muted small">No hay sesiones agendadas.</div>';
      } else {
        visibleSessions
          .slice()
          .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
          .forEach(ses => {
            const req = state.requests.find(r => r.id === ses.requestId);
            const student = state.users.find(u => u.id === ses.studentId);
            const advisor = state.users.find(u => u.id === ses.advisorId);

            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
              <div class="list-header">
                <span><b>${req ? escapeHtml(req.subject) : 'Sesión de asesoría'}</b></span>
                <span class="badge status-${ses.status}">
                  ${ses.status.charAt(0).toUpperCase() + ses.status.slice(1)}
                </span>
              </div>
              <div class="mt-8 small">
                ${new Date(ses.datetimeISO).toLocaleString()}
              </div>
              <div class="mt-8 small muted">
                Estudiante: ${student ? escapeHtml(student.name) : 'Desconocido'}
              </div>
              <div class="mt-8 small muted">
                Asesor: ${advisor ? escapeHtml(advisor.name) : 'Desconocido'}
              </div>
              <div class="mt-8 small">
                <a href="${ses.teamsLink}" target="_blank" rel="noopener noreferrer">
                  Abrir canal de Teams (Sesiones de PeerHive)
                </a>
              </div>
            `;
            listSessions.appendChild(div);
          });
      }
    }
  } catch (error) {
    console.error('Error rendering calendar events:', error);
  }
}

// ===============================
// DASHBOARD MEJORADO
// ===============================

const cardRequests = document.getElementById('card-requests');
const cardSessions = document.getElementById('card-sessions');
const cardRole = document.getElementById('card-role');
const upcomingSessions = document.getElementById('upcoming-sessions');

function renderDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  try {
    if (cardRole) {
      cardRole.innerHTML = `
        <h3>Rol actual</h3>
        <p class="mt-8 small">
          <b>${
            user.role === 'admin'
              ? 'Administrador'
              : user.role === 'advisor'
              ? 'Asesor'
              : 'Estudiante'
          }</b>
        </p>
        ${user.role === 'advisor' && !user.isAdvisorApproved ? 
          '<p class="mt-8 small badge status-pendiente">Cuenta en revisión</p>' : ''}
      `;
    }

    if (cardRequests) {
      const myRequests =
        user.role === 'student'
          ? state.requests.filter(r => r.studentId === user.id)
          : user.role === 'advisor'
          ? state.requests.filter(r => r.advisorId === user.id || !r.advisorId)
          : state.requests;

      cardRequests.innerHTML = `
        <h3>Solicitudes</h3>
        <p class="mt-8 small">
          Total: <b>${myRequests.length}</b>
        </p>
        ${user.role === 'advisor' ? `
          <p class="mt-8 small muted">
            Pendientes: <b>${myRequests.filter(r => r.status === 'pendiente').length}</b>
          </p>
        ` : ''}
      `;
    }

    if (cardSessions) {
      const mySessions = getVisibleSessionsForUser();
      const upcomingSessionsCount = mySessions.filter(s => 
        new Date(s.datetimeISO) >= new Date()
      ).length;

      cardSessions.innerHTML = `
        <h3>Sesiones</h3>
        <p class="mt-8 small">
          Total: <b>${mySessions.length}</b>
        </p>
        <p class="mt-8 small muted">
          Próximas: <b>${upcomingSessionsCount}</b>
        </p>
      `;
    }

    if (upcomingSessions) {
      upcomingSessions.innerHTML = '';
      const now = new Date();
      const futureSessions = getVisibleSessionsForUser()
        .filter(s => new Date(s.datetimeISO) >= now)
        .sort((a, b) => new Date(a.datetimeISO) - new Date(b.datetimeISO))
        .slice(0, 5);

      if (!futureSessions.length) {
        upcomingSessions.innerHTML = '<div class="muted small">No hay sesiones próximas.</div>';
      } else {
        futureSessions.forEach(ses => {
          const req = state.requests.find(r => r.id === ses.requestId);
          const div = document.createElement('div');
          div.className = 'list-item';
          div.innerHTML = `
            <div class="list-header">
              <span><b>${req ? escapeHtml(req.subject) : 'Sesión'}</b></span>
              <span class="badge status-${ses.status}">
                ${ses.status.charAt(0).toUpperCase() + ses.status.slice(1)}
              </span>
            </div>
            <div class="mt-8 small">
              ${new Date(ses.datetimeISO).toLocaleString()}
            </div>
            ${req && req.topic ? `<div class="mt-8 small muted">${escapeHtml(req.topic)}</div>` : ''}
          `;
          upcomingSessions.appendChild(div);
        });
      }
    }
  } catch (error) {
    console.error('Error rendering dashboard:', error);
  }
}

// ===============================
// GESTIÓN DE ROLES MEJORADA PARA ADMIN
// ===============================

const reportsList = document.getElementById('reports-list');
const advisorRequestsListAdmin = document.getElementById('advisor-requests-list');
const contactSearch = document.getElementById('contact-search');
const contactList = document.getElementById('contact-list');

function renderReports() {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    if (reportsList) {
      reportsList.innerHTML = '<div class="muted small">Solo el administrador puede ver esta sección.</div>';
    }
    if (advisorRequestsListAdmin) {
      advisorRequestsListAdmin.innerHTML = '';
    }
    if (contactList) {
      contactList.innerHTML = '';
    }
    return;
  }

  try {
    if (reportsList) {
      const totalUsers = state.users.length;
      const totalRequests = state.requests.length;
      const totalSessions = state.sessions.length;
      const pendingAdvisors = state.users.filter(u => 
        u.role === 'advisor' && !u.isAdvisorApproved
      ).length;

      reportsList.innerHTML = `
        <div class="list-item">
          <b>Usuarios registrados:</b> ${totalUsers}
        </div>
        <div class="list-item">
          <b>Solicitudes totales:</b> ${totalRequests}
        </div>
        <div class="list-item">
          <b>Sesiones agendadas:</b> ${totalSessions}
        </div>
        ${pendingAdvisors > 0 ? `
          <div class="list-item">
            <b>Asesores pendientes:</b> ${pendingAdvisors}
          </div>
        ` : ''}
      `;
    }

    renderAdvisorRequestsAdmin();
    renderContacts();
  } catch (error) {
    console.error('Error rendering reports:', error);
  }
}

function renderAdvisorRequestsAdmin() {
  if (!advisorRequestsListAdmin) return;
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    advisorRequestsListAdmin.innerHTML = '';
    return;
  }

  try {
    const pendingAdvisors = state.users.filter(
      u => u.role === 'advisor' && u.isAdvisorApproved === false
    );

    advisorRequestsListAdmin.innerHTML = '';

    if (!pendingAdvisors.length) {
      advisorRequestsListAdmin.innerHTML = '<div class="muted small">No hay solicitudes de asesor pendientes.</div>';
      return;
    }

    pendingAdvisors.forEach(u => {
      const div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML = `
        <div class="list-header">
          <span><b>${escapeHtml(u.name)}</b></span>
          <span class="badge">Asesor (pendiente)</span>
        </div>
        <div class="mt-8 small">
          ${u.email}
        </div>
        <div class="mt-8 small muted">
          Materia: ${u.advisorSubject ? escapeHtml(u.advisorSubject) : 'No especificada'}
        </div>
        <div class="mt-8 small">
          ${u.advisorKardex ? `
            Kardex: <a href="${u.advisorKardex.dataUrl || '#'}" 
                     download="${u.advisorKardex.fileName}" 
                     ${!u.advisorKardex.dataUrl ? 'onclick="return false;" style="opacity: 0.6;"' : ''}>
              ${u.advisorKardex.fileName}
            </a>
          ` : 'Kardex: No disponible'}
        </div>
        <div class="row-right mt-8">
          <button class="btn secondary btn-compact" data-action="reject">Rechazar</button>
          <button class="btn primary btn-compact" data-action="approve">Aprobar</button>
        </div>
      `;

      div.querySelector('[data-action="approve"]').addEventListener('click', () => {
        u.isAdvisorApproved = true;
        appState.saveState();
        showToast('Asesor aprobado exitosamente', 'success');
        renderReports();
      });

      div.querySelector('[data-action="reject"]').addEventListener('click', () => {
        Swal.fire({
          title: '¿Rechazar solicitud?',
          text: 'El usuario será convertido en estudiante.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, rechazar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            u.role = 'student';
            u.isAdvisorApproved = false;
            u.advisorSubject = null;
            u.advisorKardex = null;
            appState.saveState();
            showToast('Solicitud rechazada. Usuario convertido en estudiante.', 'info');
            renderReports();
          }
        });
      });

      advisorRequestsListAdmin.appendChild(div);
    });
  } catch (error) {
    console.error('Error rendering advisor requests:', error);
  }
}

const debouncedRenderContacts = debounce((query) => {
  renderContacts(query);
}, 300);

function renderContacts(filterText = '') {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin' || !contactList) return;

  try {
    contactList.innerHTML = '';
    const query = filterText.trim().toLowerCase();

    const filtered = state.users.filter(u => {
      if (!query) return true;
      return (
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
      );
    });

    if (!filtered.length) {
      contactList.innerHTML = '<div class="muted small">No se encontraron usuarios.</div>';
    } else {
      filtered.forEach(u => {
        const div = document.createElement('div');
        div.className = 'list-item contact-item';
        
        const roleLabel = getRoleLabel(u);
        const isCurrentUser = u.id === user.id;
        
        div.innerHTML = `
          <div class="list-header">
            <div class="user-main-info">
              <strong>${escapeHtml(u.name)}</strong>
              <span class="role-badge ${getRoleBadgeClass(u)}">${roleLabel}</span>
            </div>
            ${!isCurrentUser ? `
              <div class="contact-actions">
                <select class="role-select" data-user-id="${u.id}">
                  <option value="student" ${u.role === 'student' ? 'selected' : ''}>Estudiante</option>
                  <option value="advisor" ${u.role === 'advisor' ? 'selected' : ''}>Asesor</option>
                  <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Administrador</option>
                </select>
                <button class="contact-action-btn delete" data-user-id="${u.id}" data-user-name="${escapeHtml(u.name)}">
                  <i class="fa-solid fa-trash"></i>
                  Eliminar
                </button>
              </div>
            ` : '<span class="muted small">Tú</span>'}
          </div>
          <div class="user-details">
            <div class="user-email">${u.email}</div>
            <div class="user-meta">
              <span>Registrado: ${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</span>
              ${u.advisorSubject ? `<span>• Materia: ${escapeHtml(u.advisorSubject)}</span>` : ''}
              ${u.role === 'advisor' && !u.isAdvisorApproved ? '<span>• <strong>Pendiente de aprobación</strong></span>' : ''}
            </div>
          </div>
        `;
        
        // Configurar eventos para los controles
        if (!isCurrentUser) {
          const roleSelect = div.querySelector('.role-select');
          const deleteBtn = div.querySelector('.delete');
          
          roleSelect.addEventListener('change', (e) => {
            changeUserRole(u.id, e.target.value);
          });
          
          deleteBtn.addEventListener('click', () => {
            deleteUser(u.id, u.name);
          });
        }
        
        contactList.appendChild(div);
      });
    }
  } catch (error) {
    console.error('Error rendering contacts:', error);
  }
}

function getRoleLabel(user) {
  if (user.role === 'admin') return 'Administrador';
  if (user.role === 'advisor') {
    return user.isAdvisorApproved ? 'Asesor (aprobado)' : 'Asesor (pendiente)';
  }
  return 'Estudiante';
}

function getRoleBadgeClass(user) {
  if (user.role === 'admin') return 'admin';
  if (user.role === 'advisor') {
    return user.isAdvisorApproved ? 'advisor' : 'advisor-pending';
  }
  return 'student';
}

async function changeUserRole(userId, newRole) {
  try {
    const user = state.users.find(u => u.id === userId);
    if (!user) {
      showToast('Usuario no encontrado', 'error');
      return;
    }

    const currentUser = getCurrentUser();
    if (userId === currentUser.id) {
      showToast('No puedes cambiar tu propio rol', 'warning');
      return;
    }

    // Mostrar confirmación para cambios importantes
    if (newRole === 'admin' || user.role === 'admin') {
      const result = await Swal.fire({
        title: '¿Cambiar rol de administrador?',
        html: `Estás a punto de <strong>${newRole === 'admin' ? 'otorgar' : 'quitar'}</strong> privilegios de administrador a ${user.name}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar rol',
        cancelButtonText: 'Cancelar'
      });
      
      if (!result.isConfirmed) {
        // Resetear el select al valor original
        renderContacts(document.getElementById('contact-search').value);
        return;
      }
    }

    // Actualizar rol
    user.role = newRole;
    
    // Si se cambia a asesor, mantener estado de aprobación
    if (newRole === 'advisor' && !user.isAdvisorApproved) {
      user.isAdvisorApproved = false;
    } else if (newRole !== 'advisor') {
      user.isAdvisorApproved = false;
      user.advisorSubject = null;
      user.advisorKardex = null;
    }
    
    // Si se quita admin, asegurar que no sea el único admin
    if (user.role === 'admin' && newRole !== 'admin') {
      const adminCount = state.users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        showToast('Debe haber al menos un administrador en el sistema', 'error');
        user.role = 'admin';
        renderContacts(document.getElementById('contact-search').value);
        return;
      }
    }

    appState.saveState();
    showToast(`Rol de ${user.name} actualizado a ${getRoleLabel(user)}`, 'success');
    renderContacts(document.getElementById('contact-search').value);
    
  } catch (error) {
    console.error('Error changing user role:', error);
    showToast('Error al cambiar el rol', 'error');
    renderContacts(document.getElementById('contact-search').value);
  }
}

async function deleteUser(userId, userName) {
  try {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;

    const currentUser = getCurrentUser();
    if (userId === currentUser.id) {
      showToast('No puedes eliminar tu propia cuenta', 'warning');
      return;
    }

    // Verificar si es el último admin
    if (user.role === 'admin') {
      const adminCount = state.users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        showToast('No puedes eliminar al único administrador del sistema', 'error');
        return;
      }
    }

    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      html: `Estás a punto de eliminar permanentemente a <strong>${userName}</strong>. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626'
    });

    if (result.isConfirmed) {
      // Eliminar usuario y sus datos asociados
      state.users = state.users.filter(u => u.id !== userId);
      state.requests = state.requests.filter(r => r.studentId !== userId && r.advisorId !== userId);
      state.sessions = state.sessions.filter(s => s.studentId !== userId && s.advisorId !== userId);
      state.chats = state.chats.filter(c => c.studentId !== userId && c.advisorId !== userId);
      
      appState.saveState();
      showToast(`Usuario ${userName} eliminado correctamente`, 'success');
      renderContacts(document.getElementById('contact-search').value);
      renderReports();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    showToast('Error al eliminar el usuario', 'error');
  }
}

// ===============================
// CHAT MEJORADO
// ===============================

const chatListEl = document.getElementById('chat-list');
const chatMessagesEl = document.getElementById('chat-messages');
const chatTitleEl = document.getElementById('chat-title');
const chatSubtitleEl = document.getElementById('chat-subtitle');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatFileInput = document.getElementById('chat-file');
const chatSubmitBtn = document.getElementById('chat-submit-btn');

function getMyChats() {
  const user = getCurrentUser();
  if (!user) return [];
  if (!state.chats) state.chats = [];

  if (user.role === 'admin') return state.chats;

  return state.chats.filter(
    c => c.studentId === user.id || c.advisorId === user.id
  );
}

function renderChatList() {
  const user = getCurrentUser();
  if (!chatListEl) return;

  try {
    chatListEl.innerHTML = '';

    if (!user) {
      chatListEl.innerHTML = '<div class="muted small">Inicia sesión para ver tus chats.</div>';
      return;
    }

    const chats = getMyChats();
    if (!chats.length) {
      chatListEl.innerHTML = '<div class="muted small">Aún no tienes chats. Se crearán cuando se acepte una solicitud.</div>';
      return;
    }

    chats
      .slice()
      .reverse()
      .forEach(chat => {
        const session = state.sessions.find(s => s.id === chat.sessionId);
        const req = session
          ? state.requests.find(r => r.id === session.requestId)
          : null;

        const student = state.users.find(u => u.id === chat.studentId);
        const advisor = state.users.find(u => u.id === chat.advisorId);

        const isStudent = user.id === chat.studentId;
        const otherUser = isStudent ? advisor : student;

        const lastMsg = chat.messages?.[chat.messages.length - 1];
        const lastSnippet = lastMsg
          ? (lastMsg.text || '[Archivo]').slice(0, 40) +
            ((lastMsg.text || '[Archivo]').length > 40 ? '...' : '')
          : 'Sin mensajes aún';

        const item = document.createElement('div');
        item.className = `list-item chat-list-item ${chat.id === currentChatId ? 'active' : ''}`;
        item.dataset.chatId = chat.id;
        item.innerHTML = `
          <div class="list-header">
            <span>${otherUser ? escapeHtml(otherUser.name) : 'Chat'}</span>
            <span class="badge small">
              ${req ? escapeHtml(req.subject) : 'Sesión PeerHive'}
            </span>
          </div>
          <p class="small muted">
            ${escapeHtml(lastSnippet)}
          </p>
        `;

        item.addEventListener('click', () => {
          currentChatId = chat.id;
          document.querySelectorAll('.chat-list-item').forEach(el => {
            el.classList.remove('active');
          });
          item.classList.add('active');
          renderChatMessages();
        });

        chatListEl.appendChild(item);
      });
  } catch (error) {
    console.error('Error rendering chat list:', error);
  }
}

function renderChatMessages() {
  const user = getCurrentUser();
  if (!chatMessagesEl || !chatTitleEl || !chatSubtitleEl) return;

  try {
    if (!user) {
      chatTitleEl.textContent = 'Inicia sesión';
      chatSubtitleEl.textContent = 'Debes iniciar sesión para usar el chat.';
      chatMessagesEl.innerHTML = '';
      return;
    }

    const chats = getMyChats();
    if (!currentChatId && chats.length) {
      currentChatId = chats[0].id;
    }

    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) {
      chatTitleEl.textContent = 'Selecciona un chat';
      chatSubtitleEl.textContent = 'Cuando se acepte una solicitud se creará un chat privado.';
      chatMessagesEl.innerHTML = '';
      return;
    }

    const session = state.sessions.find(s => s.id === chat.sessionId);
    const req = session
      ? state.requests.find(r => r.id === session.requestId)
      : null;

    const student = state.users.find(u => u.id === chat.studentId);
    const advisor = state.users.find(u => u.id === chat.advisorId);

    const isStudent = user.id === chat.studentId;
    const otherUser = isStudent ? advisor : student;

    chatTitleEl.textContent = `Chat con ${otherUser ? escapeHtml(otherUser.name) : 'usuario'}`;
    chatSubtitleEl.textContent = req
      ? `${escapeHtml(req.subject)} · ${escapeHtml(req.topic)}`
      : 'Conversación de sesión PeerHive';

    chatMessagesEl.innerHTML = '';

    (chat.messages || []).forEach(m => {
      const row = document.createElement('div');
      row.className = 'chat-message-row';
      if (m.fromUserId === user.id) row.classList.add('own');

      const fromUser = state.users.find(u => u.id === m.fromUserId);

      const date = m.timestampISO ? new Date(m.timestampISO) : null;
      const timeLabel = date
        ? date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';

      const attachmentHtml = m.attachment
        ? `<div class="chat-attachment">
            <a href="${m.attachment.dataUrl}" download="${m.attachment.fileName}">
              <i class="fa-solid fa-paperclip"></i>${escapeHtml(m.attachment.fileName)}
            </a>
          </div>`
        : '';

      const textHtml = m.text
        ? `<div>${escapeHtml(m.text)}</div>`
        : m.attachment
        ? ''
        : '<div></div>';

      row.innerHTML = `
        <div class="chat-bubble">
          ${textHtml}
          ${attachmentHtml}
          <div class="chat-meta">
            ${fromUser ? escapeHtml(fromUser.name) : 'Usuario'} · ${timeLabel}
          </div>
        </div>
      `;
      chatMessagesEl.appendChild(row);
    });

    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  } catch (error) {
    console.error('Error rendering chat messages:', error);
  }
}

function pushChatMessage(chat, fromUserId, text, attachment) {
  if (!chat.messages) chat.messages = [];
  chat.messages.push({
    id: uid('msg'),
    fromUserId,
    text: text || '',
    timestampISO: new Date().toISOString(),
    attachment: attachment || null,
  });

  const idx = state.chats.findIndex(c => c.id === chat.id);
  if (idx !== -1) state.chats[idx] = chat;

  appState.saveState();
  chatInput.value = '';
  chatFileInput.value = '';
  renderChatMessages();
  renderChatList();
}

chatForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = chatSubmitBtn;
  setButtonLoading(submitBtn, true);

  try {
    const user = getCurrentUser();
    if (!user) {
      showToast('Inicia sesión para enviar mensajes', 'warning');
      return;
    }

    const text = chatInput.value.trim();
    const file = chatFileInput.files[0];

    if (!text && !file) {
      showToast('Escribe un mensaje o adjunta un archivo', 'warning');
      return;
    }

    const chats = getMyChats();
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) {
      showToast('Selecciona primero un chat', 'info');
      return;
    }

    if (file && file.size > 2 * 1024 * 1024) {
      showToast('Archivo máximo 2 MB', 'warning');
      return;
    }

    // Simular proceso async
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!file) {
      pushChatMessage(chat, user.id, text, null);
      return;
    }

    // Para archivos grandes, solo metadata
    if (file.size > 500000) {
      const attachment = {
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        // No guardamos dataUrl para archivos grandes en demo
      };
      pushChatMessage(chat, user.id, text, attachment);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = typeof reader.result === 'string' ? reader.result : '';
        const attachment = {
          fileName: file.name,
          mimeType: file.type,
          dataUrl,
        };
        pushChatMessage(chat, user.id, text, attachment);
        setButtonLoading(submitBtn, false);
      };
      reader.onerror = () => {
        throw new Error('No se pudo leer el archivo adjunto');
      };
      reader.readAsDataURL(file);
      return; // Salir aquí, el reader maneja el finally
    }
  } catch (error) {
    console.error('Error sending message:', error);
    showToast(error.message || 'Error al enviar el mensaje', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});

// ===============================
// AJUSTES MEJORADOS
// ===============================

const formSettings = document.getElementById('form-settings');
const settingsNameInput = document.getElementById('settings-name');
const settingsEmailInput = document.getElementById('settings-email');
const settingsPasswordInput = document.getElementById('settings-password');
const settingsAvatar = document.getElementById('settings-avatar');
const settingsRoleLabel = document.getElementById('settings-role-label');
const settingsSubmitBtn = document.getElementById('settings-submit-btn');

function hydrateSettings() {
  const user = getCurrentUser();
  if (!formSettings || !user) return;

  try {
    settingsNameInput.value = user.name || '';
    settingsEmailInput.value = user.email || '';
    settingsPasswordInput.value = '';

    const initials = (user.name || user.email)
      .split(' ')
      .map(x => x[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    if (settingsAvatar) settingsAvatar.textContent = initials;

    if (settingsRoleLabel) {
      settingsRoleLabel.textContent =
        user.role === 'admin'
          ? 'Administrador'
          : user.role === 'advisor'
          ? user.isAdvisorApproved ? 'Asesor (aprobado)' : 'Asesor (pendiente)'
          : 'Estudiante';
    }
  } catch (error) {
    console.error('Error hydrating settings:', error);
  }
}

formSettings?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = settingsSubmitBtn;
  setButtonLoading(submitBtn, true);

  try {
    const user = getCurrentUser();
    if (!user) {
      showToast('Inicia sesión para editar tus ajustes', 'warning');
      return;
    }

    const newName = settingsNameInput.value.trim();
    const newEmail = settingsEmailInput.value.trim();
    const newPassword = settingsPasswordInput.value.trim();

    if (!newName || !newEmail) {
      showToast('Nombre y correo son obligatorios', 'error');
      return;
    }

    const existing = state.users.find(
      u => u.email.toLowerCase() === newEmail.toLowerCase() && u.id !== user.id
    );
    if (existing) {
      showToast('Ya existe un usuario con ese correo', 'error');
      return;
    }

    // Simular proceso async
    await new Promise(resolve => setTimeout(resolve, 800));

    user.name = newName;
    user.email = newEmail;
    if (newPassword) {
      user.password = hashPassword(newPassword);
    }

    appState.saveState();
    updateTopbarUser();
    renderContacts();
    hydrateSettings();
    showToast('Ajustes guardados exitosamente', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showToast('Error al guardar los ajustes', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});

// ===============================
// NAV BOTONES MEJORADOS
// ===============================

document.querySelectorAll('.nav-btn').forEach(btn => {
  const view = btn.getAttribute('data-view');
  if (!view) return;
  
  btn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user && view !== 'view-login') {
      showToast('Inicia sesión para acceder a esta sección', 'warning');
      switchView('view-login');
      return;
    }
    
    if (view === 'view-advisor' && (!user || (user.role !== 'advisor' && user.role !== 'admin'))) {
      showToast('Solo asesores o administrador pueden ver el panel asesor', 'warning');
      return;
    }

    if (view === 'view-reports' && (!user || user.role !== 'admin')) {
      showToast('Solo el administrador puede ver los reportes', 'warning');
      return;
    }

    switchView(view);
  });
});

// Tema toggle mejorado
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const current = loadTheme();
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
});

// ===============================
// UTILIDADES GENERALES MEJORADAS
// ===============================

// Función para limpiar estado antiguo (útil para desarrollo)
function cleanupOldStorage() {
  const oldKeys = ['peerhive_demo_state', 'peerhive_demo_state_v2', 'peerhive_demo_state_v3', 'peerhive_demo_state_v4', 'peerhive_demo_state_v5'];
  oldKeys.forEach(key => {
    if (localStorage.getItem(key) && key !== STORAGE_KEY) {
      localStorage.removeItem(key);
    }
  });
}

// ===============================
// INICIALIZACIÓN MEJORADA
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  try {
    cleanupOldStorage();
    applyTheme(loadTheme());
    initAuthScreen(); // Iniciar con pantalla de auth
    initCalendar();
    updateSystemStats();
    renderContacts();

    // Si ya hay un usuario loggeado, mostrar app directamente
    const user = getCurrentUser();
    if (user) {
      showMainApp();
    }
    
    console.log('PeerHive inicializado correctamente');
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    showToast('Error al inicializar la aplicación', 'error');
  }
});

// Exportar para debugging (solo en desarrollo)
if (typeof window !== 'undefined') {
  window.peerHiveDebug = {
    appState,
    getCurrentUser,
    switchView,
    showToast,
    removeKardexFile
  };
}